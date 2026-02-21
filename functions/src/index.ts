import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
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

// ─── 5. sendDripEmails (scheduled every hour) ─────────────────────────────────
// Envoie les emails de la séquence nurturing selon le timing depuis l'inscription

const DRIP_SCHEDULE: { day: number; emailNum: number; subject: string; previewText: string }[] = [
  { day: 1, emailNum: 2, subject: "L'erreur qui sabote ta sèche (et tu la fais probablement)", previewText: "Ce n'est ni le sucre, ni le cardio." },
  { day: 3, emailNum: 3, subject: "Ton déficit calorique exact (calcul en 2 minutes)", previewText: "Pas de formule bidon. Ton chiffre perso." },
  { day: 5, emailNum: 4, subject: 'Stéphane, 47 ans : "J\'ai perdu 7 kg sans me priver"', previewText: "Commercial, père de 2 enfants, zéro temps libre." },
  { day: 7, emailNum: 5, subject: "Pourquoi perdre du gras après 40 ans est un combat différent", previewText: "Testostérone, métabolisme, cortisol." },
  { day: 9, emailNum: 6, subject: "Voilà exactement ce que tu obtiens (tout est là)", previewText: "Plans, recettes, suivi. Tout inclus pour 29€/mois." },
  { day: 11, emailNum: 7, subject: "Dernière question avant qu'on se dise au revoir", previewText: "Pas de pression. Juste une réalité." },
];

