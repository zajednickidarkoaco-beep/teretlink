import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Select } from '../../components/UIComponents';
import { UserStatus } from '../../types';
import { SupabaseService } from '../../services/supabaseService';
import { EUROPEAN_COUNTRIES } from '../../utils/countries';
import { AlertCircle, CheckCircle, MapPin, Truck, AlertTriangle, Phone } from 'lucide-react';

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

export const CreateTruck = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasAdr, setHasAdr] = useState(false);

  const [form, setForm] = useState({
    // Lokacija
    originCountry: '',
    originCity: '',
    originPostalCode: '',
    // Dostupnost
    dateFrom: '',
    dateTo: '',
    // Vozilo
    truckType: 'Cerada / Tautliner',
    truckCount: '1',
    weightCapacity: '',
    loadingMeters: '',
    // Načini utovara
    loadingMethods: [] as string[],
    // ADR
    adrCapable: false,
    adrClasses: [] as string[],
    // Temperatura
    temperatureMin: '',
    temperatureMax: '',
    // Željeno odredište
    destinationCountry: '',
    destinationCity: '',
    destinationPostalCode: '',
    // Kontakt
    contactPhone: '',
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
        <p className="text-text-muted mt-2">Morate imati odobren nalog da biste objavljivali kamione.</p>
        <Button className="mt-6" onClick={() => navigate('/dashboard')}>Nazad</Button>
      </div>
    );
  }

  if (profile?.plan === 'free') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-text-main">Potreban je upgrade plana</h2>
        <p className="text-text-muted mt-2">Sa FREE planom možete samo pregledati kamione. Za objavljivanje potreban je STANDARD ili PRO plan.</p>
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
        <h2 className="text-2xl font-bold text-text-main">Kamion objavljen!</h2>
        <p className="text-text-muted mt-2">Vaš slobodan kamion je uspešno objavljen.</p>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate('/trucks')} variant="primary">Pregled kamiona</Button>
          <Button onClick={() => setSuccess(false)} variant="outline">Objavi još jedan</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.originCountry || !form.originCity || !form.dateFrom) {
      setError('Molimo popunite obavezna polja: zemlja, grad i datum dostupnosti.');
      return;
    }
    if (!profile?.company?.name) {
      setError('Podaci o firmi nisu učitani. Molimo osvežite stranicu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await SupabaseService.createTruck(profile.id, profile.company.name, {
        originCountry: form.originCountry,
        originCity: form.originCity,
        originPostalCode: form.originPostalCode || undefined,
        destinationCountry: form.destinationCountry || undefined,
        destinationCity: form.destinationCity || undefined,
        destinationPostalCode: form.destinationPostalCode || undefined,
        dateFrom: form.dateFrom,
        dateTo: form.dateTo || undefined,
        truckType: form.truckType,
        truckCount: parseInt(form.truckCount) || 1,
        weightCapacity: form.weightCapacity ? parseFloat(form.weightCapacity) : undefined,
        loadingMeters: form.loadingMeters ? parseFloat(form.loadingMeters) : undefined,
        loadingMethods: form.loadingMethods.length > 0 ? form.loadingMethods : undefined,
        adrCapable: form.adrCapable,
        adrClasses: hasAdr && form.adrClasses.length > 0 ? form.adrClasses : undefined,
        temperatureMin: form.temperatureMin ? parseFloat(form.temperatureMin) : undefined,
        temperatureMax: form.temperatureMax ? parseFloat(form.temperatureMax) : undefined,
        contactPhone: form.contactPhone || undefined,
        description: form.description || undefined,
      } as any);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Greška pri objavljivanju. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Objavi slobodan kamion</h1>
        <p className="text-text-muted text-sm mt-1">Popunite detalje o vašem slobodnom vozilu.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── LOKACIJA I DOSTUPNOST ─────────────────────── */}
        <Card>
          <SectionHeader icon={MapPin} title="Lokacija i dostupnost" subtitle="Gde se vozilo nalazi i kada je slobodno" />

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Trenutna lokacija</p>
              <Select
                name="originCountry"
                label="Država *"
                value={form.originCountry}
                onChange={handleChange}
                options={COUNTRY_OPTIONS}
              />
              <Input name="originCity" label="Grad *" required value={form.originCity} onChange={handleChange} placeholder="npr. Beograd" />
              <Input name="originPostalCode" label="Poštanski broj" value={form.originPostalCode} onChange={handleChange} placeholder="npr. 11000" />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Period dostupnosti</p>
              <Input name="dateFrom" label="Slobodan od *" type="date" required value={form.dateFrom} onChange={handleChange} />
              <Input name="dateTo" label="Slobodan do (opciono)" type="date" value={form.dateTo} onChange={handleChange} />
            </div>
          </div>
        </Card>

        {/* ── SPECIFIKACIJE VOZILA ──────────────────────── */}
        <Card>
          <SectionHeader icon={Truck} title="Specifikacije vozila" subtitle="Tip i kapacitet" />

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Select
                name="truckType"
                label="Vrsta vozila *"
                value={form.truckType}
                onChange={handleChange}
                options={VEHICLE_TYPES}
              />
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Broj kamiona</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  name="truckCount"
                  value={form.truckCount}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Nosivost (t)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="weightCapacity"
                  value={form.weightCapacity}
                  onChange={handleChange}
                  placeholder="npr. 24"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Dužina tovarnog prostora (LDM)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="loadingMeters"
                  value={form.loadingMeters}
                  onChange={handleChange}
                  placeholder="npr. 13.6"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                />
              </div>
            </div>

            <CheckboxGroup
              label="Prihvata utovar"
              options={LOADING_METHODS}
              selected={form.loadingMethods}
              onChange={v => set('loadingMethods', v)}
            />
          </div>
        </Card>

        {/* ── POSEBNE MOGUĆNOSTI ────────────────────────── */}
        <Card>
          <SectionHeader icon={AlertTriangle} title="Posebne mogućnosti" subtitle="ADR i hladni lanac" />

          <div className="space-y-5">
            {/* ADR */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-text-muted">Opasna roba (ADR)</p>
                  <p className="text-xs text-text-muted mt-0.5">Da li vozač/vozilo ima ADR sertifikat</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newVal = !form.adrCapable;
                    set('adrCapable', newVal);
                    setHasAdr(newVal);
                    if (!newVal) set('adrClasses', []);
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition-all ${form.adrCapable ? 'bg-amber-500/15 border-amber-500 text-amber-500' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                >
                  {form.adrCapable ? '⚠ ADR sertifikat' : 'Nema ADR'}
                </button>
              </div>
              {form.adrCapable && (
                <CheckboxGroup
                  label="Prihvata ADR klase"
                  options={ADR_CLASSES}
                  selected={form.adrClasses}
                  onChange={v => set('adrClasses', v)}
                />
              )}
            </div>

            {/* Temperatura */}
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
                      placeholder="npr. 4"
                      className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ── ŽELJENO ODREDIŠTE I KONTAKT ───────────────── */}
        <Card>
          <SectionHeader icon={Phone} title="Odredište i kontakt" subtitle="Kuda idete i kako vas kontaktirati" />

          <div className="space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <Select
                name="destinationCountry"
                label="Željena zemlja"
                value={form.destinationCountry}
                onChange={handleChange}
                options={[{ value: '', label: 'Bilo gde' }, ...EUROPEAN_COUNTRIES.map(c => ({ value: c.name, label: c.name }))]}
              />
              <Input
                name="destinationCity"
                label="Željeni grad"
                value={form.destinationCity}
                onChange={handleChange}
                placeholder="npr. Beč"
              />
              <Input
                name="destinationPostalCode"
                label="Poštanski broj"
                value={form.destinationPostalCode}
                onChange={handleChange}
                placeholder="opciono"
              />
            </div>

            <Input
              name="contactPhone"
              label="Kontakt telefon"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="npr. +381 64 123 4567"
            />

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Opis / Napomene</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Željene relacije, posebni uslovi, povratna tura..."
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
          <Button type="button" variant="outline" onClick={() => navigate('/trucks')}>Otkaži</Button>
          <Button type="submit" variant="primary" disabled={loading} className="min-w-36">
            {loading ? 'Objavljujem...' : 'Objavi kamion'}
          </Button>
        </div>
      </form>
    </div>
  );
};
