import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { Request, Response } from 'express';

admin.initializeApp();
const db = admin.firestore();

// ─── STRIPE (lazy init) ───────────────────────────────────────────────────────
// La clé est chargée depuis functions/.env (local) ou Secret Manager (prod)
// On initialise Stripe à la première requête, pas au chargement du module
let _stripe: Stripe | null = null;
const getStripe = (): Stripe => {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || '';
    if (!key) throw new Error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement');
    _stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' });
  }
  return _stripe;
};

const getWebhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET || '';
const getPriceId = () => process.env.STRIPE_PRICE_ID || 'price_1T2BqFDcPMJMvgTWxoW5rHzM';

// ─── Firebase Functions v2 étend Request avec rawBody ─────────────────────────
interface FirebaseRequest extends Request {
  rawBody?: Buffer;
}

// ─── CORS helper ──────────────────────────────────────────────────────────────
const setCors = (res: Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// ─── 1. createCheckoutSession ─────────────────────────────────────────────────
export const createCheckoutSession = onRequest(
  { region: 'us-central1', cors: true },
  async (req: Request, res: Response) => {
    setCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    try {
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Non authentifié' }); return;
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = decoded.email || '';

      const { successUrl, cancelUrl } = req.body as { successUrl: string; cancelUrl: string };

      // Récupérer ou créer le customer Stripe
      const userDoc = await db.collection('users').doc(uid).get();
      let stripeCustomerId: string | undefined =
        (userDoc.data() as { stripeCustomerId?: string })?.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await getStripe().customers.create({
          email,
          metadata: { firebaseUID: uid },
        });
        stripeCustomerId = customer.id;
        await db.collection('users').doc(uid).set({ stripeCustomerId }, { merge: true });
      }

      // Créer la Checkout Session abonnement
      const session = await getStripe().checkout.sessions.create({
        mode: 'subscription',
        customer: stripeCustomerId,
        line_items: [{ price: getPriceId(), quantity: 1 }],
        success_url: successUrl || 'https://seche10-semaines-debug.vercel.app/#/success',
        cancel_url: cancelUrl || 'https://seche10-semaines-debug.vercel.app/#/pricing',
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        locale: 'fr',
        metadata: { firebaseUID: uid },
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: unknown) {
      console.error('createCheckoutSession error:', error);
      const message = error instanceof Error ? error.message : 'Erreur interne';
      res.status(500).json({ error: message });
    }
  }
);

// ─── 2. stripeWebhook ─────────────────────────────────────────────────────────
export const stripeWebhook = onRequest(
  { region: 'us-central1' },
  async (req: FirebaseRequest, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(
        req.rawBody || Buffer.from(JSON.stringify(req.body)),
        sig,
        getWebhookSecret()
      );
    } catch (err) {
      console.error('Webhook signature error:', err);
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const uid = session.metadata?.firebaseUID;
          if (uid && session.subscription) {
            await db.collection('users').doc(uid).set({
              subscriptionStatus: 'active',
              stripeSubscriptionId: session.subscription,
              subscriptionStartedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
          }
          break;
        }
        case 'customer.subscription.deleted': {
          const sub = event.data.object as Stripe.Subscription;
          const snap = await db.collection('users')
            .where('stripeCustomerId', '==', sub.customer).limit(1).get();
          if (!snap.empty) {
            await snap.docs[0].ref.set({
              subscriptionStatus: 'cancelled',
              subscriptionCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
          }
          break;
        }
        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const snap = await db.collection('users')
            .where('stripeCustomerId', '==', invoice.customer).limit(1).get();
          if (!snap.empty) {
            await snap.docs[0].ref.set({
              subscriptionStatus: 'payment_failed',
              lastPaymentError: new Date().toISOString(),
            }, { merge: true });
          }
          break;
        }
        case 'customer.subscription.updated': {
          const sub = event.data.object as Stripe.Subscription;
          const snap = await db.collection('users')
            .where('stripeCustomerId', '==', sub.customer).limit(1).get();
          if (!snap.empty) {
            await snap.docs[0].ref.set({ subscriptionStatus: sub.status }, { merge: true });
          }
          break;
        }
        default:
          console.log(`Unhandled event: ${event.type}`);
      }
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: 'Erreur interne webhook' });
    }
  }
);

// ─── 3. cancelSubscription ────────────────────────────────────────────────────
export const cancelSubscription = onRequest(
  { region: 'us-central1', cors: true },
  async (req: Request, res: Response) => {
    setCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    try {
      const authHeader = req.headers.authorization || '';
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const userDoc = await db.collection('users').doc(uid).get();
      const data = userDoc.data() as { stripeSubscriptionId?: string } | undefined;
      const { stripeSubscriptionId } = data || {};

      if (!stripeSubscriptionId) {
        res.status(404).json({ error: 'Aucun abonnement actif' }); return;
      }

      await getStripe().subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: true });
      await db.collection('users').doc(uid).set({ subscriptionStatus: 'cancelling' }, { merge: true });

      res.json({ success: true, message: 'Abonnement annulé à la prochaine échéance' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur interne';
      res.status(500).json({ error: message });
    }
  }
);
