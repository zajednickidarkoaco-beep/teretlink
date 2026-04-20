import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Zap, Shield, Star } from 'lucide-react';
import { Button, Card, Badge } from '../components/UIComponents';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  {
    key: 'free',
    name: 'Početni',
    subtitle: 'Za upoznavanje platforme',
    price: 0,
    color: 'gray',
    icon: null,
    features: [
      { text: 'Pregled svih tura i kamiona', included: true },
      { text: 'Pristup kontakt podacima', included: false },
      { text: '3 ture + 3 kamiona mesečno', included: true },
      { text: 'Osnovni filteri (zemlja, datum, vozilo)', included: false },
      { text: 'Napredni filteri (težina, cena, ADR, Frigo)', included: false },
      { text: 'Pametno podudaranje ruta', included: false },
      { text: 'Email alarmi pri podudaranju', included: false },
      { text: 'Statistike svojih oglasa', included: false },
      { text: 'Featured / istaknuti oglasi', included: false },
      { text: 'Verifikovan badge', included: false },
      { text: 'Multi-user nalog', included: false },
    ],
    cta: 'Registruj se besplatno',
    ctaLink: '/register',
    ctaVariant: 'outline' as const,
  },
  {
    key: 'standard',
    name: 'Standard',
    subtitle: 'Za aktivne prevoznike',
    price: 29,
    color: 'brand',
    icon: Zap,
    popular: true,
    features: [
      { text: 'Pregled svih tura i kamiona', included: true },
      { text: 'Pristup kontakt podacima', included: true },
      { text: 'Neograničene objave', included: true },
      { text: 'Osnovni filteri (zemlja, datum, vozilo)', included: true },
      { text: 'Napredni filteri (težina, cena, ADR, Frigo)', included: false },
      { text: 'Pametno podudaranje ruta', included: true },
      { text: 'Email alarmi pri podudaranju', included: true },
      { text: 'Osnovne statistike svojih oglasa', included: true },
      { text: 'Featured / istaknuti oglasi', included: false },
      { text: 'Verifikovan badge', included: true },
      { text: 'Multi-user nalog', included: false },
    ],
    cta: 'Izaberi Standard',
    ctaVariant: 'primary' as const,
  },
  {
    key: 'pro',
    name: 'Pro',
    subtitle: 'Bez ikakvih ograničenja',
    price: 99,
    color: 'amber',
    icon: Star,
    features: [
      { text: 'Pregled svih tura i kamiona', included: true },
      { text: 'Pristup kontakt podacima', included: true },
      { text: 'Neograničene objave', included: true },
      { text: 'Osnovni filteri (zemlja, datum, vozilo)', included: true },
      { text: 'Napredni filteri (težina, cena, ADR, Frigo)', included: true },
      { text: 'Pametno podudaranje ruta', included: true },
      { text: 'Email alarmi pri podudaranju', included: true },
      { text: 'Napredne statistike + analitika', included: true },
      { text: '5 Featured / istaknutih oglasa mesečno', included: true },
      { text: 'Top Partner badge + prioritet u listi', included: true },
      { text: 'Multi-user nalog (do 3 člana)', included: true },
    ],
    cta: 'Izaberi Pro',
    ctaVariant: 'outline' as const,
  },
];

