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

────────────────────────────────
🔔 GOOGLE GEMINI I/O — MAY 19, 2026 UPDATE
────────────────────────────────
Google's Gemini I/O announcement on May 19, 2026 opens the door to full Gemini 3.1 Flash Live API deployment.

CURRENT STATE (Pre-May 19):
• Charlie currently uses Gemini for voice-to-TEXT — the user speaks, Gemini transcribes and generates a text response. This is the existing charlieVoiceChat / charlieSpeak pipeline already live in the app.

NEXT STATE (Post-May 19 — Gemini 3.1 Flash Live):
• Full voice-to-VOICE — the user speaks, Gemini responds with a real-time native audio stream. No transcription step, no text-to-speech step. A true continuous voice conversation.
• This is the upgrade path: same Gemini API key, same Base44 backend, new Live API WebSocket endpoint.
• Latency drops dramatically. Conversation feels natural and uninterrupted.
• This is the foundation for the Two-Character Interview Format (Journalist + Bob Clone) documented in the Dyson Media Desk section.

MIGRATION PLAN:
1. Monitor Google I/O May 19 announcement for Gemini 3.1 Flash Live GA availability
2. Update geminiLiveProxy backend function to use the new Live API WebSocket endpoint
3. Test voice-to-voice flow with a single Charlie session
4. Roll out to full client intake pipeline
5. Activate Two-Character Interview format for DNN media production

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
    id: 'landing-page-transition',
    title: '🏠 Landing Page Transition Plan',
    icon: Globe,
    content: `LANDING PAGE ECOSYSTEM — SEAMLESS TRANSITION STRATEGY
(Updated: April 2026)

THE GOAL:
Replace the current client landing page with the new AdminNewLandingPage design seamlessly — only after every link, sidebar entry, supporting content, and Charlie response is fully coordinated and tested.

────────────────────────────────
WHAT THE NEW LANDING PAGE DOES
────────────────────────────────
The new landing page (H.O.M.E. — Home Ownership Management Ecosystem) serves as the primary consumer entry point with:
• Gold pill search bar: "What is your real estate situation?" with Quick Start shortcuts
• Windean Stratton case study: A long-form proof-of-concept demonstrating our 4-state relocation management capability
• "Your Story Is Next" CTA block: Links to the Solve My Story intake page
• DNN Morning Brief corner card: Live latest article from published DNN feed
• Dark header (Dyson logo + H.O.M.E. title) / Warm tan content area (#ede0cc)

────────────────────────────────
SOLVE MY STORY — INTAKE FLOW
────────────────────────────────
The "Solve My Story" button links to /solve-my-story — a standalone intake page where a prospective client can:
1. Provide full name, email, and phone
2. Select their situation type from a curated list
3. Write their story in detail
4. Submit — which saves them as a hot DnnSubscriber lead AND emails the Dyson team immediately

This is the bridge between marketing content and the CRM.

────────────────────────────────
WHAT MUST BE READY BEFORE WE FLIP THE SWITCH
────────────────────────────────
CLIENT EXPERIENCE (Priority 1):
□ Sidebar links all verified and working
□ Charlie KB trained on all primary client questions
□ DNN news articles published and displaying on landing page card
□ Solve My Story form tested end-to-end (submission → email → CRM entry)
□ Chat/Communications Hub accessible and tested
□ Relocation intake flow (commitment gate → Gemini session → debrief) fully operational

AGENT & LENDER PORTALS (Phase 2 — not blocking launch):
□ Agent Bureau enrollment page
□ Lender network portal (Financial Services — Q3 2026)

────────────────────────────────
QUICK STARTS ON THE LANDING PAGE
────────────────────────────────
• "I'm moving and need a plan." → /relocation-intake (Relo Prong)
• "I'm stuck in a deal." → /chat (Story-Solving / Escrow)
• "I'm an Agent or Lender." → /find-agent (Enterprise Portal)

────────────────────────────────
CHARLIE'S ROLE ON THE NEW LANDING PAGE
────────────────────────────────
Charlie (via FloatingCharlie) is present on the landing page and trained to:
• Answer questions about DNN news and direct to /dnn-news
• Explain the H.O.M.E. ecosystem and Dyson services
• Route clients to the correct Quick Start
• Capture escalations when questions exceed KB coverage
• Funnel hot leads into relocation intake

All new Q&A pairs developed during landing page testing are saved to CharlieKnowledgeBase for permanent training.`,
  },
  {
    id: 'clone-deployment-roadmap',
    title: '🧬 Clone Deployment Roadmap — Post Google I/O',
    icon: Mic,
    content: `ENTRY DATE: May 18, 2026

VIDEO/AUDIO CLONE DEPLOYMENT — THE NEXT PHASE
────────────────────────────────

DECISION: After Google I/O (May 19, 2026), we begin building and refining two clones:

CLONE 1 — THE NEWS PRESENTER ("The Journalist")
• A distinct AI persona — professional broadcast journalist character
• Voice: Gemini 3.1 Flash Live native voice (pre-built, e.g. "Puck" or "Charon")
• Visual: AI-generated video avatar via HeyGen — consistent anchor appearance across all DNN content
• Role: Delivers the daily DNN news briefing in video format
• Deployed: Next to the scripted copy of every news article in the consumer-facing DNN feed

CLONE 2 — BOB DYSON PERSONAL CLONE
• Bob's personal voice + likeness clone (Google Native Voice Clone + HeyGen avatar)
• Role: Delivers "Visionary Insight" commentary on key national real estate and relocation market stories
• Appears alongside The Journalist in the Two-Character Interview format
• Also deployed: On the consumer-facing news feed next to scripted article copy

────────────────────────────────
WHERE THE VIDEO CLONES APPEAR IN THE APP
────────────────────────────────
• DNN News Feed (consumer-facing): Each published article shows a video player with the clone delivering the story, beside the written article text. Consumer gets both formats — read it or watch it.
• Social Distribution: Same video auto-distributed to LinkedIn, Instagram, YouTube via Make.com automation
• Press / VNR: Video formatted as a Video News Release for media outreach

────────────────────────────────
CHARLIE — KEPT, UPDATED, AND RENAMED
────────────────────────────────
DECISION: Charlie is NOT being retired. He is being evolved.

CURRENT STATE: Charlie = text + voice-to-text AI concierge (Gemini Flash)
NEXT STATE: Charlie's voice layer is upgraded to use the Bob Dyson personal voice clone for ALL voice-to-voice responses across ALL categories (relocation intake, city guide, escrow support, agent matching, etc.)

This means:
• Consumers will hear Bob Dyson's voice when talking to the AI concierge
• Charlie's intelligence and knowledge base remain intact — only the voice changes
• Charlie will be RENAMED to reflect the upgrade (name TBD — options: "Bob", "Dyson", "The Advisor", "Your Concierge")
• The rename is a brand moment — announced as an upgrade, not a replacement

MIGRATION SEQUENCE:
1. ✅ DNN content keeps running (no cost, no disruption)
2. Post-May 19: Build Journalist clone + Bob clone using Gemini 3.1 Flash Live
3. QA clones until satisfactory — test on internal DNN articles first
4. Deploy video player to DNN news feed (article page + consumer app)
5. Once clones are approved → swap Charlie's voice layer to Bob clone
6. Rename Charlie → announce to users as a premium upgrade
7. Full rollout: Bob's voice responds to every consumer on every category

────────────────────────────────
WHAT STAYS THE SAME
────────────────────────────────
• DNN Daily Article automation — continues running (free, Gemini-only)
• DNN Morning Brief automation — continues running
• Charlie's knowledge base, scripts, escalation logic — all preserved
• All existing relocation intake flows — unchanged until clone QA is complete
• Twilio SMS campaigns — paused pending post-Google I/O media strategy review`,
  },
  {
    id: 'dyson-media-desk',
    title: '🎙️ Dyson Media Desk — Two-Character Interview Strategy',
    icon: Mic,
    content: `ENTRY DATE: May 16, 2026

THE "DYSON MEDIA DESK" — REPLACING A $90K/YEAR PR FIRM WITH A $500/MONTH AI STACK

────────────────────────────────
THE CORE CONCEPT: TWO-CHARACTER INTERVIEW FORMAT
────────────────────────────────
Instead of Bob appearing as a solo monologue on every piece of content (which risks "overkill"), we create a two-character Dialogue format. Psychology calls this the "Social Proof" model — when people eavesdrop on an expert conversation, engagement increases dramatically compared to a standard pitch.

CHARACTER 1 — THE INTERVIEWER ("The Journalist")
• A distinct persona — NOT Bob. Think "Global Relocation Reporter" or "Tech Correspondent"
• Voice: Google Gemini 3.1 Flash Live API — pre-built native voice (e.g. "Puck" or "Charon") — professional, inquisitive, punchy (60 Minutes / NPR style)
• Visual: AI-generated headshot via Midjourney/DALL-E — professional journalist appearance
• Role: Asks the "hard questions" clients are actually thinking ("What happens to my utility deposits when I move through Dyson Relo?")
• The Anchor: Stays consistent across all content. They are the face of "Dyson News."

CHARACTER 2 — THE SUBJECT MATTER EXPERT (Bob Dyson)
• Bob's Personal Clone — Google Gemini Native Voice Clone (clearing beta — deploy immediately upon GA release)
• Role: Provides visionary answers. The expert who simplified the 8-step relocation process.
• Appears only for "Visionary Insight" — not on every page
• The Dynamic: Creates a "ping-pong" effect. 5-minute explainer feels like 2 minutes.

────────────────────────────────
PRODUCTION WORKFLOW
────────────────────────────────
1. SCRIPT (Gemini): "Write a 2-minute interview about the Dyson Home utility connection process." Gemini writes BOTH parts — interviewer questions AND expert answers.

2. VOICE (Gemini 3.1 Flash Live API): Two distinct native voices — one for the Journalist (e.g. "Puck"), one for Bob's clone (Google Native Voice Clone, pending GA). Audio streamed via Google's native WebSocket audio stream — no third-party voice API required.

3. VISUAL (HeyGen or D-ID): Two "talking photo" avatars. Layout: side-by-side bubbles OR flip-flop like a televised news segment.

4. BACKGROUND (Gemini Image Gen + Veo): 
   • Static: "A high-end modern real estate executive office in a San Diego skyscraper, sunset lighting, cinematic depth of field"
   • Dynamic: Use Veo for subtle motion — dust motes, city traffic through the window, flickering screen — 5–10 second loop

────────────────────────────────
THE DNN DAILY FORMAT (BASE44 AUTOMATION)
────────────────────────────────
Morning News Segment:
• The "Journalist" clone introduces the daily real estate headline
• Bob's clone comes on to explain how that news affects Dyson Relo clients
• The segment is auto-generated from DNN's daily article feed

This creates a "Variety Show" format — not a "One-Man Show." It feels like a production, not a lecture.

────────────────────────────────
WHERE EACH FORMAT IS USED
────────────────────────────────
Internal App (The 8 Steps): "Personal Concierge" approach — just Bob, small bubble, helpful and brief. 15–30 seconds max.

External Marketing/PR: "Two-Character Interview" — used for Big Picture concepts. Explaining the WHY and HOW of Dyson Relo to press and new audiences.

Press Releases / Media Outreach: Send as a "Ready-to-Air" Video News Release (VNR). TV stations and news blogs can literally take the Journalist's questions out, have their anchor read them, then play Bob's cloned response. VNR on steroids.

────────────────────────────────
THE FULL DISTRIBUTION STACK (REPLACING THE $7,500/MO QUOTE)
────────────────────────────────
Channel                    | Tool                          | Est. Monthly Cost
---------------------------|-------------------------------|------------------
Voice Synthesis            | Gemini 3.1 Flash Live (native)| ~$0 (API usage)
Voice Clone (Bob)          | Google Native Voice Clone     | TBD on GA pricing
Direct Media (PR Wire)     | Newsworthy.ai or Prowly.com   | $300–$500
Social Media (Auto-Post)   | Metricool or Buffer           | $20–$50
SMS (Targeted Lists)       | Twilio (pay-per-message)      | ~$0.01/text
Email / Newsletter         | Beehiiv or Mailchimp          | $0–$100
Video Avatar               | HeyGen or Synthesia           | $50–$150/mo
Workflow Automation        | Make.com                      | ~$30/mo

TOTAL ESTIMATED TECH SPEND: $400–$800/month
vs. $7,500/month quote = SAVINGS OF OVER $80,000/YEAR
Note: ElevenLabs explicitly removed from stack. All voice runs natively through Gemini.

────────────────────────────────
AUTOMATED CAMPAIGN WORKFLOW
────────────────────────────────
1. Gemini writes the script and Interviewer questions
2. Gemini 3.1 Flash Live API generates both voices via native WebSocket audio stream (Journalist: pre-built voice / Bob: Native Voice Clone on GA)
3. HeyGen renders both talking-photo avatars using Gemini-generated audio as lip-sync input, with Gemini-generated background
4. Base44 automation pushes:
   → To Social: YouTube / Instagram / LinkedIn (auto-upload via Make.com)
   → To Press: Video link + Gemini-written press release sent via Newsworthy.ai → Google News + industry wires
   → To Clients: Twilio SMS to targeted leads: "Check out our latest update on relocation trends" + link

────────────────────────────────
BACKEND ARCHITECTURE — GEMINI 3.1 FLASH LIVE API (NATIVE, NO ELEVENLABS)
────────────────────────────────
DECISION: We are deploying exclusively on Google's native Gemini 3.1 Flash Live API.
ElevenLabs is explicitly NOT used. All voice synthesis runs through Google's native WebSocket audio streams and pre-built voices.

HOW THE AUDIO PIPELINE WORKS:
1. Base44 Deno backend function opens a persistent WebSocket connection to the Gemini Live API endpoint:
   wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent

2. The script for each character (Journalist + Bob clone) is segmented into turn-based chunks and sent as text input over the WebSocket.

3. Gemini streams back raw PCM audio chunks in real-time using the configured native voice per character:
   • Journalist character → assigned a pre-built Gemini voice (e.g. "Puck", "Charon", "Fenrir", "Aoede")
   • Bob Dyson clone → Google Native Voice Clone (production deployment pending GA clearance of beta; drop-in replacement requires no architecture change — same WebSocket, same stream, different voiceName parameter)

4. The Base44 backend function buffers the audio stream, assembles the final audio file, and stores it via UploadFile integration → returns the file_url for use in HeyGen avatar rendering or direct playback.

VOICE CLONE READINESS:
The architecture is intentionally designed so that when Google Native Voice Clone exits beta, the ONLY required change is swapping the voiceName parameter from a pre-built voice to Bob's registered clone ID. The entire WebSocket stream, audio assembly, and downstream HeyGen pipeline remain unchanged. Zero re-architecture required.

BASE44 EXECUTION CAPABILITY ASSESSMENT
────────────────────────────────
✅ FULLY EXECUTABLE ON BASE44 (NATIVE GEMINI STACK):
• DNN daily article generation (Gemini API — already live)
• Script writing for both characters (Gemini InvokeLLM — trivial addition)
• Journalist voice synthesis (Gemini 3.1 Flash Live — native WebSocket stream, Deno backend function)
• Bob Dyson voice clone (Gemini Native Voice Clone — deploy on GA; same backend, swap voiceName)
• SMS distribution to targeted lists (Twilio — already live)
• Email blasting to subscriber tiers (SendEmail integration — already live)
• Campaign orchestration and scheduling (Base44 automations — already live)
• Subscriber CRM tagging and segmentation (DnnSubscriber entity — already live)
• Social post content generation (Gemini — can add SocialPost entity workflow)

🔧 REQUIRES EXTERNAL INTEGRATION (NOT NATIVE TO BASE44):
• HeyGen / D-ID video rendering — requires HeyGen API key + webhook handler (voice audio fed IN from Gemini output)
• Newsworthy.ai / Prowly PR distribution — requires account + API
• Veo video background generation — requires Google Veo API access (waitlist)
• Metricool / Buffer social auto-posting — requires OAuth connector or Make.com bridge

📋 RECOMMENDED NEXT STEPS:
1. Build geminiVoiceStream Deno backend function — opens Gemini 3.1 Flash Live WebSocket, sends script text, buffers PCM audio output, uploads assembled audio file via UploadFile, returns file_url
2. Get HeyGen API key → build backend function to submit avatar video jobs using Gemini-generated audio as lip-sync input
3. Connect Make.com to Base44 webhook → automate social posting from DNN article publish event
4. Register Newsworthy.ai account → trigger PR blast when article status = "blasted"
5. Produce first "Test Interview" using Bob headshot + generated Journalist headshot + Gemini native audio
6. On Google Voice Clone GA → register Bob's voice, update voiceName in geminiVoiceStream function — done`,
  },
  {
    id: 'aviation-media-assets',
    title: '✈️ Global Aviation & Travel Asset Library',
    icon: Mic,
    content: `LOOK B EXPANDED: THE GLOBAL MARKET AUTHORITY (AVIATION ASSETS)
Entry Date: May 16, 2026

These assets will be used as b-roll, transitions, and video intro hooks whenever Bob is delivering heavy-hitting national real estate metrics or international residential market updates. Integrating private aviation doesn't just show how you travel — it visually validates 54+ years of scale, the background as a former Chief Pilot, and the absolute reality of how high-end residential relocation actually moves. It instantly separates Dyson & Dyson from a typical local real estate agent and frames Bob as a global logistics mastermind who can deploy anywhere at a moment's notice.

────────────────────────────────
ASSET B-1: THE PRE-FLIGHT DEPARTURE (ENTERING THE SCENE)
────────────────────────────────
VISUAL PROMPT:
"A cinematic, sharp corporate media shot of Bob Dyson walking purposefully across a sun-drenched private tarmac in San Diego County toward a sleek, modern private luxury jet. He possesses his signature broad, dignified build and perfectly groomed silver hair, looking sharp and authoritative. He is wearing his custom-tailored dark charcoal executive suit, a crisp white dress shirt, and a solid burgundy silk tie. He carries a premium leather briefcase in one hand, captured mid-stride with a confident, focused expression. The background shows the gleaming fuselage of the aircraft with clean reflections, softly blurred for an elite depth of field."

STRATEGIC MESSAGE:
Ultimate execution. It tells the viewer that a high-end relocation doesn't wait around for commercial flight schedules — your operation moves with absolute speed.

USE CASE: Opening hook for national market update videos. Transition into DNN daily briefings.

────────────────────────────────
ASSET B-2: THE IN-TRANSIT COMMAND (ON-LOCATION STRATEGY)
────────────────────────────────
VISUAL PROMPT:
"A high-end, interior lifestyle shot of Bob Dyson seated comfortably inside the cabin of a luxurious private jet in mid-flight. He is looking out the window thoughtfully or reviewing real estate market metrics on a sleek digital tablet. He is in his sharp grey broadcast suit and burgundy tie, embodying complete financial competence and high-tech command. Natural daylight streams through the cabin windows, illuminating the premium wood and leather interior. Crisp, cinematic editorial lighting."

STRATEGIC MESSAGE:
You are managing the global network in real-time, matching the high-tech capabilities built right into the DysonRelo Base44 Workspace.

USE CASE: B-roll for "managing your move remotely" content. Mid-video transition between market data segments.

────────────────────────────────
ASSET B-3: THE ARRIVAL / OUT-OF-AREA DEPLOYMENT (LEAVING THE SCENE)
────────────────────────────────
VISUAL PROMPT:
"An authoritative, cinematic exterior shot of Bob Dyson stepping out of a private aircraft onto a pristine tarmac at an out-of-state or international airport. He is adjusting his grey suit jacket, looking out at the destination skyline with an open, confident smile. The scene represents executive movement and global real estate capability, completely avoiding generic corporate stock imagery in favor of a clean, premium, high-integrity lifestyle environment."

STRATEGIC MESSAGE:
Global reach. Whether a client is moving a high-end estate into or out of North County, you have the boots-on-the-ground capability to oversee the transition.

USE CASE: Intro for out-of-area market reports. Agent recruitment videos. Corporate relocation pitch decks.

────────────────────────────────
HOW THIS INTEGRATES WITH THE 21 AI ASSISTANTS
────────────────────────────────
This aviation layer fits perfectly with the infrastructure documented in the corporate layout. While the 21 AI Assistants live on DysonHomes.com automate the friction of utility connections, document tracking, and escrow milestones behind the scenes — these private aviation visuals tell the client WHY Bob has that time: because the technology gives him the freedom to live, work, and dominate the high-end luxury lifestyle he represents.

The message is: "The machine handles the details. Bob handles the vision."

────────────────────────────────
STAGING THE DESKTOP FOLDER
────────────────────────────────
Copy the three prompts above into a text file and drop it directly into your CLONE ASSETS folder next to your master headshots.

File naming convention:
• bob_dyson_B1_preflight_departure_prompt.txt
• bob_dyson_B2_intransit_command_prompt.txt
• bob_dyson_B3_arrival_deployment_prompt.txt

────────────────────────────────
NEXT STEP: SCRIPT TRANSITION FORMULA
────────────────────────────────
Recommended next build: Map out the exact script formula for transitioning from the private jet scene directly into a U.S. financial real estate news update. This creates a signature "arrival hook" — Bob steps off the plane, looks at the camera, and delivers the week's most important relocation market data. That segment becomes the flagship format for DNN's weekly broadcast.`,
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
          <p>Business Plan v6.3 • Last Updated: May 18, 2026 • Added: Clone Deployment Roadmap — Journalist clone + Bob Dyson personal clone for DNN video feed; Charlie kept, upgraded to Bob's voice, and renamed post-QA. Previously v6.2: Added: Google I/O May 19 Gemini 3.1 Flash Live upgrade path — voice-to-text → voice-to-voice migration plan. Previously v6.1: Updated: Backend architecture rewritten — ElevenLabs removed, all voice synthesis now runs natively on Gemini 3.1 Flash Live API (WebSocket audio streams + pre-built voices). Google Native Voice Clone (Bob Dyson) to deploy on GA. Zero re-architecture required on clone release. Previously v6.0 (May 16): Dyson Media Desk — Two-Character Interview Strategy, Virtual Newsroom, Aviation Asset Library. v5.0: Landing Page Transition Plan (April 2026) • DNN Broadcast Intelligence Network (March 2026)</p>
        </motion.div>
      </main>
    </div>
  );
}