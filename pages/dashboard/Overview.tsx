import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserStatus } from '../../types';
import { Load, Truck } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Package, Truck as TruckIcon, Activity, Lock, TrendingUp, Plus, ArrowUpRight, Trash2 } from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';

export const Overview = () => {
  const { profile, user } = useAuth();
  const [myLoads, setMyLoads] = useState<Load[]>([]);
  const [myTrucks, setMyTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyData = async () => {
      try {
        const [loads, trucks] = await Promise.all([
          SupabaseService.getUserLoads(user.id),
          SupabaseService.getUserTrucks(user.id),
        ]);
        setMyLoads(loads);
        setMyTrucks(trucks);
      } catch (err) {
        console.error('Greška pri učitavanju objava:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [user]);

  const totalViews = [...myLoads, ...myTrucks].reduce((sum, item) => sum + (item.views || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Kontrolna Tabla</h1>
          <p className="text-text-muted text-sm">Dobrodošli nazad, {profile?.name || 'Korisnik'}</p>
        </div>
        {profile?.plan !== 'free' && (
          <div className="flex gap-3">
            <Link to="/post-load">
              <Button variant="primary" size="sm" className="gap-2 shadow-glow uppercase tracking-wide">
                <Plus className="h-3.5 w-3.5" /> Nova Tura
              </Button>
            </Link>
            <Link to="/post-truck">
              <Button variant="outline" size="sm" className="gap-2 uppercase tracking-wide">
                <Plus className="h-3.5 w-3.5" /> Novi Kamion
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Upozorenja */}
      {profile?.status === UserStatus.PENDING && (
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-4 flex gap-4 items-start">
          <div className="h-8 w-8 bg-amber-500/30 rounded flex items-center justify-center text-amber-500 shrink-0">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-amber-500 text-sm">Nalog čeka odobrenje</h3>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-1 leading-relaxed max-w-2xl font-medium">
              Vaša dokumentacija se proverava. Kontakt detalji drugih korisnika su sakriveni dok nalog ne bude odobren.
            </p>
          </div>
        </div>
      )}

      {profile?.plan === 'free' && profile?.status === UserStatus.APPROVED && (
        <div className="rounded-md border border-blue-500/50 bg-blue-500/10 p-4 flex gap-4 items-start">
          <div className="h-8 w-8 bg-blue-500/30 rounded flex items-center justify-center text-blue-500 shrink-0">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-blue-500 text-sm">FREE Plan - Ograničen pristup</h3>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 leading-relaxed max-w-2xl font-medium">
              Sa FREE planom možete samo da pregledate ture i kamione. Za objavljavanje i pristup kontaktima potreban je STANDARD ili PRO plan.
            </p>
          </div>
        </div>
      )}

      {/* Podaci o kompaniji */}
      {profile?.company && (
        <Card className="p-4 bg-surface/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-main">Informacije o kompaniji</h3>
            <Badge variant={profile.status === UserStatus.APPROVED ? 'success' : 'warning'}>
              {profile.status === UserStatus.APPROVED ? 'Odobreno' : 'Na čekanju'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider">Naziv</p>
              <p className="font-medium text-text-main">{profile.company.name}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider">PIB/Matični</p>
              <p className="font-medium text-text-main">{profile.company.registrationNumber}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider">Lokacija</p>
              <p className="font-medium text-text-main">{profile.company.city}, {profile.company.country}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider">Kategorija</p>
              <p className="font-medium text-text-main text-xs">
                {profile.company.category === 'Transport Company / Carrier' ? 'Prevoznik' :
                 profile.company.category === 'Freight Forwarder' ? 'Špediter' :
                 profile.company.category || 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Statistike */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Aktivne Ture', val: loading ? '...' : myLoads.length, icon: Package, color: 'text-brand-500', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
          { label: 'Moji Kamioni', val: loading ? '...' : myTrucks.length, icon: TruckIcon, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Ukupno Pregleda', val: loading ? '...' : totalViews, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          {
            label: 'Plan',
            val: profile?.plan === 'free' ? 'FREE' : profile?.plan === 'standard' ? 'STANDARD' : profile?.plan === 'pro' ? 'PRO' : 'N/A',
            icon: TrendingUp,
            color: profile?.plan === 'pro' ? 'text-amber-500' : profile?.plan === 'standard' ? 'text-blue-500' : 'text-gray-500',
            bg: profile?.plan === 'pro' ? 'bg-amber-500/10' : profile?.plan === 'standard' ? 'bg-blue-500/10' : 'bg-gray-500/10',
            border: profile?.plan === 'pro' ? 'border-amber-500/20' : profile?.plan === 'standard' ? 'border-blue-500/20' : 'border-gray-500/20',
          }
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex items-center justify-between hover:bg-surfaceHighlight transition-colors border-border">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-text-main mt-1">{stat.val}</p>
            </div>
            <div className={`h-10 w-10 rounded ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      {/* Moje ture i kamioni */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Moje Ture */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Moje Ture</h3>
            <Link to="/loads" className="text-[10px] text-brand-500 hover:text-brand-400 font-bold uppercase tracking-widest flex items-center gap-1">
              Pogledaj Sve <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <Card className="p-8 text-center text-text-muted border-dashed border-border bg-transparent">
              Učitavanje...
            </Card>
          ) : myLoads.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border bg-transparent">
              <p className="text-text-muted text-sm mb-3">Nema aktivnih tura.</p>
              {profile?.plan !== 'free' && (
                <Link to="/post-load">
                  <Button variant="primary" size="sm" className="gap-2">
                    <Plus className="h-3.5 w-3.5" /> Objavi turu
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            myLoads.slice(0, 3).map(load => (
              <Card key={load.id} className="p-4 flex items-center justify-between hover:border-brand-500/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info">TURA</Badge>
                    <span className="text-[10px] text-text-muted font-mono">
                      {new Date(load.dateFrom).toLocaleDateString('sr-RS')}
                    </span>
                  </div>
                  <p className="font-bold text-text-main text-sm flex items-center gap-2">
                    {load.originCity} <span className="text-text-muted">→</span> {load.destinationCity || 'Bilo gde'}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">{load.views || 0} pregleda</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-main font-mono">
                    {load.price ? `${load.price} ${load.currency}` : '-'}
                  </p>
                  <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">{load.truckType}</p>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Moji Kamioni */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Moji Kamioni</h3>
            <Link to="/trucks" className="text-[10px] text-brand-500 hover:text-brand-400 font-bold uppercase tracking-widest flex items-center gap-1">
              Pogledaj Sve <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <Card className="p-8 text-center text-text-muted border-dashed border-border bg-transparent">
              Učitavanje...
            </Card>
          ) : myTrucks.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border bg-transparent">
              <p className="text-text-muted text-sm mb-3">Nema aktivnih kamiona.</p>
              {profile?.plan !== 'free' && (
                <Link to="/post-truck">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-3.5 w-3.5" /> Objavi kamion
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            myTrucks.slice(0, 3).map(truck => (
              <Card key={truck.id} className="p-4 flex items-center justify-between hover:border-brand-500/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success">KAMION</Badge>
                    <span className="text-[10px] text-text-muted font-mono">
                      {new Date(truck.dateFrom).toLocaleDateString('sr-RS')}
                    </span>
                  </div>
                  <p className="font-bold text-text-main text-sm flex items-center gap-2">
                    {truck.originCity} <span className="text-text-muted">→</span> {truck.destinationCity || 'Bilo gde'}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">{truck.views || 0} pregleda</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-main font-mono">{truck.capacity || '-'}</p>
                  <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">{truck.truckType}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
