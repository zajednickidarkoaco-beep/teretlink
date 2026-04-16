import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../components/UIComponents';
import { ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Supabase automatski obrađuje token iz URL-a i postavlja sesiju
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true);
      }
    });

    // Proveri da li već postoji sesija za oporavak
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError('Greška pri promeni lozinke. Pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="mx-auto inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-brand-400 rounded-sm flex items-center justify-center text-black shadow-glow">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-text-main">Nalozi<span className="text-text-muted">.</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-text-main">Nova lozinka</h2>
          <p className="mt-2 text-text-muted text-sm">Unesite vašu novu lozinku</p>
        </div>

        <Card className="p-8 border-border shadow-2xl bg-surface/80 backdrop-blur-xl">
          {done ? (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Lozinka promenjena!</h3>
              <p className="text-sm text-text-muted mb-6">
                Vaša lozinka je uspešno promenjena. Bićete preusmereni na prijavu...
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full">Idi na prijavu</Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Nova lozinka"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Potvrdite lozinku"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-sm font-bold shadow-glow uppercase tracking-wide"
                size="md"
                variant="primary"
              >
                {isLoading ? 'Čuvanje...' : 'Sačuvaj novu lozinku'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
