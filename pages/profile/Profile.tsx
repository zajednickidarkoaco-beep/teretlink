import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Select } from '../../components/UIComponents';
import { User, Building2, Lock, CheckCircle, AlertCircle, ArrowLeftRight, Camera, Trash2, MessageSquare, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CompanyCategory } from '../../types';
import type { Review } from '../../types';
import { EUROPEAN_COUNTRIES } from '../../utils/countries';
import { SupabaseService } from '../../services/supabaseService';
import { StarRating } from '../../components/StarRating';
import { ReviewsList } from '../../components/ReviewsList';

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

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarAlert, setAvatarAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Bio
  const [bio, setBio] = useState('');
  const [bioLoading, setBioLoading] = useState(false);
  const [bioAlert, setBioAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const MAX_BIO = 500;

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

  // Recenzije
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Popuni forme kada se profil učita
  useEffect(() => {
    if (profile) {
      setPersonal({
        name: profile.name || '',
        jobTitle: profile.jobTitle || '',
        directPhone: profile.directPhone || '',
        mobilePhone: profile.mobilePhone || '',
      });
      setAvatarUrl(profile.avatarUrl || null);
      setBio(profile.bio || '');
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

  // Učitaj primljene recenzije
  useEffect(() => {
    if (!user?.id) return;
    setReviewsLoading(true);
    SupabaseService.getReviewsForUser(user.id)
      .then(setReviews)
      .finally(() => setReviewsLoading(false));
  }, [user?.id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    setAvatarAlert(null);
    try {
      const url = await SupabaseService.uploadAvatar(user.id, file);
      setAvatarUrl(url);
      await refreshProfile();
      setAvatarAlert({ type: 'success', message: 'Slika je uspešno postavljena.' });
    } catch (err: any) {
      setAvatarAlert({ type: 'error', message: err?.message || 'Greška pri uploadu slike.' });
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAvatar = async () => {
    if (!user) return;
    if (!confirm('Želite li da uklonite avatar?')) return;
    setAvatarUploading(true);
    setAvatarAlert(null);
    try {
      await SupabaseService.removeAvatar(user.id);
      setAvatarUrl(null);
      await refreshProfile();
      setAvatarAlert({ type: 'success', message: 'Avatar je uklonjen.' });
    } catch {
      setAvatarAlert({ type: 'error', message: 'Greška pri uklanjanju avatara.' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const saveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBioLoading(true);
    setBioAlert(null);
    try {
      await SupabaseService.updateBio(user.id, bio);
      await refreshProfile();
      setBioAlert({ type: 'success', message: 'Opis firme je sačuvan.' });
    } catch {
      setBioAlert({ type: 'error', message: 'Greška pri čuvanju opisa.' });
    } finally {
      setBioLoading(false);
    }
  };

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

  const avgRating = profile?.avgRating || 0;
  const reviewCount = profile?.reviewCount || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-fade-in">
      {/* Header sa avatarom */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="relative group">
          <div className="h-20 w-20 rounded-xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center text-brand-400 font-bold text-3xl flex-shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile?.name || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
              profile?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-brand-400 hover:bg-brand-500 text-white flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
            aria-label="Promeni avatar"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-text-main">{profile?.name || 'Profil'}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
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
            <span className="text-xs text-text-muted truncate">{profile?.email}</span>
          </div>
          {reviewCount > 0 && (
            <div className="mt-2">
              <StarRating value={avgRating} readOnly size={16} count={reviewCount} showValue />
            </div>
          )}
          {avatarUrl && (
            <button
              type="button"
              onClick={removeAvatar}
              disabled={avatarUploading}
              className="mt-2 text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" /> Ukloni sliku
            </button>
          )}
        </div>
      </div>

      {avatarAlert && <Alert type={avatarAlert.type} message={avatarAlert.message} />}

      {/* O firmi (bio) */}
      <Card className="p-6">
        <SectionHeader icon={FileText} title="O firmi" subtitle="Kratki opis vidljiv drugim korisnicima" />
        <form onSubmit={saveBio} className="space-y-4">
          <div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO))}
              placeholder="Npr. Transportna firma sa 15 godina iskustva u međunarodnom transportu. Specijalizovani smo za hladnjače i ADR terete..."
              rows={5}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-colors resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-text-muted">Predstavite svoju firmu i usluge.</span>
              <span className={`text-xs ${bio.length >= MAX_BIO - 50 ? 'text-amber-400' : 'text-text-muted'}`}>
                {bio.length}/{MAX_BIO}
              </span>
            </div>
          </div>
          {bioAlert && <Alert type={bioAlert.type} message={bioAlert.message} />}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" disabled={bioLoading}>
              {bioLoading ? 'Čuvanje...' : 'Sačuvaj opis'}
            </Button>
          </div>
        </form>
      </Card>

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

      {/* Primljene recenzije */}
      <Card className="p-6">
        <SectionHeader
          icon={MessageSquare}
          title="Primljene recenzije"
          subtitle={reviewCount > 0 ? `Prosek: ${avgRating.toFixed(1)}/5 · ${reviewCount} ${reviewCount === 1 ? 'recenzija' : 'recenzija'}` : 'Još nema recenzija'}
        />
        <ReviewsList
          reviews={reviews}
          loading={reviewsLoading}
          emptyText="Kada drugi korisnici ocene vašu saradnju, recenzije će se pojaviti ovde."
        />
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
