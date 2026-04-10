import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, FileText, TrendingUp, Zap, Shield, BarChart3, Mic, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GOLD = '#D4AF37';

const sections = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    icon: FileText,
    content: `Dyson & Dyson Concierge Relocation Services is a fully independent relocation management company — not a brokerage, not an agent network, not a listing service. We manage the entire relocation experience for families moving across the country, from first question to final walkthrough. The service is 100% free to buyers. Always.

THE LEGACY:
Founded by Bob Dyson — builder of Red Carpet Corporation of America, growing it from 500 to 1,600+ offices with 45,000 agents across 42 states. Bob served as Chief Pilot for the Governor of Oklahoma and has operated at every level of real estate for 54+ years. We use this legacy of scale to vet every local agent we partner with today. That credibility is irreplaceable and not reproducible by any tech company.

Market Opportunity: 8–9 million households relocate annually in the US. The relocation market is fragmented and painful — consumers coordinate real estate agents, movers, utilities, schools, and healthcare across multiple vendors with no central guide. Dyson consolidates this into one managed experience.

The Dyson Philosophy: We intentionally work with a limited number of families at any given time. This is not exclusivity for its own sake — it is a commitment to quality. Real relocation management demands intensive focus, deep local knowledge, timeline coordination, and relentless attention to detail. We are not scaling a service. We are delivering one.

Business Model: Free-to-consumer, agent-funded revenue:
• 25% referral fee on buyer-side commission (from receiving agent at close)
• 10–15% relocation management fee (from seller at close of their current home)
• Both fees disclosed transparently upfront — zero surprises

Licensed: The Dyson & Dyson Companies, Inc. CA DRE # 02303118`
  },
  {
    id: 'consumer-value',
    title: 'Consumer Value Proposition',
    icon: TrendingUp,
    content: `Why Relocating Families Choose Dyson:

WHAT CHARLIE DOES FOR EVERY CLIENT:
• Neighborhood Research: AI-powered analysis matched to lifestyle, commute, schools, safety, community
• 24/7 AI Concierge: Charlie answers every question about the new city, anytime, at no cost
• Agent Selection: Charlie interviews the client on agent personality fit, then we evaluate the top 20 agents in the destination market — DRE ratings, production records, personality screened by Bob Dyson personally. We present 3–5 curated candidates. Client chooses. No "I love me" agents chasing a deal.
• Moving Logistics: From packing to delivery — Charlie manages the entire moving checklist
• Utilities & Services: Internet, electric, gas, water — all transferred and set up before arrival
• School Enrollment: District research, school tours, enrollment paperwork
• Healthcare Setup: Top-rated doctors, dentists, and specialists in the new area
• Zero Cost to Buyers: Completely free — always

THE GEMINI SESSION — BY INVITATION ONLY:
After a client confirms their information, we schedule a private 3-way live session:
• The client and their family
• Google Gemini AI — one of the most advanced AI systems in the world
• Bob Dyson — 40+ years of hands-on real estate expertise

In this session we build the complete relocation profile together, in real time. It is not a chatbot form. It is a real conversation. This session is by invitation only — we are selective about who we work with to ensure everyone gets the intensive, hands-on attention they deserve.

THE CLIENT DASHBOARD:
Every client gets a personalized dashboard showing their full moving timeline, matched listings, completed/pending tasks, Charlie chat history, neighborhood research, and offer/escrow status. Everything in one place, on any device.`
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
  THE FREEMIUM VOICE MOAT STRATEGY
  ────────────────────────────────
  To manage high V2V costs ($0.35/min) and latency, we use a tiered approach:

  CHARLIE (STAGE 1): Uses pre-recorded scripts (ElevenLabs or Google TTS) to greet and qualify.
  • Cost: ~$0.01 per greeting
  • Purpose: Initial contact, lead qualification, engagement
  • Availability: 24/7 automated responses

  THE COMMITMENT GATE: Users must agree to the Referral Agreement before accessing live voice.
  • Filters for high-intent leads
  • Establishes exclusive representation and referral fee protection
  • Legal consent layer for recording and profile building

  GEMINI LIVE (STAGE 2): High-intent users get a 10-minute 'Premium Advisory Session' ($7.00 cap) to build their relocation profile.
  • Cost: ~$3.50 per session (capped at 10 min)
  • Purpose: Deep-dive intake, comprehensive profile building, personalized guidance
  • Availability: On-demand for committed users

  STRATEGIC VALUE: This filters for high-intent leads for our agents while providing a 'First-to-Market' human-like AI experience. You're not burning V2V costs on tire-kickers — only on users who've signed the agreement and demonstrated intent. This creates a powerful conversion funnel while keeping infrastructure costs predictable.

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
    content: `1. Bob Dyson's 40+ Year Track Record: This is not a startup guessing at real estate. Bob built and sold a 1,600-office, 45,000-agent network. He has operated at every level of this industry. That credibility is irreplaceable and not reproducible by a tech company.

2. The Human + AI Model: We don't choose between technology and expertise — we combine them. AI provides speed, scale, and 24/7 availability. Bob and our team provide judgment, trust, and accountability. Every major recommendation is reviewed by a human expert before reaching the client. No competitor is doing this at this level.

3. Intentionally Limited Intake: We do not race to scale. We work with a limited number of clients at any time because we refuse to compromise on quality. This creates a sense of invitation and exclusivity that premium clients respond to — and it protects our service standard.

4. Listing Agent Partnership Model: We turn every listing agent into a referral partner. At their listing presentation, they can offer a complete concierge relocation service to their sellers — at zero cost to the agent or seller. They earn 25% at close. We handle everything. This creates a distribution channel most relocation companies don't have.

5. The Presentation Library: All agent-facing, client-facing, and receiving-agent materials are stored, versioned, and deliverable from a central admin hub. No more ad-hoc PDFs or inconsistent pitches.

6. Communication Threading: Every SMS and email with clients and agents is logged, searchable, and threaded in the admin panel. Full conversation history. No context is ever lost.

7. Data Moat: PropStream property data, CrissCross skip trace, Google Gemini web search, and growing transaction history create a defensible intelligence layer no individual agent can replicate.

8. End-to-End Integration: Competitors solve one problem. We solve the entire journey — agent, city, move, utilities, schools, healthcare, and beyond.

9. Luxury Positioning: Premium brand design and Bob's direct personal engagement position Dyson above commoditized platforms (Zillow, Redfin). Appeals to serious relocating families who want a trusted advisor, not an algorithm.`
  },
  {
    id: 'growth-roadmap',
    title: 'Growth Roadmap & SMS Workflow',
    icon: TrendingUp,
    content: `SMS OUTREACH ENGINE — 5-STEP ACQUISITION SYSTEM

1. DATA AGGREGATION via PropStream
Log into PropStream, search active listings by city/zip/price range, and export the MLS list. This file has addresses and prices — but NO phone numbers yet. Do NOT import into Base44 at this stage.

2. SKIP TRACING for Direct Contact
Run SkipTrace on your MLS list inside PropStream (~$0.10–$0.15/record). Download the SkipTrace Export — it contains Owner Name, Cell Phone 1, Cell Phone 2, Property Address. THIS is the file you import into Base44.

3. BASE44 CRM INTEGRATION
In Admin → Listing Owners → Import CSV. Select your SkipTrace file. Preview confirms owner names, phone formatting, address presence. Click "Import X Owners." All contacts enter the system as: not_contacted.

4. TWILIO / SMS MULTI-PHASE OUTREACH (Phase 1–7)
• Phase 1 — Get list from PropStream MLS
• Phase 2 — Run SkipTrace in PropStream
• Phase 3 — Import SkipTrace into Base44
• Phase 4 — Send campaign via Admin → Compose SMS
• Phase 5 — Monitor replies automatically: STOP → opt_out, YES → opt_in, other → in_conversation
• Phase 6 — Day 3 and Day 7 follow-up sends
• Phase 7 — Track everything: Batch SMS Logs, Outreach Pipeline, New Opt-Ins, Active Campaigns

5. GMAIL AUTO-REPLY TRACKING
Bob's Gmail is monitored in real-time for replies matching an owner's email. YES → interested. STOP → OptOut table. All other replies → in_conversation with content saved to notes.

────────────────────────────────
PHASE EXPANSION ROADMAP
────────────────────────────────

Phase 1 — NOW: Charlie live 24/7, Gemini Session pipeline operational, Admin panel fully active, Listing Agent outreach running.

Phase 2 (Months 3–9): Recruit agents in Austin, Denver, Charlotte, Nashville, Phoenix. Launch Receiving Agent network.

Phase 3 (Months 9–18): Scale intake, corporate relocation partnerships, Delta Report automation.

Phase 4 (Year 2+): Canada, UK, Mexico expansion. Rental product, insurance partnerships, investment syndication.

THE FLYWHEEL:
One family → two potential transactions (buy + sell) → two referral fees → agent refers next client → more families → better data → better matches → more families.`
  },
  {
    id: 'social-launch',
    title: 'Social Launch & Content Strategy',
    icon: Share2,
    content: `SOCIAL MEDIA PILLAR — POSITIONING BOB DYSON AS THE ORACLE OF RELOCATION

The Goal:
Position Bob Dyson as the "Oracle of Relocation" by leveraging his 54-year industry legacy. No competitor can match this combination of scale, longevity, and current AI adoption.

Content Pillars:
1. "Then vs. Now" — Historic vs. modern real estate comparisons. Side-by-side snapshots of what buying a home looked like in 1972, 1995, 2010, and today. Data-driven, shareable, and impossible to argue with.

2. "AI Charlie" Spotlights — Showcasing the precision of the relocation engine. Short-form demos of Charlie in action: answering neighborhood questions, comparing schools, walking a buyer through the commitment gate. Show the product, not just the promise.

3. "The 1927 Parallel" — Authority deep dives. The signature series connecting the invention of synchronized sound in film to the emergence of voice-to-voice AI in real estate. Frames Charlie as the "talkie moment" for the industry.

Posting Frequency:
3x weekly high-authority posts on LinkedIn and Instagram. Consistent 90-day cadence builds algorithmic momentum and audience trust before any paid amplification.

Call to Action:
Every post directs users to the Gold Pill search bar — "Considering a move? Where are you going?" — to start their custom relocation roadmap. One destination. One action.

Platform Notes:
• LinkedIn: Long-form authority content targeting listing agents, corporate HR relocation coordinators, and real estate professionals.
• Instagram: Visual storytelling — then/now photos, Charlie clips, neighborhood reels.
• Engagement: Every comment replied to within 24 hours. Every DM from a relocating family routed to Charlie intake.`
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
    id: 'listing-agent-model',
    title: '🤝 Listing Agent Partnership Model',
    icon: TrendingUp,
    content: `THE LISTING AGENT DISTRIBUTION CHANNEL — HOW WE GROW WITHOUT ADVERTISING

The most powerful growth lever in this business is the listing agent. Every agent who lists a relocating seller becomes a potential Dyson distribution partner. Here's the full model:

────────────────────────────────
THE AGENT'S ROLE
────────────────────────────────
The listing agent does ONE thing: at their listing presentation, they say:
"I've partnered with Dyson & Dyson to offer you a complete concierge relocation service — at zero cost to you. They'll handle your entire move: agent selection in your new city, neighborhood research, moving logistics, utilities, schools, healthcare — everything. And they're free."

That's it. They hand the seller to us. We do everything else.

WHAT THE AGENT GETS:
• 25% referral fee at close of the buyer's new home
• Zero added workload — we handle 100% of the relocation
• Transaction portal access: read-only visibility into the client's move milestones
• Their client comes back after the move and refers them friends ("You were amazing, you helped us with everything")

────────────────────────────────
THE PRESENTATION LIBRARY
────────────────────────────────
Every listing agent gets access to a presentation kit stored in the admin Presentation Library:

1. Listing Agent Partnership Presentation (8 slides)
   — For agents to understand the model and pitch to their sellers

2. Client Welcome & Relocation Overview (8 slides)
   — For sellers to understand what they're getting

3. Receiving Agent Program (in development)
   — For agents in destination cities who receive our referrals

4. AI Explainer: The 1927 Parallel (4 slides)
   — For skeptical agents/clients who don't yet understand AI's role

All presentations are manageable from the admin panel — click, send as link, edit, or remove.

────────────────────────────────
THE AGENT FEE STRUCTURE
────────────────────────────────
Example on a $600,000 new home:
• Buyer's agent commission: 2.5% = $15,000
• Agent's 25% referral share = $3,750 paid at close
• Our relocation management fee: 10–15% from seller at close of THEIR home

The agent earns $3,750 by saying one sentence at a listing appointment. That's the pitch.`
  },
  {
    id: 'interview-gate',
    title: '🎙️ Interview & Approval Gate',
    icon: Shield,
    content: `THE INTERVIEW GATE — QUALITY CONTROL BEFORE AGENT MATCHING

Not every client who completes the Gemini session gets matched with an agent immediately. We have an Interview & Approval layer that ensures we're working with serious, high-intent families who are the right fit for our model.

────────────────────────────────
WHY THE INTERVIEW EXISTS
────────────────────────────────
Bob Dyson interviews every client personally (or reviews their Gemini session transcript) before any agent is introduced. This exists for three reasons:

1. QUALITY PROTECTION: We vouch for every client we send to an agent. Our reputation with our agent network depends on referral quality. We don't send unqualified leads.

2. CAPACITY MANAGEMENT: We work with a limited number of families at any time. The interview is how we determine who gets one of those limited spots.

3. FEE PROTECTION: A serious, committed client is far more likely to close — and therefore generate the referral fee that funds the entire service.

────────────────────────────────
THE INTERVIEW WORKFLOW
────────────────────────────────
STEP 1: Client completes Gemini Session
→ Profile auto-created in AdminClients panel
→ Interview record created with status "pending"

STEP 2: Admin schedules interview
→ Interview record updated with scheduled_date
→ Client notified (email/SMS)

STEP 3: Bob or team conducts interview
→ Interview notes recorded: family dynamics, intent, engagement level, timeline, financial readiness
→ Status updated to "completed"

STEP 4: Approval decision
→ APPROVED: Client advances to agent matching. Gemini session scheduled.
→ REJECTED: Client notified gracefully. Referral to other services if appropriate.
→ Approval notes recorded for internal reference.

────────────────────────────────
WHAT WE'RE LOOKING FOR IN AN INTERVIEW
────────────────────────────────
• Clear destination city and timeline (not "maybe someday")
• Financial readiness (pre-qualified or strong buyer signals)
• Family engagement — both decision-makers involved, not just one
• Genuine relocation (not fishing for free information)
• Willingness to work exclusively with our referred agent

────────────────────────────────
ADMIN PANEL: INTERVIEW MANAGEMENT
────────────────────────────────
All interviews are tracked in the AdminInterviews panel:
• View all pending, completed, approved, and rejected interviews
• Record interview notes and approval decisions
• Track which clients have had their Gemini session scheduled post-approval
• Monitor approval rates and interview-to-close pipeline

This gate is what separates a serious relocation management firm from a lead generation website. We earn trust with agents by only sending them clients we've personally vetted.`
  },
  {
    id: 'sms-campaign-process',
    title: '📲 SMS Campaign Process (Step-by-Step)',
    icon: Zap,
    content: `SMS OUTREACH CAMPAIGN — COMPLETE OPERATIONAL GUIDE
From PropStream → SkipTrace → Base44 → Twilio → Inbox

This is the end-to-end process for every outbound SMS campaign. Follow these steps in order every time. Do not skip phases.

────────────────────────────────
PHASE 1 — GET YOUR LIST FROM PROPSTREAM MLS
────────────────────────────────
1. Log into PropStream (propstream.com)
2. Search by city/zip, filter by: Active Listings, desired property type, price range
3. Export the list as CSV or Excel — this is your MLS Export
⚠️ IMPORTANT: This file has addresses and prices but NO phone numbers yet.
   Do NOT import this file into Base44 — you will get a warning that phones are missing.

────────────────────────────────
PHASE 2 — RUN SKIPTRACE IN PROPSTREAM
────────────────────────────────
1. In PropStream, upload or select your MLS list
2. Run SkipTrace on the list (costs credits — approx. $0.10–$0.15 per record)
3. Wait for SkipTrace to complete — PropStream emails you when it's done
4. Download the SkipTrace Export
   ✅ THIS is the file you import into Base44 — NOT the MLS export
   The SkipTrace file contains: "Owner 1 First Name", "Owner 1 Last Name", "Cell Phone 1", "Cell Phone 2", "Property Street Address", etc.

────────────────────────────────
PHASE 3 — IMPORT INTO BASE44
────────────────────────────────
1. In the Admin panel, go to: Admin → Listing Owners (sidebar)
2. Click "Import CSV" (top right)
3. Select your SkipTrace Export file (.xlsx or .csv)
4. A PREVIEW SCREEN appears — verify:
   • Owner names look correct (First + Last combined properly)
   • Phone numbers are formatted as (XXX) XXX-XXXX
   • Addresses are present
   • File type detected as "PropStream SkipTrace"
5. Review the stats: Total Rows, With Phone %, With Name count
   ⚠️ If "With Phone" is 0% — you uploaded the MLS file, not the SkipTrace file. Go back.
6. Click "Import X Owners" to commit all records
✅ All contacts are now in the database with status: "not_contacted"

────────────────────────────────
PHASE 4 — SEND THE SMS CAMPAIGN
────────────────────────────────
1. Go to: Admin → Compose SMS (sidebar)
2. STEP 1 — Select a template:
   • "Owner Outreach SMS #1 — Day 1 Initial Outreach" for first contact
   • "Day 3 Follow-Up" or "Day 7 Follow-Up" for re-engagement
3. STEP 2 — Filter and select contacts:
   • Use the City dropdown to narrow to the city you just imported
   • Click "Select All" to grab all contacts with phone numbers
   • Use the 👁 eye icon on any row to preview the filled message for that specific owner
4. STEP 3 — Review the send summary:
   • Confirm template name, recipient count, and "Immediate" delivery
   • Review the selected names list
5. Click "Send Now to X Contacts"
✅ Messages fire immediately via Twilio. Contact statuses auto-update to "contacted."

────────────────────────────────
PHASE 5 — MONITOR REPLIES (AUTOMATIC)
────────────────────────────────
All replies are tracked automatically — no manual action needed:

SMS Replies (via Twilio webhook):
• "STOP" / "Unsubscribe" → contact_status = not_interested, logged to OptOut table
• "YES" / "Interested" → contact_status = interested, logged to OptIn table
• Any other reply → contact_status = in_conversation, logged with reply content

Email Replies to Bob's Gmail (via Gmail automation):
• Gmail is monitored in real-time for any email that matches an owner's email address
• "YES" / "Interested" keywords → contact_status = interested
• "STOP" / "Not Interested" → contact_status = not_interested, logged to OptOut
• All other replies → contact_status = in_conversation, email content saved to notes

────────────────────────────────
PHASE 6 — FOLLOW-UP SENDS (MANUAL CONTROL)
────────────────────────────────
After the initial send, you are in full control of follow-up timing:

Day 3 Follow-Up:
1. Go to Compose SMS
2. Filter by City, then filter contacts showing "not_contacted" or "contacted" but no reply
3. Select the Day 3 Follow-Up template
4. Send

Day 7 Follow-Up:
• Same process — use the Day 7 template
• At this point, if no reply, consider moving status to "not_interested" and archiving

────────────────────────────────
PHASE 7 — TRACK EVERYTHING
────────────────────────────────
• Admin → Batch SMS Logs: every city, send count, success rate, estimated duration, history
• Admin → Outreach Pipeline: funnel metrics, opt-in rates, conversion breakdown
• Admin → New Opt-Ins: everyone who responded YES — hot leads ready for follow-up
• Admin → Listing Owners: individual contact statuses per city, notes, phone numbers
• Admin → Active Campaigns: real-time view of any in-progress sends

────────────────────────────────
RULES — READ BEFORE EVERY CAMPAIGN
────────────────────────────────
✅ Always import the SkipTrace file, NOT the MLS file (MLS has no phones)
✅ Always check the Preview step before importing — catches formatting problems first
✅ Never re-import the same city twice — check Listing Owners first to avoid duplicates
✅ One city per campaign — keeps logs clean and errors isolated
✅ Do not send follow-up to anyone marked "not_interested" or "interested" — filter them out
✅ Confirm Twilio SMS budget before sending batches over 500 contacts

────────────────────────────────
WHAT EACH TOOL IS FOR
────────────────────────────────
• Compose SMS → Sending messages (manual, on-demand, you control when)
• Listing Owners → Viewing/editing all contacts by city, checking statuses
• Batch SMS Logs → Audit trail of every campaign ever sent
• Outreach Pipeline → Funnel analytics — how many converted, how many opted out
• New Opt-Ins → Hot list of people who said YES (follow these up immediately)
• Active Campaigns → Real-time progress of any in-flight batch`
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
    id: 'scripts-handoffs',
    title: '📝 Scripts & Hand-offs',
    icon: Mic,
    content: `────────────────────────────────
CONSUMER SCRIPT (CHARLIE'S INTRO)
────────────────────────────────
"I've prepared a private V2V session with Gemini—our most advanced advisor. To protect this premium experience, please confirm your Dyson Network commitment below to start your 10-minute deep-dive."

Purpose: Frames the Gemini Live session as an exclusive, premium benefit that requires commitment. Builds anticipation and positions the user to take action.

Delivery: Spoken by Charlie (text-to-speech or voice agent) right before the Commitment Gate. Sets expectations and creates a sense of exclusivity.

────────────────────────────────
AGENT SCRIPT (THE THREE-WAY)
────────────────────────────────
"I've brought Gemini into our call to analyze the data. Gemini, based on the new listing Sarah liked, how does the commute change compared to her original plan?"

Purpose: Introduces the Silent Moderator mode—Gemini is listening to agent-client conversations and detecting pivot points in real-time. Makes the agent look tech-forward and data-driven.

Delivery: Used by agents during live video or phone consultations with relocating buyers. Frames Gemini as a real-time analyst that improves the quality of the conversation.

Context: Gemini silently tracks:
- Budget shifts (e.g., "we can stretch to 650k now")
- Destination pivots (e.g., "Austin's looking good, but maybe Denver too")
- Timeline changes (e.g., "we need to close by Q2")
- Priority updates (e.g., "schools are the deal-breaker for us")
- Property type preferences (e.g., "maybe a condo instead of single-family")

────────────────────────────────
POST-SESSION EXECUTION: DELTA REPORT
────────────────────────────────
After every voice session (consumer Gemini session OR agent call with Silent Moderator), the system MUST automatically:

1. GENERATE: Delta Report (What Changed)
   - Compares session data to baseline moving plan
   - Extracts all detected pivot points
   - Creates human-readable summary: "Sarah's budget increased $100k, timeline moved up 2 months, priority shift toward walkable neighborhoods"

2. EMAIL BUYER: "Your Relocation Profile Updated"
   Subject: "What We Learned About Your Move – Delta Report"
   Content:
   - Highlights changes detected in the session
   - Confirms updated priorities, timeline, budget
   - Links to updated Moving Plan dashboard
   - CTA: "Schedule a walkthrough with your agent"

3. EMAIL AGENT: "Delta Report – New Intel on Your Buyer"
   Subject: "[BUYER NAME] – Relocation Profile Update"
   Content:
   - Agent-focused summary of changes
   - Budget, timeline, priority shifts
   - Actionable next steps (e.g., "Run new MLS search with updated criteria")
   - Data points to reference in next conversation

4. UPDATE SYSTEM: Moving Plan entity
   - All detected pivots logged to pivot_points array
   - Timestamps recorded for audit trail
   - Source tagged (voice_note, gemini_session, agent_call)
   - Automatic triggers: If major change detected (e.g., 25% budget increase), flag for agent review

TECHNICAL IMPLEMENTATION:
- Delta Report generation: Triggered by geminiDebrief function after every session ends
- Email distribution: Automated via SendEmail integration
- Data sync: Moving Plan updated in real-time with detected pivots
- Notification: Agent receives in-app alert + email notification

STRATEGIC VALUE:
✓ Keeps both parties informed with minimal admin overhead
✓ Surfaces real changes in buyer preferences as they happen
✓ Gives agents actionable intelligence for next conversation
✓ Creates system of record for all preference changes
✓ Reduces surprise objections ("I never said that") through documentation`
  },
  ];

export default function BusinessPlan() {
  const [expandedSection, setExpandedSection] = useState('executive-summary');
  const [localSections] = useState(sections);

  const exportToPDF = () => {
    alert('PDF export coming soon. For now, use browser Print to PDF.');
  };

  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-4">
          <Link to="/admin">
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
              {localSections.map((section) => {
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
            {localSections.map((section) => (
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
                      <p key={i} className="mb-4 leading-relaxed whitespace-pre-wrap text-sm">{para}</p>
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
          style={{ background: 'rgba(255,255,255,0.7)', color: '#f5f5f5' }}
        >
          <p>Business Plan v3.1 • Last Updated: April 4, 2026 • Added: SMS Campaign Process (Phase 1–7), PropStream → SkipTrace → Base44 → Twilio workflow, Gmail auto-reply tracking</p>
        </motion.div>
      </main>
    </div>
  );
}