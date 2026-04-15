import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card } from '../../components/UIComponents';
import { ArrowLeftRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, isAuthenticated, isApproved: userApproved, profile } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';
  const isApproved = new URLSearchParams(location.search).get('approved') === 'true';

  // Ako je korisnik već ulogovan, prebaci ga na dashboard
  React.useEffect(() => {
    if (!loading && isAuthenticated && profile) {
      navigate(from, { replace: true });
    }
  }, [loading, isAuthenticated, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(formData.email, formData.password);
      console.log('Login successful, navigating to dashboard...');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Greška pri prijavljivanju');
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
          <h2 className="text-2xl font-bold tracking-tight text-text-main">Dobrodošli nazad</h2>
          <p className="mt-2 text-text-muted text-sm">
            Nemate nalog? <Link to="/register" className="text-brand-500 hover:text-brand-400 font-medium">Registrujte se</Link>
          </p>
        </div>

        <Card className="p-8 border-border shadow-2xl bg-surface/80 backdrop-blur-xl">
          {isApproved && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500 font-medium text-sm">Vaš nalog je odobren!</span>
              </div>
              <p className="text-green-500/80 text-xs mt-1">Sada možete da se prijavite i koristite platformu.</p>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email adresa"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="ime@firma.com"
            />
            <Input
              label="Lozinka"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
            
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-brand-500 hover:text-brand-400">
                Zaboravljena lozinka?
              </Link>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-red-500 text-sm">{error}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-bold shadow-glow uppercase tracking-wide" 
              size="md" 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Prijavljivanje...' : 'Prijavi se'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};