const dripEmailBodies: Record<number, string> = {
  2: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0;"><h1 style="color:#e94560;margin:0;font-size:24px;">SÈCHE 10 SEMAINES</h1></div>
<div style="padding:30px;background:#fff;">
<p style="color:#333;font-size:16px;line-height:1.7;">Salut,</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Tu as téléchargé le guide hier. Bien.</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Combien de fois tu as déjà "commencé un régime" pour abandonner 2 semaines plus tard ?</strong></p>
<p style="color:#333;font-size:16px;line-height:1.7;">L'erreur n°1 qui fait échouer 95% des tentatives de sèche : <strong>couper trop fort, trop vite.</strong></p>
<p style="color:#333;font-size:16px;line-height:1.7;">Quand tu passes de 2500 kcal à 1500 du jour au lendemain :</p>
<ul style="color:#333;font-size:16px;line-height:1.9;">
<li>Ton métabolisme ralentit de 15 à 20%</li>
<li>Ton cortisol explose → stockage abdominal</li>
<li>Ta testostérone chute → perte de muscle, pas de gras</li>
<li>Tu craques → binge → culpabilité → abandon</li>
</ul>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>La solution ?</strong> Un déficit modéré : 300 à 500 kcal sous ta maintenance. Pas plus.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Dans mon prochain email, je te montre <strong>comment calculer ton déficit exact</strong>.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À dans 2 jours,<br><strong>L'équipe Sèche 10 Semaines</strong></p>
</div></div>`,

  3: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0;"><h1 style="color:#e94560;margin:0;font-size:24px;">SÈCHE 10 SEMAINES</h1></div>
<div style="padding:30px;background:#fff;">
<p style="color:#333;font-size:16px;line-height:1.7;">Salut,</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Comment calculer <strong>ton</strong> déficit calorique :</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Étape 1 — Métabolisme de base</strong></p>
<div style="background:#f8f8f8;border-left:4px solid #e94560;padding:15px 20px;margin:15px 0;border-radius:4px;">
<p style="font-family:monospace;margin:0;">MB = (10 × poids kg) + (6,25 × taille cm) − (5 × âge) + 5</p></div>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Étape 2 — Facteur d'activité</strong></p>
<ul style="color:#333;font-size:16px;line-height:1.9;">
<li>Sédentaire : MB × 1,2</li>
<li>Légèrement actif : MB × 1,375</li>
<li>Actif : MB × 1,55</li></ul>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Étape 3 — Déficit de -400 kcal</strong></p>
<p style="color:#333;font-size:16px;line-height:1.7;">Exemple : homme 42 ans, 85 kg → ~2016 kcal/jour → -0,4 kg/sem → <strong>-4 kg de gras en 10 semaines</strong>.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Dans 2 jours, je te présente Stéphane — 47 ans, -7 kg.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À très vite,<br><strong>L'équipe Sèche 10 Semaines</strong></p>
</div></div>`,

  4: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0;"><h1 style="color:#e94560;margin:0;font-size:24px;">SÈCHE 10 SEMAINES</h1></div>
<div style="padding:30px;background:#fff;">
<p style="color:#333;font-size:16px;line-height:1.7;">Salut,</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Aujourd'hui, pas de théorie. Juste une histoire vraie.</p>
<div style="background:#f8f8f8;border-radius:8px;padding:25px;margin:15px 0;border:1px solid #eee;">
<p style="color:#333;font-weight:bold;">Stéphane, 47 ans — Directeur commercial, Bordeaux</p>
<p style="color:#555;font-style:italic;line-height:1.7;">"15 ans de régimes. Dukan, jeûne, keto… À chaque fois, je reprenais tout. En janvier : 93 kg. Mon médecin m'a parlé de pré-diabète."</p>
<p style="color:#555;font-style:italic;line-height:1.7;">"En 10 semaines : -7,2 kg. Tour de taille de 98 à 89 cm. Je n'ai jamais eu l'impression d'être au régime."</p>
<p style="color:#555;font-style:italic;line-height:1.7;">"Mon bilan sanguin : glycémie revenue dans les normes. Mon médecin n'en revenait pas."</p></div>
<p style="color:#333;font-size:16px;line-height:1.7;">Dans 2 jours, je t'explique pourquoi la sèche est plus compliquée après 40 ans.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À dans 2 jours,<br><strong>L'équipe Sèche 10 Semaines</strong></p>
</div></div>`,

  5: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0;"><h1 style="color:#e94560;margin:0;font-size:24px;">SÈCHE 10 SEMAINES</h1></div>
<div style="padding:30px;background:#fff;">
<p style="color:#333;font-size:16px;line-height:1.7;">Salut,</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À 25 ans, tu pouvais manger n'importe quoi et retrouver tes abdos. À 40+, la balance ne bouge pas. <strong>Ce n'est pas dans ta tête. C'est dans ta biologie.</strong></p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>1. Testostérone -1%/an après 30 ans</strong> → moins de muscle, plus de gras abdominal</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>2. Sensibilité à l'insuline ↓</strong> → le même plat de pâtes stocke plus</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>3. Cortisol chronique</strong> → stress = stockage viscéral</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>4. Sommeil dégradé</strong> → dormir 5h = -55% de perte de gras</p>
<div style="background:#1a1a2e;border-radius:8px;padding:25px;margin:15px 0;">
<p style="color:#e94560;font-weight:bold;font-size:18px;margin:0 0 10px;">La bonne nouvelle ?</p>
<p style="color:#fff;line-height:1.7;margin:0;">Tout ça se contourne avec le bon protocole. Un homme de 45 ans peut sécher aussi efficacement qu'à 30 ans.</p></div>
<p style="color:#333;font-size:16px;line-height:1.7;">Dans 2 jours, je te montre en détail ce que contient le programme.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À très vite,<br><strong>L'équipe Sèche 10 Semaines</strong></p>
</div></div>`,

  6: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0;"><h1 style="color:#e94560;margin:0;font-size:24px;">SÈCHE 10 SEMAINES</h1></div>
<div style="padding:30px;background:#fff;">
<p style="color:#333;font-size:16px;line-height:1.7;">Salut,</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Est-ce que tu veux continuer à bricoler seul, ou avoir un cadre qui fonctionne ?</strong></p>
<div style="background:#f8f8f8;border-radius:8px;padding:20px;margin:10px 0;">
<p style="color:#e94560;font-weight:bold;text-transform:uppercase;font-size:14px;">📋 Plan nutritionnel personnalisé</p>
<p style="color:#333;font-size:15px;">Calculé sur ton profil. Ajusté toutes les 2 semaines.</p></div>
<div style="background:#f8f8f8;border-radius:8px;padding:20px;margin:10px 0;">
<p style="color:#e94560;font-weight:bold;text-transform:uppercase;font-size:14px;">🍽️ +80 recettes rapides</p>
<p style="color:#333;font-size:15px;">15-20 min max. Ingrédients de supermarché.</p></div>
<div style="background:#f8f8f8;border-radius:8px;padding:20px;margin:10px 0;">
<p style="color:#e94560;font-weight:bold;text-transform:uppercase;font-size:14px;">📊 Suivi hebdomadaire</p>
<p style="color:#333;font-size:15px;">On ajuste selon tes progrès réels.</p></div>
<div style="background:#1a1a2e;border-radius:8px;padding:30px;margin:25px 0;text-align:center;">
<p style="color:#fff;font-size:16px;margin:0 0 5px;">Tout ça pour</p>
<p style="color:#e94560;font-size:42px;font-weight:bold;margin:0 0 5px;">29€<span style="font-size:18px;color:#fff;">/mois</span></p>
<p style="color:#aaa;font-size:14px;margin:0 0 20px;">Sans engagement</p>
<a href="https://seche10semaines.fr/#/login" style="display:inline-block;background:#e94560;color:#fff;text-decoration:none;padding:15px 40px;border-radius:6px;font-size:18px;font-weight:bold;">Commencer ma sèche →</a></div>
<p style="color:#333;font-size:16px;line-height:1.7;">29€, c'est moins qu'un resto.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À très vite,<br><strong>L'équipe Sèche 10 Semaines</strong></p>
</div></div>`,

  7: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0;"><h1 style="color:#e94560;margin:0;font-size:24px;">SÈCHE 10 SEMAINES</h1></div>
<div style="padding:30px;background:#fff;">
<p style="color:#333;font-size:16px;line-height:1.7;">Salut,</p>
<p style="color:#333;font-size:16px;line-height:1.7;">C'est le dernier email de cette série.</p>
<div style="background:#f8f8f8;border-left:4px solid #e94560;padding:20px;margin:15px 0;border-radius:4px;">
<p style="color:#1a1a2e;font-size:18px;font-weight:bold;margin:0;">Dans 10 semaines, tu seras où ?</p></div>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Scénario A :</strong> Tu ne fais rien. Même poids, même ventre, même frustration.</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong>Scénario B :</strong> Tu commences aujourd'hui. -4 à -6 kg de gras. Ventre plus plat. Énergie retrouvée.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Pas de "3 places restantes". Pas de fausse urgence. Le programme est là. <strong>Le seul facteur qui manque, c'est ta décision.</strong></p>
<div style="text-align:center;margin:30px 0;">
<a href="https://seche10semaines.fr/#/login" style="display:inline-block;background:#e94560;color:#fff;text-decoration:none;padding:16px 45px;border-radius:6px;font-size:18px;font-weight:bold;">Je commence maintenant — 29€/mois →</a>
<p style="color:#999;font-size:13px;margin:10px 0 0;">Sans engagement. Annulation en 1 clic.</p></div>
<p style="color:#333;font-size:16px;line-height:1.7;">Quoi que tu décides, je te souhaite de réussir ta transformation.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">À bientôt,<br><strong>L'équipe Sèche 10 Semaines</strong></p>
</div></div>`,
};

