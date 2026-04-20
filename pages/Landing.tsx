
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Check, Package, Zap, BarChart, Bell, Search, LayoutGrid, Smartphone, Sun, Moon, Users, Globe, HelpCircle, MousePointer2, Box, Wifi, Home, User, Plus, Battery, Quote, Star, TrendingUp } from 'lucide-react';
import { Button, Badge, Card, cn } from '../components/UIComponents';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/layout/Footer';

// Counting Number Animation Component
const CountingNumber = ({ target, duration = 2000, delay = 0, format }: {
  target: number;
  duration?: number;
  delay?: number;
  format: string;
}) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * target);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  // Format the number based on the final format
  const formatNumber = (num: number) => {
    if (format.includes('€') && format.includes('k')) {
      return `€${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return <span>{started ? formatNumber(count) : '0'}</span>;
};

// Typewriter Text Animation Component
const TypewriterText = ({ text, delay = 0, speed = 50 }: {
  text: string;
  delay?: number;
  speed?: number;
}) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};


export const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0); // 0: Alarms, 1: Matching, 2: Analytics
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { isAuthenticated, profile, signOut } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('lbx_theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('lbx_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const features = [
    { 
      title: 'Email & SMS Alarmi', 
      desc: 'Budite obavešteni istog trenutka kada se pojavi tura koja vam odgovara.',
      icon: Bell
    },
    { 
      title: 'Pametno Povezivanje', 
      desc: 'Sistem automatski prepoznaje prazne kamione i nudi im teret u blizini.',
      icon: Zap
    },
    { 
      title: 'Istorija i Analitika', 
      desc: 'Pratite cene i kretanja na tržištu kroz detaljnu statistiku.',
      icon: BarChart
    }
  ];

  const testimonials = [
    {
      name: "Marko Jovanović",
      role: "Direktor",
      company: "Balkan Trans Logistike",
      quote: "TeretLink nam je uštedeo sate telefoniranja. Pronašli smo povratne ture za 80% naših kamiona u prva tri meseca korišćenja.",
      metric: "Profit ↑ 30%",
      rating: 5
    },
    {
      name: "Jelena Stanković",
      role: "Menadžer Transporta",
      company: "EuroŠped Line",
      quote: "Najbolja platforma za domaći transport. Verifikacija firmi nam uliva poverenje da radimo samo sa ozbiljnim partnerima.",
      metric: "Ušteda 15h/ned",
      rating: 5
    },
    {
      name: "Dejan Ilić",
      role: "Vlasnik",
      company: "Ilić Prevoz",
      quote: "Kao mali prevoznik, teško sam dolazio do direktnih klijenata. Ova platforma mi je omogućila da popunim kamion bez posrednika.",
      metric: "Novi Klijenti",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-text-main selection:bg-brand-500/30 selection:text-brand-500 overflow-x-hidden transition-colors duration-300">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 border-b ${scrolled || mobileMenuOpen ? 'bg-surface border-border py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
             <div className="h-7 w-7 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white dark:text-black font-black text-lg leading-none">T</span>
             </div>
             <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold tracking-tight text-text-main">Teret</span>
                <span className="text-xl font-bold tracking-tight text-brand-500">Link</span>
             </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
             <a href="#features" className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">Mogućnosti</a>
             <Link to="/pricing" className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">Cenovnik</Link>
             <Link to="/loads" className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">Berza Tereta</Link>
             <Link to="/trucks" className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">Berza Kamiona</Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <select className="h-9 pl-3 pr-8 rounded-lg bg-surface border border-border text-text-main text-xs font-medium focus:outline-none focus:border-brand-500 transition-colors cursor-pointer appearance-none bg-no-repeat bg-right" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A1A1AA' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")", backgroundPosition: 'right 0.5rem center', backgroundSize: '12px' }}>
              <option>🇷🇸 SR</option>
              <option>🇬🇧 EN</option>
            </select>
            <button onClick={toggleTheme} className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:border-brand-500/50 transition-all">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            
            {isAuthenticated ? (
              // Logged in state
              <>
                <span className="text-xs text-text-muted">
                  Dobrodošli, {profile?.name}
                </span>
                <Link to="/dashboard" className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">
                  Dashboard
                </Link>
                <button 
                  onClick={signOut}
                  className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
                >
                  Odjavi se
                </button>
              </>
            ) : (
              // Logged out state
              <>
                <Link to="/login" className="text-xs font-medium text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">
                  Prijavi se
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">
                     REGISTRUJ SE
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle - Mobile */}
            <button onClick={toggleTheme} className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:border-brand-500/50 transition-all">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:border-brand-500/50 transition-all relative z-50"
            >
              <div className="relative w-5 h-5">
                <span className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 top-2' : 'top-1'}`}></span>
                <span className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 top-2 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 top-2' : 'top-3'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-surface transition-all duration-300 md:hidden z-[50] ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ height: 'calc(100svh - 80px)', top: '80px' }}>
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
          
          <div className="flex flex-col h-full pt-8 relative z-10">
            {/* Mobile Menu Content */}
            <div className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
              
              {/* Navigation Links */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 bg-brand-500 rounded-full"></div>
                  <h3 className="text-[10px] font-bold text-text-main uppercase tracking-widest">Navigacija</h3>
                </div>
                
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-surfaceHighlight transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-all">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text-main">Mogućnosti</div>
                    <div className="text-xs text-text-muted">Funkcije platforme</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </a>

                <Link 
                  to="/pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-surfaceHighlight transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-all">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text-main">Cenovnik</div>
                    <div className="text-xs text-text-muted">Planovi i cene</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link 
                  to="/loads" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-surfaceHighlight transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-all">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text-main">Berza Tereta</div>
                    <div className="text-xs text-text-muted">Pronađi teret</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link 
                  to="/trucks" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-surfaceHighlight transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-all">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text-main">Berza Kamiona</div>
                    <div className="text-xs text-text-muted">Pronađi vozilo</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Language Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-brand-500 rounded-full"></div>
                  <h3 className="text-[10px] font-bold text-text-main uppercase tracking-widest">Jezik</h3>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 h-12 px-4 rounded-lg bg-brand-500 text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-400 transition-all">
                    🇷🇸 Srpski
                  </button>
                  <button className="flex-1 h-12 px-4 rounded-lg bg-background text-text-muted font-medium text-sm flex items-center justify-center gap-2 hover:bg-surfaceHighlight hover:text-text-main transition-all">
                    🇬🇧 English
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Footer - Fixed at bottom */}
            <div className="px-6 py-6 bg-background border-t border-border">
              <div className="space-y-4">
                {isAuthenticated ? (
                  // Logged in state
                  <>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <div className="text-sm font-bold text-text-main">Dobrodošli, {profile?.name}</div>
                      <div className="text-xs text-text-muted mt-1">{profile?.company?.name}</div>
                    </div>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full h-12 px-4 rounded-lg bg-brand-500 text-black font-bold text-sm flex items-center justify-center hover:bg-brand-400 transition-all"
                    >
                      Idite na Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full h-12 px-4 rounded-lg bg-surface text-text-main font-medium text-sm flex items-center justify-center hover:bg-surfaceHighlight transition-all"
                    >
                      Odjavi se
                    </button>
                  </>
                ) : (
                  // Logged out state
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full h-12 px-4 rounded-lg bg-surface text-text-main font-medium text-sm flex items-center justify-center hover:bg-surfaceHighlight transition-all"
                    >
                      Prijavi se
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button size="md" variant="primary" className="w-full h-12">
                        REGISTRUJ SE BESPLATNO
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 mt-6 p-3 rounded-lg bg-surface">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-text-main font-medium">Sistem aktivan</span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs text-brand-500 font-bold">2,400+ korisnika</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 px-6 border-b border-border overflow-hidden">
         {/* Traffic Animation Background */}
         <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-[60%] w-[200%] h-px bg-gradient-to-r from-transparent via-text-muted to-transparent border-t border-dashed border-text-muted/50 animate-traffic"></div>
            <div className="absolute top-[65%] w-[200%] h-px bg-gradient-to-r from-transparent via-text-muted to-transparent border-t border-dashed border-text-muted/30 animate-traffic" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
         </div>
         
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-background to-background pointer-events-none"></div>
         
         <div className="mx-auto max-w-5xl text-center relative z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border mb-8 animate-fade-in backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">MODERNA BERZA TRANSPORTA</span>
                <span className="text-[10px] text-text-muted">→</span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-bold text-text-main mb-6 leading-[1.1] tracking-tight animate-slide-up">
                Pronađite savršen teret <br/>
                za svaki <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">kamion.</span>
             </h1>
             
             <p className="text-lg text-text-muted mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up animation-delay-100 font-light">
               TeretLink je napredna platforma koja povezuje prevoznike i špeditere. 
               Bez posrednika, bez skrivenih troškova.
             </p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="md" variant="primary" className="w-full sm:w-auto px-8 uppercase tracking-wide text-xs">
                    Počnite Besplatno
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="md" variant="outline" className="w-full sm:w-auto px-8 uppercase tracking-wide text-xs">
                    Prijavi se
                  </Button>
                </Link>
             </div>
         </div>

         {/* Dashboard Image Mockup */}
         <div className="mt-32 mx-auto max-w-6xl relative animate-slide-up animation-delay-300">
            {/* Clean Central Glow - Inside Dashboard */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out pointer-events-none overflow-hidden rounded-xl z-0">
               {/* Single Beautiful Central Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-gradient-radial from-brand-500/25 via-brand-400/12 to-transparent blur-[80px] animate-pulse" style={{ animationDuration: '4s' }}></div>
               
               {/* Subtle Inner Highlight */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-gradient-radial from-green-400/20 via-brand-500/8 to-transparent blur-[60px]"></div>
            </div>
            
            <div className="rounded-xl border border-border bg-surface/80 backdrop-blur-sm p-2 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-[0_25px_50px_rgba(74,222,128,0.1)] dark:hover:shadow-[0_25px_50px_rgba(74,222,128,0.15)] hover:border-brand-500/30 z-10">
               
               {/* Clean Mock UI Header */}
               <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-surfaceHighlight/30">
                  <div className="flex items-center gap-4">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                     </div>
                     <div className="h-4 w-px bg-border mx-2"></div>
                     <div className="flex gap-4 text-[10px] font-mono text-text-muted">
                        <span className="flex items-center gap-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                           <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> 
                           Online
                        </span>
                        <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                           v2.4.0
                        </span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="text-[10px] font-bold text-text-muted bg-surface px-2 py-1 rounded border border-border opacity-0 animate-fade-in hover:border-brand-500/30 hover:text-brand-500 transition-all duration-300" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                        PROFIL: TRANS-LOGISTIK DOO
                     </div>
                  </div>
               </div>
               
               {/* Mock Content */}
               <div className="aspect-[16/9] md:aspect-[21/9] bg-background relative overflow-hidden flex">
                  {/* Clean Mock Sidebar */}
                  <div className="w-48 border-r border-border p-4 space-y-4 hidden md:flex flex-col bg-surface/20">
                     <div className="space-y-1 mb-6">
                        <div className="h-8 w-full bg-brand-500/10 border border-brand-500/20 rounded flex items-center px-3 text-brand-500 text-xs font-bold gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                           <LayoutGrid className="h-3.5 w-3.5" />
                           Kontrolna Tabla
                        </div>
                        <div className="h-8 w-full rounded flex items-center px-3 text-text-muted text-xs font-medium gap-2 transition-colors duration-200 opacity-0 animate-fade-in hover:bg-surfaceHighlight" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                           <Package className="h-3.5 w-3.5" />
                           Moje Ture
                        </div>
                        <div className="h-8 w-full rounded flex items-center px-3 text-text-muted text-xs font-medium gap-2 transition-colors duration-200 opacity-0 animate-fade-in hover:bg-surfaceHighlight" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                           <Truck className="h-3.5 w-3.5" />
                           Moji Kamioni
                        </div>
                     </div>
                     
                     <div className="mt-auto p-3 bg-surface rounded border border-border opacity-0 animate-fade-in hover:border-brand-500/30 transition-all duration-300 group" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
                        <div className="text-[10px] text-text-muted mb-1 group-hover:text-brand-500 transition-colors">Pretplata</div>
                        <div className="text-xs text-text-main font-bold">Premium Paket</div>
                        <div className="w-full bg-surfaceHighlight h-1 mt-2 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-500 w-3/4 transition-all duration-1000 group-hover:w-full"></div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Mock Main Area */}
                  <div className="flex-1 p-6 flex flex-col">
                     {/* Clean Stats Row */}
                     <div className="grid grid-cols-4 gap-4 mb-6">
                        {[
                           { label: 'Aktivne Ture', val: 12, finalVal: '12', color: 'text-text-main', delay: '1s' },
                           { label: 'Slobodni Kamioni', val: 5, finalVal: '5', color: 'text-brand-500', delay: '1.2s' },
                           { label: 'Zarada (Okt)', val: 14200, finalVal: '€14.2k', color: 'text-text-main', delay: '1.4s' },
                           { label: 'Pregleda', val: 843, finalVal: '843', color: 'text-text-muted', delay: '1.6s' },
                        ].map((stat, i) => (
                           <div key={i} className="bg-surface border border-border rounded-lg p-3 opacity-0 animate-fade-in transition-all duration-300 hover:bg-surfaceHighlight hover:shadow-sm group relative overflow-hidden" style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}>
                              {/* Subtle inner glow on parent hover */}
                              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                              
                              <div className="text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1 relative z-10">{stat.label}</div>
                              <div className={`text-xl font-mono font-bold ${stat.color} relative z-10`}>
                                 <CountingNumber 
                                    target={stat.val} 
                                    duration={2000} 
                                    delay={parseInt(stat.delay) * 1000} 
                                    format={stat.finalVal}
                                 />
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-bold text-text-main opacity-0 animate-fade-in" style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}>
                           Poslednje Ture
                        </div>
                        <div className="h-6 px-3 bg-brand-500 hover:bg-brand-400 rounded text-black text-[10px] font-bold flex items-center uppercase tracking-wide cursor-pointer transition-all duration-200 opacity-0 animate-fade-in hover:shadow-md hover:scale-105 relative overflow-hidden group" style={{ animationDelay: '1.9s', animationFillMode: 'forwards' }}>
                           {/* Subtle glow effect */}
                           <div className="absolute inset-0 bg-gradient-to-r from-brand-400/50 via-brand-500 to-brand-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <span className="relative z-10">+ Nova Tura</span>
                        </div>
                     </div>
                     
                     {/* Animated Detailed Table Header */}
                     <div className="grid grid-cols-12 gap-4 px-3 py-2 border-b border-border text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                        <div className="col-span-4">Relacija</div>
                        <div className="col-span-2">Datum</div>
                        <div className="col-span-3">Vozilo</div>
                        <div className="col-span-2 text-right">Cena</div>
                        <div className="col-span-1 text-right">Status</div>
                     </div>

                     {/* Clean Mock List Items */}
                     <div className="space-y-2 mt-2">
                        {[
                           { from: 'Beograd', to: 'Minhen', date: 'Danas', type: 'Cerada', price: '1,200 €', status: 'active', delay: '2s' },
                           { from: 'Zagreb', to: 'Milano', date: 'Sutra', type: 'Hladnjača', price: '950 €', status: 'pending', delay: '2.3s' },
                           { from: 'Niš', to: 'Ljubljana', date: '20. Okt', type: 'Mega', price: 'Na upit', status: 'active', delay: '2.6s' },
                        ].map((row, i) => (
                           <div key={i} className="grid grid-cols-12 gap-4 items-center h-10 px-3 rounded-lg border border-border bg-surface/50 transition-all duration-300 cursor-pointer opacity-0 animate-fade-in hover:bg-surfaceHighlight hover:shadow-sm group" style={{ animationDelay: row.delay, animationFillMode: 'forwards' }}>
                              <div className="col-span-4 flex items-center gap-2 text-xs text-text-main font-medium">
                                 <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-brand-500' : 'bg-amber-500'}`}></span>
                                 {row.from} <span className="text-text-muted">→</span> {row.to}
                              </div>
                              <div className="col-span-2 text-[10px] text-text-muted">{row.date}</div>
                              <div className="col-span-3">
                                 <span className="bg-background text-text-muted px-1.5 py-0.5 rounded text-[9px] border border-border">
                                    {row.type}
                                 </span>
                              </div>
                              <div className="col-span-2 text-right text-xs font-mono font-bold text-text-main">
                                 {row.price}
                              </div>
                              <div className="col-span-1 text-right">
                                 <div className={`w-2 h-2 rounded-full ml-auto ${row.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="mt-12 text-center relative z-20">
             <p className="text-sm font-bold text-text-main mb-8 uppercase tracking-widest opacity-80">
               Veruju nam vodeće kompanije u regionu
             </p>
             <div className="flex flex-wrap justify-center gap-12 mt-8">
               {['BALKAN TRANS', 'Logistika Pro', 'CargoAgent', 'SPEED', 'EuroŠped', 'TransportLine'].map((name, i) => (
                  <div key={i} className="text-lg font-bold text-text-main transition-colors duration-300 font-mono tracking-tighter cursor-default text-text-muted hover:text-text-main transition-colors relative z-20">{name}</div>
               ))}
            </div>
         </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-b border-border bg-surface/30 py-16">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Realizovanih tura', val: '15,000+', icon: Package },
            { label: 'Registrovanih firmi', val: '2,400+', icon: Users },
            { label: 'Zemalja pokriveno', val: '24', icon: Globe },
            { label: 'Uspešnost', val: '98.5%', icon: Check },
          ].map((stat, i) => (
            <div key={i} className="space-y-2 group">
              <div className="flex justify-center text-brand-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-mono">{stat.val}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid Section (Bento) */}
      <section id="features" className="py-32 bg-surface border-b border-border bg-dot-pattern">
         <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16">
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 bg-brand-400 rounded-full"></div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">INOVACIJA</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
                  Logistika bez granica.
               </h2>
               <p className="text-text-muted text-lg font-light">Alati nove generacije koji pretvaraju haotičnu komunikaciju u uređen sistem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Large Card 1: Dispatcher Tool - 3D Glass Stack */}
               <Card className="p-0 overflow-hidden bg-background border-border h-[420px] relative group hover:border-brand-500/30 perspective-1000">
                  {/* Content Container - Fixed to Top-Left with better spacing */}
                  <div className="absolute top-8 left-8 z-20 pointer-events-none max-w-[240px]">
                     <h3 className="text-xl font-bold text-text-main mb-2">Komandni centar za dispečere</h3>
                     <p className="text-text-muted text-sm leading-relaxed">Zamenite Excel tabele i Viber grupe jednim inteligentnim interfejsom.</p>
                     <div className="mt-6 pointer-events-auto">
                        <Link to="/login">
                           <Button size="sm" variant="outline" className="uppercase text-[10px] tracking-widest group-hover:bg-brand-500 group-hover:text-black group-hover:border-brand-500 transition-all">Isprobaj Demo ↗</Button>
                        </Link>
                     </div>
                  </div>
                  
                  {/* 3D Visual - Better positioned to avoid text overlap */}
                  <div className="absolute top-[40%] -right-8 w-[75%] md:w-[65%] h-[55%] transform-style-3d rotate-y-[-12deg] rotate-x-[5deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-all duration-700 ease-out z-10">
                     {/* Card 1 */}
                     <div className="absolute top-0 w-full bg-surface border border-border rounded-tl-xl shadow-2xl p-4 flex gap-3 opacity-100 z-30 translate-x-4">
                        <div className="w-8 h-8 rounded bg-brand-500/10 flex items-center justify-center text-brand-500"><Truck className="h-4 w-4"/></div>
                        <div className="flex-1">
                           <div className="h-2 w-24 bg-text-main/10 rounded mb-2"></div>
                           <div className="h-2 w-16 bg-text-main/5 rounded"></div>
                        </div>
                        <div className="px-2 py-0.5 bg-brand-500 text-black text-[10px] font-bold rounded h-fit">MATCH</div>
                     </div>
                     {/* Card 2 */}
                     <div className="absolute top-20 w-full bg-surface/80 border border-border rounded-tl-xl shadow-xl p-4 flex gap-3 opacity-80 z-20 scale-95 -translate-x-2">
                         <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500"><Package className="h-4 w-4"/></div>
                        <div className="flex-1">
                           <div className="h-2 w-24 bg-text-main/10 rounded mb-2"></div>
                           <div className="h-2 w-16 bg-text-main/5 rounded"></div>
                        </div>
                     </div>
                     {/* Card 3 */}
                      <div className="absolute top-40 w-full bg-surface/60 border border-border rounded-tl-xl shadow-lg p-4 flex gap-3 opacity-60 z-10 scale-90 -translate-x-8">
                         <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-500"><Bell className="h-4 w-4"/></div>
                        <div className="flex-1">
                           <div className="h-2 w-24 bg-text-main/10 rounded mb-2"></div>
                           <div className="h-2 w-16 bg-text-main/5 rounded"></div>
                        </div>
                     </div>
                  </div>
               </Card>

               {/* Large Card 2: Smart Matching Engine */}
               <Card className="p-0 overflow-hidden bg-background border-border h-[420px] relative group hover:border-brand-500/30">
                  {/* Text Container - Fixed positioning */}
                  <div className="absolute top-0 left-0 w-full p-8 z-20 pointer-events-none">
                     <h3 className="text-xl font-bold text-text-main mb-2">Pametno povezivanje</h3>
                     <p className="text-text-muted text-sm leading-relaxed max-w-[280px]">Naš algoritam automatski pronalazi savršeno poklapanje između tereta i vozila.</p>
                     <div className="flex gap-2 mt-6 pointer-events-auto">
                        <Button size="sm" variant="outline" className="uppercase text-[10px] tracking-widest">Kako funkcioniše ↗</Button>
                     </div>
                  </div>
                  
                  {/* Matching Animation - Positioned in bottom area */}
                  <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-center justify-center z-10 p-6">
                     <div className="relative w-full max-w-md">
                        
                        {/* Success Notification */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                           <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg px-4 py-2 backdrop-blur-sm">
                              <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider text-center">
                                 NOVO POKLAPANJE
                              </div>
                           </div>
                        </div>
                        
                        {/* Clean Matching Flow */}
                        <div className="space-y-6">
                           
                           {/* Match Example 1 */}
                           <div className="flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-brand-500" />
                                 </div>
                                 <div>
                                    <div className="text-xs font-bold text-brand-500">DOSTUPAN</div>
                                    <div className="text-[10px] text-text-muted">Cerada 24t</div>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-px bg-brand-500/50"></div>
                                 <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500 flex items-center justify-center">
                                    <Zap className="h-3 w-3 text-brand-500" />
                                 </div>
                                 <div className="w-8 h-px bg-brand-500/50"></div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                 <div>
                                    <div className="text-xs font-bold text-brand-500 text-right">POKLAPANJE</div>
                                    <div className="text-[10px] text-text-muted text-right">Beograd → Berlin</div>
                                 </div>
                                 <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-brand-500" />
                                 </div>
                              </div>
                           </div>

                           {/* Match Example 2 */}
                           <div className="flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-text-muted" />
                                 </div>
                                 <div>
                                    <div className="text-xs font-bold text-text-muted">ZAUZET</div>
                                    <div className="text-[10px] text-text-muted">Hladnjača 18t</div>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-px bg-border"></div>
                                 <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                                 </div>
                                 <div className="w-8 h-px bg-border"></div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                 <div>
                                    <div className="text-xs font-bold text-text-muted text-right">ČEKA</div>
                                    <div className="text-[10px] text-text-muted text-right">Zagreb → Milano</div>
                                 </div>
                                 <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center">
                                    <Package className="h-5 w-5 text-text-muted" />
                                 </div>
                              </div>
                           </div>

                           {/* Match Example 3 */}
                           <div className="flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-brand-500" />
                                 </div>
                                 <div>
                                    <div className="text-xs font-bold text-brand-500">DOSTUPAN</div>
                                    <div className="text-[10px] text-text-muted">Mega 25t</div>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-px bg-brand-500/50"></div>
                                 <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500 flex items-center justify-center">
                                    <Zap className="h-3 w-3 text-brand-500" />
                                 </div>
                                 <div className="w-8 h-px bg-brand-500/50"></div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                 <div>
                                    <div className="text-xs font-bold text-brand-500 text-right">POKLAPANJE</div>
                                    <div className="text-[10px] text-text-muted text-right">Niš → Budimpešta</div>
                                 </div>
                                 <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-brand-500" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Bottom Stats Panel */}
                  <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                     <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="grid grid-cols-3 gap-4 text-center">
                           <div>
                              <div className="text-xl font-bold text-brand-500 font-mono">98.5%</div>
                              <div className="text-[9px] text-text-muted uppercase tracking-wider">Uspešnost</div>
                           </div>
                           <div>
                              <div className="text-xl font-bold text-text-main font-mono">2.3s</div>
                              <div className="text-[9px] text-text-muted uppercase tracking-wider">Prosečno vreme</div>
                           </div>
                           <div>
                              <div className="text-xl font-bold text-text-main font-mono">24/7</div>
                              <div className="text-[9px] text-text-muted uppercase tracking-wider">Aktivno</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
               
               {/* Small Card 3: Smart Filters (Tag Cloud) */}
               <Card className="p-6 bg-background border-border min-h-[300px] flex flex-col justify-between hover:border-brand-500/30 transition-colors group">
                  <div className="bg-surface border border-border rounded-lg p-6 h-36 mb-6 relative overflow-hidden flex flex-col items-center justify-center gap-2">
                     {/* Search Input Mock */}
                     <div className="w-full h-8 bg-surfaceHighlight rounded border border-border mb-2 flex items-center px-3 gap-2">
                        <Search className="h-3 w-3 text-text-muted" />
                        <div className="h-2 w-16 bg-text-muted/20 rounded"></div>
                     </div>
                     {/* Tags */}
                     <div className="flex flex-wrap gap-2 justify-center">
                        {[
                           { l: 'SRB -> DE', active: true, delay: '0s' },
                           { l: 'Hladnjača', active: false, delay: '1s' },
                           { l: 'Hitno', active: false, delay: '2s' },
                           { l: '< 24t', active: true, delay: '1.5s' },
                        ].map((tag, i) => (
                           <div 
                              key={i}
                              className={cn(
                                 "px-2 py-1 rounded text-[10px] font-bold border transition-all duration-500",
                                 "animate-pulse",
                                 tag.active 
                                    ? "bg-brand-500/20 border-brand-500/50 text-brand-500" 
                                    : "bg-background border-border text-text-muted"
                              )}
                              style={{ animationDelay: tag.delay, animationDuration: '3s' }}
                           >
                              {tag.l}
                           </div>
                        ))}
                     </div>
                     {/* Cursor - Fixed */}
                     <div className="absolute bottom-4 right-8 z-10">
                        <MousePointer2 className="h-5 w-5 fill-text-main text-background animate-bounce" />
                     </div>
                  </div>
                  <div>
                     <h4 className="text-text-main font-bold mb-1">Napredni Filteri</h4>
                     <p className="text-xs text-text-muted">Fino podešavanje pretrage kao na mikseti.</p>
                  </div>
               </Card>

               {/* Small Card 4: Simple Message Flow - Ultra Clean */}
               <Card className="p-6 bg-background border-border min-h-[300px] flex flex-col justify-between hover:border-brand-500/30 transition-colors group">
                   <div className="bg-surface border border-border rounded-lg h-36 mb-6 relative overflow-hidden flex items-center justify-center">
                     
                     {/* Simple Message Bubbles */}
                     <div className="flex flex-col gap-3 items-center">
                        
                        {/* Message 1 - Incoming */}
                        <div className="flex items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                           <div className="w-6 h-6 rounded-full bg-surfaceHighlight flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                           </div>
                           <div className="bg-surfaceHighlight rounded-lg px-3 py-1.5 max-w-[120px]">
                              <div className="h-1 w-16 bg-text-muted/30 rounded mb-1"></div>
                              <div className="h-1 w-12 bg-text-muted/20 rounded"></div>
                           </div>
                        </div>
                        
                        {/* Message 2 - Outgoing */}
                        <div className="flex items-center gap-2 flex-row-reverse opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                           <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                           </div>
                           <div className="bg-brand-500/10 rounded-lg px-3 py-1.5 max-w-[120px]">
                              <div className="h-1 w-14 bg-brand-500/30 rounded mb-1"></div>
                              <div className="h-1 w-10 bg-brand-500/20 rounded"></div>
                           </div>
                        </div>
                        
                        {/* Message 3 - Incoming */}
                        <div className="flex items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                           <div className="w-6 h-6 rounded-full bg-surfaceHighlight flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                           </div>
                           <div className="bg-surfaceHighlight rounded-lg px-3 py-1.5 max-w-[120px]">
                              <div className="h-1 w-18 bg-text-muted/30 rounded mb-1"></div>
                              <div className="h-1 w-8 bg-text-muted/20 rounded"></div>
                           </div>
                        </div>
                     </div>
                     
                     {/* Simple typing indicator */}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                        <div className="flex gap-1">
                           <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse"></div>
                           <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                           <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                     </div>
                  </div>
                  <div>
                     <h4 className="text-text-main font-bold mb-1">Direktna komunikacija</h4>
                     <p className="text-xs text-text-muted">Razgovarajte direktno bez posrednika.</p>
                  </div>
               </Card>

               {/* Small Card 5: Verification (Laser Scan) */}
               <Card className="p-6 bg-background border-border min-h-[300px] flex flex-col justify-between hover:border-brand-500/30 transition-colors group">
                   <div className="bg-surface border border-border rounded-lg p-4 h-36 mb-6 relative flex flex-col items-center justify-center gap-3 overflow-hidden">
                      <div className="w-16 h-20 bg-background border border-border rounded shadow-sm flex flex-col items-center p-2 relative z-10">
                         <div className="w-8 h-8 rounded-full bg-surfaceHighlight mb-2"></div>
                         <div className="w-10 h-1 bg-surfaceHighlight rounded mb-1"></div>
                         <div className="w-8 h-1 bg-surfaceHighlight rounded"></div>
                         
                         {/* Laser Line */}
                         <div className="absolute left-0 w-full h-0.5 bg-brand-500 shadow-[0_0_10px_#4ade80] animate-scan opacity-80 z-20"></div>
                      </div>
                      
                      <Badge variant="success" className="bg-brand-500/10 text-brand-500 border-brand-500/20 z-10">VERIFIKOVANO</Badge>
                      
                      {/* Grid Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none"></div>
                  </div>
                  <div>
                     <h4 className="text-text-main font-bold mb-1">Sigurnost</h4>
                     <p className="text-xs text-text-muted">Biometrijska i dokumentaciona provera.</p>
                  </div>
               </Card>
            </div>
         </div>
      </section>

      {/* Interactive Section (Automation) */}
      <section className="py-32 bg-background border-b border-border relative overflow-hidden">
         <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 bg-brand-400 rounded-full"></div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AUTOMATIZACIJA</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6 leading-tight">
                  <span className="text-gradient-green">Ubrzajte poslovanje.</span><br/>
                  Sistem radi za vas.
               </h2>
               
               <div className="space-y-6 mt-12">
                  {features.map((item, i) => (
                     <div 
                       key={i} 
                       onClick={() => setActiveFeature(i)}
                       className={cn(
                         "group cursor-pointer p-4 rounded-lg transition-all duration-300 border border-transparent",
                         activeFeature === i ? "bg-surface border-border" : "hover:bg-surface hover:border-border"
                       )}
                     >
                        <h4 className={cn(
                          "text-lg font-bold transition-colors mb-2 flex items-center gap-3",
                          activeFeature === i ? "text-text-main" : "text-text-muted group-hover:text-text-main"
                        )}>
                           <item.icon className={cn("h-5 w-5", activeFeature === i ? "text-brand-500" : "text-text-muted")} />
                           {item.title} 
                           {activeFeature === i && <ArrowRight className="h-4 w-4 text-brand-500 animate-pulse ml-auto" />}
                        </h4>
                        <p className={cn(
                          "text-sm transition-colors max-w-md ml-8",
                          activeFeature === i ? "text-text-main" : "text-text-muted"
                        )}>{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-brand-500/5 blur-[100px] rounded-full"></div>
               <div className="relative bg-surface border border-border rounded-xl overflow-hidden h-[500px] shadow-2xl flex flex-col transition-all duration-500">
                  
                  {/* Dynamic Header */}
                  <div className="p-6 border-b border-border bg-surfaceHighlight/30 flex justify-between items-center">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                     </div>
                     <div className="text-[10px] font-mono text-text-muted uppercase">
                       {activeFeature === 0 ? 'SYSTEM.NOTIFICATIONS' : activeFeature === 1 ? 'SYSTEM.MATCHING' : 'SYSTEM.ANALYTICS'}
                     </div>
                  </div>
                  
                  <div className="flex-1 p-8 relative flex items-center justify-center">
                     
                     {/* Visual 0: Notifications */}
                     {activeFeature === 0 && (
                        <div className="w-full max-w-sm space-y-3 animate-slide-up">
                           {/* Notification 1 - New Load Match */}
                           <div className="bg-surface border border-border rounded-lg p-4 hover:border-brand-500/20 transition-all cursor-pointer group">
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/15 transition-colors">
                                    <Bell className="h-4 w-4 text-brand-500" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                       <span className="text-xs font-bold text-text-main">Novo poklapanje</span>
                                       <span className="text-[10px] text-text-muted">pre 2 min</span>
                                    </div>
                                    <p className="text-sm text-text-main mb-1">Beograd → Beč</p>
                                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                       <span>Cerada</span>
                                       <span>•</span>
                                       <span>24t</span>
                                       <span>•</span>
                                       <span className="text-text-main font-medium">1,200 €</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           {/* Notification 2 - Price Alert */}
                           <div className="bg-surface border border-border rounded-lg p-4 hover:border-brand-500/20 transition-all cursor-pointer group">
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/15 transition-colors">
                                    <TrendingUp className="h-4 w-4 text-brand-500" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                       <span className="text-xs font-bold text-text-main">Promena cene</span>
                                       <span className="text-[10px] text-text-muted">pre 15 min</span>
                                    </div>
                                    <p className="text-sm text-text-main mb-1">Zagreb → Milano</p>
                                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                       <span>Hladnjača</span>
                                       <span>•</span>
                                       <span className="text-brand-500 font-medium">+150 €</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           {/* Loading notification */}
                           <div className="bg-surface border border-border rounded-lg p-4 opacity-40">
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-surfaceHighlight animate-pulse flex-shrink-0"></div>
                                 <div className="flex-1 space-y-2">
                                    <div className="h-2 w-24 bg-surfaceHighlight rounded animate-pulse"></div>
                                    <div className="h-2 w-32 bg-surfaceHighlight rounded animate-pulse"></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Visual 1: Fast Matching Connection */}
                     {activeFeature === 1 && (
                        <div className="relative w-full h-full flex items-center justify-center">
                           
                           {/* Simple Horizontal Layout */}
                           <div className="flex items-center justify-between w-full max-w-md px-4">
                              
                              {/* Left: Truck */}
                              <div className="flex flex-col items-center animate-fade-in">
                                 <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mb-2">
                                    <Truck className="h-8 w-8 text-brand-500" />
                                 </div>
                                 <div className="text-center">
                                    <div className="text-xs font-bold text-text-main">TransLogistic</div>
                                    <div className="text-[9px] text-text-muted uppercase tracking-wider">Prevoznik</div>
                                 </div>
                              </div>
                              
                              {/* Center: Connection */}
                              <div className="flex-1 flex items-center justify-center mx-6">
                                 <div className="relative w-full">
                                    {/* Connection Line */}
                                    <div className="h-px bg-brand-500/50 w-full"></div>
                                    
                                    {/* Center Icon */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                       <div className="w-10 h-10 rounded-lg bg-surface border border-brand-500/30 flex items-center justify-center">
                                          <Zap className="h-5 w-5 text-brand-500" />
                                       </div>
                                    </div>
                                    
                                    {/* Animated Dot */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-500 rounded-full">
                                       <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping"></div>
                                    </div>
                                 </div>
                              </div>
                              
                              {/* Right: Package */}
                              <div className="flex flex-col items-center animate-fade-in">
                                 <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mb-2">
                                    <Package className="h-8 w-8 text-brand-500" />
                                 </div>
                                 <div className="text-center">
                                    <div className="text-xs font-bold text-text-main">MegaTrade</div>
                                    <div className="text-[9px] text-text-muted uppercase tracking-wider">Pošiljalac</div>
                                 </div>
                              </div>
                           </div>
                           
                           {/* Success Badge */}
                           <div className="absolute top-8 left-1/2 -translate-x-1/2">
                              <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg px-3 py-1.5">
                                 <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">
                                    ✓ Podudaranje (98%)
                                 </div>
                              </div>
                           </div>
                           
                           {/* Route Info */}
                           <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                              <div className="text-center">
                                 <div className="text-xs text-text-main font-medium">Beograd → Berlin</div>
                                 <div className="text-[10px] text-text-muted">24t • Cerada</div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Visual 2: Advanced Analytics & Market Intelligence */}
                     {activeFeature === 2 && (
                        <div className="w-full h-full p-6 animate-fade-in relative overflow-hidden">
                           {/* Background Grid */}
                           <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                           
                           {/* Price Chart Area */}
                           <div className="relative h-48 mb-4">
                              {/* Chart Background */}
                              <div className="absolute inset-0 bg-surface/30 rounded-lg border border-border"></div>
                              
                              {/* Y-Axis Labels */}
                              <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4 text-[8px] text-text-muted font-mono">
                                 <span>€2000</span>
                                 <span>€1500</span>
                                 <span>€1000</span>
                                 <span>€500</span>
                              </div>
                              
                              {/* Animated Price Line */}
                              <svg className="absolute inset-0 w-full h-full p-4 pl-8" viewBox="0 0 300 150">
                                 {/* Grid Lines */}
                                 <defs>
                                    <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                       <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0.3"/>
                                       <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0.05"/>
                                    </linearGradient>
                                 </defs>
                                 
                                 {/* Horizontal Grid */}
                                 {[37.5, 75, 112.5].map((y, i) => (
                                    <line key={i} x1="0" y1={y} x2="300" y2={y} stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
                                 ))}
                                 
                                 {/* Price Area Fill */}
                                 <path 
                                    d="M 20 120 L 50 100 L 80 85 L 110 95 L 140 70 L 170 60 L 200 45 L 230 40 L 260 35 L 280 30 L 280 150 L 20 150 Z" 
                                    fill="url(#priceGradient)" 
                                    className="opacity-0 animate-fade-in" 
                                    style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                                 />
                                 
                                 {/* Price Line */}
                                 <path 
                                    d="M 20 120 L 50 100 L 80 85 L 110 95 L 140 70 L 170 60 L 200 45 L 230 40 L 260 35 L 280 30" 
                                    fill="none" 
                                    stroke="rgb(74, 222, 128)" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                    className="opacity-0 animate-fade-in"
                                    style={{ 
                                       animationDelay: '0.5s', 
                                       animationFillMode: 'forwards',
                                       strokeDasharray: '400',
                                       strokeDashoffset: '400',
                                       animation: 'fadeIn 0.8s ease-out 0.5s forwards, drawLine 1.5s ease-out 0.7s forwards'
                                    }}
                                 />
                                 
                                 {/* Data Points - Clean and Elegant */}
                                 {[
                                    {x: 50, y: 100, price: '€1,200'},
                                    {x: 110, y: 95, price: '€1,250'},
                                    {x: 170, y: 60, price: '€1,450'},
                                    {x: 230, y: 40, price: '€1,650'},
                                    {x: 280, y: 30, price: '€1,750'}
                                 ].map((point, i) => (
                                    <g key={i} className="opacity-0 animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.05}s`, animationFillMode: 'forwards' }}>
                                       {/* Elegant static glow */}
                                       <defs>
                                          <radialGradient id={`glow-${i}`} cx="50%" cy="50%" r="50%">
                                             <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0.3"/>
                                             <stop offset="70%" stopColor="rgb(74, 222, 128)" stopOpacity="0.1"/>
                                             <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0"/>
                                          </radialGradient>
                                       </defs>
                                       
                                       {/* Subtle breathing glow - very gentle */}
                                       <circle cx={point.x} cy={point.y} r="6" fill={`url(#glow-${i})`} className="animate-pulse" style={{ animationDuration: '4s', animationDelay: `${i * 0.5}s` }}/>
                                       
                                       {/* Main dot - no movement to prevent misalignment */}
                                       <circle cx={point.x} cy={point.y} r="3" fill="rgb(74, 222, 128)" stroke="var(--background)" strokeWidth="1.5"/>
                                       <circle cx={point.x} cy={point.y} r="1.5" fill="white" opacity="0.9"/>
                                       
                                       {/* Price tooltip on hover */}
                                       <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <rect x={point.x - 15} y={point.y - 25} width="30" height="16" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5"/>
                                          <text x={point.x} y={point.y - 16} textAnchor="middle" fontSize="8" fill="var(--text-main)" fontFamily="monospace">{point.price}</text>
                                       </g>
                                    </g>
                                 ))}
                                 
                                 {/* Single elegant data flow particle */}
                                 <g className="opacity-40">
                                    <circle r="1.2" fill="rgb(74, 222, 128)" opacity="0.8">
                                       <animateMotion dur="12s" repeatCount="indefinite" path="M 20 120 L 50 100 L 80 85 L 110 95 L 140 70 L 170 60 L 200 45 L 230 40 L 260 35 L 280 30"/>
                                    </circle>
                                 </g>
                              </svg>
                              
                              {/* Clean Trend Indicator */}
                              <div className="absolute top-4 right-4 bg-brand-500/10 border border-brand-500/30 rounded-lg px-3 py-1 opacity-0 animate-fade-in hover:bg-brand-500/15 transition-all duration-300" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                                 <div className="flex items-center gap-2 text-[10px] font-bold text-brand-500">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
                                    ↗ +24% ovaj mesec
                                 </div>
                              </div>
                           </div>
                           
                           {/* Clean Statistics Cards */}
                           <div className="grid grid-cols-3 gap-3">
                              {[
                                 { label: 'Prosečna Cena', value: '€1,420', change: '+12%', delay: '1s' },
                                 { label: 'Broj Tura', value: '2,847', change: '+8%', delay: '1.1s' },
                                 { label: 'Tržišni Udeo', value: '18.5%', change: '+3%', delay: '1.2s' }
                              ].map((stat, i) => (
                                 <div key={i} className="bg-surface/50 border border-border rounded-lg p-3 opacity-0 animate-fade-in relative overflow-hidden group hover:bg-surface/70 transition-all duration-300" style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}>
                                    <div className="text-[8px] text-text-muted uppercase tracking-wider mb-1">{stat.label}</div>
                                    <div className="text-sm font-bold text-text-main font-mono">{stat.value}</div>
                                    <div className="text-[9px] text-brand-500 font-bold">{stat.change}</div>
                                    
                                    {/* Subtle glow on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Minimal activity indicator */}
                                    <div className="absolute top-2 right-2 w-1 h-1 bg-brand-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: `${2 + i * 0.5}s`, animationDuration: '4s' }}></div>
                                 </div>
                              ))}
                           </div>
                           
                           {/* Clean Route Analysis */}
                           <div className="mt-4 bg-surface/30 border border-border rounded-lg p-3 opacity-0 animate-fade-in relative overflow-hidden group hover:bg-surface/40 transition-all duration-300" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
                              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                                 <span>Najprofitabilnije Rute</span>
                                 <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
                              </div>
                              <div className="space-y-1">
                                 {[
                                    { route: 'Beograd → Berlin', profit: '€1,750', bar: '85%', color: 'bg-brand-500' },
                                    { route: 'Zagreb → Milano', profit: '€1,420', bar: '65%', color: 'bg-brand-400' },
                                    { route: 'Niš → Budimpešta', profit: '€1,180', bar: '45%', color: 'bg-brand-300' }
                                 ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-[8px] group/route hover:bg-surface/20 rounded px-1 py-0.5 transition-all duration-200">
                                       <span className="text-text-main font-medium">{item.route}</span>
                                       <div className="flex items-center gap-2">
                                          <div className="w-12 h-1 bg-surfaceHighlight rounded-full overflow-hidden relative">
                                             {/* Clean animated progress bar */}
                                             <div className={`h-full ${item.color} rounded-full transition-all duration-1000 relative`} style={{ width: item.bar, animationDelay: `${1.5 + i * 0.1}s` }}>
                                                {/* Subtle shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" style={{ animationDelay: `${3 + i * 0.8}s`, animationDuration: '3s' }}></div>
                                             </div>
                                          </div>
                                          <span className="text-brand-500 font-bold font-mono">{item.profit}</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="p-6 bg-surfaceHighlight/20 border-t border-border font-mono text-xs">
                     {activeFeature === 0 && <div className="text-text-muted">&gt; Poslato 3 email-a i 2 SMS poruke.</div>}
                     {activeFeature === 1 && (
                        <>
                           <div className="text-brand-500 mb-2">✓ Podudaranje Pronađeno (98%)</div>
                           <div className="text-text-muted">Povezivanje prevoznika <span className="text-text-main">TransLogistic</span> sa pošiljaocem <span className="text-text-main">MegaTrade</span>...</div>
                        </>
                     )}
                     {activeFeature === 2 && <div className="text-text-muted">&gt; Rast profita od 24% u odnosu na prošli mesec.</div>}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* New Section: Mobile App (Shipper Focus) */}
      <section className="py-32 bg-surface border-b border-border overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-20 items-center">
           <div className="order-2 md:order-1 relative z-10 flex justify-center">
              {/* Creative Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)] -z-20"></div>
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand-500/20 via-blue-500/10 to-purple-500/10 rounded-full blur-[80px] -z-10 animate-pulse-slow"></div>
              
              {/* Floating 3D Boxes (Cargo Visuals) */}
              <div className="absolute -top-10 -left-10 animate-float">
                  <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-80">
                      <path d="M50 20 L80 35 L80 70 L50 85 L20 70 L20 35 Z" fill="none" stroke="var(--brand-500)" strokeWidth="1" className="drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]"/>
                      <path d="M20 35 L50 50 L80 35" fill="none" stroke="var(--brand-500)" strokeWidth="1" />
                      <path d="M50 50 L50 85" fill="none" stroke="var(--brand-500)" strokeWidth="1" />
                  </svg>
              </div>
              <div className="absolute bottom-20 -right-5 animate-float-slow" style={{ animationDelay: '1s' }}>
                  <svg width="80" height="80" viewBox="0 0 100 100" className="opacity-60">
                      <path d="M50 20 L80 35 L80 70 L50 85 L20 70 L20 35 Z" fill="none" stroke="var(--text-muted)" strokeWidth="1"/>
                      <path d="M20 35 L50 50 L80 35" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
                      <path d="M50 50 L50 85" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
                  </svg>
              </div>

              {/* Premium Phone Mockup */}
              <div className="group relative w-[320px] h-[640px] bg-zinc-950 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-[6px] border-zinc-900 ring-1 ring-white/20 flex flex-col overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-all duration-700 ease-out z-10">
                 {/* Gloss Reflection Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-50 rounded-[2.2rem] opacity-30"></div>
                 
                 {/* Side Buttons */}
                 <div className="absolute top-24 -right-2.5 w-1 h-10 bg-zinc-800 rounded-r-md shadow-sm border-l border-black/50"></div>
                 <div className="absolute top-40 -left-2.5 w-1 h-16 bg-zinc-800 rounded-l-md shadow-sm border-r border-black/50"></div>
                 <div className="absolute top-60 -left-2.5 w-1 h-16 bg-zinc-800 rounded-l-md shadow-sm border-r border-black/50"></div>

                 {/* Notch (iPhone 13 Style) */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-3 shadow-sm border-b border-x border-zinc-900">
                    <div className="w-12 h-1 rounded-full bg-zinc-800/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800 relative">
                       <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-blue-900/40 rounded-full"></div>
                    </div>
                 </div>
                 
                 <div className="rounded-[2.1rem] overflow-hidden w-full h-full bg-surface dark:bg-[#0c0c0e] relative flex flex-col select-none">
                    
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 w-full h-10 px-6 pt-3 flex justify-between items-start text-[10px] font-medium text-text-muted z-40 mix-blend-difference">
                       <span className="pl-1">9:41</span>
                       <div className="flex gap-1.5 items-center pr-1">
                          <Wifi className="w-3 h-3" />
                          <Battery className="w-3 h-3" />
                       </div>
                    </div>

                    {/* App Header with Profile - Pushed down to clear notch */}
                    <div className="mt-0 h-28 bg-gradient-to-b from-surface/80 to-surface/40 backdrop-blur-xl border-b border-border flex items-end pb-4 justify-between px-5 z-30 pt-12">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 p-[1px]">
                             <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                <User className="w-5 h-5 text-brand-500" />
                             </div>
                          </div>
                          <div>
                             <span className="block font-bold text-text-main text-sm">Marko P.</span>
                             <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                                <span className="text-[10px] text-brand-500 font-bold uppercase tracking-wider">PREMIUM NALOG</span>
                             </div>
                          </div>
                       </div>
                       <div className="relative p-2.5 bg-surfaceHighlight rounded-full border border-border text-text-muted hover:text-text-main transition-colors">
                          <Bell className="w-4 h-4" />
                          <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-background"></div>
                       </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 space-y-3 flex-1 overflow-hidden relative">
                       <div className="flex justify-between items-center mb-2">
                           <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Moje Objave</h3>
                           <div className="bg-brand-500 text-black text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer shadow-glow">+ OBJAVI</div>
                       </div>
                       
                       {[
                          { 
                             route: 'Beograd -> Berlin', 
                             type: 'Palete', 
                             price: '1,400 €', 
                             status: 'TRAŽI VOZILO',
                             badgeClass: 'bg-brand-500/10 text-brand-500 border-brand-500/20', 
                             time: '1h',
                             isLoad: true 
                          },
                          { 
                             route: 'Zagreb -> Beč', 
                             type: 'Hladnjača', 
                             price: 'Slobodan', 
                             status: 'SLOBODAN', 
                             badgeClass: 'bg-brand-500/10 text-brand-500 border-brand-500/20', 
                             time: '3h',
                             isLoad: false 
                          },
                          { 
                             route: 'Niš -> Sofija', 
                             type: 'Rinfuz', 
                             price: '450 €', 
                             status: 'U TOKU',
                             badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
                             time: '5h',
                             isLoad: true 
                          },
                          { 
                             route: 'Kragujevac -> Bar', 
                             type: 'Kontejner', 
                             price: '800 €', 
                             status: 'TRAŽI VOZILO',
                             badgeClass: 'bg-brand-500/10 text-brand-500 border-brand-500/20', 
                             time: '1d',
                             isLoad: true 
                          },
                       ].map((item, i) => (
                          <div key={i} className="group/item p-3 bg-surfaceHighlight/50 backdrop-blur-sm rounded-xl border border-border flex gap-3 hover:bg-surfaceHighlight transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm">
                             {/* Dynamic Icon based on Type */}
                             <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                                item.isLoad 
                                   ? "bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover/item:bg-blue-500 group-hover/item:text-white"
                                   : "bg-brand-500/10 text-brand-500 border-brand-500/20 group-hover/item:bg-brand-500 group-hover/item:text-black"
                             )}>
                                {item.isLoad ? <Box className="h-5 w-5"/> : <Truck className="h-5 w-5"/>}
                             </div>
                             
                             <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                                <div className="flex justify-between items-start">
                                   <div className="text-xs font-bold text-text-main truncate tracking-tight">{item.route}</div>
                                   <div className="text-xs font-mono font-bold text-text-main whitespace-nowrap ml-2">{item.price}</div>
                                </div>
                                
                                <div className="flex justify-between items-end mt-1">
                                   <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
                                      <span className="bg-surface border border-border px-1.5 rounded">{item.type}</span>
                                      <span className="opacity-75">• {item.time}</span>
                                   </div>
                                   <span className={cn("text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border", item.badgeClass)}>{item.status}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Navigation Bar - Fixed Alignment */}
                    <div className="h-[72px] bg-surface/90 backdrop-blur-xl border-t border-border/50 absolute bottom-0 w-full z-20 px-2 pb-4 pt-2">
                       <div className="grid grid-cols-5 h-full items-center">
                          {/* Home */}
                          <div className="flex flex-col items-center gap-1 text-brand-500 cursor-pointer hover:scale-110 transition-transform">
                             <Home className="w-5 h-5 stroke-[2.5]" />
                             <span className="text-[8px] font-bold">Početna</span>
                          </div>
                          {/* Search */}
                          <div className="flex flex-col items-center gap-1 text-text-muted hover:text-text-main cursor-pointer transition-colors">
                             <Search className="w-5 h-5" />
                             <span className="text-[8px] font-medium">Pretraga</span>
                          </div>
                          {/* Floating Plus Button Container - Centered */}
                          <div className="relative flex justify-center -top-6">
                             <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(34,197,94,0.4)] border-[4px] border-surface dark:border-[#0c0c0e] text-black cursor-pointer hover:scale-110 transition-transform active:scale-95">
                                <Plus className="w-7 h-7 stroke-[3]" />
                             </div>
                          </div>
                          {/* Loads */}
                          <div className="flex flex-col items-center gap-1 text-text-muted hover:text-text-main cursor-pointer transition-colors">
                             <Package className="w-5 h-5" />
                             <span className="text-[8px] font-medium">Ture</span>
                          </div>
                          {/* Profile */}
                          <div className="flex flex-col items-center gap-1 text-text-muted hover:text-text-main cursor-pointer transition-colors">
                             <User className="w-5 h-5" />
                             <span className="text-[8px] font-medium">Profil</span>
                          </div>
                       </div>
                    </div>

                    {/* Scanning Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_20px_#4ade80] animate-scan-vertical opacity-50 pointer-events-none z-30"></div>
                 </div>
              </div>
           </div>
           
           <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 mb-6">
                 <Smartphone className="h-5 w-5 text-brand-500" />
                 <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">UVEK UZ VAS</span>
              </div>
              <h2 className="text-4xl font-bold text-text-main mb-6">
                 Kancelarija u vašem džepu.
              </h2>
              <p className="text-lg text-text-muted leading-relaxed mb-8">
                 Bilo da ste u kancelariji ili na putu, Nalozi za utovar su uvek sa vama. 
                 Naša platforma je u potpunosti optimizovana za sve mobilne uređaje, 
                 omogućavajući vam da ugovorite transport u hodu.
                 <br/><br/>
                 <span className="text-text-main font-semibold">Savršeno za firme koje šalju robu:</span> objavite turu direktno sa telefona i pratite ponude u realnom vremenu.
              </p>
              <ul className="space-y-3">
                 {[
                    'Pristup sa bilo kog uređaja',
                    'Instant notifikacije na telefonu',
                    'Brza pretraga tura u pokretu'
                 ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-main">
                       <div className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 text-xs">✓</div>
                       {item}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* New Section: How It Works */}
      <section className="py-24 border-b border-border bg-surface/20">
        <div className="mx-auto max-w-7xl px-6 text-center">
           <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-brand-500"></span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">PROCES</span>
              <span className="h-px w-8 bg-brand-500"></span>
           </div>
           <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-16">Kako funkcioniše platforma?</h2>
           
           <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent border-t border-dashed border-text-muted opacity-30"></div>

             {[
               { title: '1. Registracija', desc: 'Kreirajte besplatan nalog i verifikujte vašu firmu u nekoliko koraka.', icon: Users },
               { title: '2. Pretraga', desc: 'Koristite pametne filtere da pronađete odgovarajući teret ili kamion.', icon: Search },
               { title: '3. Transport', desc: 'Kontaktirajte partnera direktno i dogovorite detalje transporta.', icon: Truck },
             ].map((step, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-2xl bg-surface border border-border shadow-lg flex items-center justify-center mb-6 group hover:border-brand-500 transition-colors duration-300">
                    <step.icon className="h-10 w-10 text-text-muted group-hover:text-brand-500 transition-colors" />
                 </div>
                 <h3 className="text-xl font-bold text-text-main mb-3">{step.title}</h3>
                 <p className="text-text-muted leading-relaxed max-w-xs">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* New Section: FAQ */}
      <section className="py-24 border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-text-main mb-4">Često postavljana pitanja</h2>
             <p className="text-text-muted">Imate pitanja? Mi imamo odgovore.</p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
             {[
               { q: 'Da li je korišćenje platforme besplatno?', a: 'Da, registracija je potpuno besplatna. Nudimo i početni paket koji vam omogućava da isprobate osnovne funkcionalnosti bez ikakvih troškova.' },
               { q: 'Kako vršite verifikaciju firmi?', a: 'Svaki nalog prolazi kroz ručnu proveru PIB-a i matičnog broja kako bismo osigurali da na platformi posluju samo legitimne kompanije.' },
               { q: 'Da li mogu otkazati pretplatu?', a: 'Naravno. Pretplatu možete otkazati ili promeniti u bilo kom trenutku direktno iz vašeg naloga, bez penala.' },
               { q: 'Kako da objavim svoju prvu turu?', a: 'Nakon registracije, kliknite na dugme "Nova Tura" na kontrolnoj tabli. Proces je jednostavan i traje manje od minut.' },
             ].map((item, i) => (
               <Card key={i} className="p-6 hover:border-text-muted/30 transition-colors">
                 <h4 className="font-bold text-text-main mb-3 flex items-start gap-3">
                   <HelpCircle className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                   {item.q}
                 </h4>
                 <p className="text-sm text-text-muted leading-relaxed pl-8">{item.a}</p>
               </Card>
             ))}
           </div>
        </div>
      </section>

      {/* Testimonial Section - Redesigned Grid */}
      <section className="py-32 bg-surface border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
           <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 bg-brand-400 rounded-full"></div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ISKUSTVA KORISNIKA</span>
               </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Reč onih koji nam veruju.</h2>
              <p className="text-text-muted">Pridružite se hiljadama zadovoljnih korisnika.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="p-8 relative bg-background/50 backdrop-blur-sm border-border hover:border-brand-500/30 transition-all duration-300 group hover:-translate-y-1 h-full flex flex-col">
                   {/* Background Quote Icon */}
                   <div className="absolute top-6 right-6 text-surfaceHighlight group-hover:text-brand-500/10 transition-colors">
                      <Quote className="h-12 w-12 opacity-50" />
                   </div>
                   
                   <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                         <Star key={j} className="h-4 w-4 fill-brand-500 text-brand-500" />
                      ))}
                   </div>
                   
                   <div className="flex-1">
                      <p className="text-text-main font-medium italic mb-8 relative z-10 leading-relaxed">"{t.quote}"</p>
                   </div>
                   
                   <div className="mt-auto border-t border-border pt-6 flex items-end justify-between">
                      <div>
                         <div className="font-bold text-text-main text-sm">{t.name}</div>
                         <div className="text-xs text-text-muted">{t.role}</div>
                         <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{t.company}</div>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-1 justify-end text-brand-500">
                            <TrendingUp className="h-3 w-3" />
                         </div>
                         <div className="text-xs font-bold text-brand-500 mt-0.5">{t.metric}</div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      </section>

      {/* New Section: Final CTA */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
         {/* Ambient background glow */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent"></div>
         
         <div className="mx-auto max-w-5xl relative">
            {/* Main CTA Card - Enhanced for light theme */}
            <div className="relative rounded-2xl bg-stone-50 dark:bg-gradient-to-br dark:from-zinc-900/90 dark:to-zinc-950/90 border-2 border-stone-200 dark:border-white/10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-2xl hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-2xl hover:border-brand-500/40 dark:hover:border-brand-500/30 transition-all duration-300 group">
               {/* Light theme gradient background */}
               <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-stone-50 to-green-50/30 dark:opacity-0"></div>
               
               {/* Animated gradient mesh background - only visible in dark mode */}
               <div className="absolute inset-0 opacity-0 dark:opacity-30 group-hover:dark:opacity-40 transition-opacity duration-500">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] animate-float"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-[128px] animate-float" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-600 rounded-full mix-blend-multiply filter blur-[128px] animate-float" style={{ animationDelay: '4s' }}></div>
               </div>
               
               {/* Decorative elements for light theme - Enhanced */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-400/15 via-brand-300/10 to-transparent rounded-full blur-3xl dark:opacity-0 animate-float"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-400/15 via-green-300/10 to-transparent rounded-full blur-3xl dark:opacity-0 animate-float" style={{ animationDelay: '3s' }}></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-brand-100/20 to-transparent dark:opacity-0"></div>
               
               {/* Geometric shapes for light theme */}
               <div className="absolute top-10 left-10 w-32 h-32 border-2 border-brand-200/30 rounded-2xl rotate-12 dark:opacity-0"></div>
               <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-green-200/30 rounded-full dark:opacity-0"></div>
               <div className="absolute top-1/3 right-20 w-16 h-16 bg-brand-100/40 rounded-lg rotate-45 dark:opacity-0"></div>
               <div className="absolute bottom-1/3 left-16 w-20 h-20 bg-green-100/40 rounded-full dark:opacity-0"></div>
               
               {/* Dot pattern overlay - more visible in light */}
               <div className="absolute inset-0 opacity-40 dark:opacity-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
               
               {/* Grid pattern overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"></div>
               
               {/* Content */}
               <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border-2 border-brand-200 dark:border-white/10 mb-6 shadow-sm">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                     </span>
                     <span className="text-[10px] font-bold text-stone-600 dark:text-zinc-300 uppercase tracking-[0.2em]">Pridružite se danas</span>
                  </div>
                  
                  {/* Heading */}
                  <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4 tracking-tight leading-[1.1]">
                     Prestanite da gubite novac na <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-green-600 dark:from-brand-400 dark:via-brand-500 dark:to-green-400">praznim kilometrima</span>.
                  </h2>
                  
                  {/* Subheading */}
                  <p className="text-base md:text-lg text-stone-600 dark:text-zinc-400 mb-3 max-w-2xl mx-auto leading-relaxed">
                     Svaki prazan kamion je izgubljena zarada. Naša platforma povezuje vaše vozače sa teretom u realnom vremenu.
                  </p>
                  
                  {/* Stats row */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs">
                     <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-brand-500"></div>
                        <span><span className="text-stone-900 dark:text-white font-bold">2,400+</span> prevoznika</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-brand-500"></div>
                        <span><span className="text-stone-900 dark:text-white font-bold">15,000+</span> tura</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-brand-500"></div>
                        <span><span className="text-stone-900 dark:text-white font-bold">98.5%</span> uspešnost</span>
                     </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                     <Link to="/register" className="w-full sm:w-auto group/btn">
                       <button className="relative w-full sm:w-auto h-12 px-8 bg-brand-500 hover:bg-brand-600 text-white dark:text-black font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-200 shadow-[0_4px_14px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)] overflow-hidden">
                         <span className="relative z-10 flex items-center justify-center gap-2">
                           Počnite besplatno
                           <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                         </span>
                       </button>
                     </Link>
                     <a href="#" className="w-full sm:w-auto group/btn2">
                       <button className="w-full sm:w-auto h-12 px-8 bg-white dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 border-2 border-stone-200 dark:border-white/10 text-stone-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-200">
                         <span className="flex items-center justify-center gap-2">
                           Kontaktirajte nas
                           <ArrowRight className="h-3.5 w-3.5 group-hover/btn2:translate-x-1 transition-transform duration-200" />
                         </span>
                       </button>
                     </a>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm">
                        <Check className="h-3 w-3 text-brand-500" strokeWidth={3} />
                        <span className="text-[10px] font-medium text-stone-700 dark:text-zinc-300 uppercase tracking-wider">Bez posrednika</span>
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm">
                        <Check className="h-3 w-3 text-brand-500" strokeWidth={3} />
                        <span className="text-[10px] font-medium text-stone-700 dark:text-zinc-300 uppercase tracking-wider">Instant notifikacije</span>
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm">
                        <Check className="h-3 w-3 text-brand-500" strokeWidth={3} />
                        <span className="text-[10px] font-medium text-stone-700 dark:text-zinc-300 uppercase tracking-wider">Verifikovani partneri</span>
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm">
                        <Check className="h-3 w-3 text-brand-500" strokeWidth={3} />
                        <span className="text-[10px] font-medium text-stone-700 dark:text-zinc-300 uppercase tracking-wider">24/7 podrška</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};
