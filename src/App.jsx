import { Toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react"
import SectionTag from './components/debug/SectionTag';

function FontInjector() {
  useEffect(() => {
    // Register service worker for PWA support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Inject Cormorant Garamond for luxury serif headings
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Barlow:wght@200;300;400;500&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html {
        margin: 0; padding: 0;
        background: #808080 !important;
      }
      body {
        margin: 0; padding: 0;
        background: #808080 !important;
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
      .display-heading {
        font-family: 'Barlow', 'Helvetica Neue', Arial, sans-serif !important;
        font-weight: 300;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }
      .frosted-gold {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 1px solid rgba(212,175,55,0.18);
      }
      .frosted-dark {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
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
import CityGuide from './pages/CityGuide.jsx';
import Search from './pages/Search';
import Admin from './pages/Admin';
import AdminOwners from './pages/AdminOwners.jsx';
import AdminOwnerDetail from './pages/AdminOwnerDetail';
import AdminClients from './pages/AdminClients';
import AdminListingSearch from './pages/AdminListingSearch';
import AdminOutreachCampaigns from './pages/AdminOutreachCampaigns';
import AdminFlaggedConversations from './pages/AdminFlaggedConversations';
import AdminSearchProfiles from './pages/AdminSearchProfiles';
import AdminClientDetail from './pages/AdminClientDetail';
import AdminCommunications from './pages/AdminCommunications';
import AdminTemplates from './pages/AdminTemplates';
import AdminPresentationLibrary from './pages/AdminPresentationLibrary';
import AdminReferrals from './pages/AdminReferrals';
import AdminContentApproval from './pages/AdminContentApproval';
import AdminInterviews from './pages/AdminInterviews';
import Explainers from './pages/Explainers';
import GeminiSession from './pages/GeminiSession';
import BusinessPlan from './pages/BusinessPlan';
import SkipTraceResults from './pages/SkipTraceResults';
import AgentExplainer from './pages/AgentExplainer';
import AdminListingAgentExplainer from './pages/AdminListingAgentExplainer';
import AdminCharlieScripts from './pages/AdminCharlieScripts';

import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import { LayoutProvider } from './lib/LayoutContext';

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
      <Route path="/Explainers" element={<Explainers />} />
      <Route path="/AgentExplainer" element={<AgentExplainer />} />
      <Route path="/GeminiSession" element={<GeminiSession />} />

      
      {/* App routes with floating Charlie */}
      <Route element={<AppLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/CityGuide" element={<CityGuide />} />
        <Route path="/Search" element={<Search />} />
      </Route>

      {/* Admin routes with sidebar */}
      <Route element={<AdminLayout />}>
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminOwners" element={<AdminOwners />} />
        <Route path="/AdminOwners/:ownerId" element={<AdminOwnerDetail />} />
        <Route path="/AdminClients" element={<AdminClients />} />
        <Route path="/AdminClients/:clientId" element={<AdminClientDetail />} />
        <Route path="/AdminListingSearch" element={<AdminListingSearch />} />
        <Route path="/AdminOutreachCampaigns" element={<AdminOutreachCampaigns />} />
        <Route path="/AdminFlaggedConversations" element={<AdminFlaggedConversations />} />
        <Route path="/AdminSearchProfiles" element={<AdminSearchProfiles />} />
        <Route path="/AdminCommunications" element={<AdminCommunications />} />
        <Route path="/AdminTemplates" element={<AdminTemplates />} />
        <Route path="/AdminPresentationLibrary" element={<AdminPresentationLibrary />} />
        <Route path="/AdminReferrals" element={<AdminReferrals />} />
        <Route path="/AdminContentApproval" element={<AdminContentApproval />} />
        <Route path="/AdminInterviews" element={<AdminInterviews />} />
        <Route path="/BusinessPlan" element={<BusinessPlan />} />
        <Route path="/SkipTraceResults" element={<SkipTraceResults />} />
        <Route path="/AdminListingAgentExplainer" element={<AdminListingAgentExplainer />} />
        <Route path="/AdminCharlieScripts" element={<AdminCharlieScripts />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LayoutProvider>
          <FontInjector />
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </LayoutProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App