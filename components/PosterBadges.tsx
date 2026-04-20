import React from 'react';
import { BadgeCheck, Crown, Award, Zap, Calendar } from 'lucide-react';
import { getPlanLimits } from '../utils/plans';

interface PosterBadgesProps {
  posterPlan?: string | null;
  size?: 'sm' | 'md';
  // Opcioni podaci za proširene bedževe (na detail/profile strani)
  avgRating?: number;
  reviewCount?: number;
  avgResponseTimeMinutes?: number | null;
  memberSinceIso?: string;
  /** Ako je true, prikazuje i prošireni set bedževa (Top Ocenjen / Brzi odgovor / Dugogodišnji). */
  showExtended?: boolean;
}

/** Koliko meseci je prošlo od datuma registracije. */
const monthsSince = (iso?: string): number => {
  if (!iso) return 0;
  const then = new Date(iso).getTime();
  if (isNaN(then)) return 0;
  const diff = Date.now() - then;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
};

/**
 * Prikazuje bedževe:
 * - Osnovni (uvek): Verifikovan (Standard+), Top Partner (Pro)
 * - Prošireni (showExtended=true): Top Ocenjen (≥4.5★, ≥3 rev), Brzi odgovor (<2h), Dugogodišnji (>6 meseci)
 */
export const PosterBadges = ({
  posterPlan,
  size = 'sm',
  avgRating,
  reviewCount,
  avgResponseTimeMinutes,
  memberSinceIso,
  showExtended = false,
}: PosterBadgesProps) => {
  const limits = getPlanLimits(posterPlan);
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  // Prošireni bedževi
  const isTopRated = showExtended && (avgRating ?? 0) >= 4.5 && (reviewCount ?? 0) >= 3;
  const isFastResponder =
    showExtended && typeof avgResponseTimeMinutes === 'number' && avgResponseTimeMinutes > 0 && avgResponseTimeMinutes < 120;
  const veteranMonths = monthsSince(memberSinceIso);
  const isVeteran = showExtended && veteranMonths >= 6;

  const hasAnyBadge =
    limits.hasVerifiedBadge || limits.hasTopPartnerBadge || isTopRated || isFastResponder || isVeteran;

  if (!hasAnyBadge) return null;

  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {limits.hasVerifiedBadge && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-400 font-semibold uppercase tracking-wider ${textSize}`}
          title="Verifikovana firma — Standard ili Pro plan"
        >
          <BadgeCheck className={`${iconSize} fill-blue-400 text-background`} />
          Verifikovan
        </span>
      )}
      {limits.hasTopPartnerBadge && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-400/15 to-amber-500/10 text-amber-400 font-bold uppercase tracking-wider ${textSize}`}
          title="Top Partner — Pro plan"
        >
          <Crown className={`${iconSize} fill-amber-400 text-background`} />
          Top Partner
        </span>
      )}
      {isTopRated && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 font-semibold uppercase tracking-wider ${textSize}`}
          title={`Top Ocenjen — prosek ${(avgRating ?? 0).toFixed(1)}/5`}
        >
          <Award className={`${iconSize} fill-yellow-400 text-background`} />
          Top Ocenjen
        </span>
      )}
      {isFastResponder && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 font-semibold uppercase tracking-wider ${textSize}`}
          title="Brzi odgovor — prosečno odgovara za manje od 2h"
        >
          <Zap className={`${iconSize} fill-emerald-400 text-background`} />
          Brzi odgovor
        </span>
      )}
      {isVeteran && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-purple-400/30 bg-purple-400/10 text-purple-400 font-semibold uppercase tracking-wider ${textSize}`}
          title={`Dugogodišnji korisnik — ${veteranMonths} meseci na platformi`}
        >
          <Calendar className={`${iconSize}`} />
          Dugogodišnji
        </span>
      )}
    </span>
  );
};
