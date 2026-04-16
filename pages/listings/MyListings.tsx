import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Load, Truck } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Plus, Trash2, Package, Truck as TruckIcon, MapPin, Calendar, Phone } from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';

export const MyListings = () => {
  const { user, profile } = useAuth();
  const [myLoads, setMyLoads] = useState<Load[]>([]);
  const [myTrucks, setMyTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'loads' | 'trucks'>('loads');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'load' | 'truck' } | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchMyData();
  }, [user]);

  const fetchMyData = async () => {
    try {
      const [loads, trucks] = await Promise.all([
        SupabaseService.getUserLoads(user!.id),
        SupabaseService.getUserTrucks(user!.id),
      ]);
      setMyLoads(loads);
      setMyTrucks(trucks);
    } catch (err) {
      console.error('Greška pri učitavanju objava:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      if (confirmDelete.type === 'load') {
        await SupabaseService.deleteLoad(confirmDelete.id);
        setMyLoads(prev => prev.filter(l => l.id !== confirmDelete.id));
      } else {
        await SupabaseService.deleteTruck(confirmDelete.id);
        setMyTrucks(prev => prev.filter(t => t.id !== confirmDelete.id));
      }
    } catch (err) {
      console.error('Greška pri brisanju:', err);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('sr-RS');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Moje objave</h1>
          <p className="text-text-muted text-sm">Upravljajte svojim turama i kamionima</p>
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

      {/* Tabovi */}
      <div className="flex gap-1 bg-surface border border-border rounded-lg p-1 w-full sm:w-fit">
        <button
          onClick={() => setActiveTab('loads')}
          className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'loads'
              ? 'bg-brand-500 text-black'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Package className="h-4 w-4" />
          Ture ({loading ? '...' : myLoads.length})
        </button>
        <button
          onClick={() => setActiveTab('trucks')}
          className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'trucks'
              ? 'bg-brand-500 text-black'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          <TruckIcon className="h-4 w-4" />
          Kamioni ({loading ? '...' : myTrucks.length})
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="h-4 bg-surfaceHighlight rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-surfaceHighlight rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : activeTab === 'loads' ? (
        myLoads.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-transparent">
            <Package className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-4">Nemate objavljenih tura.</p>
            {profile?.plan !== 'free' && (
              <Link to="/post-load">
                <Button variant="primary" size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" /> Objavi prvu turu
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {myLoads.map(load => (
              <Card key={load.id} className="p-5 hover:border-brand-500/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="info">TURA</Badge>
                      {load.isFtl && <Badge variant="warning">FTL</Badge>}
                      <span className="text-[10px] text-text-muted font-mono">{load.referenceNumber || ''}</span>
                    </div>
                    <p className="font-bold text-text-main flex items-center gap-2 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                      {load.originCity}, {load.originCountry}
                      <span className="text-text-muted">→</span>
                      {load.destinationCity || 'Bilo gde'}, {load.destinationCountry || ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(load.dateFrom)}{load.dateTo ? ` – ${formatDate(load.dateTo)}` : ''}
                      </span>
                      {load.truckType && <span>{load.truckType}</span>}
                      {load.weightTonnes && <span>{load.weightTonnes}t</span>}
                      {load.contactPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {load.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {load.price && (
                      <p className="font-bold text-text-main font-mono">{load.price} {load.currency}</p>
                    )}
                    <p className="text-[10px] text-text-muted">{load.views || 0} pregleda</p>
                    <button
                      onClick={() => setConfirmDelete({ id: load.id, type: 'load' })}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Obriši
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        myTrucks.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-transparent">
            <TruckIcon className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-4">Nemate objavljenih kamiona.</p>
            {profile?.plan !== 'free' && (
              <Link to="/post-truck">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" /> Objavi prvi kamion
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {myTrucks.map(truck => (
              <Card key={truck.id} className="p-5 hover:border-brand-500/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success">KAMION</Badge>
                    </div>
                    <p className="font-bold text-text-main flex items-center gap-2 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                      {truck.originCity}, {truck.originCountry}
                      <span className="text-text-muted">→</span>
                      {truck.destinationCity || 'Bilo gde'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(truck.dateFrom)}{truck.dateTo ? ` – ${formatDate(truck.dateTo)}` : ''}
                      </span>
                      {truck.truckType && <span>{truck.truckType}</span>}
                      {truck.capacity && <span>{truck.capacity}</span>}
                      {truck.contactPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {truck.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-[10px] text-text-muted">{truck.views || 0} pregleda</p>
                    <button
                      onClick={() => setConfirmDelete({ id: truck.id, type: 'truck' })}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Obriši
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Modal za potvrdu brisanja */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <h3 className="font-bold text-text-main mb-2">Obriši objavu</h3>
            <p className="text-text-muted text-sm mb-6">
              Da li ste sigurni da želite da obrišete ovu objavu? Ova akcija se ne može poništiti.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setConfirmDelete(null)}
              >
                Odustani
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 bg-red-500 hover:bg-red-600 border-red-500"
                onClick={handleDelete}
                disabled={!!deletingId}
              >
                {deletingId ? 'Brisanje...' : 'Obriši'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
