import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Truck, Package, Shield, CreditCard, LogOut, ArrowLeftRight, Sun, Moon, List, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../UIComponents';

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void } = {}) => {
  const { profile, signOut } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('lbx_theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('lbx_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 group border border-transparent',
      isActive
        ? 'bg-brand-900/10 text-brand-600 dark:text-brand-400 border-brand-500/20'
        : 'text-text-muted hover:bg-surfaceHighlight hover:text-text-main'
    );

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-background transition-colors duration-300">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
           <div className="relative flex h-8 w-8 items-center justify-center bg-brand-400 rounded-md text-black shadow-glow">
             <ArrowLeftRight className="h-4 w-4" />
           </div>
           <div className="flex flex-col">
             <span className="text-lg font-bold text-text-main tracking-tight leading-none">Nalozi</span>
             <span className="text-[9px] font-bold text-brand-500 uppercase tracking-widest mt-0.5">za utovar</span>
           </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-1">
          <NavLink to="/dashboard" onClick={onNavigate} className={navItemClass}>
            <LayoutDashboard className="h-4 w-4" />
            Kontrolna tabla
          </NavLink>
          <NavLink to="/loads" onClick={onNavigate} className={navItemClass}>
            <Package className="h-4 w-4" />
            Ture (Tereti)
          </NavLink>
          <NavLink to="/trucks" onClick={onNavigate} className={navItemClass}>
            <Truck className="h-4 w-4" />
            Kamioni
          </NavLink>
          <NavLink to="/my-listings" onClick={onNavigate} className={navItemClass}>
            <List className="h-4 w-4" />
            Moje objave
          </NavLink>
          <NavLink to="/profile" onClick={onNavigate} className={navItemClass}>
            <UserCircle className="h-4 w-4" />
            Moj profil
          </NavLink>

          <div className="pt-8 pb-3">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Upravljanje
            </p>
          </div>
          <NavLink to="/plans" onClick={onNavigate} className={navItemClass}>
            <CreditCard className="h-4 w-4" />
            Pretplata
          </NavLink>

          {profile?.role === 'admin' && (
             <>
              <div className="pt-8 pb-3">
                <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Admin Zona
                </p>
              </div>
              <NavLink to="/admin" onClick={onNavigate} className={navItemClass}>
                <Shield className="h-4 w-4" />
                Administracija
              </NavLink>
             </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-surfaceHighlight hover:text-text-main transition-all"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'dark' ? 'Tamna tema' : 'Svetla tema'}
          </span>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-brand-500' : 'bg-zinc-300'}`}>
             <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </button>

        {/* User Profile */}
        <div className="bg-surface border border-border p-3 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded bg-surfaceHighlight border border-border flex items-center justify-center text-text-main font-bold text-xs">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-text-main">{profile?.name || 'Korisnik'}</p>
              <p className="truncate text-xs text-text-muted">{profile?.company?.name || 'Nema firme'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  profile?.plan === 'free' ? 'bg-gray-500/20 text-gray-500' :
                  profile?.plan === 'standard' ? 'bg-blue-500/20 text-blue-500' :
                  profile?.plan === 'pro' ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {profile?.plan === 'free' ? 'FREE' : 
                   profile?.plan === 'standard' ? 'STANDARD' : 
                   profile?.plan === 'pro' ? 'PRO' : 'N/A'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  profile?.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                  profile?.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {profile?.status === 'approved' ? 'ODOBRENO' : 
                   profile?.status === 'pending' ? 'ČEKA' : 'ODBAČENO'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-surfaceHighlight hover:text-text-main transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Odjavi se
          </button>
        </div>
      </div>
    </div>
  );
};