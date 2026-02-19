export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyMacros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietProfile {
  tdee: number;
  targetCalories: number;
  macros: Macros;
  biometrics: {
    gender: string;
    age: number;
    weight: number;
    height: number;
    activity: number;
    waistline?: number;
    neck?: number;
  };
  healthProfile: string;
  glucose?: string | number | null;
  deficitPercent?: number;
  training?: DailyMacros;
  rest?: DailyMacros;
  bodyFatEstimate?: number | null;
  projectedLoss?: {
    weight: number;
    waist: number;
  };
}

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'cancelling'
  | 'cancelled'
  | 'payment_failed'
  | 'inactive';

export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  photoStart?: string;
  photoCurrent?: string;
  createdAt: string;
  onboardingComplete: boolean;
  dietProfile?: DietProfile;
  glucoseReadings?: { date: string; value: number }[];
  lipidesReadings?: { dateAnalyse: string; total?: number; ldl: number; hdl: number; triglycerides: number }[];
  pesees?: { date: string; poids: number }[];
  tourDeTaille?: { date: string; value: number }[];
  initialWeight?: number;
  initialWaistline?: number;
  guidePdfUrl?: string;
  ifWindow?: string;
  // Stripe / Subscription
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartedAt?: string;
  subscriptionCancelledAt?: string;
  lastPaymentError?: string;
}

export interface DailyJournal {
  training: boolean;
  meals: {
    [key: number]: {
      validated: boolean;
      variantIndex: number;
    };
  };
  stacks: {
    d3: boolean;
    vitc: boolean;
    collagen?: boolean;
    creatine: boolean;
    berberine?: boolean;
    omega3: boolean;
    magnesium: boolean;
    workout: boolean;
    mcgill?: boolean;
  };
  water?: number;
  workoutIndex?: number;
}

export const PROGRAM_PHASES: Record<number, { name: string; desc: string; loss: number }> = {
  1: { name: 'Reset Métabolique', desc: 'Détox & Sensibilité Insuline', loss: 1.0 },
  2: { name: 'Reset Métabolique', desc: 'Adaptation & Sommeil', loss: 1.5 },
  3: { name: 'Reset Métabolique', desc: 'Intensification', loss: 2.0 },
  4: { name: 'Sèche Viscérale', desc: 'Déficit Calorique', loss: 2.5 },
  5: { name: 'Sèche Viscérale', desc: 'Brûlage Graisses', loss: 3.0 },
  6: { name: 'Sèche Viscérale', desc: 'Optimisation', loss: 3.5 },
  7: { name: 'Sèche Viscérale', desc: 'Pic de Sèche', loss: 4.0 },
  8: { name: 'Définition', desc: 'Rétention Eau', loss: 4.2 },
  9: { name: 'Définition', desc: 'Dernière Ligne Droite', loss: 4.5 },
  10: { name: 'Maintien', desc: 'Sortie de Sèche', loss: 5.0 },
};
