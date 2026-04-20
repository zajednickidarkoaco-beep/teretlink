import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

/**
 * Zajednički layout za legal i info stranice (O nama, Kontakt, Privacy, Terms, Cookies).
 * Header sa naslovom, scrollable content, i Footer na dnu.
 */
export const LegalPageLayout = ({ title, subtitle, lastUpdated, children }: LegalPageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      {/* Top bar sa nazad linkom i logom */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-xs uppercase tracking-wider font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Nazad na početnu
          </Link>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative h-7 w-7 flex items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <path d="M8 20 L20 12 L32 20 L20 28 Z" className="stroke-brand-500" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="4" className="fill-brand-500" />
                <circle cx="8" cy="20" r="3" className="fill-brand-400" />
                <circle cx="32" cy="20" r="3" className="fill-brand-400" />
                <circle cx="20" cy="12" r="3" className="fill-brand-400" />
                <circle cx="20" cy="28" r="3" className="fill-brand-400" />
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-text-main">Teret</span>
              <span className="text-sm font-bold text-brand-500">Link</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero / Naslov */}
      <div className="border-b border-border bg-surface/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="mx-auto max-w-4xl px-6 py-14 relative">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">{title}</h1>
          {subtitle && <p className="mt-3 text-base text-text-muted max-w-2xl leading-relaxed">{subtitle}</p>}
          {lastUpdated && (
            <p className="mt-4 text-xs text-text-muted uppercase tracking-wider">
              Poslednje ažuriranje: {lastUpdated}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 mx-auto max-w-4xl px-6 py-12 w-full">
        <article className="prose-legal space-y-6 text-text-muted leading-relaxed">
          {children}
        </article>
      </main>

      <Footer />
    </div>
  );
};
