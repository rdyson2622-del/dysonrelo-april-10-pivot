import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import PageNotFound from './lib/PageNotFound';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page Imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RelocationIntake from './pages/RelocationIntake';
import RelocationRoadmap from './components/intake/RelocationRoadmap';
import GeminiSession from './pages/GeminiSession';
import Admin from './pages/Admin';
import CharlieScripts from './pages/CharlieScripts';
import AdminClients from './pages/AdminClients';
import AdminClientDetail from './pages/AdminClientDetail';
import AdminCommunications from './pages/AdminCommunications';
import Explainers from './pages/Explainers';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/relocation-intake" element={<RelocationIntake />} />
      <Route path="/relocation-roadmap" element={<RelocationRoadmap />} />
      <Route path="/gemini" element={<GeminiSession />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/scripts" element={<CharlieScripts />} />
      <Route path="/admin/clients" element={<AdminClients />} />
      <Route path="/admin/client-detail" element={<AdminClientDetail />} />
      <Route path="/admin/communications" element={<AdminCommunications />} />
      <Route path="/explainers" element={<Explainers />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;