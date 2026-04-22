import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, FileText, TrendingUp, Zap, Shield, BarChart3, Mic, Share2, Globe } from 'lucide-react';
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

  2. ZILLOW API
  Secondary listing data & market intelligence.

  3. REALTOR.COM API
  Complementary listing data & market trends

  4. ANGI (formerly ANGIE'S LIST)
  Home services & contractor data (for relocation move planning)

  5. CRISSCROSS (Skip Tracing)
  Seller contact data for outbound campaigns

  6. PROPSTREAM
  Property valuations, tax records, comparable sales

  7. PUBLIC DATA
  Census, school districts, tax records, neighborhood fundamentals

  8. GOOGLE GEMINI API (LLM + Web Search)
  Real-time synthesis and enrichment via internet search
  Charlie uses Gemini 3 Flash/Pro with add_context_from_internet=true

  ────────────────────────────────
  TECHNOLOGY PARTNERS
  ────────────────────────────────

  1. GOOGLE GEMINI API — AI concierge, live voice interviews, synthesis
  2. BASE44 PLATFORM — Database, functions, auth, integrations
  3. TWILIO — SMS & Communication for seller outreach campaigns
  4. GOOGLE WORKSPACE — Docs, Sheets, Drive for admin operations

  ────────────────────────────────
  THE FREEMIUM VOICE MOAT STRATEGY
  ────────────────────────────────
  CHARLIE (STAGE 1): Pre-recorded scripts to greet and qualify. Cost ~$0.01 per greeting.
  THE COMMITMENT GATE: Users must agree before accessing live voice. Filters high-intent leads.
  GEMINI LIVE (STAGE 2): High-intent users get a 10-minute Premium Advisory Session (~$3.50 cap).

  STRATEGIC VALUE: Filters for high-intent leads while providing a first-to-market human-like AI experience.`
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

3. Intentionally Limited Intake: We do not race to scale. We work with a limited number of clients at any time because we refuse to compromise on quality. This creates a sense of invitation and exclusivity that premium clients respond to.

4. Listing Agent Partnership Model: We turn every listing agent into a referral partner. At their listing presentation, they can offer a complete concierge relocation service to their sellers — at zero cost to the agent or seller. They earn 25% at close. We handle everything.

5. The Presentation Library: All agent-facing, client-facing, and receiving-agent materials are stored, versioned, and deliverable from a central admin hub.

6. Communication Threading: Every SMS and email with clients and agents is logged, searchable, and threaded in the admin panel. Full conversation history. No context is ever lost.

7. Data Moat: PropStream property data, CrissCross skip trace, Google Gemini web search, and growing transaction history create a defensible intelligence layer no individual agent can replicate.

8. End-to-End Integration: Competitors solve one problem. We solve the entire journey — agent, city, move, utilities, schools, healthcare, and beyond.

9. Luxury Positioning: Premium brand design and Bob's direct personal engagement position Dyson above commoditized platforms (Zillow, Redfin).`
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
1. "Then vs. Now" — Historic vs. modern real estate comparisons. Side-by-side snapshots of what buying a home looked like in 1972, 1995, 2010, and today.

2. "AI Charlie" Spotlights — Showcasing the precision of the relocation engine. Short-form demos of Charlie in action: answering neighborhood questions, comparing schools, walking a buyer through the commitment gate.

3. "The 1927 Parallel" — Authority deep dives. The signature series connecting the invention of synchronized sound in film to the emergence of voice-to-voice AI in real estate.

Posting Frequency:
3x weekly high-authority posts on LinkedIn and Instagram. Consistent 90-day cadence builds algorithmic momentum and audience trust before any paid amplification.

Call to Action:
Every post directs users to the Gold Pill search bar — "Considering a move? Where are you going?" — to start their custom relocation roadmap.

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

STEP 1 — CLIENT ACQUISITION (Automated)
Clients come in two ways:
A) Inbound via Website / App — potential relocating family visits dysonanddyson.com, interacts with Charlie, and either chats or books a live Gemini session.
B) Outbound Seller Outreach — we identify homeowners listing their homes, run skip tracing to get phone numbers, send outreach SMS via Twilio.

STEP 2 — COMMITMENT GATE (Automated)
Before a client gets access to the deep AI interview, they must pass through our Commitment Gate:
1. Intro + Disclosure
2. Contact Form — captures name, email, phone
3. Service Agreement — 5 checkboxes the client must personally confirm

STEP 3 — GEMINI LIVE INTAKE SESSION (Automated)
After the gate, the client enters a live voice-to-voice AI interview powered by Google Gemini. Lasts 10–20 minutes. Fully transcribed in real-time.

STEP 4 — AUTOMATED DEBRIEF (Automated)
When the session ends, Gemini analyzes the full transcript and extracts structured data. Saved to RelocationClient profile, converted into RelocationTask records, flagged for staff review.

