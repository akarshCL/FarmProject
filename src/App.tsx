import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Website Components
import LandingPage from './components/website/LandingPage';
import AuthPage from './components/auth/AuthPage';
import SetupPage from './components/setup/SetupPage';

// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';
import InventoryDetail from './components/inventory/InventoryDetail';
import WorkforceDetail from './components/workforce/WorkforceDetail';
import LivestockDetail from './components/livestock/LivestockDetail';
import CropsDetail from './components/crops/CropsDetail';
import FuelDetail from './components/fuel/FuelDetail';
import VehiclesDetail from './components/vehicles/VehiclesDetail';
import CCTVDetail from './components/cctv/CCTVDetail';
import GPSDetail from './components/gps/GPSDetail';
import VendorsDetail from './components/vendors/VendorsDetail';
import WhatsAppDetail from './components/whatsapp/WhatsAppDetail';
import FinanceDetail from './components/finance/FinanceDetail';
import SettingsPage from './components/settings/SettingsPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component (redirect if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          
          <Route path="/auth/login" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
          
          <Route path="/auth/signup" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />

          {/* Setup Route */}
          <Route path="/setup" element={
            <ProtectedRoute>
              <SetupPage />
            </ProtectedRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute>
              <InventoryDetail />
            </ProtectedRoute>
          } />

          <Route path="/workforce" element={
            <ProtectedRoute>
              <WorkforceDetail />
            </ProtectedRoute>
          } />

          <Route path="/livestock" element={
            <ProtectedRoute>
              <LivestockDetail />
            </ProtectedRoute>
          } />

          <Route path="/crops" element={
            <ProtectedRoute>
              <CropsDetail />
            </ProtectedRoute>
          } />

          <Route path="/fuel" element={
            <ProtectedRoute>
              <FuelDetail />
            </ProtectedRoute>
          } />

          <Route path="/vehicles" element={
            <ProtectedRoute>
              <VehiclesDetail />
            </ProtectedRoute>
          } />

          <Route path="/cctv" element={
            <ProtectedRoute>
              <CCTVDetail />
            </ProtectedRoute>
          } />

          <Route path="/gps" element={
            <ProtectedRoute>
              <GPSDetail />
            </ProtectedRoute>
          } />

          <Route path="/vendors" element={
            <ProtectedRoute>
              <VendorsDetail />
            </ProtectedRoute>
          } />

          <Route path="/whatsapp" element={
            <ProtectedRoute>
              <WhatsAppDetail />
            </ProtectedRoute>
          } />

          <Route path="/finance" element={
            <ProtectedRoute>
              <FinanceDetail />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;