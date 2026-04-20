import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Select, Card } from '../../components/UIComponents';
import { CompanyCategory } from '../../types';
import { TermsOfService } from '../../components/TermsOfService';
import { BALKAN_COUNTRIES, getPhoneCodeByCountry } from '../../utils/countries';
import { CityAutocomplete } from '../../components/CityAutocomplete';
import { ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff, Check, X } from 'lucide-react';

// =============================================
// Helper: validacije
// =============================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PIB_REGEX = /^\d{9}$/; // srpski PIB = 9 cifara
const PHONE_REGEX = /^[\d\s\-()]{5,}$/;

type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

const getPasswordStrength = (pw: string): PasswordStrength => {
  if (!pw) return 'empty';
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

const strengthMeta: Record<PasswordStrength, { label: string; color: string; bar: string; width: string }> = {
  empty:  { label: '',         color: '',              bar: '',                width: '0%' },
  weak:   { label: 'Slaba',    color: 'text-red-500',  bar: 'bg-red-500',      width: '33%' },
  medium: { label: 'Srednja',  color: 'text-amber-400',bar: 'bg-amber-400',    width: '66%' },
  strong: { label: 'Jaka',     color: 'text-green-500',bar: 'bg-green-500',    width: '100%' },
};

// Auto-prefix https:// na website ako korisnik nije stavio
const normalizeWebsite = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Show/hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Per-field greške (prikazujemo tek nakon što korisnik "napusti" polje - onBlur)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Ref za autofocus prvog polja na svakom koraku
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Personal data
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    directPhone: '',
    mobilePhone: '',
    directPhoneCountryCode: '+381',
    mobilePhoneCountryCode: '+381',

    // Company data
    companyName: '',
    registrationNumber: '',
    category: CompanyCategory.CARRIER,
    country: 'Srbija',
    city: '',
    address: '',
    phone: '',
    companyPhoneCountryCode: '+381',
    companyEmail: '',
    fax: '',
    faxCountryCode: '+381',
    website: '',
  });

  // Autofocus kad se menja step
  useEffect(() => {
    const t = setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto-update phone codes when country changes
    if (name === 'country') {
      const phoneCode = getPhoneCodeByCountry(value);
      setFormData({
        ...formData,
        [name]: value,
        directPhoneCountryCode: phoneCode,
        mobilePhoneCountryCode: phoneCode,
        companyPhoneCountryCode: phoneCode,
        faxCountryCode: phoneCode
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // ============================
  // Validation helpers
  // ============================
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (touched.companyName && !formData.companyName.trim()) errs.companyName = 'Naziv firme je obavezan';
    if (touched.registrationNumber && formData.registrationNumber && !PIB_REGEX.test(formData.registrationNumber.trim())) {
      errs.registrationNumber = 'PIB mora imati tačno 9 cifara';
    }
    if (touched.registrationNumber && !formData.registrationNumber.trim()) {
      errs.registrationNumber = 'PIB je obavezan';
    }
    if (touched.city && !formData.city.trim()) errs.city = 'Grad je obavezan';
    if (touched.address && !formData.address.trim()) errs.address = 'Adresa je obavezna';
    if (touched.phone && formData.phone && !PHONE_REGEX.test(formData.phone.trim())) {
      errs.phone = 'Neispravan format telefona';
    }
    if (touched.phone && !formData.phone.trim()) errs.phone = 'Telefon firme je obavezan';
    if (touched.companyEmail && formData.companyEmail && !EMAIL_REGEX.test(formData.companyEmail.trim())) {
      errs.companyEmail = 'Neispravan email';
    }
    if (touched.companyEmail && !formData.companyEmail.trim()) errs.companyEmail = 'Email firme je obavezan';

    if (touched.name && !formData.name.trim()) errs.name = 'Ime i prezime je obavezno';
    if (touched.email && formData.email && !EMAIL_REGEX.test(formData.email.trim())) {
      errs.email = 'Neispravan email';
    }
    if (touched.email && !formData.email.trim()) errs.email = 'Email je obavezan';

    if (touched.password && formData.password && formData.password.length < 8) {
      errs.password = 'Lozinka mora imati najmanje 8 karaktera';
    }
    if (touched.password && !formData.password) errs.password = 'Lozinka je obavezna';

    if (touched.confirmPassword && formData.confirmPassword && formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Lozinke se ne poklapaju';
    }

    return errs;
  }, [formData, touched]);

  // Provera da li je korak validan (nezavisno od touched state-a — za disable dugmeta)
  const isStep1Valid = useMemo(() => {
    return !!(
      formData.companyName.trim() &&
      PIB_REGEX.test(formData.registrationNumber.trim()) &&
      formData.country.trim() &&
      formData.city.trim() &&
      formData.address.trim() &&
      PHONE_REGEX.test(formData.phone.trim()) &&
      EMAIL_REGEX.test(formData.companyEmail.trim())
    );
  }, [formData]);

  const isStep2Valid = useMemo(() => {
    return !!(
      formData.name.trim() &&
      EMAIL_REGEX.test(formData.email.trim()) &&
      formData.password.length >= 8 &&
      formData.confirmPassword === formData.password
    );
  }, [formData]);

  // Password strength
  const passwordStrength = getPasswordStrength(formData.password);
  const strength = strengthMeta[passwordStrength];

  // Real-time password match indicator
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password;
  const passwordsMismatch = formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password;

  // Markira sva polja step-a kao touched (za klik "Nastavi" kad je disabled pa korisnik vidi sve greške)
  const markStep1Touched = () => {
    setTouched(prev => ({
      ...prev,
      companyName: true,
      registrationNumber: true,
      city: true,
      address: true,
      phone: true,
      companyEmail: true,
    }));
  };
  const markStep2Touched = () => {
    setTouched(prev => ({
      ...prev,
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    }));
  };

  const handleNextStep1 = () => {
    if (!isStep1Valid) {
      markStep1Touched();
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!isStep2Valid) {
      markStep2Touched();
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStep1Valid || !isStep2Valid) {
      setError('Molimo popunite sva obavezna polja');
      return;
    }

    if (!acceptedTerms) {
      setError('Morate prihvatiti opšte uslove korišćenja');
      return;
    }

    setLoading(true);
    setError('');

    // Trim whitespace iz svih string polja pre slanja
    const cleanData = {
      name: formData.name.trim(),
      jobTitle: formData.jobTitle.trim(),
      directPhone: formData.directPhone.trim(),
      mobilePhone: formData.mobilePhone.trim(),
      phoneCountryCode: formData.directPhoneCountryCode,
      company: {
        name: formData.companyName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        category: formData.category,
        country: formData.country.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        phoneCountryCode: formData.companyPhoneCountryCode,
        email: formData.companyEmail.trim(),
        fax: formData.fax.trim(),
        faxCountryCode: formData.faxCountryCode,
        website: normalizeWebsite(formData.website), // auto-prefix https://
      }
    };

    try {
      await signUp(formData.email.trim(), formData.password, cleanData);

      // Registration successful, but email needs to be confirmed
      setEmailSent(true);
    } catch (error: any) {
      console.error('Registration error:', error);

      // Provide user-friendly error messages in Serbian
      let errorMessage = 'Greška pri registraciji';

      if (error.message?.includes('User already registered')) {
        errorMessage = 'Korisnik sa ovom email adresom već postoji';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Neispravna email adresa';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Lozinka mora imati najmanje 8 karaktera';
      } else if (error.message?.includes('firmi')) {
        errorMessage = 'Nalog je kreiran, ali podaci o firmi nisu sačuvani. Možete ih dodati kasnije u profilu.';
      } else if (error.message?.includes('row-level security')) {
        errorMessage = 'Greška u sistemu. Molimo pokušajte ponovo za nekoliko sekundi.';
      } else if (error.message?.includes('AbortError') || error.message?.includes('signal is aborted')) {
        errorMessage = 'Registracija je možda uspešna. Proverite vaš email za potvrdu i pokušajte da se prijavite.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-md relative z-10">
          <Card className="p-8 border-border shadow-2xl bg-surface/80 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-2">Proverite vaš email</h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                Poslali smo vam email na <strong>{formData.email}</strong> sa linkom za potvrdu naloga.
                Kliknite na link u email-u da potvrdite vašu registraciju.
              </p>
              <div className="space-y-3">
                <p className="text-xs text-text-muted">
                  Ne vidite email? Proverite spam folder ili pokušajte ponovo za nekoliko minuta.
                </p>
                <Link to="/login" className="block">
                  <Button variant="primary" className="w-full">
                    Nazad na prijavu
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    Nazad na početnu
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-md relative z-10">
          <Card className="p-8 border-border shadow-2xl bg-surface/80 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-brand-500" />
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-2">Registracija uspešna!</h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                Vaš nalog je kreiran i čeka odobrenje administratora.
                Bićete obavešteni putem email-a kada bude odobren.
              </p>
              <div className="space-y-3">
                <Link to="/login" className="block">
                  <Button variant="primary" className="w-full">
                    Idite na prijavu
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    Nazad na početnu
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
       {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-8 relative z-10">
         <div className="text-center relative">
          <Link to="/" className="absolute left-0 top-1 inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-medium text-xs uppercase tracking-wide">
            <ArrowLeft className="h-3 w-3" /> Nazad
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white">Registracija</h2>
          <p className="mt-2 text-zinc-500 text-sm">
            Pridružite se mreži najboljih transportnih firmi.
          </p>
        </div>

        <Card className="p-10 shadow-2xl border-white/10 relative overflow-hidden bg-surface/80 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-zinc-800">
             <div className="h-full bg-brand-500 transition-all duration-500 shadow-[0_0_10px_#4ade80]" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>
          </div>

          {/* Step indikator */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-zinc-500">
            <span className={step >= 1 ? 'text-brand-400 font-bold' : ''}>Korak {step} od 3</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-2">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                   <h3 className="text-lg font-bold text-white">Podaci o Firmi</h3>
                   <p className="text-xs text-zinc-500 uppercase tracking-wide">Verifikacija Poslovanja</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <Input
                     ref={firstFieldRef}
                     name="companyName"
                     label="Naziv Firme"
                     required
                     value={formData.companyName}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={fieldErrors.companyName}
                   />
                   <Input
                     name="registrationNumber"
                     label="PIB (9 cifara)"
                     required
                     value={formData.registrationNumber}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={fieldErrors.registrationNumber}
                     placeholder="npr. 123456789"
                     maxLength={9}
                   />
                </div>

                <Select
                  name="category"
                  label="Kategorija"
                  value={formData.category}
                  onChange={handleChange}
                  options={Object.values(CompanyCategory).map(c => ({ value: c, label: c }))}
                />

                <div className="grid grid-cols-2 gap-6">
                   <Select
                     name="country"
                     label="Država"
                     required
                     value={formData.country}
                     onChange={handleChange}
                     options={BALKAN_COUNTRIES.map(c => ({ value: c.name, label: c.name }))}
                   />
                   <CityAutocomplete
                     name="city"
                     label="Grad"
                     value={formData.city}
                     country={formData.country}
                     required
                     onChange={handleChange}
                     placeholder="Unesite grad..."
                   />
                </div>

                <Input
                  name="address"
                  label="Adresa"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={fieldErrors.address}
                />

                <div className="grid grid-cols-2 gap-6">
                   <div className="grid grid-cols-3 gap-2">
                     <Select
                       name="companyPhoneCountryCode"
                       label="Kod"
                       value={formData.companyPhoneCountryCode}
                       onChange={handleChange}
                       options={BALKAN_COUNTRIES.map(c => ({ value: c.phoneCode, label: c.phoneCode }))}
                     />
                     <div className="col-span-2">
                       <Input
                         name="phone"
                         label="Telefon firme"
                         required
                         value={formData.phone}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={fieldErrors.phone}
                         placeholder="11 123 4567"
                       />
                     </div>
                   </div>
                   <Input
                     name="companyEmail"
                     label="Email Firme"
                     type="email"
                     required
                     value={formData.companyEmail}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={fieldErrors.companyEmail}
                     placeholder="info@firma.rs"
                   />
                </div>

                <div className="pt-6">
                   <Button
                     type="button"
                     variant="primary"
                     className="w-full h-11 uppercase tracking-wide text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                     onClick={handleNextStep1}
                     disabled={!isStep1Valid}
                   >
                     {isStep1Valid ? 'Nastavi' : 'Popunite obavezna polja'}
                   </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                   <h3 className="text-lg font-bold text-white">Lični Podaci</h3>
                   <p className="text-xs text-zinc-500 uppercase tracking-wide">Kontakt Osoba</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <Input
                     ref={firstFieldRef}
                     name="name"
                     label="Ime i Prezime"
                     required
                     value={formData.name}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={fieldErrors.name}
                   />
                   <Input
                     name="jobTitle"
                     label="Pozicija u firmi"
                     value={formData.jobTitle}
                     onChange={handleChange}
                     placeholder="npr. Direktor, Špediter..."
                   />
                </div>

                <Input
                  name="email"
                  label="Email Adresa"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={fieldErrors.email}
                  placeholder="ime@firma.rs"
                />

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="grid grid-cols-3 gap-2">
                     <Select
                       name="directPhoneCountryCode"
                       label="Kod"
                       value={formData.directPhoneCountryCode}
                       onChange={handleChange}
                       options={BALKAN_COUNTRIES.map(c => ({ value: c.phoneCode, label: c.phoneCode }))}
                     />
                     <div className="col-span-2">
                       <Input
                         name="directPhone"
                         label="Direktan telefon"
                         value={formData.directPhone}
                         onChange={handleChange}
                         placeholder="11 123 4567"
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     <Select
                       name="mobilePhoneCountryCode"
                       label="Kod"
                       value={formData.mobilePhoneCountryCode}
                       onChange={handleChange}
                       options={BALKAN_COUNTRIES.map(c => ({ value: c.phoneCode, label: c.phoneCode }))}
                     />
                     <div className="col-span-2">
                       <Input
                         name="mobilePhone"
                         label="Mobilni telefon"
                         value={formData.mobilePhone}
                         onChange={handleChange}
                         placeholder="64 123 4567"
                       />
                     </div>
                   </div>
                </div>

                {/* Lozinka sa show/hide + strength meter */}
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                     <div className="relative">
                       <Input
                         name="password"
                         label="Lozinka"
                         type={showPassword ? 'text' : 'password'}
                         required
                         value={formData.password}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={fieldErrors.password}
                         placeholder="Najmanje 8 karaktera"
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(s => !s)}
                         className="absolute right-3 top-[34px] text-text-muted hover:text-text-main transition-colors"
                         tabIndex={-1}
                         aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                       >
                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </button>
                     </div>

                     {/* Password strength meter */}
                     {formData.password && (
                       <div className="mt-2">
                         <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                           <div
                             className={`h-full ${strength.bar} transition-all duration-300`}
                             style={{ width: strength.width }}
                           />
                         </div>
                         <p className={`text-xs mt-1 font-medium ${strength.color}`}>
                           Jačina lozinke: {strength.label}
                         </p>
                       </div>
                     )}
                   </div>

                   <div>
                     <div className="relative">
                       <Input
                         name="confirmPassword"
                         label="Potvrdi Lozinku"
                         type={showConfirmPassword ? 'text' : 'password'}
                         required
                         value={formData.confirmPassword}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={fieldErrors.confirmPassword}
                         placeholder="Ponovi lozinku"
                       />
                       <button
                         type="button"
                         onClick={() => setShowConfirmPassword(s => !s)}
                         className="absolute right-3 top-[34px] text-text-muted hover:text-text-main transition-colors"
                         tabIndex={-1}
                         aria-label={showConfirmPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                       >
                         {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </button>
                     </div>

                     {/* Real-time match indikator */}
                     {passwordsMatch && (
                       <p className="text-xs mt-1 font-medium text-green-500 flex items-center gap-1">
                         <Check className="h-3 w-3" /> Lozinke se poklapaju
                       </p>
                     )}
                     {passwordsMismatch && !fieldErrors.confirmPassword && (
                       <p className="text-xs mt-1 font-medium text-red-500 flex items-center gap-1">
                         <X className="h-3 w-3" /> Lozinke se ne poklapaju
                       </p>
                     )}
                   </div>
                </div>

                <div className="pt-6 flex gap-4">
                   <Button type="button" variant="outline" className="flex-1 uppercase tracking-wide text-xs" onClick={() => setStep(1)}>Nazad</Button>
                   <Button
                     type="button"
                     variant="primary"
                     className="flex-1 uppercase tracking-wide text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                     onClick={handleNextStep2}
                     disabled={!isStep2Valid}
                   >
                     {isStep2Valid ? 'Nastavi' : 'Popunite obavezna polja'}
                   </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                   <h3 className="text-lg font-bold text-white">Dodatni Podaci</h3>
                   <p className="text-xs text-zinc-500 uppercase tracking-wide">Opciono</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="grid grid-cols-3 gap-2">
                     <Select
                       name="faxCountryCode"
                       label="Kod"
                       value={formData.faxCountryCode}
                       onChange={handleChange}
                       options={BALKAN_COUNTRIES.map(c => ({ value: c.phoneCode, label: c.phoneCode }))}
                     />
                     <div className="col-span-2">
                       <Input
                         ref={firstFieldRef}
                         name="fax"
                         label="Faks"
                         value={formData.fax}
                         onChange={handleChange}
                         placeholder="11 123 4567"
                       />
                     </div>
                   </div>
                   <Input
                     name="website"
                     label="Web sajt"
                     value={formData.website}
                     onChange={handleChange}
                     placeholder="www.firma.rs"
                   />
                </div>

                {/* Terms of Service */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">Opšti uslovi korišćenja</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTerms(!showTerms)}
                      className="text-xs"
                    >
                      {showTerms ? 'Sakrij' : 'Prikaži'} uslove
                    </Button>
                  </div>

                  {showTerms && <TermsOfService />}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-brand-500 focus:ring-brand-500 border-border rounded"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-text-muted leading-relaxed">
                      Prihvatam <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-brand-500 hover:text-brand-400 underline"
                      >
                        opšte uslove korišćenja
                      </button> sistema TeretLink
                    </label>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                   <Button type="button" variant="outline" className="flex-1 uppercase tracking-wide text-xs" onClick={() => setStep(2)}>Nazad</Button>
                   <Button
                     type="submit"
                     variant="primary"
                     className="flex-1 uppercase tracking-wide text-xs shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={loading || !acceptedTerms}
                   >
                     {loading ? 'Registracija...' : 'Završi Registraciju'}
                   </Button>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 mt-4">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-500 text-sm">{error}</span>
                  </div>
                )}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
