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
    id: 'data-aggregation-network',
    title: 'Data Aggregation + Network',
    icon: Shield,
    content: `YOUR COMPETITIVE MOAT: DATA SOURCES + TECHNOLOGY PARTNERS

  ────────────────────────────────
  CURRENT DATA SOURCES
  ────────────────────────────────

  1. MLS NETWORKS (Regional)
  Primary listing source. 250+ regional systems; strong coverage in major metros, weaker in rural/secondary markets.
  Contact: Varies by region (IDX provider)
  Website: Varies

  2. ZILLOW API
  Secondary listing data & market intelligence. High visibility but API-dependent.
  Website: https://www.zillow.com/webservice/
  Contact: api.zillow.com/support

  3. REALTOR.COM API
  Complementary listing data & market trends
  Website: https://www.realtor.com/api
  Contact: api-support@realtor.com

  4. ANGI (formerly ANGIE'S LIST)
  Home services & contractor data (for relocation move planning)
  Website: https://www.angi.com/api
  Contact: business@angi.com

  5. CRISSCROSS (Skip Tracing)
  Seller contact data for outbound campaigns
  Website: https://crisscross.com
  API Key: BATCHDATA_API_KEY (secrets)

  6. PROPSTREAM
  Property valuations, tax records, comparable sales
  Website: https://propstream.com
  API Key: PROPSTREAM_API_KEY (secrets)

  7. PUBLIC DATA
  Census, school districts, tax records, neighborhood fundamentals (static but comprehensive)
  Sources: census.gov, education.gov, county assessors

  8. GOOGLE GEMINI API (LLM + Web Search)
  Real-time synthesis and enrichment via internet search
  Website: https://ai.google.dev/gemini-api
  API Key: GEMINI_API_KEY (secrets)
  Charlie uses Gemini 3 Flash/Pro with add_context_from_internet=true to answer questions with current data

  ────────────────────────────────
  TECHNOLOGY PARTNERS & INTEGRATION VENDORS
  ────────────────────────────────

  1. GOOGLE GEMINI API
  Service: Large Language Model + Web Search
  Website: https://cloud.google.com/ai/generative-ai
  Contact: support.google.com/cloud
  Role: AI concierge, live voice interviews, synthesis

  2. BASE44 PLATFORM
  Service: Backend-as-a-Service
  Website: https://base44.com
  Contact: support@base44.com
  Role: Database, functions, auth, integrations

  3. TWILIO
  Service: SMS & Communication
  Website: https://www.twilio.com
  Contact: support@twilio.com
  Role: Seller outreach SMS campaigns

  4. GOOGLE WORKSPACE
  Service: Docs, Sheets, Drive
  Website: https://workspace.google.com
  Contact: workspace support
  Role: Admin docs, process tracking

  ────────────────────────────────
  REACH GAPS & STRATEGIC ADVANTAGE
  ────────────────────────────────
  • MLS fragmentation limits rural coverage → Compensate with Zillow + Realtor.com data
  • Real-time hyperlocal insights (walkability, community vibe) not in any single database → Charlie fills this gap through AI synthesis + web search
  • Home services coordination gap → Angi integration provides contractor/service provider data

  STRATEGIC MOAT: You're the intelligent aggregator of fragmented data. Individual suppliers can't replicate your synthesis + network effects. You control the distribution channel + client relationship.

  ────────────────────────────────
  FUTURE VENDOR DEVELOPMENT
  ────────────────────────────────
  As the app evolves, new vendors may be added:
  • Healthcare provider directories (Healthgrades, Zocdoc)
  • School district APIs (Great Schools)
  • Utility companies (direct integrations)
  • Moving companies (Uship, Allied integrations)
  • Insurance partners (state farm, Allstate integrations)

  Always document: vendor name, website, contact, API docs, API key location (if applicable), and role.`
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
    id: 'process-overview',
    title: '🗺️ Process Overview (New Employee)',
    icon: Zap,
    content: `WELCOME TO DYSON & DYSON — HOW THE MACHINE WORKS

If you're reading this, you're joining a business that automates 90% of a traditional relocation concierge. Here is the complete flow from first contact to closed deal. Read this once and you'll understand the whole operation.

────────────────────────────────
STEP 1 — CLIENT ACQUISITION (Automated)
────────────────────────────────
Clients come in two ways:

A) Inbound via Website / App
A potential relocating family visits dysonanddyson.com, interacts with Charlie (our AI concierge), and either chats or books a live Gemini session. Charlie is live 24/7 — no human needed for initial contact.

B) Outbound Seller Outreach (Human + AI)
We identify homeowners currently listing their homes for sale — people who are clearly moving. We run their address through CrissCross (skip tracing) to get phone numbers, then send outreach SMS via Twilio. When they respond, Charlie (via AI) handles the follow-up conversation. Our goal: find out WHERE they're moving to and offer to connect them with a top agent there.

────────────────────────────────
STEP 2 — COMMITMENT GATE (Automated)
────────────────────────────────
Before a client gets access to the deep AI interview, they must pass through our Commitment Gate. This is a 3-step screen:

1. Intro + Disclosure — explains what Gemini will do, that the call is recorded, and that the service is free
2. Contact Form — captures name, email, phone
3. Service Agreement — 5 checkboxes the client must personally confirm:
   • Service is free to them
   • Exclusive representation (they agree to use our referred agent)
   • Consent to recording and profile building
   • Staff review of their profile
   • All transaction communication flows through the Dyson platform

WHY THIS MATTERS: The exclusive representation clause is our referral fee protection. Once they click all 5 boxes, we have a documented agreement. This is your lead — protected.

────────────────────────────────
STEP 3 — GEMINI LIVE INTAKE SESSION (Automated)
────────────────────────────────
After the gate, the client enters a live voice-to-voice AI interview powered by Google Gemini. This is not a chatbot — this is real-time voice conversation. The session:

• Lasts 10–20 minutes
• Covers: destination city, neighborhoods, timeline, family, budget, buying vs. renting, priorities (schools, church, commute, etc.), employment situation, whether they're selling, special needs
• Is fully transcribed in real-time — every word saved
• Has a live timer and speaking indicators so clients know they're being heard

WHAT YOU DO DURING A SESSION: Nothing. It's fully automated. You will only get involved AFTER the session ends.

────────────────────────────────
STEP 4 — AUTOMATED DEBRIEF (Automated)
────────────────────────────────
When the session ends, Gemini analyzes the full transcript and extracts structured data:

• Destination city, current city, timeline
• Family composition (kids' ages, pets, special needs)
• Budget range (mapped to our internal pricing tiers)
• Top priorities (schools, church, commute, safety, etc.)
• Whether they're selling their current home
• Employment situation
• Action items mentioned during the call

This data is automatically:
1. Saved to the RelocationClient profile in the admin database
2. Converted into RelocationTask records (their move checklist)
3. Flagged for staff review in the admin panel
4. Logged as a ChatMessage transcript

────────────────────────────────
STEP 5 — STAFF REVIEW & AGENT MATCHING (Human)
────────────────────────────────
THIS IS WHERE YOU COME IN. After the automated steps, a staff member:

1. Opens the AdminClients panel and reviews the new profile
2. Reads the AI-generated summary and transcript
3. Reviews the action items created
4. Uses judgment to select the best agent match from our network
5. Sends a formal referral proposal to the selected agent (automated email)
6. Monitors agent acceptance and agreement signing

Your job is to be the quality layer between AI and the client. The AI gathers raw data. You make the judgment call on the right agent fit.

────────────────────────────────
STEP 6 — AGENT MATCHING & AGREEMENT (Human + Automated)
────────────────────────────────
Once you identify the right agent for the client:

1. A ReferralProposal record is created in the admin panel
2. The system sends the agent an email with a unique accept/reject link
3. Agent reviews: referral fee (25%), relocation management fee (15%), client brief
4. Agent accepts → digital agreement is executed → AgentReferral record is created
5. Agent is introduced to the client via the Dyson platform (all comms captured)

WHY ALL COMMS GO THROUGH THE PLATFORM: We maintain visibility on every conversation. If an agent tries to "cut us out," we have documented evidence. This also protects the client — we can monitor for quality and intervene if needed.

────────────────────────────────
STEP 7 — ACTIVE RELOCATION & CHARLIE SUPPORT (Automated + Human)
────────────────────────────────
Once matched:
• Charlie continues to serve the client 24/7 via the chat interface
• RelocationTasks are tracked and updated
• CityGuide provides neighborhood research
• Charlie can help with schools, utilities, healthcare, community connections
• Staff spot-checks conversations flagged by the system

────────────────────────────────
STEP 8 — CLOSE & GET PAID (Human)
────────────────────────────────
When the client closes on their new home:
1. Verify the referral fee has been triggered in the agent agreement
2. Confirm agent's close date in the AgentReferral record
3. Invoice the receiving broker for the 25% referral fee + 15% relocation management fee
4. Mark fees_paid = true in the system
5. Follow up with client for NPS survey and potential seller referral (they may now be selling their old home — another lead!)

CYCLE COMPLETE. One family, two potential transactions (buy + sell). That's the full flywheel.`
  },
  {
    id: 'process-commitment-gate',
    title: '🔐 Commitment Gate — Deep Dive',
    icon: Shield,
    content: `THE COMMITMENT GATE — YOUR REFERRAL FEE PROTECTION LAYER

The Commitment Gate is the most legally and commercially important piece of the platform. It exists for one reason: to secure your referral fee before you invest time and resources matching a client.

────────────────────────────────
THE THREE SCREENS
────────────────────────────────

SCREEN 1: Intro & Disclosure
Shows the client:
• What Gemini AI is and how it works
• That the session is recorded and summarized
• That their profile is reviewed by human Dyson staff
• That the service is 100% free to them
• A disclosure about Google Gemini powering the interview

Purpose: Informed consent. Clients who understand the process trust it more and ghost less.

SCREEN 2: Contact Form
Captures: Full name, email address, phone (optional)
Why: This is how we build the RelocationClient record and how we reach them after the session.

SCREEN 3: Service Agreement (The 5 Commitments)
Each item must be individually checked — not a single "I agree" button. This creates deliberate, documented consent.

The 5 Items:
1. "Service is free to me — agents handle compensation" → Sets expectation, no surprise later
2. "I will work exclusively with a Dyson-referred agent for my destination purchase" → THIS IS YOUR PROTECTION. They cannot go around you.
3. "I consent to this conversation being recorded and summarized" → Legal recording consent
4. "My profile will be reviewed by Dyson staff to match me with the right agent" → Sets expectation for human review
5. "All official transaction communications will flow through the Dyson platform" → Controls the communication channel

────────────────────────────────
WHY THE GATE IS NON-NEGOTIABLE
────────────────────────────────
Without the gate, you can spend 20 minutes matching a client with an agent, they close 6 months later, and the agent claims they found the buyer themselves. With the gate:

• You have a timestamped, name + email documented agreement
• You have proof of exclusive representation
• You have communication channel control (platform-first model)
• You have a legal basis for the referral fee claim

Never skip the gate. Never "let someone start the session early." The gate IS the contract.

────────────────────────────────
WHAT HAPPENS AFTER THE GATE
────────────────────────────────
After all 5 boxes are checked:
1. Client info (name, email, phone) is passed to the Gemini Live session
2. The GeminiLiveSession component initializes with their info
3. A ChatMessage record is created: "[GEMINI LIVE SESSION STARTED] Client: [name]"
4. The live voice interview begins

The gate data becomes the ClientInfo object that travels through the entire session pipeline and gets saved to the RelocationClient profile during the debrief phase.`
  },
  {
    id: 'process-gemini-debrief',
    title: '🤖 Gemini Debrief — How AI Builds the Profile',
    icon: Zap,
    content: `THE GEMINI DEBRIEF — TURNING VOICE CONVERSATIONS INTO STRUCTURED DATA

After every Gemini Live session ends, an automated AI debrief runs in the backend. This is what converts a 15-minute voice conversation into an actionable client file. Understanding this process is critical — it's what makes the system work without manual data entry.

────────────────────────────────
WHAT TRIGGERS THE DEBRIEF
────────────────────────────────
When a client clicks "End Session & Build Profile," the following happens automatically:
1. The WebSocket connection closes
2. The full transcript (every spoken word) is sent to the geminiDebrief backend function
3. Gemini 2.5 Flash analyzes the transcript
4. Structured JSON data is extracted
5. Data is saved to multiple entities simultaneously

────────────────────────────────
WHAT GEMINI EXTRACTS
────────────────────────────────
From a raw conversation, the AI pulls:

LOCATION DATA
• destination_city — "Austin, TX" not just "Austin"
• current_city — where they're moving FROM
• move_timeline — "3–6 months", "end of summer", etc.

FAMILY DATA
• family_size — number of people moving
• family_details — kids' ages, pets, elderly parents, special needs

FINANCIAL DATA
• budget_range — price range mentioned (mapped to our enum tiers)
• purchase_type — buying vs. renting

PRIORITY DATA
• priorities array — mapped from conversational language to our standard tags:
  - "my kids need good schools" → ['schools']
  - "we go to church every Sunday" → ['religious_community']
  - "I need to be close to MD Anderson" → ['healthcare']
  - "love walkable neighborhoods" → ['walkability']

EMPLOYMENT DATA
• employment — remote/transferring/job searching/employed locally

ADDITIONAL CONTEXT
• selling_current_home — true/false (potential second transaction!)
• personality_notes — lifestyle preferences, city vs. suburbs, introvert/extrovert
• agent_personality_match — notes on what type of agent personality fits them
• special_needs — medical, accessibility, elderly care
• action_items — EVERY specific task they mention (flight research, school tours, etc.)
• summary — 2-3 sentence human-readable summary for the matching agent

────────────────────────────────
WHERE THE DATA GOES
────────────────────────────────

1. RelocationClient entity — profile created or updated with all fields
2. RelocationTask entity — one task per action item, auto-categorized:
   • "check school ratings" → category: schools
   • "set up electricity" → category: utilities
   • "research pediatricians" → category: healthcare
   • "find Catholic church nearby" → category: social
3. ChatMessage entity — full transcript saved verbatim for staff review
4. ChatMessage entity (second record) — admin alert flagged for review:
   "[NEW CLIENT READY FOR AGENT MATCHING]" with summary, destination, budget, timeline

────────────────────────────────
HOW TO READ A DEBRIEF AS STAFF
────────────────────────────────
In the AdminClients panel:
1. Find the new client (sorted by created_date)
2. Read the notes field — this is the AI-generated summary
3. Check their priorities array — these drive the agent match
4. Look for selling_current_home = true — this means a potential seller referral too
5. Check agent_personality_match notes — use this to select the right agent personality
6. Review their action items in RelocationTasks — this is your follow-up checklist

THE DEBRIEF IS YOUR BRIEFING DOCUMENT. Before you pick up the phone or send a single email about this client, read their debrief. Everything you need to match them correctly is in there.

────────────────────────────────
FAILURE MODES & HOW TO HANDLE THEM
────────────────────────────────
If the client ends the session early (< 5 minutes):
• Debrief still runs — just with less data
• Profile will have nulls for some fields
• Staff should follow up via email to complete the intake

If Gemini extraction fails:
• Raw transcript is always saved as a ChatMessage
• Staff can manually read transcript and update the RelocationClient record
• Never lose a lead because of a technical failure — the transcript is always the backup

If client skips the gate and calls directly:
• NEVER match an agent without gate completion
• Direct them to complete the online agreement first
• Use your judgment on high-value clients — but get the agreement before agent introduction`
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
  },
  {
    id: 'referral-flow-mockup',
    title: '🎯 Referral Flow Mockup',
    icon: FileText,
    isComponent: true,
    component: ReferralFlowMockup
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
                  {section.isComponent ? (
                    <div style={{ color: '#333' }}>
                      {<section.component />}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none" style={{ color: '#333' }}>
                      {section.content.split('\n\n').map((para, i) => (
                        <p key={i} className="mb-4 leading-relaxed whitespace-pre-wrap text-sm">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
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
          <p>Business Plan v2.0 • Last Updated: March 15, 2026 • Includes Full Operational Process Guides</p>
        </motion.div>
      </main>
    </div>
  );
}