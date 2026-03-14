import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"

function FontInjector() {
  useEffect(() => {
    // Inject Google Font link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap';
    document.head.appendChild(link);

    // Inject heading styles
    const style = document.createElement('style');
    style.textContent = `
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-weight: 300 !important;
        letter-spacing: 0.12em !important;
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import CityGuide from './pages/CityGuide';
import Admin from './pages/Admin';
import AdminOwners from './pages/AdminOwners';
import AdminClients from './pages/AdminClients';

import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';

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
      <Route path="/" element={<Navigate to="/Home" replace />} />
      <Route path="/Home" element={<Home />} />
      
      {/* App routes with floating Charlie */}
      <Route element={<AppLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/CityGuide" element={<CityGuide />} />
      </Route>

      {/* Admin routes with sidebar */}
      <Route element={<AdminLayout />}>
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminOwners" element={<AdminOwners />} />
        <Route path="/AdminClients" element={<AdminClients />} />
      </Route>

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
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App