STEP 5 — STAFF REVIEW & AGENT MATCHING (Human)
THIS IS WHERE YOU COME IN. After the automated steps, a staff member reviews the new profile, reads the AI-generated summary, and selects the best agent match.

STEP 6 — AGENT MATCHING & AGREEMENT (Human + Automated)
ReferralProposal created → agent receives email with accept/reject link → agent accepts → digital agreement executed → agent introduced to client.

STEP 7 — ACTIVE RELOCATION & CHARLIE SUPPORT (Automated + Human)
Charlie continues to serve the client 24/7. RelocationTasks tracked and updated. Staff spot-checks flagged conversations.

STEP 8 — CLOSE & GET PAID (Human)
Verify referral fee triggered → confirm close date → invoice receiving broker → mark fees_paid = true → follow up for NPS survey.

CYCLE COMPLETE. One family, two potential transactions (buy + sell). That's the full flywheel.`
  },
  {
    id: 'process-commitment-gate',
    title: '🔐 Commitment Gate — Deep Dive',
    icon: Shield,
    content: `THE COMMITMENT GATE — YOUR REFERRAL FEE PROTECTION LAYER

SCREEN 1: Intro & Disclosure
Shows the client what Gemini AI is, that the session is recorded, that their profile is reviewed by human Dyson staff, and that the service is 100% free to them.

SCREEN 2: Contact Form
Captures: Full name, email address, phone (optional)

SCREEN 3: Service Agreement (The 5 Commitments)
1. "Service is free to me — agents handle compensation"
2. "I will work exclusively with a Dyson-referred agent for my destination purchase" → THIS IS YOUR PROTECTION.
3. "I consent to this conversation being recorded and summarized"
4. "My profile will be reviewed by Dyson staff to match me with the right agent"
5. "All official transaction communications will flow through the Dyson platform"

WHY THE GATE IS NON-NEGOTIABLE:
Without the gate, you can spend 20 minutes matching a client with an agent, they close 6 months later, and the agent claims they found the buyer themselves. With the gate you have timestamped, documented agreement + proof of exclusive representation + legal basis for the referral fee claim.

Never skip the gate. Never "let someone start the session early." The gate IS the contract.`
  },
  {
    id: 'process-gemini-debrief',
    title: '🤖 Gemini Debrief — How AI Builds the Profile',
    icon: Zap,
    content: `THE GEMINI DEBRIEF — TURNING VOICE CONVERSATIONS INTO STRUCTURED DATA

WHAT TRIGGERS THE DEBRIEF:
When a client clicks "End Session & Build Profile," the full transcript is sent to the geminiDebrief backend function. Gemini 2.5 Flash analyzes it and extracts structured JSON data saved to multiple entities simultaneously.

WHAT GEMINI EXTRACTS:
• destination_city, current_city, move_timeline
• family_size, family_details (kids' ages, pets, special needs)
• budget_range, purchase_type (buying vs. renting)
• priorities array mapped from conversational language to standard tags
• employment situation
• selling_current_home (true/false — potential second transaction!)
• action_items — every specific task they mention
• summary — 2-3 sentence human-readable summary for the matching agent

WHERE THE DATA GOES:
1. RelocationClient entity — profile created or updated
2. RelocationTask entity — one task per action item, auto-categorized
3. ChatMessage entity — full transcript saved verbatim
4. ChatMessage entity (second) — admin alert flagged for review

HOW TO READ A DEBRIEF AS STAFF:
In AdminClients panel: find new client → read notes (AI summary) → check priorities array → look for selling_current_home = true → check agent_personality_match notes → review action items in RelocationTasks.

THE DEBRIEF IS YOUR BRIEFING DOCUMENT. Before you pick up the phone or send a single email about this client, read their debrief.`
  },
  {
    id: 'listing-agent-model',
    title: '🤝 Listing Agent Partnership Model',
    icon: TrendingUp,
    content: `THE LISTING AGENT DISTRIBUTION CHANNEL — HOW WE GROW WITHOUT ADVERTISING

THE AGENT'S ROLE:
The listing agent does ONE thing: at their listing presentation, they say:
"I've partnered with Dyson & Dyson to offer you a complete concierge relocation service — at zero cost to you."

That's it. They hand the seller to us. We do everything else.

WHAT THE AGENT GETS:
• 25% referral fee at close of the buyer's new home
• Zero added workload — we handle 100% of the relocation
• Transaction portal access: read-only visibility into the client's move milestones
• Their client comes back after the move and refers them friends

THE PRESENTATION LIBRARY:
1. Listing Agent Partnership Presentation (8 slides)
2. Client Welcome & Relocation Overview (8 slides)
3. Receiving Agent Program (in development)
4. AI Explainer: The 1927 Parallel (4 slides)

THE AGENT FEE STRUCTURE:
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

WHY THE INTERVIEW EXISTS:
Bob Dyson interviews every client personally (or reviews their Gemini session transcript) before any agent is introduced:
1. QUALITY PROTECTION: We vouch for every client we send to an agent.
2. CAPACITY MANAGEMENT: We work with a limited number of families at any time.
3. FEE PROTECTION: A serious, committed client is far more likely to close.

THE INTERVIEW WORKFLOW:
STEP 1: Client completes Gemini Session → Profile auto-created → Interview record created with status "pending"
STEP 2: Admin schedules interview → Client notified
STEP 3: Bob or team conducts interview → Notes recorded → Status updated to "completed"
STEP 4: Approval decision → APPROVED: Client advances to agent matching. REJECTED: Client notified gracefully.

WHAT WE'RE LOOKING FOR:
• Clear destination city and timeline (not "maybe someday")
• Financial readiness (pre-qualified or strong buyer signals)
• Family engagement — both decision-makers involved
• Genuine relocation (not fishing for free information)
• Willingness to work exclusively with our referred agent

This gate is what separates a serious relocation management firm from a lead generation website.`
  },
  {
    id: 'sms-campaign-process',
    title: '📲 SMS Campaign Process (Step-by-Step)',
    icon: Zap,
    content: `SMS OUTREACH CAMPAIGN — COMPLETE OPERATIONAL GUIDE
From PropStream → SkipTrace → Base44 → Twilio → Inbox

PHASE 1 — GET YOUR LIST FROM PROPSTREAM MLS
1. Log into PropStream (propstream.com)
2. Search by city/zip, filter by: Active Listings, desired property type, price range
3. Export the list as CSV or Excel — this is your MLS Export
⚠️ IMPORTANT: This file has addresses and prices but NO phone numbers yet. Do NOT import this file into Base44.

PHASE 2 — RUN SKIPTRACE IN PROPSTREAM
1. In PropStream, upload or select your MLS list
2. Run SkipTrace on the list (costs credits — approx. $0.10–$0.15 per record)
3. Download the SkipTrace Export
✅ THIS is the file you import into Base44 — NOT the MLS export

PHASE 3 — IMPORT INTO BASE44
1. Admin → Listing Owners → Import CSV
2. Select your SkipTrace Export file (.xlsx or .csv)
3. Verify preview: owner names, phone numbers, addresses
4. Click "Import X Owners"
✅ All contacts enter with status: not_contacted

PHASE 4 — SEND THE SMS CAMPAIGN
1. Go to: Admin → Compose SMS
2. Select template (Day 1, Day 3, or Day 7)
3. Filter and select contacts by city
4. Review send summary
5. Click "Send Now to X Contacts"

PHASE 5 — MONITOR REPLIES (AUTOMATIC)
• "STOP" → contact_status = not_interested, logged to OptOut table
• "YES" → contact_status = interested, logged to OptIn table
• Any other reply → contact_status = in_conversation

PHASE 6 — FOLLOW-UP SENDS
Day 3 and Day 7 follow-ups via Compose SMS using corresponding templates.

PHASE 7 — TRACK EVERYTHING
• Admin → Batch SMS Logs
• Admin → Outreach Pipeline
• Admin → New Opt-Ins (hot leads — follow up immediately)
• Admin → Active Campaigns`
  },
  {
    id: 'dnn-broadcast-network',
    title: '📡 DNN Broadcast Intelligence Network',
    icon: Globe,
    content: `THE THIRD PILLAR STRATEGY — FROM CONCIERGE TO MEDIA ENTITY

Dyson & Dyson does not just manage relocations. We have repositioned as a broadcast intelligence network that serves the consumer daily — not just during a transaction. DNN (Digital News Network) is that daily touchpoint.

────────────────────────────────
WHY A NEWS NETWORK?
────────────────────────────────
Most real estate companies only have permission to contact a consumer when they're in a transaction. We want daily permission. DNN gives us that. When we deliver market-moving news daily, we build a subscriber audience that trusts us BEFORE they decide to move. That trust converts to leads, and those leads convert to referral fees.

────────────────────────────────
THE THREE PILLARS
────────────────────────────────

PILLAR 1: RELOCATION INTELLIGENCE (Consumer-Facing)
• DNN delivers AI-generated relocation market briefs daily
• Topics: interest rates, migration data, housing markets, tax policy, employer moves
• Subscribers receive these via email (Communications Hub blast) and in-app (DNN News Feed)
• Charlie is the bridge — every article ends with "Ask Charlie About This"
• Strategy: Educate the consumer into understanding that they need to relocate — then be the obvious solution

PILLAR 2: AGENT BUREAU (B2B Revenue)
• Partner agents ("Bureau Chiefs") pay to receive co-branded DNN intelligence for their farm
• Each Bureau Chief gets exclusive territory rights in their market
• DNN wraps our articles with "Intelligence brought to you by DNN in partnership with [Agent Name]"
• Bureau Chiefs get a subscriber silo — their clients get DNN content, but the agent gets the co-brand
• Revenue: monthly subscription per Bureau slot + 25% referral fee at close
• This turns our content into a B2B lead engine

PILLAR 3: FINANCIAL SERVICES NETWORK (Coming Q3 2026)
• Vetted lender network in each destination market
• DRE-compliant introductions — we never steer or recommend without disclosure
• Lenders pay a monthly subscription to be DNN-approved
• White-labeled rate intelligence: lender delivers our market briefs co-branded with their credentials
• Revenue: lender subscription + potential referral arrangement (structured for DRE compliance)

────────────────────────────────
THE SUBSCRIBER FLYWHEEL
────────────────────────────────
Homeowner lists (PropStream + SkipTrace)
  → SMS outreach → interested owners opt in
    → Owners become DNN Subscribers (Tier 1)
      → Daily intelligence builds trust
        → When they're ready to list, they call us first
          → Listing agent introduces Dyson concierge to their buyer
            → Buyer becomes a relocation client
              → Referral fee at close
                → Agent becomes a Bureau Chief

ONE HOMEOWNER → SUBSCRIBER → CLIENT → REVENUE → AGENT → MORE SUBSCRIBERS

────────────────────────────────
CHARLIE'S ROLE IN THE DNN NETWORK
────────────────────────────────
Charlie is the editorial voice of DNN from the consumer side. Every subscriber who reads a market brief and has a question gets routed to Charlie. Charlie's job in this context:
• Explain the news in plain language ("What does this rate hike mean for my Austin move?")
• Anchor the consumer to their specific relocation scenario
• Escalate to human staff when a consumer shows high intent
• Feed escalations into the CharlieKnowledgeBase for future training

This creates a closed loop: DNN creates content → Charlie absorbs it → consumers ask questions → Charlie learns from escalations → better responses next cycle.

────────────────────────────────
SUBSCRIBER TIERS
────────────────────────────────
Tier 1 (Free): DNN Intelligence Briefs via email + in-app. No agent assignment.
Tier 2 (Paid, future): Premium market data, early access to agent matching.
Tier 3 (VIP / Agent): Bureau Chief agents and their tagged client networks. Full co-brand.

────────────────────────────────
COMMUNICATIONS HUB WORKFLOW
────────────────────────────────
1. Admin generates DNN article (AI-assisted, reviewed by staff)
2. Article staged → reviewed → published to in-app feed
3. Admin uses Communications Hub to blast the article to subscriber list by tier
4. Blast record saved: blast_count, blasted_at, target_tier
5. Subscriber engagement tracked: opens, clicks, escalations to Charlie
6. High-engagement subscribers flagged as hot leads → routed to relocation intake`
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

Purpose: Frames the Gemini Live session as an exclusive, premium benefit that requires commitment.

────────────────────────────────
AGENT SCRIPT (THE THREE-WAY)
────────────────────────────────
"I've brought Gemini into our call to analyze the data. Gemini, based on the new listing Sarah liked, how does the commute change compared to her original plan?"

Purpose: Introduces the Silent Moderator mode—Gemini is listening to agent-client conversations and detecting pivot points in real-time.

────────────────────────────────
POST-SESSION EXECUTION: DELTA REPORT
────────────────────────────────
After every voice session, the system automatically:

1. GENERATES: Delta Report — compares session data to baseline moving plan, extracts all detected pivot points

2. EMAILS BUYER: "Your Relocation Profile Updated" — highlights changes, confirms updated priorities/timeline/budget, links to updated Moving Plan dashboard

3. EMAILS AGENT: "[BUYER NAME] – Relocation Profile Update" — agent-focused summary of changes, actionable next steps

4. UPDATES SYSTEM: Moving Plan entity — all detected pivots logged to pivot_points array with timestamps and source tags

STRATEGIC VALUE:
✓ Keeps both parties informed with minimal admin overhead
✓ Surfaces real changes in buyer preferences as they happen
✓ Gives agents actionable intelligence for next conversation
✓ Creates system of record for all preference changes`
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
          style={{ background: 'rgba(255,255,255,0.7)', color: '#555' }}
        >
          <p>Business Plan v4.0 • Last Updated: April 22, 2026 • Added: DNN Broadcast Intelligence Network — Three-Pillar Strategy (Relocation Intelligence, Agent Bureau, Financial Services Network), Subscriber Flywheel, Charlie editorial loop, Tier architecture, Communications Hub workflow</p>
        </motion.div>
      </main>
    </div>
  );
}