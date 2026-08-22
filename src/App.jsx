import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LayoutProvider } from '@/lib/LayoutContext';
import { Toaster } from "@/components/ui/toaster";
import PageNotFound from './lib/PageNotFound';
import PageNumberBadge from './components/PageNumberBadge';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

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
import AdminBobLibrary from './pages/AdminBobLibrary';
import BusinessPlan from './pages/BusinessPlan';
import Explainers from './pages/Explainers';
import Chat from './pages/Chat';
import ClientCommunicationsExplainer from './pages/ClientCommunicationsExplainer';
import Search from './pages/Search';
import CityGuide from './pages/CityGuide';
import PropertyComparison from './pages/PropertyComparison';
import AdminSkipTrace from './pages/AdminSkipTrace';
import AdminBulkSkipTrace from './pages/AdminBulkSkipTrace';
import AdminMarketingCampaigns from './pages/AdminMarketingCampaigns';
import AdminTargetAudiences from './pages/AdminTargetAudiences';
import AdminAudienceDistribution from './pages/AdminAudienceDistribution';
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
import AdminMediaCRM from './pages/AdminMediaCRM';
import AdminPitchTracker from './pages/AdminPitchTracker';
import AdminPressKit from './pages/AdminPressKit';
import AdminMassPitchPersonalizer from './pages/AdminMassPitchPersonalizer';
import MediaRoom from './pages/MediaRoom';
import AdminComposeSMS from './pages/AdminComposeSMS';
import DnnNewsFeed from './pages/DnnNewsFeed';
import DnnMarketData from './pages/DnnMarketData';
import DnnSubscriberCRM from './pages/DnnSubscriberCRM';
import DnnCommunicationsHub from './pages/DnnCommunicationsHub';
import DnnAgentBureau from './pages/DnnAgentBureau';
import BobDyson from './pages/BobDyson';
import AIAssistants from './pages/AIAssistants';
import ReadyToStart from './components/dashboard/ReadyToStart';
import CharlieVoicePresentation from './pages/CharlieVoicePresentation';
import ConsumerDnnNews from './pages/ConsumerDnnNews';
import DnnBroadcastArchivePage from './pages/DnnBroadcastArchivePage';
import MyAgent from './pages/MyAgent';
import FinancialServices from './pages/FinancialServices';
import AdminNewLandingPage from './pages/AdminNewLandingPage';
import AdminReloManagement from './pages/AdminReloManagement';
import AdminDnnRevenue from './pages/AdminDnnRevenue';
import AdminAgentVetting from './pages/AdminAgentVetting';
import AdminLenderVetting from './pages/AdminLenderVetting';
import AdminBureauStories from './pages/AdminBureauStories';
import ReloManagementVideoBg from './pages/ReloManagementVideoBg';
import SolveMyStory from './pages/SolveMyStory';
import AdminPRNAgentPlan from './pages/AdminPRNAgentPlan';
import RoleSelector from './pages/RoleSelector';
import BroadcastPreview from './pages/BroadcastPreview';
import BroadcastShow from './pages/BroadcastShow';
import AgentInvitedClients from './pages/AgentInvitedClients';
import RealEstateAnswers from './pages/RealEstateAnswers';
import NationalVettedDirectory from './pages/NationalVettedDirectory';
import AdminRoster from './pages/AdminRoster';
import AdminAffiliateRecruiting from './pages/AdminAffiliateRecruiting';
import AdminBobDysonContacts from './pages/AdminBobDysonContacts';
import VettedAgentsCity from './pages/VettedAgentsCity';
import SendingAgentDashboard from './pages/SendingAgentDashboard';
import AdminExodusPitch from './pages/AdminExodusPitch';
import AdminPartnerBenefits from './pages/AdminPartnerBenefits';
import AdminExodusOutreach from './pages/AdminExodusOutreach';
import AdminPRNAgreements from './pages/AdminPRNAgreements';
import AdminMasterAgreement from './pages/AdminMasterAgreement';
import AdminLeadHandoff from './pages/AdminLeadHandoff';
import DnnStudioDashboard from './pages/DnnStudioDashboard';
import AdminRecruitingBroadcast from './pages/AdminRecruitingBroadcast';
import DnnScriptReview from './pages/DnnScriptReview';
import AdminExplainerVideos from './pages/AdminExplainerVideos';
import DnnVideoPreview from './pages/DnnVideoPreview';
import AdminShowPipeline from './pages/AdminShowPipeline';
import AdminScriptStudio from './pages/AdminScriptStudio';
import AdminDailyNewsLibrary from './pages/AdminDailyNewsLibrary';
import HeygenCreditMonitor from './pages/HeygenCreditMonitor';
import AdminProductionDashboard from './pages/AdminProductionDashboard';
import AdminShowPerformance from './pages/AdminShowPerformance';
import AdminComplianceReview from './pages/AdminComplianceReview';
import Shard2Dashboard from './pages/Shard2Dashboard';
import Shard2Pages from './pages/Shard2Pages';
import Shard2Scripts from './pages/Shard2Scripts';
import Shard2Library from './pages/Shard2Library';
import Shard2Settings from './pages/Shard2Settings';
import SendingAgentLanding from './pages/SendingAgentLanding';
import CorporateRelo from './pages/CorporateRelo';
import AdminCorporateRelo from './pages/AdminCorporateRelo';
import AdminQAScriptStudio from './pages/AdminQAScriptStudio';
import AgentLanding from './pages/AgentLanding';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Subscribe from './pages/Subscribe';
import AgentSubscribe from './pages/AgentSubscribe';
import TermsOfService from './pages/TermsOfService';
import AdminClaudeScreenViewer from './pages/AdminClaudeScreenViewer';
import AdminLibrarySpecialists from './pages/AdminLibrarySpecialists';
import AdminWorkflowAtlas from './pages/AdminWorkflowAtlas';
import AdminGrokCommand from './pages/AdminGrokCommand';
import AdminDispatchLog from './pages/AdminDispatchLog';
import RoadMapToCompletion from './pages/RoadMapToCompletion';
import Connect from './pages/Connect';
import MasterShowSheet from './pages/MasterShowSheet';
import SolutionMapEntry from './pages/SolutionMapEntry';
import DnnStudioLanding from './pages/DnnStudioLanding';
import EscrowManagement from './pages/wisdom/EscrowManagement';
import ListingManagement from './pages/wisdom/ListingManagement';
import AgentRecords from './pages/wisdom/AgentRecords';
import WisdomMarketing from './pages/wisdom/WisdomMarketing';
import LuxuryPresence from './pages/wisdom/LuxuryPresence';
import BrokerageLayout from './components/layout/BrokerageLayout';
import BrokerageDashboard from './pages/brokerage/BrokerageDashboard';
import TransactionAudit from './pages/brokerage/TransactionAudit';
import BuyingClients from './pages/wisdom/BuyingClients';
import SubscriberSetup from './pages/SubscriberSetup';
import AdminAddSubscriber from './pages/AdminAddSubscriber';
import AdminActiveRelocationAgents from './pages/AdminActiveRelocationAgents';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, isAuthenticated } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/portal" replace /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public broadcast viewer pages (for social media link previews / scraping) */}
      <Route path="/broadcast-show" element={<BroadcastShow />} />
      <Route path="/broadcast-preview" element={<BroadcastPreview />} />

      {/* Public marketing/legal pages — no auth required, but still wrapped in AppLayout
          so the admin top command bar (access to every portal) shows automatically. */}
      <Route element={<AppLayout />}>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/relocation-intake" element={<RelocationIntake />} />
        <Route path="/RelocationIntake" element={<RelocationIntake />} />
        <Route path="/real-estate-answers" element={<RealEstateAnswers />} />
        {/* Corporate Relo / HR portal — PUBLIC (cold HR visitors, no login redirect).
            Public AppLayout is the pattern for cold visitors; it must NOT inherit the
            Client sidebar content or the Admin sidebar (AdminLayout) — it is its own portal. */}
        <Route path="/corporate-relo" element={<CorporateRelo />} />
      </Route>

      {/* Root → Role Selector if signed in, News if not (never send unauthenticated users to /login) */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/portal" replace /> : <Navigate to="/broadcast-show" replace />} />

      {/* Everything below requires authentication */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        {/* Role Selector — standalone, no sidebar */}
        <Route path="/portal" element={<RoleSelector />} />

        {/* Solution Map entry — the "ask anything" intelligence page (INTELLIGENCE pill) */}
        <Route path="/solutions" element={<SolutionMapEntry />} />
        <Route path="/roadmaps" element={<SolutionMapEntry />} />

        {/* Consumer Routes with Sidebar Layout */}
        {/* ⚠️ CRITICAL: These routes are essential for the app. Do not remove without careful review. */}
        <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/relocation-roadmap" element={<RelocationRoadmap />} />
        <Route path="/RelocationRoadmap" element={<RelocationRoadmap />} />
        <Route path="/gemini" element={<GeminiSession />} />
        <Route path="/GeminiSession" element={<GeminiSession />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/communications-explainer" element={<ClientCommunicationsExplainer />} />
        <Route path="/relocation-roadmap" element={<RelocationRoadmap />} />
        <Route path="/RelocationRoadmap" element={<RelocationRoadmap />} />
        <Route path="/gemini" element={<GeminiSession />} />
        <Route path="/GeminiSession" element={<GeminiSession />} />
        {/* PERMANENT FIX: /communications-explainer is CRITICAL — do not remove */}
        <Route path="/CityGuide" element={<CityGuide />} />
        <Route path="/city-guide" element={<CityGuide />} />
        <Route path="/search" element={<Search />} />
        <Route path="/FindAgent" element={<FindAgent />} />
        <Route path="/find-agent" element={<FindAgent />} />
        <Route path="/media" element={<MediaRoom />} />
        <Route path="/dnn-news" element={<ConsumerDnnNews />} />
        <Route path="/dnn-archive" element={<DnnBroadcastArchivePage />} />
        <Route path="/my-agent" element={<MyAgent />} />
        <Route path="/financial-services" element={<FinancialServices />} />
        <Route path="/relo-management" element={<Navigate to="/relocation-intake" replace />} />
        <Route path="/bob-dyson" element={<BobDyson />} />
        <Route path="/Explainers" element={<Explainers />} />
        <Route path="/explainers" element={<Explainers />} />
        <Route path="/ai-assistants" element={<AIAssistants />} />
        <Route path="/agent-invited-clients" element={<AgentInvitedClients />} />
        <Route path="/national-directory" element={<NationalVettedDirectory />} />
      <Route path="/master-show-sheet" element={<MasterShowSheet />} />
      <Route path="/agent-subscribe" element={<AgentSubscribe />} />
      <Route path="/partner-benefits" element={<SendingAgentLanding />} />
      <Route path="/vetted-agents/:citySlug" element={<VettedAgentsCity />} />
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
        <Route path="/admin/dnn/news-feed" element={<DnnNewsFeed />} />
        <Route path="/admin/dnn/market-data" element={<DnnMarketData />} />
        <Route path="/admin/dnn/subscribers" element={<DnnSubscriberCRM />} />
        <Route path="/admin/dnn/communications" element={<DnnCommunicationsHub />} />
        <Route path="/admin/dnn/agent-bureau" element={<DnnAgentBureau />} />
        <Route path="/admin/active-campaigns" element={<AdminActiveCampaigns />} />
        <Route path="/admin/scheduled-campaigns" element={<AdminScheduledCampaigns />} />
        <Route path="/admin/video-sms-campaign" element={<AdminVideoSMSCampaign />} />
        <Route path="/admin/video-library" element={<AdminVideoLibrary />} />
        <Route path="/admin/media-crm" element={<AdminMediaCRM />} />
        <Route path="/admin/pitch-tracker" element={<AdminPitchTracker />} />
        <Route path="/admin/press-kit" element={<AdminPressKit />} />
        <Route path="/admin/mass-pitch" element={<AdminMassPitchPersonalizer />} />
        <Route path="/admin/opt-ins" element={<AdminOptIns />} />
        <Route path="/admin/presentation-library" element={<AdminPresentationLibrary />} />
        <Route path="/admin/communications" element={<AdminCommunications />} />
        <Route path="/admin/flagged-conversations" element={<AdminFlaggedConversations />} />
        <Route path="/admin/referrals" element={<AdminReferrals />} />
        <Route path="/admin/charlie-scripts" element={<AdminCharlieScripts />} />
        <Route path="/admin/charlie-knowledge-base" element={<AdminCharlieKnowledgeBase />} />
        <Route path="/admin/charlie-escalations" element={<AdminCharlieEscalations />} />
        <Route path="/admin/bob-library" element={<AdminBobLibrary />} />
        <Route path="/admin/skip-trace" element={<AdminSkipTrace />} />
        <Route path="/admin/bulk-skip-trace" element={<AdminBulkSkipTrace />} />
        <Route path="/admin/marketing-campaigns" element={<AdminMarketingCampaigns />} />
        <Route path="/admin/target-audiences" element={<AdminTargetAudiences />} />
        <Route path="/admin/audience-distribution" element={<AdminAudienceDistribution />} />
        <Route path="/admin/campaign-roadmap" element={<AdminCampaignRoadmap />} />
        <Route path="/admin/social-launch" element={<AdminSocialLaunch />} />
        <Route path="/admin/business-plan" element={<BusinessPlan />} />
        <Route path="/business-plan" element={<Navigate to="/admin/business-plan" replace />} />
        <Route path="/admin/new-landing-page" element={<AdminNewLandingPage />} />
        <Route path="/admin/relo-management" element={<AdminReloManagement />} />
        <Route path="/admin/corporate-relo" element={<AdminCorporateRelo />} />
        <Route path="/admin/dnn/revenue" element={<AdminDnnRevenue />} />
        <Route path="/admin/dnn/agent-vetting" element={<AdminAgentVetting />} />
        <Route path="/admin/dnn/lender-vetting" element={<AdminLenderVetting />} />
        <Route path="/admin/dnn/bureau-stories" element={<AdminBureauStories />} />
        <Route path="/solve-my-story" element={<SolveMyStory />} />
        <Route path="/admin/prn-agent-plan" element={<AdminPRNAgentPlan />} />
        <Route path="/admin/roster" element={<AdminRoster />} />
        <Route path="/admin/active-relocation-agents" element={<AdminActiveRelocationAgents />} />
        <Route path="/admin/affiliate-recruiting" element={<AdminAffiliateRecruiting />} />
        <Route path="/admin/bob-dyson-contacts" element={<AdminBobDysonContacts />} />
        <Route path="/admin/sending-agents" element={<SendingAgentDashboard />} />
        <Route path="/admin/exodus-pitch" element={<AdminExodusPitch />} />
        <Route path="/admin/partner-benefits" element={<AdminPartnerBenefits />} />
        <Route path="/admin/exodus-outreach" element={<AdminExodusOutreach />} />
        <Route path="/admin/prn-agreements" element={<AdminPRNAgreements />} />
        <Route path="/admin/master-agreement" element={<AdminMasterAgreement />} />
        <Route path="/admin/lead-handoff" element={<AdminLeadHandoff />} />
        <Route path="/admin/dnn/studio" element={<DnnStudioDashboard />} />
        <Route path="/admin/dnn/recruiting" element={<AdminRecruitingBroadcast />} />
        <Route path="/admin/dnn/script-review" element={<DnnScriptReview />} />
        <Route path="/admin/dnn/explainer-videos" element={<AdminExplainerVideos />} />
        <Route path="/admin/dnn/video-preview" element={<DnnVideoPreview />} />
        <Route path="/admin/dnn/show-pipeline" element={<AdminShowPipeline />} />
        <Route path="/admin/dnn/script-studio" element={<AdminScriptStudio />} />
        <Route path="/admin/dnn/daily-library" element={<AdminDailyNewsLibrary />} />
        <Route path="/admin/heygen-credits" element={<HeygenCreditMonitor />} />
        <Route path="/admin/production-dashboard" element={<AdminProductionDashboard />} />
        <Route path="/admin/dnn/show-performance" element={<AdminShowPerformance />} />
        <Route path="/admin/compliance-review" element={<AdminComplianceReview />} />
        <Route path="/admin/qa-script-studio" element={<AdminQAScriptStudio />} />
        <Route path="/admin/shard2" element={<Shard2Dashboard />} />
        <Route path="/admin/shard2/pages" element={<Shard2Pages />} />
        <Route path="/admin/shard2/scripts" element={<Shard2Scripts />} />
        <Route path="/admin/shard2/library" element={<Shard2Library />} />
        <Route path="/admin/shard2/settings" element={<Shard2Settings />} />
        <Route path="/admin/claude-screen-viewer" element={<AdminClaudeScreenViewer />} />
        <Route path="/admin/library-specialists" element={<AdminLibrarySpecialists />} />
        <Route path="/admin/workflows" element={<AdminWorkflowAtlas />} />
        <Route path="/admin/workflows/:deskId" element={<AdminWorkflowAtlas />} />
        <Route path="/admin/grok-command" element={<AdminGrokCommand />} />
        <Route path="/admin/dispatch-log" element={<AdminDispatchLog />} />
        <Route path="/admin/roadmap" element={<RoadMapToCompletion />} />
        <Route path="/admin/wisdom/escrow" element={<EscrowManagement />} />
        <Route path="/admin/wisdom/audit" element={<TransactionAudit />} />
        <Route path="/admin/wisdom/listings" element={<ListingManagement />} />
        <Route path="/admin/wisdom/buying-clients" element={<BuyingClients />} />
        <Route path="/admin/wisdom/agents" element={<AgentRecords />} />
        <Route path="/admin/wisdom/marketing" element={<WisdomMarketing />} />
        <Route path="/admin/wisdom/luxury" element={<LuxuryPresence />} />
        <Route path="/admin/add-subscriber" element={<AdminAddSubscriber />} />
        <Route path="/admin/show-sheet" element={<MasterShowSheet />} />
        <Route path="/admin/archived/studio-landing" element={<DnnStudioLanding />} />
      </Route>

      {/* Brokerage Portal — subscriber view (Wisdom Properties = subscriber #1) */}
      <Route element={<BrokerageLayout />}>
        <Route path="/brokerage" element={<BrokerageDashboard />} />
        <Route path="/brokerage/escrow" element={<EscrowManagement />} />
        <Route path="/brokerage/audit" element={<TransactionAudit />} />
        <Route path="/brokerage/listings" element={<ListingManagement />} />
        <Route path="/brokerage/buying-clients" element={<BuyingClients />} />
        <Route path="/brokerage/agents" element={<AgentRecords />} />
        <Route path="/brokerage/marketing" element={<WisdomMarketing />} />
        <Route path="/brokerage/luxury" element={<LuxuryPresence />} />
      </Route>

        <Route path="/subscriber-setup" element={<SubscriberSetup />} />
        <Route path="/relo-management-video-bg" element={<ReloManagementVideoBg />} />
        <Route path="/agent-landing" element={<AgentLanding />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
            <Toaster />
            {new URLSearchParams(window.location.search).get('videoMode') !== 'true' && <PageNumberBadge />}
          </Router>
        </QueryClientProvider>
      </LayoutProvider>
    </AuthProvider>
  );
}

export default App;