import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import AppointmentBooking from './pages/AppointmentBooking';
import AdminLayout from './components/AdminLayout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/agendar" element={<AppointmentBooking />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clients />} />
          {/* Future expansion: barbers, services */}
        </Route>
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #D4AF37',
        },
      }} />
    </BrowserRouter>
  );
}

