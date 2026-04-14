import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Select, Badge } from '../../components/UIComponents';
import { UserStatus } from '../../types';
import { SupabaseService } from '../../services/supabaseService';
import { EUROPEAN_COUNTRIES } from '../../utils/countries';
import { AlertCircle, CheckCircle, MapPin, Package, Truck, AlertTriangle, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'Cerada / Tautliner', label: 'Cerada / Tautliner' },
  { value: 'Mega cerada / Mega tautliner', label: 'Mega cerada / Mega tautliner' },
  { value: 'Jumbo cerada', label: 'Jumbo cerada' },
  { value: 'Hladnjača / Frigo', label: 'Hladnjača / Frigo' },
  { value: 'Izoterm', label: 'Izoterm' },
  { value: 'Otvoreni / Platforma', label: 'Otvoreni / Platforma' },
  { value: 'Kiper / Kipovac', label: 'Kiper / Kipovac' },
  { value: 'Silos', label: 'Silos' },
  { value: 'Cisterna', label: 'Cisterna' },
  { value: 'Kontejner', label: 'Kontejner' },
  { value: 'Auto transporter', label: 'Auto transporter' },
  { value: 'Kombi / Sprinter', label: 'Kombi / Sprinter' },
  { value: 'Kuka / Rol kiper', label: 'Kuka / Rol kiper' },
  { value: 'Nisko utovarna', label: 'Nisko utovarna / Low Loader' },
  { value: 'Specijalni transport', label: 'Specijalni transport' },
];

const LOAD_TYPES = [
  { value: '', label: '— Izaberite vrstu tereta —' },
  { value: 'Europalete', label: 'Europalete (EUR 1)' },
  { value: 'Palete nestandardne', label: 'Palete (nestandardne)' },
  { value: 'Rasuti teret', label: 'Rasuti teret (bez paleta)' },
  { value: 'Kontejner 20ft', label: 'Kontejner (20ft)' },
  { value: 'Kontejner 40ft', label: 'Kontejner (40ft)' },
  { value: 'Coils', label: 'Čelični koluti / Coils' },
  { value: 'Generalni teret', label: 'Generalni teret' },
  { value: 'Hrana', label: 'Živežne namirnice / Hrana' },
  { value: 'Auto industrija', label: 'Automobilska industrija' },
  { value: 'Gradjevina', label: 'Građevinski materijal' },
  { value: 'Hemikalije', label: 'Hemikalije' },
  { value: 'Drvo', label: 'Drvo / Drvna industrija' },
  { value: 'Tekstil', label: 'Tekstil i odeća' },
  { value: 'Masine', label: 'Mašine i oprema' },
];

const ADR_CLASSES = [
  { value: 'ADR 1', label: 'Klasa 1 — Eksplozivi' },
  { value: 'ADR 2', label: 'Klasa 2 — Gasovi' },
  { value: 'ADR 3', label: 'Klasa 3 — Zapaljive tečnosti' },
  { value: 'ADR 4', label: 'Klasa 4 — Zapaljive čvrste materije' },
  { value: 'ADR 5', label: 'Klasa 5 — Oksidansi' },
  { value: 'ADR 6', label: 'Klasa 6 — Otrovne materije' },
  { value: 'ADR 7', label: 'Klasa 7 — Radioaktivne materije' },
  { value: 'ADR 8', label: 'Klasa 8 — Korozivne materije' },
  { value: 'ADR 9', label: 'Klasa 9 — Ostale opasne materije' },
];

const LOADING_METHODS = [
  { value: 'Zadnje', label: 'Sa zadnje strane' },
  { value: 'Bocno', label: 'Sa strane / Bočno' },
  { value: 'Gornje', label: 'Odozgo' },
];

const COUNTRY_OPTIONS = [
  { value: '', label: '— Izaberite državu —' },
  ...EUROPEAN_COUNTRIES.map(c => ({ value: c.name, label: c.name })),
];

const isTempVehicle = (type: string) =>
  type.includes('Hladnjača') || type.includes('Frigo') || type.includes('Izoterm');