const colorMap: Record<string, { badge: string; border: string; glow: string; icon: string; price: string }> = {
  gray:  { badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20', border: 'border-border', glow: '', icon: 'bg-gray-500/10 text-gray-400', price: 'text-text-main' },
  brand: { badge: 'bg-brand-500/10 text-brand-400 border-brand-500/20', border: 'border-brand-500/40', glow: 'shadow-[0_0_30px_rgba(74,222,128,0.08)]', icon: 'bg-brand-400/10 text-brand-400', price: 'text-brand-400' },
  amber: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', border: 'border-amber-500/30', glow: '', icon: 'bg-amber-500/10 text-amber-400', price: 'text-amber-400' },
};

export const Pricing = () => {
  const { profile, isAuthenticated } = useAuth();
  const currentPlan = profile?.plan || null;

  const handleUpgrade = (planKey: string) => {
    const subject = encodeURIComponent(`Zahtev za nadogradnju na ${planKey.toUpperCase()} plan`);
    const body = encodeURIComponent(
      `Zdravo,\n\nŽelim da nadogradim moj nalog na ${planKey.toUpperCase()} plan.\n\nEmail: ${profile?.email || ''}\nFirma: ${profile?.company?.name || ''}\n\nHvala!`
    );
    window.location.href = `mailto:podrska@teretlink.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className={isAuthenticated ? 'text-text-main animate-fade-in' : 'min-h-screen bg-background text-text-main'}>
      {/* Header — prikazuje se samo za neautentifikovane (public /pricing) */}
      {!isAuthenticated && (
        <div className="border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="h-3 w-3" />
              Početna
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">Prijavi se</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className={`mx-auto max-w-6xl px-4 ${isAuthenticated ? 'pt-4 pb-8' : 'pt-16 pb-12'} text-center`}>
        <div className="inline-flex items-center gap-2 bg-brand-400/10 border border-brand-400/20 rounded-full px-4 py-1.5 text-xs font-bold text-brand-400 uppercase tracking-widest mb-6">
          <Shield className="h-3.5 w-3.5" /> Transparentan cenovnik
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-text-main tracking-tight mb-4">
          Izaberite pravi plan
        </h1>
        <p className="text-text-muted text-lg max-w-xl mx-auto">
          Počnite besplatno, nadogradite kada budete spremni. Bez ugovora, bez skrivenih troškova.
        </p>

        {isAuthenticated && currentPlan && (
          <div className="mt-6 inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 text-sm">
            <span className="text-text-muted">Vaš trenutni plan:</span>
            <span className={`font-bold uppercase ${
              currentPlan === 'pro' ? 'text-amber-400' :
              currentPlan === 'standard' ? 'text-brand-400' : 'text-gray-400'
            }`}>
              {currentPlan}
            </span>
          </div>
        )}
      </div>

      {/* Plan kartice */}
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const c = colorMap[plan.color];
            const isCurrent = currentPlan === plan.key;
            const Icon = plan.icon;

            return (
              <Card
                key={plan.key}
                className={`relative flex flex-col p-8 transition-all ${c.border} ${c.glow} ${
                  isCurrent ? 'ring-2 ring-brand-400/30' : ''
                }`}
              >
                {/* Popular badge */}
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Najpopularnije
                    </span>
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-surface border border-border text-text-muted text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Vaš plan
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {Icon && (
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${c.icon}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-text-main">{plan.name}</h3>
                  </div>
                  <p className="text-text-muted text-xs uppercase tracking-wider">{plan.subtitle}</p>
                </div>

                {/* Cena */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className={`text-5xl font-black ${c.price}`}>
                      {plan.price}€
                    </span>
                    <span className="text-text-muted text-sm mb-2">/mesec</span>
                  </div>
                  {plan.price === 0 && (
                    <p className="text-text-muted text-xs mt-1">Zauvek besplatno</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${f.included ? 'text-text-main' : 'text-text-muted opacity-50'}`}>
                      {f.included
                        ? <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${c.price}`} />
                        : <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>

                {/* CTA dugme */}
                {isCurrent ? (
                  <div className="w-full text-center py-2.5 rounded-lg border border-border text-text-muted text-sm font-medium">
                    Aktivni plan
                  </div>
                ) : isAuthenticated ? (
                  plan.key === 'free' ? (
                    <div className="w-full text-center py-2.5 rounded-lg border border-border text-text-muted text-xs">
                      Vaš osnivački plan
                    </div>
                  ) : (
                    <Button
                      variant={plan.ctaVariant}
                      className="w-full uppercase text-xs tracking-widest"
                      onClick={() => handleUpgrade(plan.key)}
                    >
                      {plan.cta}
                    </Button>
                  )
                ) : (
                  <Link to={plan.ctaLink || '/register'}>
                    <Button variant={plan.ctaVariant} className="w-full uppercase text-xs tracking-widest">
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>

        {/* Napomena o nadogradnji */}
        {isAuthenticated && currentPlan !== 'pro' && (
          <div className="mt-10 text-center">
            <p className="text-text-muted text-sm">
              Za nadogradnju plana kontaktirajte nas na{' '}
              <a href="mailto:podrska@teretlink.com" className="text-brand-400 hover:underline">
                podrska@teretlink.com
              </a>
              {' '}ili putem{' '}
              <a
                href="https://wa.me/381631234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:underline"
              >
                WhatsApp
              </a>
              . Odgovaramo u roku od 24h.
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-text-main text-center mb-10">Česta pitanja</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Mogu li da menjam plan?',
                a: 'Da, u svakom trenutku. Kontaktirajte nas i plan ćemo promeniti u roku od 24h.',
              },
              {
                q: 'Postoji li ugovor ili obaveza?',
                a: 'Ne. Plaćate mesečno i možete otkazati ili promeniti plan kada god želite.',
              },
              {
                q: 'Kako se plaća?',
                a: 'Plaćanje se vrši bankovnom transakcijom. Nakon uplate šaljemo vam potvrdu i aktiviramo plan.',
              },
              {
                q: 'Šta znači "pametno podudaranje"?',
                a: 'Sistem automatski pronalazi ture i kamione koji odgovaraju vašim rutama i datumima, i obaveštava vas emailom.',
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6">
                <h4 className="font-bold text-text-main mb-2">{faq.q}</h4>
                <p className="text-text-muted text-sm leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
