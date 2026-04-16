import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { EmailConfirmed } from './pages/auth/EmailConfirmed';
import { ResetPassword } from './pages/auth/ResetPassword';
import { PendingApproval } from './pages/PendingApproval';
import { Pricing } from './pages/Pricing';
import { AppLayout } from './components/layout/AppLayout';
import { Overview } from './pages/dashboard/Overview';
import { LoadBoard } from './pages/listings/LoadBoard';
import { TruckBoard } from './pages/listings/TruckBoard';
import { CreateLoad } from './pages/listings/CreateLoad';
import { CreateTruck } from './pages/listings/CreateTruck';
import { MyListings } from './pages/listings/MyListings';
import { AdminPanel } from './pages/admin/AdminPanel';
import { Profile } from './pages/profile/Profile';

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          {/* Protected Routes - Require Authentication AND Approval */}
          <Route element={
            <ProtectedRoute requireApproval>
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Routes accessible only to approved users */}
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/loads" element={<LoadBoard />} />
            <Route path="/trucks" element={<TruckBoard />} />
            <Route path="/post-load" element={<CreateLoad />} />
            <Route path="/post-truck" element={<CreateTruck />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin routes - nested within approved routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            {/* Plans route redirects to pricing for now */}
            <Route path="/plans" element={<Navigate to="/pricing" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;