import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Select, Badge } from '../../components/UIComponents';
import {
  Filter, Phone, Lock, Calendar, ArrowRight, Weight, Ruler, AlertTriangle,
  Thermometer, Truck, RefreshCw, SlidersHorizontal, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SupabaseService } from '../../services/supabaseService';
import { Truck as TruckType } from '../../types';
import { EUROPEAN_COUNTRIES, getFlagEmoji } from '../../utils/countries';
import { ListingDetailPanel } from '../../components/ListingDetailPanel';

const COUNTRY_OPTIONS = [
  { value: '', label: 'Sve države' },
  ...EUROPEAN_COUNTRIES.map(c => ({ value: c.name, label: c.name })),
];

const VEHICLE_TYPE_OPTIONS = [
  { value: '', label: 'Sva vozila' },
  { value: 'Cerada / Tautliner', label: 'Cerada / Tautliner' },
  { value: 'Mega cerada / Mega tautliner', label: 'Mega cerada' },
  { value: 'Jumbo cerada', label: 'Jumbo cerada' },
  { value: 'Hladnjača / Frigo', label: 'Hladnjača / Frigo' },
  { value: 'Izoterm', label: 'Izoterm' },
  { value: 'Otvoreni / Platforma', label: 'Platforma' },
  { value: 'Kiper / Kipovac', label: 'Kiper' },
  { value: 'Silos', label: 'Silos' },
  { value: 'Cisterna', label: 'Cisterna' },
  { value: 'Kontejner', label: 'Kontejner' },
  { value: 'Auto transporter', label: 'Auto transporter' },
  { value: 'Kombi / Sprinter', label: 'Kombi / Sprinter' },
  { value: 'Kuka / Rol kiper', label: 'Kuka / Rol kiper' },
  { value: 'Nisko utovarna', label: 'Nisko utovarna' },
  { value: 'Specijalni transport', label: 'Specijalni transport' },
];

const INITIAL_FILTER = {
  // Basic (STANDARD+)
  originCountry: '',
  destinationCountry: '',
  truckType: '',
  dateFrom: '',
  // Advanced (PRO only)
  weightCapacityMin: '',
  ldmMin: '',
  truckCountMin: '',
  adrCapable: false,
  frigoCapable: false,
};

