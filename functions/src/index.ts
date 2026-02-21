import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

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
    _stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' as any });
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

      if (stripeCustomerId) {
        // Verify the customer exists on the current Stripe account
        try {
          await getStripe().customers.retrieve(stripeCustomerId);
        } catch {
          // Customer from old Stripe account — recreate
          stripeCustomerId = undefined;
        }
      }

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
        payment_method_types: ['card'],
        line_items: [{ price: getPriceId(), quantity: 1 }],
        success_url: successUrl || 'https://seche10semaines.fr/#/success',
        cancel_url: cancelUrl || 'https://seche10semaines.fr/#/pricing',
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
            const status = sub.cancel_at_period_end ? 'cancelling' : sub.status;
            const updateData: Record<string, unknown> = { subscriptionStatus: status };
            if (sub.cancel_at_period_end && sub.current_period_end) {
              updateData.subscriptionEndsAt = new Date(sub.current_period_end * 1000).toISOString();
            }
            await snap.docs[0].ref.set(updateData, { merge: true });
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

      const updatedSub = await getStripe().subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: true });
      const cancelDate = new Date(updatedSub.current_period_end * 1000).toISOString();
      await db.collection('users').doc(uid).set({
        subscriptionStatus: 'cancelling',
        subscriptionEndsAt: cancelDate,
      }, { merge: true });

      res.json({ success: true, message: 'Abonnement annulé à la prochaine échéance', endsAt: cancelDate });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur interne';
      res.status(500).json({ error: message });
    }
  }
);

// ─── 4. sendGuideOnLeadCreated ────────────────────────────────────────────────
// Se déclenche automatiquement quand un document est créé dans la collection "leads"
// Envoie le guide PDF par email au lead

const getMailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'huzinepro@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || '',
    },
  });
};

export const sendGuideOnLeadCreated = onDocumentCreated(
  { document: 'leads/{leadId}', region: 'us-central1' },
  async (event) => {
    const data = event.data?.data();
    if (!data || !data.email) {
      console.error('Lead sans email, skip');
      return;
    }

    const email = data.email as string;
    const leadId = event.params.leadId;

    console.log(`Envoi du guide à ${email} (lead: ${leadId})`);

    // Chemin du PDF embarqué avec la function
    const pdfPath = path.join(__dirname, '..', 'assets', 'guide-seche-10-semaines.pdf');

    if (!fs.existsSync(pdfPath)) {
      console.error(`PDF introuvable : ${pdfPath}`);
      // Marquer comme erreur dans Firestore
      await db.collection('leads').doc(leadId).update({ emailStatus: 'error_pdf_missing' });
      return;
    }

    try {
      const transporter = getMailTransporter();

      await transporter.sendMail({
        from: '"Sèche 10 Semaines" <huzinepro@gmail.com>',
        to: email,
        subject: '📘 Votre guide gratuit — Les 5 erreurs qui sabotent votre sèche après 40 ans',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0F2C59; font-size: 24px; margin-bottom: 10px;">
                Votre guide est prêt 🎉
              </h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Merci pour votre intérêt pour <strong>Sèche 10 Semaines</strong>.
              </p>
            </div>

            <div style="background: #F8FAFC; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #0F2C59; font-size: 18px; margin-bottom: 12px;">
                📘 Les 5 erreurs qui sabotent votre sèche après 40 ans
              </h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
                Dans ce guide, vous découvrirez :
              </p>
              <ul style="color: #475569; font-size: 14px; line-height: 2; padding-left: 20px;">
                <li>Pourquoi les régimes classiques échouent après 40 ans</li>
                <li>L'erreur n°1 sur le déficit calorique</li>
                <li>Comment adapter votre alimentation à VOTRE métabolisme</li>
                <li>La méthode pour perdre du gras sans frustration</li>
                <li>Le plan d'action en 10 semaines</li>
              </ul>
              <p style="color: #94A3B8; font-size: 13px; margin-top: 12px;">
                📎 Le guide est en pièce jointe de cet email.
              </p>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://seche10semaines.fr" style="display: inline-block; background: #00B894; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 700;">
                Découvrir le programme complet →
              </a>
            </div>

            <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center;">
              <p style="color: #94A3B8; font-size: 12px; line-height: 1.6;">
                Sèche 10 Semaines — Programme de nutrition personnalisé par algorithme<br/>
                29€/mois · Sans engagement · <a href="https://seche10semaines.fr" style="color: #00B894;">seche10semaines.fr</a>
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: 'Guide-Seche-10-Semaines.pdf',
            path: pdfPath,
            contentType: 'application/pdf',
          },
        ],
      });

      // Marquer comme envoyé
      await db.collection('leads').doc(leadId).update({
        emailStatus: 'sent',
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Guide envoyé à ${email}`);
    } catch (error) {
      console.error(`❌ Erreur envoi guide à ${email}:`, error);
      await db.collection('leads').doc(leadId).update({
        emailStatus: 'error',
        emailError: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);
