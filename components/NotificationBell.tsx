import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Package, Truck as TruckIcon, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupabaseService } from '../services/supabaseService';
import { Notification } from '../types';

/**
 * Bell ikona sa brojačem nepročitanih i dropdown listom notifikacija.
 * Radi samo za prijavljene korisnike (Free takođe vidi — samo ih niko ne kreira za njih).
 * Polling na 60s da se ažurira broj nepročitanih bez page refresh-a.
 */
export const NotificationBell = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);

  // Izračunaj poziciju dropdown-a u odnosu na bell dugme
  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, [open]);

  const refreshUnreadCount = useCallback(async () => {
    if (!profile) return;
    const count = await SupabaseService.getUnreadNotificationCount();
    setUnreadCount(count);
  }, [profile]);

  const loadNotifications = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const items = await SupabaseService.getNotifications(20);
    setNotifications(items);
    setLoading(false);
  }, [profile]);

  // Poll unread count svakih 60s
  useEffect(() => {
    if (!profile) return;
    refreshUnreadCount();
    const id = setInterval(refreshUnreadCount, 60000);
    return () => clearInterval(id);
  }, [profile, refreshUnreadCount]);

  // Učitaj listu kad se otvori dropdown
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open, loadNotifications]);

  // Zatvori dropdown klikom van (ali ne ako je klik na bell dugme ili na dropdown)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideButton = buttonRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideButton && !insideDropdown) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleNotificationClick = (n: Notification) => {
    // Mark as read u pozadini (bez await) — da ne blokira navigation
    if (!n.isRead) {
      SupabaseService.markNotificationAsRead(n.id).catch(err =>
        console.error('Mark as read failed:', err)
      );
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setOpen(false);
    // Navigate odmah
    if (n.relatedLoadId) {
      navigate(`/loads?highlight=${n.relatedLoadId}`);
    } else if (n.relatedTruckId) {
      navigate(`/trucks?highlight=${n.relatedTruckId}`);
    }
  };

  const handleMarkAllRead = async () => {
    await SupabaseService.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(x => ({ ...x, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await SupabaseService.deleteNotification(id);
    setNotifications(prev => {
      const target = prev.find(x => x.id === id);
      if (target && !target.isRead) setUnreadCount(c => Math.max(0, c - 1));
      return prev.filter(x => x.id !== id);
    });
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match_load': return <Package className="h-4 w-4 text-purple-400" />;
      case 'match_truck': return <TruckIcon className="h-4 w-4 text-blue-400" />;
      case 'contact': return <Info className="h-4 w-4 text-green-400" />;
      default: return <Info className="h-4 w-4 text-text-muted" />;
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = Date.now();
    const diff = Math.floor((now - d.getTime()) / 1000);
    if (diff < 60) return 'sada';
    if (diff < 3600) return `pre ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `pre ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `pre ${Math.floor(diff / 86400)}d`;
    return d.toLocaleDateString('sr-RS');
  };

  if (!profile) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-md text-text-muted hover:text-text-main hover:bg-surfaceHighlight transition-colors"
        title="Notifikacije"
        aria-label="Notifikacije"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-500 text-black text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && position && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', top: position.top, right: position.right }}
          className="w-[340px] sm:w-96 max-w-[calc(100vw-1rem)] bg-background border border-border rounded-lg shadow-2xl z-[9999] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-main">Notifikacije</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Označi sve
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-xs text-text-muted">Učitavanje...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-text-muted mx-auto mb-2 opacity-40" />
                <p className="text-sm text-text-main font-medium">Nema notifikacija</p>
                <p className="text-xs text-text-muted mt-1">
                  {profile.plan === 'free'
                    ? 'Nadogradi plan da dobiješ alarme o novim oglasima.'
                    : 'Obavestićemo te kad neko objavi oglas koji ti odgovara.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map(n => (
                  <li
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`px-4 py-3 cursor-pointer hover:bg-surfaceHighlight transition-colors ${
                      !n.isRead ? 'bg-brand-400/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold ${!n.isRead ? 'text-text-main' : 'text-text-muted'} truncate`}>
                            {n.title}
                          </p>
                          {!n.isRead && <span className="flex-shrink-0 h-2 w-2 rounded-full bg-brand-500 mt-1" />}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-text-muted mt-1">{formatTime(n.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, n.id)}
                        className="flex-shrink-0 p-1 text-text-muted hover:text-red-400 rounded"
                        title="Obriši"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {profile.plan === 'free' && (
            <div className="px-4 py-2.5 border-t border-border bg-amber-400/[0.03] text-center">
              <p className="text-[11px] text-amber-400">
                Matching alarmi su dostupni od STANDARD plana
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
