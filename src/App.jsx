import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"

function FontInjector() {
  useEffect(() => {
    // Inject Cormorant Garamond for luxury serif headings
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0; padding: 0;
        background: #080808;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .serif-heading {
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .frosted-gold {
        background: rgba(18, 15, 5, 0.72);
        backdrop-filter: blur(28px) saturate(200%);
        -webkit-backdrop-filter: blur(28px) saturate(200%);
        border: 1px solid rgba(212,175,55,0.18);
      }
      .frosted-dark {
        background: rgba(10,10,10,0.82);
        backdrop-filter: blur(20px) saturate(160%);
        -webkit-backdrop-filter: blur(20px) saturate(160%);
        border: 1px solid rgba(255,255,255,0.06);
      }
      .gold-text-gradient {
        background: linear-gradient(135deg, #F5E27A 0%, #D4AF37 40%, #B8860B 80%, #D4AF37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .gold-btn {
        background: linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%);
        color: #000 !important;
        font-weight: 700;
        letter-spacing: 0.02em;
        transition: all 0.25s ease;
        box-shadow: 0 0 24px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.22);
      }
      .gold-btn:hover {
        box-shadow: 0 0 40px rgba(212,175,55,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
        transform: translateY(-1px);
      }
      .service-card {
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.07);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.3s ease;
      }
      .service-card:hover {
        background: rgba(212,175,55,0.06);
        border-color: rgba(212,175,55,0.28);
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(212,175,55,0.1);
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
        <FontInjector />
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App