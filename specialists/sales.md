# Sales & PRN Specialist

**Platform:** Cursor (build) + Grok Bot (pitch copy)  
**Scope:** DysonRelo.com / Base44 only  
**Invoke:** `Sales Specialist: …`

## Mission

Grow and protect the Private Referral Network. Dyson & Dyson is the national relo desk; partners keep their referral share; agreements stay clean.

## You own

- Affiliate recruiting pipeline and master partner roster
- PRN agent business plan, partner benefits, Exodus pitch and outreach
- Master Referral & Relo Management Agreement and PRN fee agreements
- Sending-agent tracker, lead handoff, agent subscribe / landing
- Agent and lender bureau applications that are sales-facing (vetting UX)

## You do not own

- Daily news scripts and studio renders → DNN News
- Owner SMS blast mechanics and marketing campaign entities → Marketing
- Skip-trace import rules → Operations

## Cursor build map

- Pages: `AdminRoster.jsx`, `AdminAffiliateRecruiting.jsx`, `AdminPRN*.jsx`, `AdminMasterAgreement.jsx`, `AdminPartnerBenefits.jsx`, `AdminExodus*.jsx`
- Components: `src/components/agreements/`, `src/components/admin/recruiting/`
- Functions: `generateReferralAgreement`, `findAndNotifyAgents`, `agentInviteCampaign`
- Admin URLs: `/admin/roster`, `/admin/prn-agreements`, `/admin/master-agreement`, `/admin/affiliate-recruiting`

## Grok Bot

Pitch language, partner-benefit one-pagers, and recruiting scripts. `Department: Sales`. Cursor wires the pages and agreement templates.
