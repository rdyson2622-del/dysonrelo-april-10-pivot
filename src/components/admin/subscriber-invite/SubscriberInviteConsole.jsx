import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Send, Mail, MessageSquare, UserCheck, Search, CheckCircle2,
  AlertCircle, Copy, ExternalLink, Sparkles, Phone, Building,
  Filter, Users, ArrowRight, ShieldCheck, RefreshCw, Eye, Check,
  FileText, Clock, ChevronRight, X, UserPlus
} from 'lucide-react';

const GOLD = '#D4AF37';

const TEMPLATES = [
  {
    id: 'bob_vip',
    name: 'Bob Dyson Personal VIP Invitation',
    badge: 'Recommended for Sphere',
    targetRole: 'client',
    subject: 'A personal invitation from Bob Dyson — Your DysonRelo Concierge',
    emailIntro: `Dear {{first_name}},

Over the past 55+ years, serving my clients, colleagues, and friends across California and nationwide has been the greatest privilege of my professional career.

Today, I am reaching out to personally invite you to activate your complimentary subscription to DysonRelo.com.

We don't sell real estate — we orchestrate your entire move.

As our subscriber, you receive:
• Daily 6AM DNN Real Estate News — Anchored by AI Charlie & Bob, delivering interest rate trends, tax policy shifts, and national market movements before the bell.
• Independent Agent Vetting Across All 50 States — Before you ever contact an agent on Realtor, Zillow, or Homes.com, our fiduciary desk independently vets their track record, contract negotiation skills, and license standing — zero fees to you.
• 0% State Tax Migration & Destination Roadmaps — Deep economic, property tax, and school district roadmaps for top relocation destinations (Texas, Florida, Arizona, Tennessee, Nevada, and beyond).
• Escrow & Document Audits — Proactive milestone monitoring to protect your earnest money deposits and prevent closing delays.

Please activate your private concierge access using your personalized invitation link below:`,
    smsBody: `Hi {{first_name}}, this is Bob Dyson. I'm inviting you to activate your complimentary DysonRelo Concierge & 6AM Housing News access. We vet agents across all 50 states at zero cost to you. Activate your private access here: {{return_link}} — or text me back anytime at (858) 353-1200. CA DRE #02303118`,
  },
  {
    id: 'relocation_buyer',
    name: 'Relocating Families & Homeowners',
    badge: 'Buyers / Moves',
    targetRole: 'client',
    subject: 'Independent Real Estate Concierge Invitation — The Dyson & Dyson Companies',
    emailIntro: `Dear {{first_name}},

When planning a relocation or exploring a new real estate market, having an independent fiduciary in your corner changes everything.

Most online real estate portals sell your phone number to 3 or 4 competing agents the moment you click "Contact Agent." At DysonRelo, we take the exact opposite approach.

We provide:
• Independent, unbiased agent vetting in any city across all 50 states
• 0% state income tax haven comparisons & lifestyle analysis
• Dedicated escrow timeline tracking and transaction milestone audits
• Daily 6AM DNN Housing Market Briefings

Activate your complimentary concierge portal access here:`,
    smsBody: `Hi {{first_name}}, when moving or buying in a new market, don't let lead portals sell your info. DysonRelo provides independent fiduciary agent vetting across all 50 states for free. Activate your complimentary concierge here: {{return_link}} (Bob Dyson desk: 858-353-1200)`,
  },
  {
    id: 'agent_affiliate',
    name: 'Agent & Broker Network Affiliate',
    badge: 'Agents / Brokers',
    targetRole: 'agent',
    subject: 'Receiving Agent Network Invitation — DysonRelo 25% Referral Bureau',
    emailIntro: `Dear {{first_name}},

I hope you're having a productive week. 

We are activating our 2026 Receiving Agent Bureau at DysonRelo and The Dyson & Dyson Companies, Inc. (CA DRE #02303118). 

We regularly orchestrate corporate relocations, executive transfers, and out-of-area buyer moves. We are expanding our vetted agent directory to route pre-qualified buyers and sellers to top local specialists for a standard 25% referral payout.

As an active affiliate, you receive:
• Inbound buyer & seller referral matching in your local territory
• Proactive escrow milestone & transaction document auditing
• Private-label daily housing market intelligence broadcasts for your clients

Activate your agent portal profile using the link below:`,
    smsBody: `Hi {{first_name}}, Bob Dyson here. We're selecting trusted local agents for our 2026 DysonRelo Receiving Agent Bureau (25% referral payouts on inbound moves). Activate your partner profile here: {{return_link}} — CA DRE #02303118`,
  },
  {
    id: 'corporate_hr',
    name: 'Corporate HR & Executive Relocation',
    badge: 'HR / Employers',
    targetRole: 'hr',
    subject: 'Corporate Relocation Suite & Fiduciary Management — DysonRelo',
    emailIntro: `Dear {{first_name}},

Managing executive transfers and employee relocations shouldn't require exorbitant broker fees or fragmented communication.

The Dyson & Dyson Companies, Inc. provides zero-fee relocation management for employers and HR teams nationwide:
• Complete turnkey employee destination roadmaps
• Independent agent vetting in destination cities with strict fiduciary standards
• Real-time milestone tracking from home sale to escrow closing
• Zero cost to employers or transferees

Activate your corporate relocation portal suite using the link below:`,
    smsBody: `Hi {{first_name}}, DysonRelo provides zero-fee executive relocation orchestration & independent agent vetting for employers nationwide. Access our corporate suite here: {{return_link}} — Bob Dyson (858) 353-1200`,
  },
  {
    id: 'referral_agent_opportunity',
    name: 'Pre-Enrolled Referral Agent (25% Network)',
    badge: 'Referral Agent',
    targetRole: 'referral_agent',
    subject: 'Your DysonRelo Referral Agent Desk & Charlie AI Concierge Walkthrough',
    emailIntro: `Dear {{first_name}},

You have been pre-enrolled as an affiliate subscriber in the Dyson & Dyson Referral Agent Network (CA DRE #02303118).

As a Referral Agent Subscriber:
• You never list, market properties, or handle transaction paperwork.
• You refer buyers, sellers, and relocating families into our nationwide fiduciary desk and receive a guaranteed 25% referral payout at closing.
• Charlie Simmons, our AI voice concierge, is live on your desk to walk you through fee protections, client handoffs, and your agent workspace.

Meet Charlie and access your pre-enrolled referral desk here:
{{return_link}}

Direct voice line to Charlie: https://dysonrelo.com/talking-app`,
    smsBody: `Hi {{first_name}}, Bob Dyson here. You are pre-enrolled in our DysonRelo 25% Referral Agent Network. Walk the portal with Charlie, our AI concierge: {{return_link}} (or speak directly with Charlie at https://dysonrelo.com/talking-app) — CA DRE #02303118`,
  },
];

