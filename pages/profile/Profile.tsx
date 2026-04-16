import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Select } from '../../components/UIComponents';
import { User, Building2, Lock, CheckCircle, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CompanyCategory } from '../../types';
import { EUROPEAN_COUNTRIES } from '../../utils/countries';

const CATEGORY_OPTIONS = [
  { value: CompanyCategory.CARRIER, label: CompanyCategory.CARRIER },
  { value: CompanyCategory.FORWARDER, label: CompanyCategory.FORWARDER },
  { value: CompanyCategory.LOGISTICS, label: CompanyCategory.LOGISTICS },
  { value: CompanyCategory.MANUFACTURER, label: CompanyCategory.MANUFACTURER },
  { value: CompanyCategory.IMPORTER_EXPORTER, label: CompanyCategory.IMPORTER_EXPORTER },
  { value: CompanyCategory.MOVING, label: CompanyCategory.MOVING },
  { value: CompanyCategory.OTHER, label: CompanyCategory.OTHER },
];

const COUNTRY_OPTIONS = [
  { value: '', label: '— Izaberite državu —' },
  ...EUROPEAN_COUNTRIES.map(c => ({ value: c.name, label: c.name })),
];

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3 pb-4 border-b border-border mb-5">
    <div className="h-9 w-9 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-brand-400" />
    </div>
    <div>
      <h3 className="font-bold text-text-main">{title}</h3>
      <p className="text-xs text-text-muted uppercase tracking-wider">{subtitle}</p>
    </div>
  </div>
);

