import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Phone, TrendingUp, Lock, Crown, Package, Truck as TruckIcon, MapPin, BarChart3, Globe } from 'lucide-react';
import { Card, Button } from './UIComponents';
import { Load, Truck } from '../types';
import { getPlanLimits } from '../utils/plans';
import { getFlagEmoji } from '../utils/countries';

interface StatsSectionProps {
  myLoads: Load[];
  myTrucks: Truck[];
  userPlan: string | null | undefined;
}

/**
 * Sekcija statistike za oglase korisnika.
 *
 * - Free: zaključano, prikazuje "Nadogradi plan" blok
 * - Standard+: osnovne statistike (ukupno pregleda, kontakata, konverzija) + top 3 oglasa
 * - Pro: basic stats + dodatne napredne (top rute) — placeholder za buduće proširenje
 */
export const StatsSection = ({ myLoads, myTrucks, userPlan }: StatsSectionProps) => {
  const limits = getPlanLimits(userPlan);

  if (!limits.canSeeBasicStats) {
    return (
      <Card className="p-6 border-amber-400/30 bg-amber-400/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-400/15 flex items-center justify-center flex-shrink-0">
            <Lock className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-main">Statistika oglasa — zaključano</h3>
            <p className="text-sm text-text-muted mt-1">
              Pratite koliko je ljudi videlo vaše oglase i koliko vas je kontaktiralo.
              Dostupno od STANDARD plana.
            </p>
            <Link to="/pricing">
              <Button variant="primary" size="sm" className="mt-3">
                Nadogradi plan
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // Agregati
  const allItems = [
    ...myLoads.map(l => ({ ...l, _kind: 'load' as const })),
    ...myTrucks.map(t => ({ ...t, _kind: 'truck' as const })),
  ];
  const totalViews = allItems.reduce((s, x) => s + (x.views || 0), 0);
  const totalInquiries = allItems.reduce((s, x) => s + (x.inquiries || 0), 0);
  const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : '0';
  const avgViews = allItems.length > 0 ? (totalViews / allItems.length).toFixed(1) : '0';

  // Top 3 oglasa po pregledima
  const topItems = [...allItems]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // === Napredna analitika (Pro) ===
  // Top 5 ruta po ukupnim pregledima (spajamo origin → destination)
  const routeMap = new Map<string, { route: string; views: number; inquiries: number; count: number }>();
  allItems.forEach(item => {
    const key = `${item.originCity || '?'} → ${item.destinationCity || 'Bilo gde'}`;
    const existing = routeMap.get(key);
    if (existing) {
      existing.views += item.views || 0;
      existing.inquiries += item.inquiries || 0;
      existing.count += 1;
    } else {
      routeMap.set(key, {
        route: key,
        views: item.views || 0,
        inquiries: item.inquiries || 0,
        count: 1,
      });
    }
  });
  const topRoutes = Array.from(routeMap.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const maxRouteViews = topRoutes[0]?.views || 1;

  // Distribucija po zemljama porekla
  const countryMap = new Map<string, number>();
  allItems.forEach(item => {
    const c = item.originCountry || 'Nepoznato';
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
  });
  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const totalCountryItems = topCountries.reduce((s, x) => s + x.count, 0) || 1;

  // Mesečna aktivnost (poslednjih 6 meseci)
  const now = new Date();
  const monthLabels: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('sr-RS', { month: 'short' });
    monthLabels.push({ key, label });
  }
  const monthMap = new Map<string, number>();
  allItems.forEach(item => {
    if (!item.createdAt) return;
    const d = new Date(item.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  });
  const monthlyActivity = monthLabels.map(m => ({
    label: m.label,
    count: monthMap.get(m.key) || 0,
  }));
  const maxMonthly = Math.max(...monthlyActivity.map(m => m.count), 1);

  const statCards = [
    {
      label: 'Ukupno pregleda',
      value: totalViews,
      icon: Eye,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Ukupno kontakata',
      value: totalInquiries,
      icon: Phone,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Stopa konverzije',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'text-brand-400',
      bg: 'bg-brand-400/10',
      border: 'border-brand-400/20',
      hint: 'kontakti / pregledi',
    },
    {
      label: 'Prosek po oglasu',
      value: avgViews,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      hint: 'pregleda',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header sa Pro indikatorom */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-main">Statistika oglasa</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {limits.canSeeAdvancedStats
              ? 'Napredna analitika vaših oglasa'
              : 'Osnovni pregledi i kontakti — za naprednu analitiku nadogradite na PRO'}
          </p>
        </div>
        {!limits.canSeeAdvancedStats && (
          <Link to="/pricing">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Crown className="h-3.5 w-3.5 text-amber-400" /> Napredna analitika (PRO)
            </Button>
          </Link>
        )}
      </div>

      {/* Stat kartice */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <Card key={i} className={`p-4 ${stat.border}`}>
            <div className="flex items-start justify-between mb-2">
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold text-text-main mt-1`}>{stat.value}</p>
            {stat.hint && <p className="text-[10px] text-text-muted mt-0.5">{stat.hint}</p>}
          </Card>
        ))}
      </div>

      {/* Top oglasi */}
      {topItems.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Top oglasi po pregledima</h3>
            <span className="text-xs text-text-muted">{topItems.length} od {allItems.length}</span>
          </div>
          <div className="space-y-2">
            {topItems.map((item, i) => {
              const Icon = item._kind === 'load' ? Package : TruckIcon;
              return (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface/60 transition-colors">
                  <span className="h-6 w-6 rounded-full bg-brand-400/10 text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <Icon className="h-4 w-4 text-text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main truncate">
                      {item.originCity} → {item.destinationCity || 'Bilo gde'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {item._kind === 'load' ? 'Tura' : 'Kamion'} · {new Date(item.createdAt).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-text-main flex items-center gap-1 justify-end">
                      <Eye className="h-3 w-3 text-purple-400" /> {item.views || 0}
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1 justify-end mt-0.5">
                      <Phone className="h-3 w-3 text-green-400" /> {item.inquiries || 0}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Napredna analitika (Pro) */}
      {limits.canSeeAdvancedStats && allItems.length > 0 && (
        <div className="space-y-4">
          {/* PRO banner */}
          <div className="flex items-center gap-2 pt-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Napredna analitika</h3>
            <span className="text-[10px] bg-amber-400/15 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Pro</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top rute */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <MapPin className="h-4 w-4 text-brand-400" />
                <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">Top rute po pregledima</h4>
              </div>
              {topRoutes.length > 0 ? (
                <div className="space-y-3">
                  {topRoutes.map((r, i) => {
                    const pct = (r.views / maxRouteViews) * 100;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-text-main truncate pr-2">{r.route}</p>
                          <span className="text-xs text-text-muted flex items-center gap-1 flex-shrink-0">
                            <Eye className="h-3 w-3 text-purple-400" />{r.views}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface/60 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-text-muted mt-0.5">{r.count} oglasa · {r.inquiries} kontakata</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-text-muted">Još nema dovoljno podataka.</p>
              )}
            </Card>

            {/* Distribucija po zemljama */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <Globe className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">Poreklo po zemljama</h4>
              </div>
              {topCountries.length > 0 ? (
                <div className="space-y-2.5">
                  {topCountries.map((c, i) => {
                    const pct = ((c.count / totalCountryItems) * 100).toFixed(0);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg flex-shrink-0">{getFlagEmoji(c.country)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-text-main truncate pr-2">{c.country}</p>
                            <span className="text-xs text-text-muted flex-shrink-0">{c.count} · {pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface/60 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-text-muted">Još nema dovoljno podataka.</p>
              )}
            </Card>
          </div>

          {/* Mesečna aktivnost */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <BarChart3 className="h-4 w-4 text-green-400" />
              <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">Mesečna aktivnost (6 meseci)</h4>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {monthlyActivity.map((m, i) => {
                const pct = (m.count / maxMonthly) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-xs font-bold text-text-main mb-1">{m.count}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-green-500/40 to-green-400/80 transition-all min-h-[4px]"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="text-[10px] text-text-muted mt-1.5 capitalize">{m.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-text-muted mt-3 text-center">Broj novih oglasa po mesecu</p>
          </Card>
        </div>
      )}

      {allItems.length === 0 && (
        <Card className="p-6 text-center">
          <Package className="h-10 w-10 text-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-sm text-text-main font-medium">Još nemate objavljenih oglasa</p>
          <p className="text-xs text-text-muted mt-1">Objavite prvu turu ili kamion da biste videli statistiku.</p>
        </Card>
      )}
    </div>
  );
};
