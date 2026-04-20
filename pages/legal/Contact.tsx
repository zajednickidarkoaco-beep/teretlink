import React, { useState } from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { Card, Input, Button } from '../../components/UIComponents';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Sva obavezna polja moraju biti popunjena');
      return;
    }
    // TODO: kad se doda SMTP, šalji na backend
    // Za sada samo simuliramo success — korisnik može da kontaktira preko email/telefona
    setError('');
    setSent(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <LegalPageLayout
      title="Kontakt"
      subtitle="Tu smo da odgovorimo na vaša pitanja. Odgovaramo u roku od 24h radnim danom."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 not-prose">
        {/* Kontakt info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Email</p>
                <a href="mailto:info@teretlink.rs" className="text-sm font-medium text-text-main hover:text-brand-500 transition-colors break-all">
                  info@teretlink.rs
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Telefon</p>
                <a href="tel:+381600000000" className="text-sm font-medium text-text-main hover:text-brand-500 transition-colors">
                  +381 60 000 0000
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Adresa</p>
                <p className="text-sm font-medium text-text-main">Beograd, Srbija</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Radno vreme</p>
                <p className="text-sm font-medium text-text-main">Pon – Pet: 09:00 – 17:00</p>
                <p className="text-xs text-text-muted mt-0.5">Vikendom: email podrška</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Forma */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-text-main mb-2">Poruka poslata!</h3>
                <p className="text-sm text-text-muted mb-6">
                  Hvala što ste nas kontaktirali. Odgovorićemo u najkraćem mogućem roku.
                </p>
                <Button variant="outline" onClick={() => { setSent(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                  Pošalji novu poruku
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-text-main">Pošaljite nam poruku</h2>
                  <p className="text-sm text-text-muted mt-1">Popunite formu ili nas kontaktirajte direktno preko podataka levo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    name="name"
                    label="Ime i prezime *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Petar Petrović"
                  />
                  <Input
                    name="email"
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ime@firma.rs"
                  />
                </div>

                <Input
                  name="subject"
                  label="Tema"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Kratka tema poruke..."
                />

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Poruka *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Vaša poruka..."
                    className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted resize-y"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-500 text-sm">{error}</span>
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full gap-2">
                  <Send className="h-4 w-4" /> Pošalji poruku
                </Button>

                <p className="text-[11px] text-text-muted text-center">
                  Slanjem poruke prihvatate našu <a href="/#/privacy" className="text-brand-500 hover:underline">Politiku privatnosti</a>.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </LegalPageLayout>
  );
};
