import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '../../components/UIComponents';
import { ArrowLeftRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const redirectTo = `${window.location.origin}/#/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setError('Greška pri slanju emaila. Proverite da li je email adresa ispravna.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="mx-auto inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-brand-400 rounded-sm flex items-center justify-center text-black shadow-glow">
                <ArrowLeftRight className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-text-main">Nalozi<span className="text-text-muted">.</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-text-main">Resetujte lozinku</h2>
          <p className="mt-2 text-text-muted text-sm">
            Unesite email adresu i poslaćemo vam link za resetovanje
          </p>
        </div>

        <Card className="p-8 border-border shadow-2xl bg-surface/80 backdrop-blur-xl">
          {!submitted ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Email adresa"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@firma.com"
              />
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm">{error}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full h-11 text-sm font-bold shadow-glow uppercase tracking-wide" size="md" variant="primary">
                {isLoading ? 'Slanje...' : 'Pošalji link za resetovanje'}
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-text-main transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Nazad na prijavu
              </Link>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Email poslat!</h3>
              <p className="text-sm text-text-muted mb-6">
                Proverite svoj email inbox. Poslali smo vam link za resetovanje lozinke na <span className="font-medium text-text-main">{email}</span>
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Nazad na prijavu
                </Button>
              </Link>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-text-muted">
          Niste dobili email? Proverite spam folder ili{' '}
          <button onClick={() => setSubmitted(false)} className="text-brand-500 hover:text-brand-400 font-medium">
            pokušajte ponovo
          </button>
        </p>
      </div>
    </div>
  );
};
