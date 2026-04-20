import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SupabaseService } from '../../services/supabaseService';
import { UserRole, UserStatus, User, Load, Truck } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Check, X, AlertCircle, Trash2, Users, TrendingUp, Clock, ShieldCheck, Star, Package, Truck as TruckIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Stats {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
  freeUsers: number;
  standardUsers: number;
  proUsers: number;
  totalLoads: number;
  totalTrucks: number;
  recentLoads: number;
  recentTrucks: number;
}

export const AdminPanel = () => {
  const { profile, isAdmin } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'listings' | 'stats'>('pending');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);
  const [adminLoads, setAdminLoads] = useState<Load[]>([]);
  const [adminTrucks, setAdminTrucks] = useState<Truck[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'normal'>('all');

  const fetchAdminListings = async () => {
    try {
      setListingsLoading(true);
      const [loads, trucks] = await Promise.all([
        SupabaseService.getLoads(),
        SupabaseService.getTrucks(),
      ]);
      setAdminLoads(loads);
      setAdminTrucks(trucks);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      setError(error.message);
    } finally {
      setListingsLoading(false);
    }
  };

  const handleToggleFeatured = async (itemType: 'load' | 'truck', itemId: string, currentValue: boolean) => {
    try {
      if (itemType === 'load') {
        await SupabaseService.setLoadFeatured(itemId, !currentValue);
        setAdminLoads(prev => prev.map(l => l.id === itemId ? { ...l, isFeatured: !currentValue } : l));
      } else {
        await SupabaseService.setTruckFeatured(itemId, !currentValue);
        setAdminTrucks(prev => prev.map(t => t.id === itemId ? { ...t, isFeatured: !currentValue } : t));
      }
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingUsers();
      fetchAllUsers();
    }
  }, [isAdmin]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const users = await SupabaseService.getPendingUsers();
      setPendingUsers(users);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await SupabaseService.getAllUsers();
      setAllUsers(users);
    } catch (error: any) {
      console.error('Error fetching all users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [users, loads, trucks] = await Promise.all([
        SupabaseService.getAllUsers(),
        SupabaseService.getLoads(),
        SupabaseService.getTrucks(),
      ]);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      setStats({
        totalUsers: users.length,
        approvedUsers: users.filter(u => u.status === 'approved').length,
        pendingUsers: users.filter(u => u.status === 'pending').length,
        rejectedUsers: users.filter(u => u.status === 'rejected').length,
        freeUsers: users.filter(u => u.plan === 'free').length,
        standardUsers: users.filter(u => u.plan === 'standard').length,
        proUsers: users.filter(u => u.plan === 'pro').length,
        totalLoads: loads.length,
        totalTrucks: trucks.length,
        recentLoads: loads.filter(l => new Date(l.createdAt) > sevenDaysAgo).length,
        recentTrucks: trucks.filter(t => new Date(t.createdAt) > sevenDaysAgo).length,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproval = async (userId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    if (!profile) return;
    
    try {
      setLoading(true);
      await SupabaseService.updateUserStatus(userId, status, profile.id, rejectionReason);
      // Refresh both lists
      await fetchPendingUsers();
      await fetchAllUsers();
      setError(null); // Clear any previous errors
      
      // Close modal if it was open
      setShowRejectionModal(null);
      setRejectionReason('');
    } catch (error: any) {
      console.error('Error updating user status:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (userId: string) => {
    setShowRejectionModal(userId);
    setRejectionReason('');
  };

  const confirmRejection = () => {
    if (showRejectionModal) {
      handleApproval(showRejectionModal, 'rejected', rejectionReason);
    }
  };

  const handlePlanChange = async (userId: string, plan: 'free' | 'standard' | 'pro') => {
    if (!profile) return;
    
    try {
      await SupabaseService.updateUserPlan(userId, plan);
      // Refresh all users list
      await fetchAllUsers();
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Error updating user plan:', error);
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!profile) return;
    
    if (!confirm(`Da li ste sigurni da želite da obrišete korisnika ${userName}? Ova akcija se ne može poništiti.`)) {
      return;
    }
    
    try {
      setLoading(true);
      console.log('Starting user deletion for:', userId, userName);
      
      await SupabaseService.deleteUser(userId);
      
      console.log('User deletion completed successfully');
      
      // Refresh both lists
      await fetchPendingUsers();
      await fetchAllUsers();
      setError(null); // Clear any previous errors
      
      // Show success message
      alert(`Korisnik ${userName} je uspešno obrisan.`);
      
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(`Greška pri brisanju korisnika: ${error.message}`);
      alert(`Greška pri brisanju korisnika ${userName}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-4">Greška</h1>
          <p className="text-text-muted mb-4">{error}</p>
          <Button onClick={fetchPendingUsers} variant="primary">
            Pokušaj ponovo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-main">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-brand-500 text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Zahtevi ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-brand-500 text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Korisnici ({allUsers.length})
        </button>
        <button
          onClick={() => { setActiveTab('listings'); if (adminLoads.length === 0 && adminTrucks.length === 0) fetchAdminListings(); }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'listings'
              ? 'bg-brand-500 text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Oglasi
        </button>
        <button
          onClick={() => { setActiveTab('stats'); fetchStats(); }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-brand-500 text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Statistike
        </button>
      </div>

      {/* Pending Approvals Tab */}
      {activeTab === 'pending' && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
             Zahtevi za odobrenje 
             <Badge variant="warning">{pendingUsers.length}</Badge>
          </h2>
          
          {pendingUsers.length === 0 ? (
             <Card className="p-8 text-center text-text-muted italic bg-surface">Nema zahteva na čekanju.</Card>
          ) : (
             <div className="grid gap-4">
               {pendingUsers.map(user => (
                 <Card key={user.id} className="p-6 border-l-4 border-l-amber-500 shadow-md">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <h3 className="font-bold text-lg text-text-main">{user.company?.name}</h3>
                           <Badge>{user.company?.category}</Badge>
                         </div>
                         <p className="text-sm text-text-muted break-all">PIB/Matični broj: {user.company?.registrationNumber}</p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-8 gap-y-1 text-sm text-text-muted mt-2">
                            <p className="break-words">Korisnik: <span className="text-text-main font-medium">{user.name}</span></p>
                            <p className="break-all">Email: {user.email}</p>
                            <p>Telefon: {user.company?.phone}</p>
                            <p>Lokacija: {user.company?.city}, {user.company?.country}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <Button 
                           variant="danger" 
                           size="sm" 
                           onClick={() => handleReject(user.id)}
                         >
                           <X className="h-4 w-4 mr-1" /> Odbij
                         </Button>
                         <Button 
                           variant="secondary" 
                           size="sm"
                           onClick={() => handleApproval(user.id, 'approved')}
                         >
                           <Check className="h-4 w-4 mr-1" /> Odobri
                         </Button>
                      </div>
                    </div>
                 </Card>
               ))}
             </div>
          )}
        </section>
      )}

      {/* All Users Tab */}
      {activeTab === 'all' && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-main">Svi korisnici</h2>
          
          <div className="grid gap-4">
            {allUsers.map(user => (
              <Card key={user.id} className="p-6 shadow-md">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <h3 className="font-bold text-lg text-text-main">{user.company?.name || user.name}</h3>
                       <Badge variant={user.status === 'approved' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'}>
                         {user.status === 'approved' ? 'Odobreno' : user.status === 'pending' ? 'Čeka' : 'Odbačeno'}
                       </Badge>
                       <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                         {user.role === 'admin' ? 'ADMIN' : 'USER'}
                       </Badge>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-8 gap-y-1 text-sm text-text-muted mt-2">
                        <p className="break-words">Korisnik: <span className="text-text-main font-medium">{user.name}</span></p>
                        <p className="break-all">Email: {user.email}</p>
                        <p>Plan: <span className={`font-medium ${
                          user.plan === 'free' ? 'text-gray-500' :
                          user.plan === 'standard' ? 'text-blue-500' :
                          'text-amber-500'
                        }`}>{user.plan?.toUpperCase()}</span></p>
                        <p>Lokacija: {user.company?.city}, {user.company?.country}</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3">
                     <div>
                       <label className="text-xs text-text-muted uppercase tracking-wider">Plan</label>
                       <select
                         value={user.plan}
                         onChange={(e) => handlePlanChange(user.id, e.target.value as 'free' | 'standard' | 'pro')}
                         className="w-full mt-1 px-3 py-2 bg-surface border border-border rounded-md text-text-main text-sm"
                       >
                         <option value="free">FREE</option>
                         <option value="standard">STANDARD</option>
                         <option value="pro">PRO</option>
                       </select>
                     </div>
                     <div className="flex gap-2">
                       {user.status === 'pending' && (
                         <>
                           <Button 
                             variant="danger" 
                             size="sm" 
                             onClick={() => handleReject(user.id)}
                           >
                             <X className="h-4 w-4" />
                           </Button>
                           <Button 
                             variant="secondary" 
                             size="sm"
                             onClick={() => handleApproval(user.id, 'approved')}
                           >
                             <Check className="h-4 w-4" />
                           </Button>
                         </>
                       )}
                       {user.status === 'rejected' && (
                         <Button 
                           variant="secondary" 
                           size="sm"
                           onClick={() => handleApproval(user.id, 'approved')}
                           title="Odobri korisnika (rehabilitacija)"
                         >
                           <Check className="h-4 w-4" /> Odobri
                         </Button>
                       )}
                       {user.role !== 'admin' && (
                         <Button 
                           variant="danger" 
                           size="sm" 
                           onClick={() => handleDeleteUser(user.id, user.name)}
                           title="Obriši korisnika (za testiranje)"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Listings Tab — Featured management */}
      {activeTab === 'listings' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Upravljanje oglasima
            </h2>
            <div className="flex gap-1 bg-surface border border-border rounded-lg p-1">
              {(['all', 'featured', 'normal'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFeaturedFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    featuredFilter === f
                      ? 'bg-brand-500 text-white'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {f === 'all' ? 'Svi' : f === 'featured' ? '★ Istaknuti' : 'Obični'}
                </button>
              ))}
            </div>
          </div>

          {listingsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3">
              {/* Loads */}
              {adminLoads
                .filter(l => featuredFilter === 'all' ? true : featuredFilter === 'featured' ? l.isFeatured : !l.isFeatured)
                .map(load => (
                  <Card key={`l-${load.id}`} className={`p-4 ${load.isFeatured ? 'border-amber-400/40 ring-1 ring-amber-400/20' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Package className="h-4 w-4 text-blue-400" />
                        <Badge variant="info">Tura</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-main text-sm truncate">
                          {load.originCity} → {load.destinationCity || 'Bilo gde'}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {load.companyName} · {new Date(load.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                      <Button
                        variant={load.isFeatured ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleFeatured('load', load.id, !!load.isFeatured)}
                        className={`gap-1.5 flex-shrink-0 ${load.isFeatured ? 'bg-amber-500 hover:bg-amber-600 border-amber-500' : ''}`}
                      >
                        <Star className={`h-3.5 w-3.5 ${load.isFeatured ? 'fill-current' : ''}`} />
                        {load.isFeatured ? 'Istaknuto' : 'Istakni'}
                      </Button>
                    </div>
                  </Card>
                ))}

              {/* Trucks */}
              {adminTrucks
                .filter(t => featuredFilter === 'all' ? true : featuredFilter === 'featured' ? t.isFeatured : !t.isFeatured)
                .map(truck => (
                  <Card key={`t-${truck.id}`} className={`p-4 ${truck.isFeatured ? 'border-amber-400/40 ring-1 ring-amber-400/20' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TruckIcon className="h-4 w-4 text-green-400" />
                        <Badge variant="success">Kamion</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-main text-sm truncate">
                          {truck.originCity} → {truck.destinationCity || 'Bilo gde'}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {truck.companyName} · {new Date(truck.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                      <Button
                        variant={truck.isFeatured ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleFeatured('truck', truck.id, !!truck.isFeatured)}
                        className={`gap-1.5 flex-shrink-0 ${truck.isFeatured ? 'bg-amber-500 hover:bg-amber-600 border-amber-500' : ''}`}
                      >
                        <Star className={`h-3.5 w-3.5 ${truck.isFeatured ? 'fill-current' : ''}`} />
                        {truck.isFeatured ? 'Istaknuto' : 'Istakni'}
                      </Button>
                    </div>
                  </Card>
                ))}

              {adminLoads.length === 0 && adminTrucks.length === 0 && (
                <Card className="p-12 text-center border-dashed border-border bg-transparent">
                  <p className="text-text-muted text-sm">Nema oglasa za prikaz.</p>
                </Card>
              )}
            </div>
          )}
        </section>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-text-main">Statistike platforme</h2>

          {!stats ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Korisnici */}
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Korisnici
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-5 text-center">
                    <p className="text-3xl font-black text-text-main">{stats.totalUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Ukupno</p>
                  </Card>
                  <Card className="p-5 text-center border-brand-500/30">
                    <p className="text-3xl font-black text-brand-400">{stats.approvedUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Odobreni</p>
                  </Card>
                  <Card className="p-5 text-center border-amber-500/30">
                    <p className="text-3xl font-black text-amber-400">{stats.pendingUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Na čekanju</p>
                  </Card>
                  <Card className="p-5 text-center border-red-500/30">
                    <p className="text-3xl font-black text-red-400">{stats.rejectedUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Odbijeni</p>
                  </Card>
                </div>
              </div>

              {/* Planovi */}
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Planovi pretplate
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-5 text-center">
                    <p className="text-3xl font-black text-gray-400">{stats.freeUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Početni (Free)</p>
                    <div className="mt-3 bg-surface rounded-full h-1.5">
                      <div
                        className="bg-gray-500 h-1.5 rounded-full"
                        style={{ width: `${stats.totalUsers ? (stats.freeUsers / stats.totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </Card>
                  <Card className="p-5 text-center border-brand-500/30">
                    <p className="text-3xl font-black text-brand-400">{stats.standardUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Standard</p>
                    <div className="mt-3 bg-surface rounded-full h-1.5">
                      <div
                        className="bg-brand-400 h-1.5 rounded-full"
                        style={{ width: `${stats.totalUsers ? (stats.standardUsers / stats.totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </Card>
                  <Card className="p-5 text-center border-amber-500/30">
                    <p className="text-3xl font-black text-amber-400">{stats.proUsers}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Pro</p>
                    <div className="mt-3 bg-surface rounded-full h-1.5">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full"
                        style={{ width: `${stats.totalUsers ? (stats.proUsers / stats.totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </Card>
                </div>
              </div>

              {/* Oglasi */}
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Oglasi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-5 text-center">
                    <p className="text-3xl font-black text-text-main">{stats.totalLoads}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Ture ukupno</p>
                  </Card>
                  <Card className="p-5 text-center">
                    <p className="text-3xl font-black text-text-main">{stats.totalTrucks}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Kamioni ukupno</p>
                  </Card>
                  <Card className="p-5 text-center border-brand-500/30">
                    <p className="text-3xl font-black text-brand-400">{stats.recentLoads}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> Ture (7 dana)
                    </p>
                  </Card>
                  <Card className="p-5 text-center border-brand-500/30">
                    <p className="text-3xl font-black text-brand-400">{stats.recentTrucks}</p>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> Kamioni (7 dana)
                    </p>
                  </Card>
                </div>
              </div>

              {/* Osvezi dugme */}
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={fetchStats}>
                  Osveži statistike
                </Button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-text-main mb-4">Razlog odbijanja</h3>
            <p className="text-text-muted text-sm mb-4">
              Unesite razlog zašto odbijate ovu prijavu. Ovaj razlog će biti poslat korisniku u email-u.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Npr: Nedostaju potrebni dokumenti, neispravni podaci o firmi..."
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-main text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowRejectionModal(null);
                  setRejectionReason('');
                }}
                className="flex-1"
              >
                Otkaži
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={confirmRejection}
                className="flex-1"
              >
                Odbij prijavu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};