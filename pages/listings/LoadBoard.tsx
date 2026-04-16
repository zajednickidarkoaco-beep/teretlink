import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Select, Badge } from '../../components/UIComponents';
import {
  Filter, Calendar, Phone, Lock, ArrowRight, Weight, Ruler, Package,
  AlertTriangle, Thermometer, RefreshCw, SlidersHorizontal, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SupabaseService } from '../../services/supabaseService';
import { Load } from '../../types';
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

const LOAD_TYPE_OPTIONS = [
  { value: '', label: 'Sve vrste tereta' },
  { value: 'Europalete', label: 'Europalete (EUR 1)' },
  { value: 'Palete nestandardne', label: 'Palete (nestandardne)' },
  { value: 'Rasuti teret', label: 'Rasuti teret' },
  { value: 'Kontejner 20ft', label: 'Kontejner 20ft' },
  { value: 'Kontejner 40ft', label: 'Kontejner 40ft' },
  { value: 'Coils', label: 'Čelični koluti / Coils' },
  { value: 'Generalni teret', label: 'Generalni teret' },
  { value: 'Hrana', label: 'Hrana / Živežne namirnice' },
  { value: 'Auto industrija', label: 'Auto industrija' },
  { value: 'Gradjevina', label: 'Građevinski materijal' },
  { value: 'Hemikalije', label: 'Hemikalije' },
  { value: 'Drvo', label: 'Drvo / Drvna industrija' },
  { value: 'Tekstil', label: 'Tekstil i odeća' },
  { value: 'Masine', label: 'Mašine i oprema' },
];

const INITIAL_FILTER = {
  // Basic (STANDARD+)
  originCountry: '',
  destinationCountry: '',
  truckType: '',
  dateFrom: '',
  // Advanced (PRO only)
  weightMin: '',
  weightMax: '',
  ldmMax: '',
  ftlLtl: '' as '' | 'ftl' | 'ltl',
  loadType: '',
  priceMin: '',
  priceMax: '',
  adrOnly: false,
  frigoOnly: false,
};

