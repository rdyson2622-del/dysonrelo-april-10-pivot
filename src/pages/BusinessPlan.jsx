import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, FileText, TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GOLD = '#D4AF37';

const sections = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    icon: FileText,
    content: `Dyson & Dyson Concierge Relocation Services harnesses advanced AI to provide end-to-end relocation assistance to families relocating in the US. The platform is completely free to consumers—funded through agent referral fees—and operates 24/7 via Charlie, an AI concierge.

Market Opportunity: 8-9 million households relocate annually in the US. Even 5% penetration would be transformational. The relocation market is fragmented and painful; consumers pay for piecemeal solutions across multiple vendors (real estate agents, movers, utilities, schools, healthcare). Dyson consolidates this into one integrated experience.

Business Model: Free-to-consumer, agent-funded revenue (25% referral fee on buyer's side, 15% relocation management fee). This eliminates buyer friction and accelerates adoption vs. traditional real estate models.`
  },
  {
    id: 'consumer-value',
    title: 'Consumer Value Proposition',
    icon: TrendingUp,
    content: `Why Relocating Families Choose Dyson:

• Neighborhood Research: AI-powered analysis of neighborhoods matching lifestyle, commute, and priorities
• AI Concierge (Charlie): 24/7 availability, free expert guidance on every aspect of relocation
• Agent Selection: Hand-matched with vetted, top-performing local agents specializing in relocations
• Home Search Strategy: AI-powered property matching based on exact criteria and budget
• Full-Service Coordination: Moving logistics, utilities setup, school enrollment, healthcare provider discovery
• Zero Cost to Buyers: Completely free—funded through agent partnerships

Key Differentiator: Charlie operates 24/7, scales infinitely, and improves with data. This beats traditional human concierges on availability, cost, and responsiveness.`
  },
  {
    id: 'data-suppliers',
    title: 'Data Suppliers & Reach',
    icon: Shield,
    content: `Current Information Sources:

1. MLS Networks (regional): Primary listing source. 250+ regional systems; strong coverage in major metros, weaker in rural/secondary markets.

2. CrissCross (Skip Tracing): Seller contact data for outreach campaigns.

3. Zillow/Realtor.com: Secondary listing data and market intelligence. High visibility but API-dependent.

4. Public Data: Census, school districts, tax records, neighborhood fundamentals. Static but comprehensive.

5. Google Gemini API (LLM + Web Search): Real-time synthesis and enrichment via internet search. Charlie uses Gemini 3 Flash/Pro with add_context_from_internet=true to answer questions with current, contextual data.

Reach Gaps: MLS fragmentation limits rural coverage. Real-time hyperlocal insights (walkability, community vibe) aren't in any database—Charlie fills this gap through AI synthesis.

Strategic Moat: You're the intelligent aggregator of fragmented data. Suppliers can't replicate your synthesis layer alone.`
  },
  {
    id: 'revenue-model',
    title: 'Revenue Model',
    icon: BarChart3,
    content: `Primary Revenue Stream: Agent Referral Fees
• 25% referral fee on buyer-side commission (when referred buyer closes)
• 15% relocation management fee for our coordination services
• Revenue scales with transaction volume and average home price

Secondary Opportunities:
• Corporate relocation partnerships (provide concierge for employee relocations)
• International relocation (expand beyond US)
• Rental market expansion (renters also relocate; lower AOV but high volume)
• Data licensing (anonymized buyer intent, neighborhood sentiment, agent performance)
• Insurance partnerships (home, auto, life—relocating families need all three)

Unit Economics: Higher-priced markets (Austin, Denver, Seattle, Florida) generate larger referral fees. Focus growth in high-value markets first.`
  },
  {
    id: 'competitive-advantage',
    title: 'Competitive Advantages',
    icon: Zap,
    content: `1. Network Effects: More agents → better matches → happier consumers → more agents. Strong defensibility.

2. Luxury Brand Positioning: Premium design and "Dyson & Dyson" brand position above commoditized solutions (Zillow, Redfin). Appeals to higher-income relocating families.

3. Free-to-Consumer Model: Eliminates buyer friction vs. traditional agent models. Faster adoption.

4. AI Scalability: Charlie operates 24/7 on unlimited inquiries. Beats human concierge model on cost and availability.

5. Data Moat: Over time, accumulate insights on neighborhoods, agent performance, market trends that become increasingly valuable and defensible.

6. End-to-End Integration: Competitors address single problems (listings, agents, movers). You solve the full journey.`
  },
  {
    id: 'growth-roadmap',
    title: 'Growth Roadmap',
    icon: TrendingUp,
    content: `Phase 1 (Months 1-6): MVP Launch
• Validate product-market fit in 2-3 high-value markets (Austin, Denver, Seattle)
• Build initial agent network (50-100 agents)
• Refine Charlie's capabilities based on user feedback

Phase 2 (Months 6-12): Scale & Expand
• Expand to top 20 US metros
• Grow agent network to 500+
• Launch corporate relocation partnerships
• Optimize data aggregation pipeline

Phase 3 (Year 2): Infrastructure & Moat
• Build proprietary data layer (own MLS aggregation, public data warehouse)
• International expansion (Canada, UK)
• Develop agent performance predictive models
• Launch data licensing to suppliers

Phase 4 (Year 3+): Adjacent Markets
• Rental relocation product
• Insurance partnerships
• International relocation services
• Real estate investment syndication (help relocators invest in destination markets)`
  },
  {
    id: 'key-metrics',
    title: 'Key Metrics to Track',
    icon: BarChart3,
    content: `User Metrics:
• Monthly Active Users (MAU)
• Chat sessions per user
• Neighborhoods researched
• Agent match conversion rate
• Customer satisfaction (NPS)

Business Metrics:
• Closed transactions (referrals that converted)
• Average referral fee per transaction
• Cost per acquisition (marketing + infrastructure)
• Customer acquisition cost (CAC)
• Lifetime value (LTV) of user
• Agent network growth rate

Agent Metrics:
• Agent satisfaction with referral quality
• Close rate on Dyson referrals vs. other sources
• Time-to-close on Dyson referrals
• Repeat referral requests

Market Metrics:
• Market share in target metros
• Brand awareness among relocating families
• Competitive win/loss analysis`
  },
  {
    id: 'technology-infrastructure',
    title: 'Technology & Infrastructure',
    icon: Zap,
    content: `Current Stack:
• Frontend: React + Tailwind CSS (Base44 platform)
• Backend: Deno backend functions + Base44 infrastructure
• LLM: Google Gemini API (3 Flash/Pro)
• Data: Base44 database (entities: ChatMessage, RelocationClient, RelocationTask, ListingImport, SellerOutreach, AgentReferral, etc.)
• Integrations: MLS feeds, Zillow API, CrissCross skip tracing

Infrastructure Priorities:
1. Scale LLM inference (caching common queries, batch processing)
2. Build MLS aggregation layer (reduce Zillow dependency)
3. Public data warehouse (Census, schools, healthcare)
4. Real-time notification system (new listings, agent responses)
5. Analytics & BI platform (agent performance, user behavior)

Cost Optimization: As volume grows, replace Gemini API calls with cached responses and custom fine-tuned models.`
  },
  {
    id: 'risks-mitigations',
    title: 'Key Risks & Mitigations',
    icon: Shield,
    content: `Risk 1: Agent Network Adoption
Mitigation: Aggressive recruitment incentives, proven referral quality, white-glove onboarding

Risk 2: Data Dependency on Third Parties (Zillow, MLS)
Mitigation: Build proprietary data layer; negotiate direct MLS partnerships; develop alternatives

Risk 3: LLM API Costs at Scale
Mitigation: Cache queries; batch processing; transition to custom models; negotiate volume discounts

Risk 4: Regulatory (State real estate licensing, referral fee structures)
Mitigation: Legal review by state; structured as agent networking platform, not brokerage

Risk 5: Competitive Response from Zillow/Redfin
Mitigation: Premium positioning + network effects make them slow to respond; build moat via data + brand

Risk 6: Churn if Agent Experience is Poor
Mitigation: Excellent referral quality data; dedicated agent success team; ongoing feedback loop`
  }
];