const Alert = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
  <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
    type === 'success'
      ? 'bg-green-500/10 border-green-500/20 text-green-400'
      : 'bg-red-500/10 border-red-500/20 text-red-400'
  }`}>
    {type === 'success'
      ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
      : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
    {message}
  </div>
);

export const Profile = () => {
  const { profile, user, refreshProfile } = useAuth();

  // Lični podaci
  const [personal, setPersonal] = useState({
    name: '',
    jobTitle: '',
    directPhone: '',
    mobilePhone: '',
  });
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalAlert, setPersonalAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Firma
  const [company, setCompany] = useState({
    name: '',
    registrationNumber: '',
    category: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyAlert, setCompanyAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Lozinka
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Popuni forme kada se profil učita
  useEffect(() => {
    if (profile) {
      setPersonal({
        name: profile.name || '',
        jobTitle: profile.jobTitle || '',
        directPhone: profile.directPhone || '',
        mobilePhone: profile.mobilePhone || '',
      });
      if (profile.company) {
        setCompany({
          name: profile.company.name || '',
          registrationNumber: profile.company.registrationNumber || '',
          category: profile.company.category || '',
          country: profile.company.country || '',
          city: profile.company.city || '',
          address: profile.company.address || '',
          phone: profile.company.phone || '',
          email: profile.company.email || '',
          website: profile.company.website || '',
        });
      }
    }
  }, [profile]);

  const savePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPersonalLoading(true);
    setPersonalAlert(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: personal.name,
          job_title: personal.jobTitle || null,
          direct_phone: personal.directPhone || null,
          mobile_phone: personal.mobilePhone || null,
        })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      setPersonalAlert({ type: 'success', message: 'Lični podaci su uspešno sačuvani.' });
    } catch {
      setPersonalAlert({ type: 'error', message: 'Greška pri čuvanju. Pokušajte ponovo.' });
    } finally {
      setPersonalLoading(false);
    }
  };

  const saveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCompanyLoading(true);
    setCompanyAlert(null);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          registration_number: company.registrationNumber,
          category: company.category || null,
          country: company.country,
          city: company.city,
          address: company.address,
          phone: company.phone,
          email: company.email,
          website: company.website || null,
        })
        .eq('user_id', user.id);
      if (error) throw error;
      await refreshProfile();
      setCompanyAlert({ type: 'success', message: 'Podaci o firmi su uspešno sačuvani.' });
    } catch {
      setCompanyAlert({ type: 'error', message: 'Greška pri čuvanju. Pokušajte ponovo.' });
    } finally {
      setCompanyLoading(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordAlert(null);
    if (passwords.newPassword.length < 6) {
      setPasswordAlert({ type: 'error', message: 'Lozinka mora imati najmanje 6 karaktera.' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordAlert({ type: 'error', message: 'Lozinke se ne poklapaju.' });
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;
      setPasswords({ newPassword: '', confirmPassword: '' });
      setPasswordAlert({ type: 'success', message: 'Lozinka je uspešno promenjena.' });
    } catch {
      setPasswordAlert({ type: 'error', message: 'Greška pri promeni lozinke. Pokušajte ponovo.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center text-brand-400 font-bold text-2xl flex-shrink-0">
          {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-main">{profile?.name || 'Profil'}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              profile?.plan === 'pro' ? 'bg-amber-500/20 text-amber-400' :
              profile?.plan === 'standard' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {profile?.plan?.toUpperCase() || 'FREE'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              profile?.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {profile?.status === 'approved' ? 'Odobreno' : 'Na čekanju'}
            </span>
            <span className="text-xs text-text-muted">{profile?.email}</span>
          </div>
        </div>
      </div>

      {/* Lični podaci */}
      <Card className="p-6">
        <SectionHeader icon={User} title="Lični podaci" subtitle="Ime, pozicija, kontakt telefon" />
        <form onSubmit={savePersonal} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Ime i prezime *"
              value={personal.name}
              onChange={e => setPersonal(p => ({ ...p, name: e.target.value }))}
              required
              placeholder="Vaše ime i prezime"
            />
            <Input
              label="Pozicija u firmi"
              value={personal.jobTitle}
              onChange={e => setPersonal(p => ({ ...p, jobTitle: e.target.value }))}
              placeholder="npr. Dispečer, Direktor..."
            />
            <Input
              label="Direktni telefon"
              value={personal.directPhone}
              onChange={e => setPersonal(p => ({ ...p, directPhone: e.target.value }))}
              placeholder="+381 11 123 456"
            />
            <Input
              label="Mobilni telefon"
              value={personal.mobilePhone}
              onChange={e => setPersonal(p => ({ ...p, mobilePhone: e.target.value }))}
              placeholder="+381 6X XXX XXX"
            />
          </div>
          {personalAlert && <Alert type={personalAlert.type} message={personalAlert.message} />}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" disabled={personalLoading}>
              {personalLoading ? 'Čuvanje...' : 'Sačuvaj'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Podaci o firmi */}
      <Card className="p-6">
        <SectionHeader icon={Building2} title="Podaci o firmi" subtitle="Naziv, adresa, kontakt" />
        <form onSubmit={saveCompany} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Naziv firme *"
              value={company.name}
              onChange={e => setCompany(c => ({ ...c, name: e.target.value }))}
              required
              placeholder="D.O.O., A.D...."
            />
            <Input
              label="Matični broj / PIB"
              value={company.registrationNumber}
              onChange={e => setCompany(c => ({ ...c, registrationNumber: e.target.value }))}
              placeholder="12345678"
            />
          </div>
          <Select
            label="Kategorija firme"
            value={company.category}
            onChange={e => setCompany(c => ({ ...c, category: e.target.value }))}
            options={[{ value: '', label: '— Izaberite kategoriju —' }, ...CATEGORY_OPTIONS]}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Država *"
              value={company.country}
              onChange={e => setCompany(c => ({ ...c, country: e.target.value }))}
              options={COUNTRY_OPTIONS}
            />
            <Input
              label="Grad *"
              value={company.city}
              onChange={e => setCompany(c => ({ ...c, city: e.target.value }))}
              placeholder="Beograd"
            />
          </div>
          <Input
            label="Adresa"
            value={company.address}
            onChange={e => setCompany(c => ({ ...c, address: e.target.value }))}
            placeholder="Ulica i broj"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Telefon firme"
              value={company.phone}
              onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))}
              placeholder="+381 11 123 456"
            />
            <Input
              label="Email firme"
              type="email"
              value={company.email}
              onChange={e => setCompany(c => ({ ...c, email: e.target.value }))}
              placeholder="firma@email.com"
            />
          </div>
          <Input
            label="Web sajt"
            value={company.website}
            onChange={e => setCompany(c => ({ ...c, website: e.target.value }))}
            placeholder="https://vasafirma.com"
          />
          {companyAlert && <Alert type={companyAlert.type} message={companyAlert.message} />}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" disabled={companyLoading}>
              {companyLoading ? 'Čuvanje...' : 'Sačuvaj'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Promena lozinke */}
      <Card className="p-6">
        <SectionHeader icon={Lock} title="Promena lozinke" subtitle="Unesite novu lozinku" />
        <form onSubmit={savePassword} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Nova lozinka"
              type="password"
              value={passwords.newPassword}
              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
              placeholder="••••••••"
              required
            />
            <Input
              label="Potvrdite lozinku"
              type="password"
              value={passwords.confirmPassword}
              onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          {passwordAlert && <Alert type={passwordAlert.type} message={passwordAlert.message} />}
          <div className="flex justify-end">
            <Button type="submit" variant="outline" size="sm" disabled={passwordLoading}>
              {passwordLoading ? 'Menjanje...' : 'Promeni lozinku'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Info kartica */}
      <Card className="p-5 border-border/50 bg-surface/50">
        <div className="flex items-start gap-3">
          <ArrowLeftRight className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-text-muted space-y-1">
            <p><span className="text-text-main font-medium">Email adresa</span> se ne može menjati ovde — kontaktirajte podršku.</p>
            <p><span className="text-text-main font-medium">Plan pretplate</span> se menja u sekciji Pretplata.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