// Checkbox group component
const CheckboxGroup = ({
  label, options, selected, onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (val: string[]) => void;
}) => {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-text-muted mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 ${
              selected.includes(opt.value)
                ? 'bg-brand-400/15 border-brand-400 text-brand-400'
                : 'bg-surface border-border text-text-muted hover:border-text-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Section header
const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
    <div className="h-9 w-9 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
      <Icon className="h-4.5 w-4.5 text-brand-400" />
    </div>
    <div>
      <h3 className="font-bold text-text-main">{title}</h3>
      <p className="text-xs text-text-muted uppercase tracking-wider">{subtitle}</p>
    </div>
  </div>
);

export const CreateLoad = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasAdr, setHasAdr] = useState(false);

  const [form, setForm] = useState({
    // Ruta - utovar
    originCountry: '',
    originCity: '',
    originPostalCode: '',
    dateFrom: '',
    loadingTime: '',
    // Ruta - istovar
    destinationCountry: '',
    destinationCity: '',
    destinationPostalCode: '',
    dateTo: '',
    unloadingTime: '',
    // Vozilo
    truckType: 'Cerada / Tautliner',
    isFtl: true,
    // Teret
    loadType: '',
    weightTonnes: '',
    loadingMeters: '',
    volumeM3: '',
    palletCount: '',
    isStackable: false,
    loadingMethods: [] as string[],
    // Posebni zahtevi
    adrClasses: [] as string[],
    temperatureMin: '',
    temperatureMax: '',
    // Cena i kontakt
    price: '',
    currency: 'EUR',
    contactPhone: '',
    referenceNumber: '',
    description: '',
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    set(e.target.name, e.target.value);
  };

  if (profile?.status !== UserStatus.APPROVED) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-text-main">Nalog čeka odobrenje</h2>
        <p className="text-text-muted mt-2 max-w-md">Morate imati odobren nalog da biste objavljivali ture.</p>
        <Button className="mt-6" onClick={() => navigate('/dashboard')}>Nazad</Button>
      </div>
    );
  }

  if (profile?.plan === 'free') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-text-main">Potreban je upgrade plana</h2>
        <p className="text-text-muted mt-2 max-w-md">Sa FREE planom možete samo pregledati ture. Za objavljivanje potreban je STANDARD ili PRO plan.</p>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate('/pricing')} variant="primary">Pogledaj planove</Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline">Nazad</Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="w-16 h-16 bg-brand-400/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-brand-400" />
        </div>
        <h2 className="text-2xl font-bold text-text-main">Tura objavljena!</h2>
        <p className="text-text-muted mt-2">Vaša tura je uspešno objavljena i vidljiva svim korisnicima.</p>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate('/loads')} variant="primary">Pregled tura</Button>
          <Button onClick={() => { setSuccess(false); setForm(f => ({ ...f })); }} variant="outline">Objavi još jednu</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.originCountry || !form.originCity || !form.destinationCountry || !form.destinationCity || !form.dateFrom) {
      setError('Molimo popunite sva obavezna polja (utovar, istovar, datum).');
      return;
    }
    if (!profile?.company?.name) {
      setError('Podaci o firmi nisu učitani. Molimo osvežite stranicu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await SupabaseService.createLoad(profile.id, profile.company.name, {
        originCountry: form.originCountry,
        originCity: form.originCity,
        originPostalCode: form.originPostalCode || undefined,
        destinationCountry: form.destinationCountry,
        destinationCity: form.destinationCity,
        destinationPostalCode: form.destinationPostalCode || undefined,
        dateFrom: form.dateFrom,
        dateTo: form.dateTo || undefined,
        loadingTime: form.loadingTime || undefined,
        unloadingTime: form.unloadingTime || undefined,
        truckType: form.truckType,
        isFtl: form.isFtl,
        loadType: form.loadType || undefined,
        weightTonnes: form.weightTonnes ? parseFloat(form.weightTonnes) : undefined,
        loadingMeters: form.loadingMeters ? parseFloat(form.loadingMeters) : undefined,
        volumeM3: form.volumeM3 ? parseFloat(form.volumeM3) : undefined,
        palletCount: form.palletCount ? parseInt(form.palletCount) : undefined,
        isStackable: form.isStackable,
        loadingMethods: form.loadingMethods.length > 0 ? form.loadingMethods : undefined,
        adrClasses: hasAdr && form.adrClasses.length > 0 ? form.adrClasses : undefined,
        temperatureMin: form.temperatureMin ? parseFloat(form.temperatureMin) : undefined,
        temperatureMax: form.temperatureMax ? parseFloat(form.temperatureMax) : undefined,
        price: form.price ? parseFloat(form.price) : undefined,
        currency: form.currency,
        contactPhone: form.contactPhone || undefined,
        referenceNumber: form.referenceNumber || undefined,
        description: form.description || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Greška pri objavljivanju ture. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Objavi novu turu</h1>
        <p className="text-text-muted text-sm mt-1">Popunite detalje tereta koji treba da se preveze.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── RUTA ─────────────────────────────────────── */}
        <Card>
          <SectionHeader icon={MapPin} title="Ruta" subtitle="Mesta utovara i istovara" />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Utovar */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Utovar</p>
              <Select
                name="originCountry"
                label="Država *"
                value={form.originCountry}
                onChange={handleChange}
                options={COUNTRY_OPTIONS}
              />
              <Input name="originCity" label="Grad *" required value={form.originCity} onChange={handleChange} placeholder="npr. Beograd" />
              <Input name="originPostalCode" label="Poštanski broj" value={form.originPostalCode} onChange={handleChange} placeholder="npr. 11000" />
              <Input name="dateFrom" label="Datum utovara *" type="date" required value={form.dateFrom} onChange={handleChange} />
              <Input name="loadingTime" label="Vreme utovara" type="time" value={form.loadingTime} onChange={handleChange} />
            </div>

            {/* Istovar */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Istovar</p>
              <Select
                name="destinationCountry"
                label="Država *"
                value={form.destinationCountry}
                onChange={handleChange}
                options={COUNTRY_OPTIONS}
              />
              <Input name="destinationCity" label="Grad *" required value={form.destinationCity} onChange={handleChange} placeholder="npr. Berlin" />
              <Input name="destinationPostalCode" label="Poštanski broj" value={form.destinationPostalCode} onChange={handleChange} placeholder="npr. 10115" />
              <Input name="dateTo" label="Datum istovara" type="date" value={form.dateTo} onChange={handleChange} />
              <Input name="unloadingTime" label="Vreme istovara" type="time" value={form.unloadingTime} onChange={handleChange} />
            </div>
          </div>
        </Card>

        {/* ── VOZILO I TERET ────────────────────────────── */}
        <Card>
          <SectionHeader icon={Package} title="Vozilo i teret" subtitle="Specifikacije tereta" />

          <div className="space-y-5">
            {/* Vrsta vozila + FTL/LTL */}
            <div className="grid md:grid-cols-2 gap-5">
              <Select
                name="truckType"
                label="Vrsta vozila *"
                value={form.truckType}
                onChange={handleChange}
                options={VEHICLE_TYPES}
              />
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Tip utovara</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => set('isFtl', true)}
                    className={`flex-1 h-10 rounded-md text-sm font-semibold border transition-all ${form.isFtl ? 'bg-brand-400/15 border-brand-400 text-brand-400' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                  >
                    FTL — Puni kamion
                  </button>
                  <button
                    type="button"
                    onClick={() => set('isFtl', false)}
                    className={`flex-1 h-10 rounded-md text-sm font-semibold border transition-all ${!form.isFtl ? 'bg-brand-400/15 border-brand-400 text-brand-400' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                  >
                    LTL — Grupažno
                  </button>
                </div>
              </div>
            </div>

            {/* Vrsta tereta */}
            <Select
              name="loadType"
              label="Vrsta tereta"
              value={form.loadType}
              onChange={handleChange}
              options={LOAD_TYPES}
            />

            {/* Dimenzije i težina */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Težina (t)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="weightTonnes"
                  value={form.weightTonnes}
                  onChange={handleChange}
                  placeholder="npr. 22.5"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">LDM (m)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  name="loadingMeters"
                  value={form.loadingMeters}
                  onChange={handleChange}
                  placeholder="npr. 13.6"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Volumen (m³)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="volumeM3"
                  value={form.volumeM3}
                  onChange={handleChange}
                  placeholder="npr. 82"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Broj paleta</label>
                <input
                  type="number"
                  min="0"
                  name="palletCount"
                  value={form.palletCount}
                  onChange={handleChange}
                  placeholder="npr. 33"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
            </div>

            {/* Slaganje + Načini utovara */}
            <div className="grid md:grid-cols-2 gap-5 items-start">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Slaganje tereta</label>
                <button
                  type="button"
                  onClick={() => set('isStackable', !form.isStackable)}
                  className={`w-full h-10 rounded-md text-sm font-semibold border transition-all ${form.isStackable ? 'bg-brand-400/15 border-brand-400 text-brand-400' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                >
                  {form.isStackable ? '✓ Može se slagati' : 'Ne može se slagati'}
                </button>
              </div>
              <CheckboxGroup
                label="Način utovara"
                options={LOADING_METHODS}
                selected={form.loadingMethods}
                onChange={v => set('loadingMethods', v)}
              />
            </div>
          </div>
        </Card>

        {/* ── POSEBNI ZAHTEVI ───────────────────────────── */}
        <Card>
          <SectionHeader icon={AlertTriangle} title="Posebni zahtevi" subtitle="ADR i temperatura" />

          <div className="space-y-5">
            {/* ADR */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-text-muted">Opasna roba (ADR)</label>
                <button
                  type="button"
                  onClick={() => { setHasAdr(!hasAdr); if (hasAdr) set('adrClasses', []); }}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition-all ${hasAdr ? 'bg-amber-500/15 border-amber-500 text-amber-500' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                >
                  {hasAdr ? '⚠ ADR aktivan' : 'Dodaj ADR'}
                </button>
              </div>
              {hasAdr && (
                <CheckboxGroup
                  label="ADR klase"
                  options={ADR_CLASSES}
                  selected={form.adrClasses}
                  onChange={v => set('adrClasses', v)}
                />
              )}
            </div>

            {/* Temperatura — prikazati samo za hladnjače/izoterme */}
            {isTempVehicle(form.truckType) && (
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Temperaturni opseg (°C)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Minimalna (°C)</label>
                    <input
                      type="number"
                      name="temperatureMin"
                      value={form.temperatureMin}
                      onChange={handleChange}
                      placeholder="npr. -25"
                      className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Maksimalna (°C)</label>
                    <input
                      type="number"
                      name="temperatureMax"
                      value={form.temperatureMax}
                      onChange={handleChange}
                      placeholder="npr. -18"
                      className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ── CENA I KONTAKT ────────────────────────────── */}
        <Card>
          <SectionHeader icon={DollarSign} title="Cena i kontakt" subtitle="Opcioni detalji" />

          <div className="space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-1.5">Cena (opciono)</label>
                <input
                  type="number"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Na upit ako ostavite prazno"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
              <Select
                name="currency"
                label="Valuta"
                value={form.currency}
                onChange={handleChange}
                options={[
                  { value: 'EUR', label: 'EUR — Euro' },
                  { value: 'USD', label: 'USD — Dolar' },
                  { value: 'RSD', label: 'RSD — Dinar' },
                  { value: 'CHF', label: 'CHF — Frank' },
                ]}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                name="contactPhone"
                label="Kontakt telefon"
                value={form.contactPhone}
                onChange={handleChange}
                placeholder="npr. +381 64 123 4567"
              />
              <Input
                name="referenceNumber"
                label="Referentni broj (interni)"
                value={form.referenceNumber}
                onChange={handleChange}
                placeholder="npr. TL-2025-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Opis / Napomene</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Dodatne informacije o teretu, posebni uslovi..."
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        {/* Akcije */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/loads')}>Otkaži</Button>
          <Button type="submit" variant="primary" disabled={loading} className="min-w-32">
            {loading ? 'Objavljujem...' : 'Objavi turu'}
          </Button>
        </div>
      </form>
    </div>
  );
};