export const LoadBoard = () => {
  const { profile, canViewContact } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [sort, setSort] = useState('newest');

  const fetchLoads = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoadingData(true);
    try {
      const data = await SupabaseService.getLoads();
      setLoads(data);
    } catch (err) {
      console.error('Error fetching loads:', err);
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const isPro = profile?.plan === 'pro';

  const filteredLoads = loads.filter(l => {
    if (profile?.plan === 'free') return true;

    // Basic filters (STANDARD+)
    if (filter.originCountry && l.originCountry !== filter.originCountry) return false;
    if (filter.destinationCountry && l.destinationCountry !== filter.destinationCountry) return false;
    if (filter.truckType && l.truckType !== filter.truckType) return false;
    if (filter.dateFrom && l.dateFrom < filter.dateFrom) return false;

    // Advanced filters (PRO only)
    if (isPro) {
      if (filter.weightMin && (l.weightTonnes == null || l.weightTonnes < parseFloat(filter.weightMin))) return false;
      if (filter.weightMax && (l.weightTonnes == null || l.weightTonnes > parseFloat(filter.weightMax))) return false;
      if (filter.ldmMax && (l.loadingMeters == null || l.loadingMeters > parseFloat(filter.ldmMax))) return false;
      if (filter.ftlLtl === 'ftl' && l.isFtl === false) return false;
      if (filter.ftlLtl === 'ltl' && l.isFtl !== false) return false;
      if (filter.loadType && l.loadType !== filter.loadType) return false;
      if (filter.priceMin && (l.price == null || l.price < parseFloat(filter.priceMin))) return false;
      if (filter.priceMax && (l.price == null || l.price > parseFloat(filter.priceMax))) return false;
      if (filter.adrOnly && (!l.adrClasses || l.adrClasses.length === 0)) return false;
      if (filter.frigoOnly && l.temperatureMin == null && l.temperatureMax == null) return false;
    }

    return true;
  });

  const sortedLoads = [...filteredLoads].sort((a, b) => {
    switch (sort) {
      case 'oldest':     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date_asc':   return new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime();
      case 'date_desc':  return new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime();
      case 'price_asc':  return (a.price ?? Infinity) - (b.price ?? Infinity);
      case 'price_desc': return (b.price ?? -Infinity) - (a.price ?? -Infinity);
      default:           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const resetFilters = () => {
    setFilter(INITIAL_FILTER);
    setShowAdvanced(false);
  };

  const basicActiveCount = [
    filter.originCountry, filter.destinationCountry, filter.truckType, filter.dateFrom,
  ].filter(Boolean).length;

  const advancedActiveCount = [
    filter.weightMin, filter.weightMax, filter.ldmMax, filter.ftlLtl,
    filter.loadType, filter.priceMin, filter.priceMax,
  ].filter(Boolean).length + (filter.adrOnly ? 1 : 0) + (filter.frigoOnly ? 1 : 0);

  const totalActiveCount = basicActiveCount + advancedActiveCount;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Berza Tereta</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {loadingData ? 'Učitavam...' : `${sortedLoads.length} ${sortedLoads.length === 1 ? 'oglas' : 'oglasa'}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface text-text-muted text-xs font-medium px-3 cursor-pointer hover:border-text-muted transition-colors focus:outline-none focus:border-brand-400"
          >
            <option value="newest">Najnoviji</option>
            <option value="oldest">Najstariji</option>
            <option value="date_asc">Datum polaska: najbliži</option>
            <option value="date_desc">Datum polaska: najdalji</option>
            <option value="price_asc">Cena: rastuće</option>
            <option value="price_desc">Cena: opadajuće</option>
          </select>
          <button
            onClick={() => fetchLoads(true)}
            disabled={refreshing}
            className="h-9 w-9 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text-main hover:border-text-muted transition-all disabled:opacity-50"
            title="Osveži"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          {profile?.plan !== 'free' && (
            <Link to="/post-load">
              <Button variant="primary">+ Objavi turu</Button>
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
                label="Zemlja utovara"
                value={filter.originCountry}
                onChange={e => setFilter(f => ({ ...f, originCountry: e.target.value }))}
                options={COUNTRY_OPTIONS}
              />
              <Select
                label="Zemlja istovara"
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
                label="Datum od"
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
                  : 'Filtrirajte po težini, ceni, vrsti tereta i još više'}
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
                  {/* Row 1: Numeric ranges */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <Input
                      label="Težina od (t)"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={filter.weightMin}
                      onChange={e => setFilter(f => ({ ...f, weightMin: e.target.value }))}
                    />
                    <Input
                      label="Težina do (t)"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="24"
                      value={filter.weightMax}
                      onChange={e => setFilter(f => ({ ...f, weightMax: e.target.value }))}
                    />
                    <Input
                      label="Maks. LDM (m)"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="13.6"
                      value={filter.ldmMax}
                      onChange={e => setFilter(f => ({ ...f, ldmMax: e.target.value }))}
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-text-muted">Tip utovara</label>
                      <div className="flex rounded-lg border border-border bg-surface overflow-hidden h-10">
                        {([['', 'Sve'], ['ftl', 'FTL'], ['ltl', 'LTL']] as ['' | 'ftl' | 'ltl', string][]).map(([val, lbl]) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setFilter(f => ({ ...f, ftlLtl: val }))}
                            className={`flex-1 text-xs font-medium transition-all border-r border-border last:border-0 ${
                              filter.ftlLtl === val
                                ? 'bg-brand-400/15 text-brand-400'
                                : 'text-text-muted hover:text-text-main hover:bg-surface-highlight'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Type + Price + Toggles */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                    <Select
                      label="Vrsta tereta"
                      value={filter.loadType}
                      onChange={e => setFilter(f => ({ ...f, loadType: e.target.value }))}
                      options={LOAD_TYPE_OPTIONS}
                    />
                    <Input
                      label="Cena od (€)"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={filter.priceMin}
                      onChange={e => setFilter(f => ({ ...f, priceMin: e.target.value }))}
                    />
                    <Input
                      label="Cena do (€)"
                      type="number"
                      min="0"
                      placeholder="9999"
                      value={filter.priceMax}
                      onChange={e => setFilter(f => ({ ...f, priceMax: e.target.value }))}
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-text-muted">Posebni zahtevi</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFilter(f => ({ ...f, adrOnly: !f.adrOnly }))}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border text-xs font-semibold transition-all ${
                            filter.adrOnly
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                              : 'bg-surface border-border text-text-muted hover:border-text-muted hover:text-text-main'
                          }`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5" /> ADR
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilter(f => ({ ...f, frigoOnly: !f.frigoOnly }))}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border text-xs font-semibold transition-all ${
                            filter.frigoOnly
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
                        Filtrirajte po težini, ceni, vrsti tereta, ADR, frigo i još više
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-surface-highlight rounded w-24" />
                  <div className="h-6 bg-surface-highlight rounded w-48" />
                  <div className="flex gap-2">
                    <div className="h-7 bg-surface-highlight rounded w-20" />
                    <div className="h-7 bg-surface-highlight rounded w-20" />
                  </div>
                </div>
                <div className="w-full sm:w-48 space-y-3">
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
          {sortedLoads.map(load => {
            const canSeePhone = canViewContact(load.userId);
            const hasAdr = load.adrClasses && load.adrClasses.length > 0;
            const hasTemp = load.temperatureMin != null || load.temperatureMax != null;

            return (
              <Card key={load.id} onClick={() => setSelectedLoad(load)} className="cursor-pointer hover:shadow-md hover:border-brand-400/30 transition-all duration-300 border-border overflow-hidden">
                <div className="p-5 flex flex-col md:flex-row gap-6">
                  {/* Route + Details */}
                  <div className="flex-1 space-y-4 min-w-0">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="info">Tura</Badge>
                      {load.isFtl === false && <Badge variant="default">LTL / Grupažno</Badge>}
                      {hasAdr && <Badge variant="warning">ADR</Badge>}
                      {hasTemp && <Badge variant="info">Frigo</Badge>}
                      <span className="text-sm text-text-muted font-medium flex items-center gap-1 ml-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(load.dateFrom).toLocaleDateString('sr-RS')}
                        {load.dateTo && ` — ${new Date(load.dateTo).toLocaleDateString('sr-RS')}`}
                      </span>
                    </div>

                    {/* Ruta */}
                    <div className="flex items-center gap-4 sm:gap-8">
                      <div className="min-w-0">
                        <div className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Utovar</div>
                        <p className="font-bold text-lg text-text-main leading-tight truncate">{getFlagEmoji(load.originCountry)} {load.originCity}</p>
                        <p className="text-sm text-text-muted">
                          {load.originPostalCode && <span className="font-mono mr-1">{load.originPostalCode}</span>}
                          {load.originCountry}
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center px-2">
                        <div className="text-xs text-text-muted mb-1 font-medium">
                          {load.price ? `${load.price.toLocaleString()} ${load.currency}` : 'Na upit'}
                        </div>
                        <div className="w-full h-px bg-border relative">
                          <div className="absolute right-0 -top-1.5 text-text-muted">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="text-right min-w-0">
                        <div className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Istovar</div>
                        <p className="font-bold text-lg text-text-main leading-tight truncate">{getFlagEmoji(load.destinationCountry || '')} {load.destinationCity || '—'}</p>
                        <p className="text-sm text-text-muted">
                          {load.destinationPostalCode && <span className="font-mono mr-1">{load.destinationPostalCode}</span>}
                          {load.destinationCountry}
                        </p>
                      </div>
                    </div>

                    {/* Specs chips */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted">
                        {load.truckType}
                      </span>
                      {load.weightTonnes != null && (
                        <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted flex items-center gap-1">
                          <Weight className="h-3 w-3" /> {load.weightTonnes} t
                        </span>
                      )}
                      {load.loadingMeters != null && (
                        <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted flex items-center gap-1">
                          <Ruler className="h-3 w-3" /> {load.loadingMeters} LDM
                        </span>
                      )}
                      {load.palletCount != null && (
                        <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-xs font-medium text-text-muted flex items-center gap-1">
                          <Package className="h-3 w-3" /> {load.palletCount} pal.
                        </span>
                      )}
                    </div>

                    {load.description && (
                      <p className="text-sm text-text-muted italic border-l-2 border-border pl-3 truncate">
                        "{load.description}"
                      </p>
                    )}
                  </div>

                  {/* Company & Contact */}
                  <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-5 flex flex-col justify-between flex-shrink-0">
                    <div>
                      <p className="font-semibold text-text-main text-sm">{load.companyName}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(load.createdAt).toLocaleDateString('sr-RS')}
                        {' · '}
                        {new Date(load.createdAt).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {load.referenceNumber && (
                        <p className="text-xs text-text-muted mt-1 font-mono">Ref: {load.referenceNumber}</p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      {canSeePhone ? (
                        load.contactPhone ? (
                          <>
                            <a href={`tel:${load.contactPhone}`} onClick={e => e.stopPropagation()}>
                              <Button variant="secondary" className="w-full gap-2 font-semibold text-sm">
                                <Phone className="h-4 w-4" /> {load.contactPhone}
                              </Button>
                            </a>
                            <a
                              href={`https://wa.me/${load.contactPhone.replace(/[\s\-\(\)\+]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg font-semibold text-xs text-white transition-opacity hover:opacity-90"
                              style={{ backgroundColor: '#25D366' }}
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current flex-shrink-0">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              WhatsApp
                            </a>
                          </>
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

          {sortedLoads.length === 0 && !loadingData && (
            <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-border">
              <Package className="h-10 w-10 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-text-main font-medium">Nema tura koje odgovaraju pretrazi</p>
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
        item={selectedLoad}
        onClose={() => setSelectedLoad(null)}
        canSeePhone={canViewContact(selectedLoad?.userId || '')}
      />
    </div>
  );
};