export const sendDripEmails = onSchedule(
  { schedule: 'every 1 hours', region: 'us-central1', timeZone: 'Europe/Paris' },
  async () => {
    const now = Date.now();
    const leadsSnap = await db.collection('leads').get();

    for (const doc of leadsSnap.docs) {
      const data = doc.data();
      if (!data.email || !data.createdAt) continue;

      const createdAt = data.createdAt.toDate ? data.createdAt.toDate().getTime() : data.createdAt;
      const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      const emailsSent: number[] = data.emailsSent || [];

      for (const step of DRIP_SCHEDULE) {
        if (daysSinceCreation >= step.day && !emailsSent.includes(step.emailNum)) {
          const htmlBody = dripEmailBodies[step.emailNum];
          if (!htmlBody) continue;

          try {
            const transporter = getMailTransporter();
            await transporter.sendMail({
              from: '"Sèche 10 Semaines" <huzinepro@gmail.com>',
              to: data.email,
              subject: step.subject,
              html: htmlBody,
            });

            emailsSent.push(step.emailNum);
            await doc.ref.update({ emailsSent, [`email${step.emailNum}SentAt`]: admin.firestore.FieldValue.serverTimestamp() });
            console.log(`✅ Drip email ${step.emailNum} envoyé à ${data.email}`);
          } catch (err) {
            console.error(`❌ Drip email ${step.emailNum} erreur pour ${data.email}:`, err);
          }

          // Un seul email par lead par exécution (pour éviter de tout envoyer d'un coup)
          break;
        }
      }
    }

    console.log(`Drip check terminé. ${leadsSnap.size} leads vérifiés.`);
  }
);