export const TruckBoard = () => {
  const { profile, canViewContact } = useAuth();
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filter, setFilter] = useState(INITIAL_FILTER);

  const fetchTrucks = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoadingData(true);
    try {
      const data = await SupabaseService.getTrucks();
      setTrucks(data);
    } catch (err) {
      console.error('Error fetching trucks:', err);
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const isPro = profile?.plan === 'pro';

  const filteredTrucks = trucks.filter(t => {
    if (profile?.plan === 'free') return true;

    // Basic filters (STANDARD+)
    if (filter.originCountry && t.originCountry !== filter.originCountry) return false;
    if (filter.destinationCountry && (!t.destinationCountry || t.destinationCountry !== filter.destinationCountry)) return false;
    if (filter.truckType && t.truckType !== filter.truckType) return false;
    if (filter.dateFrom && t.dateFrom < filter.dateFrom) return false;

    // Advanced filters (PRO only)
    if (isPro) {
      if (filter.weightCapacityMin && (t.weightCapacity == null || t.weightCapacity < parseFloat(filter.weightCapacityMin))) return false;
      if (filter.ldmMin && (t.loadingMeters == null || t.loadingMeters < parseFloat(filter.ldmMin))) return false;
      if (filter.truckCountMin && (t.truckCount == null || t.truckCount < parseInt(filter.truckCountMin))) return false;
      if (filter.adrCapable && !t.adrCapable && (!t.adrClasses || t.adrClasses.length === 0)) return false;
      if (filter.frigoCapable && t.temperatureMin == null && t.temperatureMax == null) return false;
    }

    return true;
  });

  const resetFilters = () => {
    setFilter(INITIAL_FILTER);
    setShowAdvanced(false);
  };

  const basicActiveCount = [
    filter.originCountry, filter.destinationCountry, filter.truckType, filter.dateFrom,
  ].filter(Boolean).length;

  const advancedActiveCount = [
    filter.weightCapacityMin, filter.ldmMin, filter.truckCountMin,
  ].filter(Boolean).length + (filter.adrCapable ? 1 : 0) + (filter.frigoCapable ? 1 : 0);

  const totalActiveCount = basicActiveCount + advancedActiveCount;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Berza Kamiona</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {loadingData ? 'Učitavam...' : `${filteredTrucks.length} ${filteredTrucks.length === 1 ? 'oglas' : 'oglasa'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTrucks(true)}
            disabled={refreshing}
            className="h-9 w-9 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text-main hover:border-text-muted transition-all disabled:opacity-50"
            title="Osveži"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          {profile?.plan !== 'free' && (
            <Link to="/post-truck">
              <Button variant="primary">+ Objavi kamion</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-5 sticky top-4 z-20 shadow-lg border-border ring-1 ring-border">
        {profile?.plan === 'free' ? (
          <div className="text-center py-3">
            <p className="text-text-muted text-sm mb-3">Filteri su dostupni samo sa STANDARD ili PRO planom</p>
            <Link to="/pricing">
              <Button variant="primary" size="sm">Nadogradi plan</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Basic Filters */}
            <div className="grid md:grid-cols-5 gap-3 items-end">
              <Select
                label="Zemlja polaska"
                value={filter.originCountry}
                onChange={e => setFilter(f => ({ ...f, originCountry: e.target.value }))}
                options={COUNTRY_OPTIONS}
              />
              <Select
                label="Željeno odredište"
                value={filter.destinationCountry}
                onChange={e => setFilter(f => ({ ...f, destinationCountry: e.target.value }))}
                options={COUNTRY_OPTIONS}
              />
              <Select
                label="Vrsta vozila"
                value={filter.truckType}
                onChange={e => setFilter(f => ({ ...f, truckType: e.target.value }))}
                options={VEHICLE_TYPE_OPTIONS}
              />
              <Input
                label="Slobodan od"
                type="date"
                value={filter.dateFrom}
                onChange={e => setFilter(f => ({ ...f, dateFrom: e.target.value }))}
              />
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Poništi
                {totalActiveCount > 0 && (
                  <span className="bg-brand-400 text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalActiveCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Advanced Toggle */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-text-muted">
                {advancedActiveCount > 0
                  ? <span className="text-brand-400 font-medium">{advancedActiveCount} naprednih filtera aktivno</span>
                  : 'Filtrirajte po nosivosti, LDM, ADR sposobnosti i još više'}
              </span>
              <button
                onClick={() => setShowAdvanced(s => !s)}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg border ${
                  showAdvanced
                    ? 'bg-brand-400/10 border-brand-400/30 text-brand-400'
                    : 'bg-surface border-border text-text-muted hover:text-text-main hover:border-text-muted'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Napredna pretraga
                {!isPro && <Lock className="h-3 w-3" />}
                {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Advanced Panel */}
            {showAdvanced && (
              <div className="relative mt-4 pt-4 border-t border-border">
                <div className={!isPro ? 'blur-sm pointer-events-none select-none' : ''}>
                  {/* Row 1: Numeric ranges + toggles */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                    <Input
                      label="Nosivost min. (t)"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={filter.weightCapacityMin}
                      onChange={e => setFilter(f => ({ ...f, weightCapacityMin: e.target.value }))}
                    />
                    <Input
                      label="LDM min. (m)"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={filter.ldmMin}
                      onChange={e => setFilter(f => ({ ...f, ldmMin: e.target.value }))}
                    />
                    <Input
                      label="Broj kamiona min."
                      type="number"
                      min="1"
                      step="1"
                      placeholder="1"
                      value={filter.truckCountMin}
                      onChange={e => setFilter(f => ({ ...f, truckCountMin: e.target.value }))}
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-text-muted">Posebne mogućnosti</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFilter(f => ({ ...f, adrCapable: !f.adrCapable }))}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border text-xs font-semibold transition-all ${
                            filter.adrCapable
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                              : 'bg-surface border-border text-text-muted hover:border-text-muted hover:text-text-main'
                          }`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5" /> ADR
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilter(f => ({ ...f, frigoCapable: !f.frigoCapable }))}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border text-xs font-semibold transition-all ${
                            filter.frigoCapable
                              ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                              : 'bg-surface border-border text-text-muted hover:border-text-muted hover:text-text-main'
                          }`}
                        >
                          <Thermometer className="h-3.5 w-3.5" /> Frigo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lock overlay for STANDARD plan */}
                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/75 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center">
                        <Lock className="h-5 w-5 text-text-muted" />
                      </div>
                      <p className="text-sm font-semibold text-text-main">Napredna pretraga — PRO plan</p>
                      <p className="text-xs text-text-muted max-w-xs">
                        Filtrirajte po nosivosti, LDM, broju kamiona, ADR i frigo sposobnosti
                      </p>
                    </div>
                    <Link to="/pricing">
                      <Button variant="primary" size="sm">Nadogradi na PRO</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Card>

      {/* Loading skeleton */}
      {loadingData && (
        <div className="space-y-4 pt-2">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="flex gap-6">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-surface-highlight rounded w-24" />
                  <div className="h-6 bg-surface-highlight rounded w-48" />
                  <div className="flex gap-2">
                    <div className="h-7 bg-surface-highlight rounded w-20" />
                    <div className="h-7 bg-surface-highlight rounded w-20" />
                  </div>
                </div>
                <div className="w-48 space-y-3">
                  <div className="h-4 bg-surface-highlight rounded w-32" />
                  <div className="h-9 bg-surface-highlight rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* List */}
      {!loadingData && (
        <div className="space-y-4 pt-2">
          {filteredTrucks.map(truck => {
            const canSeePhone = canViewContact(truck.userId);
            const hasAdr = truck.adrCapable || (truck.adrClasses && truck.adrClasses.length > 0);
            const hasTemp = truck.temperatureMin != null || truck.temperatureMax != null;

            return (
              <Card key={truck.id} onClick={() => setSelectedTruck(truck)} className="cursor-pointer hover:shadow-md hover:border-brand-400/30 transition-all duration-300 border-border overflow-hidden">
                <div className="p-5 flex flex-col md:flex-row gap-6">
                  {/* Route + Details */}
                  <div className="flex-1 space-y-4 min-w-0">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="success">Slobodan kamion</Badge>
                      {(truck.truckCount ?? 1) > 1 && (
                        <Badge variant="default">{truck.truckCount} kamiona</Badge>
                      )}
                      {hasAdr && <Badge variant="warning">ADR</Badge>}
                      {hasTemp && <Badge variant="info">Frigo</Badge>}
                      <span className="text-sm text-text-muted font-medium flex items-center gap-1 ml-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Od: {new Date(truck.dateFrom).toLocaleDateString('sr-RS')}
                        {truck.dateTo && ` — ${new Date(truck.dateTo).toLocaleDateString('sr-RS')}`}
                      </span>
                    </div>

                    {/* Ruta */}
                    <div className="flex items-center gap-4 sm:gap-8">
                      <div className="min-w-0">
                        <div className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Lokacija</div>
                        <p className="font-bold text-lg text-text-main leading-tight">{getFlagEmoji(truck.originCountry)} {truck.originCity}</p>
                        <p className="text-sm text-text-muted">
                          {truck.originPostalCode && <span className="font-mono mr-1">{truck.originPostalCode}</span>}
                          {truck.originCountry}
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center px-2">
                        <div className="w-full h-px bg-border relative">
                          <div className="absolute right-0 -top-1.5 text-text-muted">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="text-right min-w-0">
                        <div className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Ide za</div>
                        <p className="font-bold text-lg text-text-main leading-tight">
                          {getFlagEmoji(truck.destinationCountry || '')} {truck.destinationCity || 'Bilo gde'}
                        </p>
                        <p className="text-sm text-text-muted">
                          {truck.destinationPostalCode && <span className="font-mono mr-1">{truck.destinationPostalCode}</span>}
                          {truck.destinationCountry || ''}
                        </p>
                      </div>
                    </div>

                    {/* Specs chips */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted">
                        {truck.truckType}
                      </span>
                      {truck.weightCapacity != null && (
                        <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted flex items-center gap-1">
                          <Weight className="h-3 w-3" /> {truck.weightCapacity} t
                        </span>
                      )}
                      {truck.loadingMeters != null && (
                        <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted flex items-center gap-1">
                          <Ruler className="h-3 w-3" /> {truck.loadingMeters} LDM
                        </span>
                      )}
                    </div>

                    {truck.description && (
                      <p className="text-sm text-text-muted italic border-l-2 border-border pl-3 truncate">
                        "{truck.description}"
                      </p>
                    )}
                  </div>

                  {/* Company & Contact */}
                  <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-5 flex flex-col justify-between flex-shrink-0">
                    <div>
                      <p className="font-semibold text-text-main text-sm">{truck.companyName}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(truck.createdAt).toLocaleDateString('sr-RS')}
                        {' · '}
                        {new Date(truck.createdAt).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="mt-4">
                      {canSeePhone ? (
                        truck.contactPhone ? (
                          <a href={`tel:${truck.contactPhone}`}>
                            <Button variant="secondary" className="w-full gap-2 font-semibold text-sm">
                              <Phone className="h-4 w-4" /> {truck.contactPhone}
                            </Button>
                          </a>
                        ) : (
                          <div className="text-xs text-text-muted text-center py-2 bg-surface rounded-lg border border-border">
                            Telefon nije naveden
                          </div>
                        )
                      ) : (
                        <div className="relative overflow-hidden rounded-lg cursor-not-allowed border border-border">
                          <div className="blur-[3px] bg-surface p-2.5 text-center text-text-muted select-none font-mono text-sm">
                            +381 6* *** ****
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-text-muted bg-surface px-3 py-1.5 rounded-full shadow-sm border border-border">
                              <Lock className="h-3 w-3" /> Sakriveno
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredTrucks.length === 0 && !loadingData && (
            <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-border">
              <Truck className="h-10 w-10 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-text-main font-medium">Nema kamiona koji odgovaraju pretrazi</p>
              <p className="text-text-muted text-sm mt-1">Pokušajte sa drugačijim filterima ili proverite ponovo uskoro.</p>
              {totalActiveCount > 0 && (
                <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                  Poništi filtere
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <ListingDetailPanel
        item={selectedTruck}
        onClose={() => setSelectedTruck(null)}
        canSeePhone={canViewContact(selectedTruck?.userId || '')}
      />
    </div>
  );
};