export default function SubscriberInviteConsole({ onSentSuccess }) {
  const queryClient = useQueryClient();

  // Tab & mode
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' | 'history'
  const [contactSource, setContactSource] = useState('contacts'); // 'contacts' | 'manual'
  const [selectedTemplateId, setSelectedTemplateId] = useState('bob_vip');
  const [channel, setChannel] = useState('both'); // 'email' | 'sms' | 'both'
  const [targetRole, setTargetRole] = useState('client');

  // Contact search & selection
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'email' | 'phone'
  const [selectedContact, setSelectedContact] = useState(null);

  // Manual contact fields
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCompany, setManualCompany] = useState('');

  // Editable message fields
  const [emailSubject, setEmailSubject] = useState(TEMPLATES[0].subject);
  const [emailBody, setEmailBody] = useState(TEMPLATES[0].emailIntro);
  const [smsBody, setSmsBody] = useState(TEMPLATES[0].smsBody);

  // Sending state
  const [sending, setSending] = useState(false);
  const [sentResult, setSentResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);

  // Load contacts from BobDysonContact
  const { data: rawContacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['bobDysonContactsForInvite'],
    queryFn: () => base44.entities.BobDysonContact.filter({ status: 'active' }, '-created_date', 5000),
    staleTime: 60000,
  });

  // Load recent sent communications for history tab
  const { data: recentComms = [], isLoading: commsLoading, refetch: refetchComms } = useQuery({
    queryKey: ['recentInviteComms'],
    queryFn: () => base44.entities.Communication.filter({}, '-sent_date', 50),
    staleTime: 10000,
  });

  // Filter contacts
  const filteredContacts = useMemo(() => {
    let list = rawContacts;
    if (filterType === 'email') {
      list = list.filter(c => !!c.email);
    } else if (filterType === 'phone') {
      list = list.filter(c => !!c.phone);
    }

    if (!searchQuery.trim()) {
      return list.slice(0, 30);
    }

    const q = searchQuery.toLowerCase().trim();
    return list.filter(c =>
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q)
    ).slice(0, 40);
  }, [rawContacts, searchQuery, filterType]);

  // Handle template selection
  const handleTemplateChange = (tplId) => {
    setSelectedTemplateId(tplId);
    const tpl = TEMPLATES.find(t => t.id === tplId);
    if (tpl) {
      setEmailSubject(tpl.subject);
      setEmailBody(tpl.emailIntro);
      setSmsBody(tpl.smsBody);
      setTargetRole(tpl.targetRole || 'client');
    }
  };

  // Derive active recipient details
  const activeRecipient = useMemo(() => {
    if (contactSource === 'contacts' && selectedContact) {
      const parts = (selectedContact.full_name || '').trim().split(' ');
      const firstName = selectedContact.first_name || parts[0] || 'Friend';
      return {
        fullName: selectedContact.full_name || '',
        firstName,
        email: selectedContact.email || '',
        phone: selectedContact.phone || '',
        company: selectedContact.company || '',
        id: selectedContact.id,
      };
    }
    const parts = manualName.trim().split(' ');
    const firstName = parts[0] || 'Friend';
    return {
      fullName: manualName,
      firstName,
      email: manualEmail,
      phone: manualPhone,
      company: manualCompany,
      id: null,
    };
  }, [contactSource, selectedContact, manualName, manualEmail, manualPhone, manualCompany]);

  // Computed personalized return link
  const returnLink = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dysonrelo.com';
    const params = new URLSearchParams();
    if (activeRecipient.email) params.set('email', activeRecipient.email);
    if (activeRecipient.fullName) params.set('name', activeRecipient.fullName);
    if (activeRecipient.phone) params.set('phone', activeRecipient.phone);
    if (targetRole) params.set('role', targetRole);
    params.set('ref', 'bob_dyson_invite');

    if (targetRole === 'referral_agent' && selectedContact?.portal_slug) {
      return `${origin}/referral-agent/${selectedContact.portal_slug}`;
    }
    return `${origin}/subscribe?${params.toString()}`;
  }, [activeRecipient, targetRole, selectedContact]);

  // Formatted preview of email message with merge tags replaced
  const formattedEmailBody = useMemo(() => {
    return emailBody
      .replace(/{{first_name}}/g, activeRecipient.firstName || 'Friend')
      .replace(/{{full_name}}/g, activeRecipient.fullName || 'Valued Contact')
      .replace(/{{return_link}}/g, returnLink);
  }, [emailBody, activeRecipient, returnLink]);

  // Formatted preview of SMS message with merge tags replaced
  const formattedSmsBody = useMemo(() => {
    return smsBody
      .replace(/{{first_name}}/g, activeRecipient.firstName || 'Friend')
      .replace(/{{full_name}}/g, activeRecipient.fullName || 'Valued Contact')
      .replace(/{{return_link}}/g, returnLink);
  }, [smsBody, activeRecipient, returnLink]);

  // Select contact from list
  const handleSelectContact = (c) => {
    setSelectedContact(c);
    setSentResult(null);
  };

  // Copy helper
  const handleCopyLink = () => {
    navigator.clipboard.writeText(returnLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyLetter = () => {
    const fullLetter = `${emailSubject}\n\n${formattedEmailBody}\n\n👉 Activate Your Subscription:\n${returnLink}\n\nWarmest regards,\nBob Dyson\nThe Dyson & Dyson Companies, Inc.\nCalifornia DRE #02303118\nDesk: (858) 353-1200\nEmail: bob@dysonrelo.com\nhttps://dysonrelo.com`;
    navigator.clipboard.writeText(fullLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleCopySms = () => {
    navigator.clipboard.writeText(formattedSmsBody);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2000);
  };

  // Execute Sending
  const handleSendInvite = async () => {
    if (!activeRecipient.email && (channel === 'email' || channel === 'both')) {
      alert('Recipient email address is required to send via Email.');
      return;
    }
    if (!activeRecipient.phone && (channel === 'sms' || channel === 'both')) {
      if (channel === 'sms') {
        alert('Recipient phone number is required to send via SMS / Text.');
        return;
      }
    }

    setSending(true);
    setSentResult(null);

    const outcomes = { email: null, sms: null };

    try {
      // 1. Send Email if selected
      if ((channel === 'email' || channel === 'both') && activeRecipient.email) {
        const fullHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #111; line-height: 1.6; padding: 20px; border: 1px solid #D4AF37; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px; text-align: center;">
              <h2 style="margin: 0; color: #0a0a0a; font-size: 24px; font-family: Georgia, serif; letter-spacing: 1px;">THE DYSON &amp; DYSON COMPANIES, INC.</h2>
              <p style="margin: 4px 0 0; color: #D4AF37; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Nationwide Relocation Concierge • CA DRE #02303118</p>
            </div>
            
            <div style="font-size: 15px; color: #222; white-space: pre-line;">
              ${formattedEmailBody}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${returnLink}" style="background: linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%); color: #000; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(212,175,55,0.4);">
                Activate Your Free Concierge Subscription →
              </a>
              <p style="font-size: 11px; color: #777; margin-top: 8px;">Direct return link: <a href="${returnLink}" style="color: #b8920a;">${returnLink}</a></p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 13px; color: #555;">
              <p style="margin: 0 0 5px; font-weight: bold; color: #111;">Bob Dyson</p>
              <p style="margin: 0 0 3px;">The Dyson &amp; Dyson Companies, Inc.</p>
              <p style="margin: 0 0 3px;">California DRE #02303118</p>
              <p style="margin: 0 0 3px;">Direct Concierge Desk: <strong>(858) 353-1200</strong> (Call or Text)</p>
              <p style="margin: 0 0 3px;">Email: <a href="mailto:bob@dysonrelo.com" style="color: #b8920a;">bob@dysonrelo.com</a></p>
              <p style="margin: 0;"><a href="https://dysonrelo.com" style="color: #b8920a;">DysonRelo.com</a></p>
            </div>
          </div>
        `;

        const res = await base44.functions.invoke('adminQuickSend', {
          channel: 'email',
          to: activeRecipient.email,
          recipient_name: activeRecipient.fullName || activeRecipient.email,
          subject: emailSubject,
          message: fullHtml,
        });

        if (res.data?.success) {
          outcomes.email = true;
        } else {
          outcomes.email = false;
        }
      }

      // 2. Send SMS if selected
      if ((channel === 'sms' || channel === 'both') && activeRecipient.phone) {
        const cleanPhone = activeRecipient.phone.replace(/[^0-9+]/g, '');
        const res = await base44.functions.invoke('adminQuickSend', {
          channel: 'sms',
          to: cleanPhone,
          recipient_name: activeRecipient.fullName || cleanPhone,
          message: formattedSmsBody,
        });

        if (res.data?.success) {
          outcomes.sms = true;
        } else {
          outcomes.sms = false;
        }
      }

      // 3. Mark contact or create note if contact exists
      if (selectedContact?.id) {
        try {
          await base44.entities.BobDysonContact.update(selectedContact.id, {
            notes: (selectedContact.notes || '') + `\n[Subscriber Invite sent on ${new Date().toLocaleDateString()}]`,
          });
        } catch (_) {}
      }

      // 4. Also register invitation in DnnSubscriber as 'invited' record
      try {
        await base44.entities.DnnSubscriber.create({
          full_name: activeRecipient.fullName || 'Invited Sphere Contact',
          email: activeRecipient.email || '',
          phone: activeRecipient.phone || '',
          tier: 'tier1',
          source: `Direct Sphere Invite (${channel.toUpperCase()} from Admin)`,
          notes: `Sent by Bob Dyson on ${new Date().toLocaleString()}. Return Link: ${returnLink}`,
        });
      } catch (_) {}

      setSentResult({
        success: true,
        channel,
        recipient: activeRecipient.fullName || activeRecipient.email,
        emailSent: outcomes.email,
        smsSent: outcomes.sms,
        timestamp: new Date().toLocaleTimeString(),
      });

      refetchComms();
      queryClient.invalidateQueries({ queryKey: ['bobDysonContactsForInvite'] });
      onSentSuccess?.();
    } catch (err) {
      console.error('Failed to send invite:', err);
      setSentResult({
        success: false,
        error: err.message || 'Error executing invitation dispatch.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full text-white text-left">
      {/* Top Header / Context Banner */}
      <div className="p-4 sm:p-6 border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#141005] via-[#0a0a0a] to-[#141005]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/10">
              <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
              <span>OFFICIAL SUBSCRIBER INVITE SUITE</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80 font-mono">6,000–8,000 CONTACTS READY</span>
            </div>
            <h2 
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Send Personalized Subscriber Invitations &amp; Track Returns
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl">
              Dispatch personalized Email or Text letters to your sphere and colleagues. Every invitation includes a unique 1-click return link and direct concierge desk routing.
            </p>
          </div>

          {/* Quick Metrics & Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compose'
                  ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                  : 'bg-[#181818] text-white/70 hover:text-white border border-white/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose &amp; Dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                  : 'bg-[#181818] text-white/70 hover:text-white border border-white/20'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sent Log &amp; Activity ({recentComms.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10 bg-[#0c0c0c]">
          
          {/* ========================================================
              LEFT COLUMN: CONTACT SELECTION (5,000+ BOB DYSON CONTACTS)
              ======================================================== */}
          <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col gap-4 bg-[#0e0e0e]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  1. Select Contact
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#181818] p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => setContactSource('contacts')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    contactSource === 'contacts' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  From Roster ({rawContacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setContactSource('manual')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    contactSource === 'manual' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Manual Entry
                </button>
              </div>
            </div>

            {contactSource === 'contacts' ? (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 5,000+ contacts by name, email, phone, city..."
                    className="w-full bg-[#161616] border border-white/15 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-white/40 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-white/40 mr-1">Filter:</span>
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-0.5 rounded-full border ${
                      filterType === 'all' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-[#181818] text-white/70 border-white/10'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('email')}
                    className={`px-2 py-0.5 rounded-full border ${
                      filterType === 'email' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-[#181818] text-white/70 border-white/10'
                    }`}
                  >
                    Has Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('phone')}
                    className={`px-2 py-0.5 rounded-full border ${
                      filterType === 'phone' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-[#181818] text-white/70 border-white/10'
                    }`}
                  >
                    Has Mobile Phone
                  </button>
                </div>

                {/* Selected Contact Card */}
                {selectedContact && (
                  <div className="p-3 rounded-xl border border-[#D4AF37] bg-[#1a160d] space-y-1.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                        <span>Selected Recipient</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedContact(null)}
                        className="text-[10px] text-white/50 hover:text-white underline cursor-pointer"
                      >
                        Deselect
                      </button>
                    </div>
                    <div className="font-bold text-sm text-white">{selectedContact.full_name}</div>
                    <div className="text-[11px] text-white/70 space-y-0.5">
                      {selectedContact.email && <div className="truncate">✉️ {selectedContact.email}</div>}
                      {selectedContact.phone && <div>📞 {selectedContact.phone}</div>}
                      {selectedContact.company && <div className="truncate">🏢 {selectedContact.company}</div>}
                      {selectedContact.city && <div>📍 {selectedContact.city}</div>}
                    </div>
                  </div>
                )}

                {/* Contact List */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212]">
                  <div className="px-3 py-1.5 bg-[#181818] border-b border-white/10 text-[10px] text-white/50 font-mono flex items-center justify-between">
                    <span>Showing {filteredContacts.length} Contacts</span>
                    <span>Click to select</span>
                  </div>
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
                    {contactsLoading ? (
                      <div className="p-6 text-center text-xs text-white/50 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Loading 5,000+ Contacts...</span>
                      </div>
                    ) : filteredContacts.length === 0 ? (
                      <div className="p-6 text-center text-xs text-white/50">
                        No contacts found matching "{searchQuery}".
                      </div>
                    ) : (
                      filteredContacts.map((c) => {
                        const isSelected = selectedContact?.id === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectContact(c)}
                            className={`w-full p-2.5 text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-[#241d0e] border-l-4 border-[#D4AF37]'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="min-w-0 pr-1">
                              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                <span>{c.full_name}</span>
                                {c.company && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/60 font-normal truncate max-w-[120px]">
                                    {c.company}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-white/50 flex items-center gap-2 mt-0.5 truncate">
                                {c.email ? <span className="truncate">✉️ {c.email}</span> : <span className="text-white/30 italic">No email</span>}
                                {c.phone && <span>📞 {c.phone}</span>}
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-white/30'}`} />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Manual Contact Form */
              <div className="space-y-3 bg-[#121212] p-3 rounded-xl border border-white/10">
                <div className="text-xs font-bold text-white mb-1">Enter Contact Information:</div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Full Name *</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. John Miller"
                    className="w-full bg-[#181818] border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Email Address *</label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#181818] border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Mobile Phone (for Text)</label>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="(858) 555-0199"
                    className="w-full bg-[#181818] border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Company / Affiliation</label>
                  <input
                    type="text"
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    placeholder="e.g. Berkshire Hathaway / Acme Corp"
                    className="w-full bg-[#181818] border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              MIDDLE & RIGHT COLUMNS: TEMPLATE, CHANNELS, LETTER & RETURN METHOD
              ======================================================== */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between gap-5 bg-[#0a0a0a]">
            
            {/* Top Toolbar: Template & Channel Selector */}
            <div className="space-y-3 pb-3 border-b border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                    2. Choose Letter Template:
                  </span>
                </div>

                {/* Delivery Channel Buttons */}
                <div className="flex items-center gap-1 bg-[#141414] border border-[#D4AF37]/40 p-1 rounded-xl">
                  <span className="text-[10px] font-bold text-white/50 px-2 uppercase">Channel:</span>
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      channel === 'email' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      channel === 'sms' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Text / SMS Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('both')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      channel === 'both' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span>⚡ Both (Email + Text)</span>
                  </button>
                </div>
              </div>

              {/* Template Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleTemplateChange(tpl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedTemplateId === tpl.id
                        ? 'border-[#D4AF37] bg-[#221b0d] shadow-md scale-[1.01]'
                        : 'border-white/10 bg-[#121212] hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                        {tpl.badge}
                      </div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {tpl.name}
                      </div>
                    </div>
                    <div className="mt-2 text-[9px] text-white/40 flex items-center justify-between">
                      <span>Target: {tpl.targetRole}</span>
                      {selectedTemplateId === tpl.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Subject Line (if email or both) */}
            {(channel === 'email' || channel === 'both') && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    Email Subject Line:
                  </label>
                  <span className="text-[10px] text-white/50">Personalized in delivery</span>
                </div>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none shadow-sm"
                />
              </div>
            )}

            {/* Editable Letter Body / Text Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* EMAIL LETTER COLUMN */}
              {(channel === 'email' || channel === 'both') && (
                <div className="space-y-1.5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Letter Body:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLetter}
                      className="text-[10px] text-white/60 hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLetter ? 'Copied!' : 'Copy Letter'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 focus:border-[#D4AF37] rounded-xl p-3 text-[11px] text-white font-mono leading-relaxed focus:outline-none resize-none shadow-inner"
                  />
                  <div className="text-[9.5px] text-white/40 italic">
                    Merge tags available: {'{{first_name}}'}, {'{{full_name}}'}, {'{{return_link}}'}
                  </div>
                </div>
              )}

              {/* SMS TEXT MESSAGE COLUMN */}
              {(channel === 'sms' || channel === 'both') && (
                <div className="space-y-1.5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Text / SMS Message:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySms}
                      className="text-[10px] text-white/60 hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedSms ? 'Copied!' : 'Copy SMS'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={channel === 'both' ? 10 : 8}
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 focus:border-[#D4AF37] rounded-xl p-3 text-[11px] text-white font-mono leading-relaxed focus:outline-none resize-none shadow-inner"
                  />
                  <div className="flex items-center justify-between text-[9.5px] text-white/40">
                    <span>Length: {smsBody.length} characters</span>
                    <span className="text-[#10b981]">Delivered via Twilio Authorized Gateway</span>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================
                METHOD TO RETURN IT TO US (CLARITY BOX)
                ======================================================== */}
            <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#D4AF37]/50 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                    Method to Return It to Us:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(returnLink, '_blank')}
                    className="text-[10.5px] font-bold text-white hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer underline"
                  >
                    <span>Test Return Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-[10.5px] px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-[#D4AF37] border border-white/10 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedLink ? 'Copied!' : 'Copy Return Link'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10.5px]">
                <div className="p-2 rounded-xl bg-[#1a1810] border border-white/5 space-y-0.5">
                  <div className="font-bold text-[#10b981] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>1. Direct 1-Click Activation</span>
                  </div>
                  <p className="text-white/60 text-[9.5px]">
                    Recipient opens their link, their name is recognized, and they click Activate to confirm.
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-[#1a1810] border border-white/5 space-y-0.5">
                  <div className="font-bold text-[#D4AF37] flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>2. Call / Text Return Line</span>
                  </div>
                  <p className="text-white/60 text-[9.5px]">
                    Letter includes direct desk line <strong>(858) 353-1200</strong> for calls &amp; text inquiries.
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-[#1a1810] border border-white/5 space-y-0.5">
                  <div className="font-bold text-blue-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>3. Direct Email Reply</span>
                  </div>
                  <p className="text-white/60 text-[9.5px]">
                    Recipient can hit reply to respond directly to Bob Dyson at <strong>bob@dysonrelo.com</strong>.
                  </p>
                </div>
              </div>

              {/* Live Link display */}
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#0e0d08] border border-white/10 font-mono text-[9.5px] text-white/70 overflow-hidden">
                <span className="text-[#D4AF37] font-bold shrink-0">Generated Link:</span>
                <span className="truncate">{returnLink}</span>
              </div>
            </div>

            {/* Result banner if sent */}
            {sentResult && (
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 animate-in fade-in ${
                sentResult.success ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981]' : 'bg-red-500/15 border-red-500 text-red-400'
              }`}>
                <div className="flex items-center gap-2 text-xs">
                  {sentResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <div>
                    {sentResult.success ? (
                      <span>
                        <strong>Success!</strong> Invitation dispatched to <strong>{sentResult.recipient}</strong> at {sentResult.timestamp}. Logged in Communication registry.
                      </span>
                    ) : (
                      <span><strong>Error:</strong> {sentResult.error}</span>
                    )}
                  </div>
                </div>
                {sentResult.success && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold underline cursor-pointer shrink-0"
                  >
                    View Sent Log →
                  </button>
                )}
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <div className="text-xs text-white/60">
                <span>Sending to: </span>
                <strong className="text-white">
                  {activeRecipient.fullName || 'No contact selected yet'}
                </strong>
                {activeRecipient.email && <span className="text-[#D4AF37] ml-1 font-mono">({activeRecipient.email})</span>}
                {activeRecipient.phone && <span className="text-white/60 ml-1 font-mono">📞 {activeRecipient.phone}</span>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendInvite}
                  disabled={sending || (!activeRecipient.email && !activeRecipient.phone)}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2 cursor-pointer ${
                    sending || (!activeRecipient.email && !activeRecipient.phone)
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    background: (!activeRecipient.email && !activeRecipient.phone)
                      ? undefined
                      : 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                    color: (!activeRecipient.email && !activeRecipient.phone) ? undefined : '#0a0a0a',
                  }}
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Invite...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Invitation Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ========================================================
            SENT LOG & RECENT DISPATCHES HISTORY TAB
            ======================================================== */
        <div className="p-4 sm:p-6 bg-[#0a0a0a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Recent Subscriber Invitations &amp; Communications</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181818] border border-white/10 text-[#D4AF37]">
                  {recentComms.length} Recorded
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Audited dispatch logs sent via Resend (Email) and Twilio (SMS).
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetchComms()}
              className="px-3 py-1.5 rounded-lg bg-[#181818] border border-white/15 text-xs text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#101010]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-white/10 text-[10px] uppercase tracking-wider text-[#D4AF37]">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Contact Detail</th>
                  <th className="p-3">Sent Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/50">
                      Loading communication records...
                    </td>
                  </tr>
                ) : recentComms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/50">
                      No sent invitations logged yet. Return to the Compose tab to send your first invitation.
                    </td>
                  </tr>
                ) : (
                  recentComms.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.communication_type === 'email'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {c.communication_type}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">
                        {c.recipient_name || 'Subscriber Lead'}
                      </td>
                      <td className="p-3 font-mono text-white/70">
                        {c.recipient_email || c.recipient_phone || '—'}
                      </td>
                      <td className="p-3 text-white/50 font-mono text-[11px]">
                        {c.sent_date ? new Date(c.sent_date).toLocaleString() : '—'}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10b981]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{c.status || 'Sent'}</span>
                        </span>
                      </td>
                      <td className="p-3 max-w-[200px] truncate text-white/50 text-[10.5px]">
                        {c.message_content || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}