export default function BusinessPlan() {
  const [expandedSection, setExpandedSection] = useState('executive-summary');

  const exportToPDF = () => {
    // Placeholder for PDF export functionality
    alert('PDF export coming soon. For now, use browser Print to PDF.');
  };

  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-4">
          <Link to="/Admin">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="serif-heading text-xl" style={{ color: '#000' }}>Business Plan</h1>
        </div>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all"
          style={{ background: GOLD, color: '#000' }}
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Market Size', value: '8-9M Relocations/Year', color: '#4169E1' },
            { label: 'Target Penetration', value: '5% = Transformational', color: '#20B820' },
            { label: 'Revenue Model', value: 'Agent Referral Fees', color: '#FF8C00' },
            { label: 'Competitive Moat', value: 'Data Aggregation + Network', color: '#9932CC' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)', border: `2px solid ${item.color}` }}>
              <p className="text-xs font-semibold tracking-widest" style={{ color: item.color }}>
                {item.label}
              </p>
              <p className="text-lg font-bold mt-2" style={{ color: '#000' }}>{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setExpandedSection(section.id)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                    style={{
                      background: expandedSection === section.id ? GOLD : 'rgba(255,255,255,0.7)',
                      color: expandedSection === section.id ? '#000' : '#333'
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {sections.map((section) => (
              expandedSection === section.id && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    {React.createElement(section.icon, { className: 'w-6 h-6', style: { color: GOLD } })}
                    <h2 className="serif-heading text-2xl" style={{ color: '#000' }}>{section.title}</h2>
                  </div>
                  <div className="prose prose-sm max-w-none" style={{ color: '#333' }}>
                    {section.content.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-4 leading-relaxed whitespace-pre-wrap text-sm">
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </div>

        {/* Version Control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-4 rounded-lg text-center text-sm"
          style={{ background: 'rgba(255,255,255,0.7)', color: '#666' }}
        >
          <p>Business Plan v1.0 • Last Updated: March 14, 2026</p>
        </motion.div>
      </main>
    </div>
  );
}