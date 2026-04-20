import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer komponenta — koristi se na svim javnim stranicama.
 * Linkovi su povezani na prave stranice (About, Contact, Privacy, Terms).
 */
export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>

      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <Link to="/" className="flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity">
                <div className="relative h-10 w-10 flex items-center justify-center">
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
                  <span className="text-2xl font-bold tracking-tight text-text-main">Teret</span>
                  <span className="text-2xl font-bold tracking-tight text-brand-500">Link</span>
                </div>
              </Link>
              <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-xs">
                Moderna berza transporta koja povezuje prevoznike i špeditere širom Balkana i Evrope.
              </p>

              {/* Kontakt info */}
              <ul className="space-y-2 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" />
                  <a href="mailto:info@teretlink.rs" className="hover:text-text-main transition-colors">info@teretlink.rs</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" />
                  <a href="tel:+381600000000" className="hover:text-text-main transition-colors">+381 60 000 0000</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" />
                  <span>Beograd, Srbija</span>
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex gap-2 mt-5">
                <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:border-brand-500/50 hover:bg-surfaceHighlight transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:border-brand-500/50 hover:bg-surfaceHighlight transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:border-brand-500/50 hover:bg-surfaceHighlight transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            {/* Platforma */}
            <div className="md:col-span-3">
              <h4 className="font-bold text-text-main mb-5 text-[10px] uppercase tracking-[0.2em]">Platforma</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/loads" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Berza tereta
                  </Link>
                </li>
                <li>
                  <Link to="/trucks" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Berza kamiona
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Cenovnik
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Registracija
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kompanija */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-text-main mb-5 text-[10px] uppercase tracking-[0.2em]">Kompanija</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    O nama
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            {/* Pravno */}
            <div className="md:col-span-3">
              <h4 className="font-bold text-text-main mb-5 text-[10px] uppercase tracking-[0.2em]">Pravno</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Politika privatnosti
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Uslovi korišćenja
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-sm text-text-muted hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-500 transition-colors"></span>
                    Kolačići
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              <span>© {year} TeretLink.</span>
              <span className="hidden md:block">•</span>
              <span>Sva prava zadržana.</span>
              <span className="hidden md:block">•</span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                Napravljeno u Srbiji
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
