import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import PageNotFound from './lib/PageNotFound';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PageNumberBadge from './components/PageNumberBadge';

// Layout Imports
import AdminLayout from './components/layout/AdminLayout';
import AppLayout from './components/layout/AppLayout';

// Page Imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RelocationIntake from './pages/RelocationIntake';
import RelocationRoadmap from './components/intake/RelocationRoadmap';
import FindAgent from './pages/FindAgent';
import GeminiSession from './pages/GeminiSession';
import Admin from './pages/Admin';
import CharlieScripts from './pages/CharlieScripts';
import AdminClients from './pages/AdminClients';
import AdminClientDetail from './pages/AdminClientDetail';
import AdminCommunications from './pages/AdminCommunications';
import AdminSearchProfiles from './pages/AdminSearchProfiles';
import AdminOwners from './pages/AdminOwners';
import AdminOutreachCampaigns from './pages/AdminOutreachCampaigns';
import AdminPresentationLibrary from './pages/AdminPresentationLibrary';
import AdminFlaggedConversations from './pages/AdminFlaggedConversations';
import AdminReferrals from './pages/AdminReferrals';
import AdminCharlieScripts from './pages/AdminCharlieScripts';
import AdminCharlieKnowledgeBase from './pages/AdminCharlieKnowledgeBase.jsx';
import AdminCharlieEscalations from './pages/AdminCharlieEscalations.jsx';
import BusinessPlan from './pages/BusinessPlan';
import Explainers from './pages/Explainers';
import Chat from './pages/Chat';
import Search from './pages/Search';
import CityGuide from './pages/CityGuide';
import PropertyComparison from './pages/PropertyComparison';
import AdminSkipTrace from './pages/AdminSkipTrace';
import AdminBulkSkipTrace from './pages/AdminBulkSkipTrace';
import AdminMarketingCampaigns from './pages/AdminMarketingCampaigns';
import AdminTargetAudiences from './pages/AdminTargetAudiences';
import AdminCampaignRoadmap from './pages/AdminCampaignRoadmap';
import AdminSocialLaunch from './pages/AdminSocialLaunch';
import AdminOutreachPipeline from './pages/AdminOutreachPipeline';
import AdminBatchSMSLog from './pages/AdminBatchSMSLog';
import AdminOutreachAnalytics from './pages/AdminOutreachAnalytics';
import AdminSMSSequences from './pages/AdminSMSSequences';
import AdminOwnerKanban from './pages/AdminOwnerKanban';
import AdminOptIns from './pages/AdminOptIns';
import AdminActiveCampaigns from './pages/AdminActiveCampaigns';
import AdminScheduledCampaigns from './pages/AdminScheduledCampaigns.jsx';
import AdminVideoSMSCampaign from './pages/AdminVideoSMSCampaign.jsx';
import AdminVideoLibrary from './pages/AdminVideoLibrary.jsx';
import AdminComposeSMS from './pages/AdminComposeSMS';
import BobDyson from './pages/BobDyson';
import CharlieVoicePresentation from './pages/CharlieVoicePresentation';
import AIAssistants from './pages/AIAssistants';
import ReadyToStart from './components/dashboard/ReadyToStart';

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
      {/* Consumer Routes with Sidebar Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/relocation-intake" element={<RelocationIntake />} />
        <Route path="/RelocationIntake" element={<RelocationIntake />} />
        <Route path="/relocation-roadmap" element={<RelocationRoadmap />} />
        <Route path="/RelocationRoadmap" element={<RelocationRoadmap />} />
        <Route path="/gemini" element={<GeminiSession />} />
        <Route path="/GeminiSession" element={<GeminiSession />} />
        <Route path="/explainers" element={<Explainers />} />
        <Route path="/Explainers" element={<Explainers />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/CityGuide" element={<CityGuide />} />
        <Route path="/city-guide" element={<CityGuide />} />
        <Route path="/bob-dyson" element={<BobDyson />} />
        <Route path="/ai-assistants" element={<AIAssistants />} />
        <Route path="/ready-to-start" element={<ReadyToStart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/PropertyComparison" element={<PropertyComparison />} />
        <Route path="/property-comparison" element={<PropertyComparison />} />
        <Route path="/FindAgent" element={<FindAgent />} />
        <Route path="/find-agent" element={<FindAgent />} />
        <Route path="/charlie-voice" element={<CharlieVoicePresentation />} />
      </Route>
      
      {/* Admin Routes with Sidebar Layout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/scripts" element={<CharlieScripts />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/client-detail" element={<AdminClientDetail />} />
        <Route path="/admin/communications" element={<AdminCommunications />} />
        <Route path="/admin/search-profiles" element={<AdminSearchProfiles />} />
        <Route path="/admin/owners" element={<AdminOwners />} />
        <Route path="/admin/outreach-campaigns" element={<AdminOutreachCampaigns />} />
        <Route path="/admin/outreach-pipeline" element={<AdminOutreachPipeline />} />
        <Route path="/admin/batch-sms-log" element={<AdminBatchSMSLog />} />
        <Route path="/admin/outreach-analytics" element={<AdminOutreachAnalytics />} />
        <Route path="/admin/sms-sequences" element={<AdminSMSSequences />} />
        <Route path="/admin/owner-kanban" element={<AdminOwnerKanban />} />
        <Route path="/admin/compose-sms" element={<AdminComposeSMS />} />
        <Route path="/admin/active-campaigns" element={<AdminActiveCampaigns />} />
        <Route path="/admin/scheduled-campaigns" element={<AdminScheduledCampaigns />} />
        <Route path="/admin/video-sms-campaign" element={<AdminVideoSMSCampaign />} />
        <Route path="/admin/video-library" element={<AdminVideoLibrary />} />
        <Route path="/admin/opt-ins" element={<AdminOptIns />} />
        <Route path="/admin/presentation-library" element={<AdminPresentationLibrary />} />
        <Route path="/admin/flagged-conversations" element={<AdminFlaggedConversations />} />
        <Route path="/admin/referrals" element={<AdminReferrals />} />
        <Route path="/admin/charlie-scripts" element={<AdminCharlieScripts />} />
        <Route path="/admin/charlie-knowledge-base" element={<AdminCharlieKnowledgeBase />} />
        <Route path="/admin/charlie-escalations" element={<AdminCharlieEscalations />} />
        <Route path="/admin/skip-trace" element={<AdminSkipTrace />} />
        <Route path="/admin/bulk-skip-trace" element={<AdminBulkSkipTrace />} />
        <Route path="/admin/marketing-campaigns" element={<AdminMarketingCampaigns />} />
        <Route path="/admin/target-audiences" element={<AdminTargetAudiences />} />
        <Route path="/admin/campaign-roadmap" element={<AdminCampaignRoadmap />} />
        <Route path="/admin/social-launch" element={<AdminSocialLaunch />} />
        <Route path="/admin/business-plan" element={<BusinessPlan />} />
        <Route path="/business-plan" element={<Navigate to="/admin/business-plan" replace />} />
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
          <Toaster />
          <PageNumberBadge />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;