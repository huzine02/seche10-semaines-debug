import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const db = admin.firestore();

// ─── STRIPE ───────────────────────────────────────────────────────────────────
// Clés lues depuis functions/.env (local) ou Secret Manager (production)
// Déploiement: firebase functions:secrets:set STRIPE_SECRET_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!stripeSecretKey) {
  console.warn('⚠️  STRIPE_SECRET_KEY manquante dans les variables d\'environnement');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-01-27.acacia' });

// ─── PLAN STRIPE ──────────────────────────────────────────────────────────────
// Créez un produit à 49€/mois dans dashboard.stripe.com/products
// puis copiez l'ID price_XXXX ici ou dans functions/.env
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_seche10_49eur_month';

// ─── 1. createCheckoutSession ─────────────────────────────────────────────────
export const createCheckoutSession = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    try {
      // Vérifier le token Firebase
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Non authentifié' });
        return;
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = decoded.email || '';

      const { successUrl, cancelUrl } = req.body;

      // Récupérer ou créer le customer Stripe
      const userDoc = await db.collection('users').doc(uid).get();
      let stripeCustomerId: string | undefined = userDoc.data()?.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({ email, metadata: { firebaseUID: uid } });
        stripeCustomerId = customer.id;
        await db.collection('users').doc(uid).set({ stripeCustomerId }, { merge: true });
      }

      // Créer la Checkout Session (abonnement)
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: stripeCustomerId,
        line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
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
  });

// ─── 2. stripeWebhook ─────────────────────────────────────────────────────────
export const stripeWebhook = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);
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
          // Trouver l'user par stripeCustomerId
          const snapshot = await db
            .collection('users')
            .where('stripeCustomerId', '==', sub.customer)
            .limit(1)
            .get();
          if (!snapshot.empty) {
            await snapshot.docs[0].ref.set({
              subscriptionStatus: 'cancelled',
              subscriptionCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const snapshot = await db
            .collection('users')
            .where('stripeCustomerId', '==', invoice.customer)
            .limit(1)
            .get();
          if (!snapshot.empty) {
            await snapshot.docs[0].ref.set({
              subscriptionStatus: 'payment_failed',
              lastPaymentError: new Date().toISOString(),
            }, { merge: true });
          }
          break;
        }

        case 'customer.subscription.updated': {
          const sub = event.data.object as Stripe.Subscription;
          const snapshot = await db
            .collection('users')
            .where('stripeCustomerId', '==', sub.customer)
            .limit(1)
            .get();
          if (!snapshot.empty) {
            await snapshot.docs[0].ref.set({
              subscriptionStatus: sub.status,
            }, { merge: true });
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: 'Erreur interne webhook' });
    }
  });

// ─── 3. cancelSubscription ───────────────────────────────────────────────────
export const cancelSubscription = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    try {
      const authHeader = req.headers.authorization || '';
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const userDoc = await db.collection('users').doc(uid).get();
      const { stripeSubscriptionId } = userDoc.data() || {};
      if (!stripeSubscriptionId) {
        res.status(404).json({ error: 'Aucun abonnement actif' });
        return;
      }

      // Annulation à la fin de la période
      await stripe.subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: true });
      await db.collection('users').doc(uid).set({ subscriptionStatus: 'cancelling' }, { merge: true });

      res.json({ success: true, message: 'Abonnement annulé à la prochaine échéance' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur interne';
      res.status(500).json({ error: message });
    }
  });
