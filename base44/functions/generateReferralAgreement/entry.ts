import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      list_agent_name,
      broker_name,
      list_agent_email,
      property_address,
      seller_name,
      referral_fee_percent = 25,
      relocation_mgmt_fee_percent = 15
    } = await req.json();

    if (!list_agent_name || !broker_name || !property_address) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const agreement = `
# RELOCATION REFERRAL & MANAGEMENT AGREEMENT

**DATE:** ${new Date().toLocaleDateString()}

**BETWEEN:**
**Dyson & Dyson Concierge Relocation Services** ("Dyson & Dyson")
AND
**${list_agent_name}** / **${broker_name}** ("Listing Agent/Broker")

**RE: Property at ${property_address}**
**Seller: ${seller_name}**

---

## 1. REFERRAL SERVICE OVERVIEW

Dyson & Dyson specializes in comprehensive relocation services for families selling their homes. We provide:
- AI-powered relocation concierge (Charlie)
- Destination market research and neighborhood analysis
- Vetted local agent matching and buyer representation
- Complete moving coordination and lifestyle setup

**Cost to Seller:** Completely Free

---

## 2. REFERRAL FEE STRUCTURE

### Listing Agent Compensation:
- **Referral Fee:** ${referral_fee_percent}% of Dyson & Dyson's earned relocation management fee
- **Paid:** At close of escrow on the RECEIVING BROKER's transaction

### Example Calculation:
If Dyson & Dyson earns $10,000 in relocation management fees, Listing Agent receives:
**$10,000 × ${referral_fee_percent}% = $${(10000 * referral_fee_percent / 100).toLocaleString()}**

---

## 3. DYSON & DYSON MANAGEMENT FEE

Dyson & Dyson charges the RECEIVING BROKER (destination market):
- **Relocation Management Fee:** ${relocation_mgmt_fee_percent}% of the buyer's side commission at close of escrow
- **Paid:** At close of transaction in seller's new market

This fee covers:
- AI concierge services (Charlie)
- Local agent matching and vetting
- Destination market research
- Moving logistics coordination
- Schools, utilities, healthcare setup
- Community integration support

---

## 4. TERMS & CONDITIONS

### 4.1 Referral Process
1. Listing Agent introduces seller to Dyson & Dyson
2. Seller engages Charlie AI concierge for relocation planning
3. Dyson & Dyson matches seller with vetted agent in destination market
4. Receiving broker agrees to our standard 10-20% relocation management fee
5. Deal closes; fees are paid to both parties

### 4.2 Referral Exclusivity
- This agreement applies ONLY to sellers referred by ${list_agent_name}/${broker_name}
- Valid for **12 months** from date of listing

### 4.3 No Cost to Listing Agent
- Listing Agent incurs no costs or liability
- Dyson & Dyson handles all client communication and service delivery

### 4.4 Payment Terms
- Referral fees paid at close of escrow from Receiving Broker's proceeds
- Dyson & Dyson will wire payment within 5 business days of closing

### 4.5 Confidentiality
- All seller information is confidential
- Dyson & Dyson agrees to professional, ethical conduct throughout process

---

## 5. TERMINATION

Either party may terminate this agreement with 30 days written notice, effective for new referrals only. Active referrals remain subject to these terms until close of escrow.

---

## 6. SIGNATURES

**FOR LISTING AGENT / BROKER:**

Name (Print): _________________________
Signature: _________________________
Date: _________________________
Email: ${list_agent_email}

**FOR DYSON & DYSON:**

Name (Print): _________________________
Signature: _________________________
Date: _________________________
Email: [DYSON_EMAIL]

---

**Questions?** Contact: partnerships@dysonanddyson.com

*This agreement is effective upon signature by both parties.*
`;

    return Response.json({
      agreement,
      generated_at: new Date().toISOString(),
      status: 'ready_for_signature'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});