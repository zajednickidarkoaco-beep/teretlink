// Centralizovane definicije šta svaki plan dobija.
// Promena ovde automatski utiče na sve provere u aplikaciji.

export type PlanKey = 'free' | 'standard' | 'pro';

export interface PlanLimits {
  monthlyLoadLimit: number;       // koliko tura mesečno (Infinity = neograničeno)
  monthlyTruckLimit: number;      // koliko kamiona mesečno
  canSeeContacts: boolean;        // pristup telefonu/WhatsApp-u tuđih oglasa
  canUseBasicFilters: boolean;    // zemlja, datum, tip vozila
  canUseAdvancedFilters: boolean; // težina, cena, ADR, Frigo
  canSeeMatching: boolean;        // pametno podudaranje + email alarmi
  canSeeBasicStats: boolean;      // views, kontakti svojih oglasa
  canSeeAdvancedStats: boolean;   // analitika
  monthlyFeaturedCredits: number; // koliko featured oglasa mesečno
  hasVerifiedBadge: boolean;
  hasTopPartnerBadge: boolean;
  maxTeamMembers: number;
}

export const PLAN_LIMITS: Record<PlanKey, PlanLimits> = {
  free: {
    monthlyLoadLimit: 3,
    monthlyTruckLimit: 3,
    canSeeContacts: false,
    canUseBasicFilters: false,
    canUseAdvancedFilters: false,
    canSeeMatching: false,
    canSeeBasicStats: false,
    canSeeAdvancedStats: false,
    monthlyFeaturedCredits: 0,
    hasVerifiedBadge: false,
    hasTopPartnerBadge: false,
    maxTeamMembers: 1,
  },
  standard: {
    monthlyLoadLimit: Infinity,
    monthlyTruckLimit: Infinity,
    canSeeContacts: true,
    canUseBasicFilters: true,
    canUseAdvancedFilters: false,
    canSeeMatching: true,
    canSeeBasicStats: true,
    canSeeAdvancedStats: false,
    monthlyFeaturedCredits: 0,
    hasVerifiedBadge: true,
    hasTopPartnerBadge: false,
    maxTeamMembers: 1,
  },
  pro: {
    monthlyLoadLimit: Infinity,
    monthlyTruckLimit: Infinity,
    canSeeContacts: true,
    canUseBasicFilters: true,
    canUseAdvancedFilters: true,
    canSeeMatching: true,
    canSeeBasicStats: true,
    canSeeAdvancedStats: true,
    monthlyFeaturedCredits: 5,
    hasVerifiedBadge: true,
    hasTopPartnerBadge: true,
    maxTeamMembers: 3,
  },
};

export const getPlanLimits = (plan: PlanKey | string | null | undefined): PlanLimits => {
  if (plan === 'pro') return PLAN_LIMITS.pro;
  if (plan === 'standard') return PLAN_LIMITS.standard;
  return PLAN_LIMITS.free;
};

export const PLAN_NAMES: Record<PlanKey, string> = {
  free: 'Početni',
  standard: 'Standard',
  pro: 'Pro',
};

export const PLAN_PRICES: Record<PlanKey, number> = {
  free: 0,
  standard: 29,
  pro: 99,
};
