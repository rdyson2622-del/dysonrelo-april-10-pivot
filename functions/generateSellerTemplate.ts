import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { listing_id, seller_name, property_address, destination_hint } = await req.json();

    if (!listing_id || !seller_name || !property_address) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const destinationText = destination_hint ? `We understand you're relocating to ${destination_hint}.` : 'We understand you may be relocating.';

    const emailTemplate = `Subject: Exclusive Relocation Support for Your Move – Complimentary

Dear ${seller_name},

Congratulations on your home sale at ${property_address}! We're reaching out with an exclusive opportunity.

${destinationText} Our firm specializes in making relocations seamless through our AI-powered concierge service, Charlie.

We offer:
✓ Free AI-powered relocation planning & neighborhood research
✓ Expert local agent matching at your destination
✓ End-to-end moving coordination
✓ Schools, utilities, healthcare setup – all handled for you

**Best part: It costs you nothing as a buyer.**

Would you be open to a brief 10-minute conversation about your move? We'd love to help make your relocation effortless.

Reply to this email or call us at your convenience.

Warm regards,
Dyson & Dyson Relocation Services
Concierge Relocation Services for Families`;

    const docTemplate = `
# SELLER OUTREACH LETTER

**TO:** ${seller_name}
**RE:** Relocation Support Services
**PROPERTY:** ${property_address}

---

## OFFER SUMMARY

Dyson & Dyson offers **complimentary AI-powered relocation concierge services** to sellers relocating after a successful sale.

### What We Provide:
1. **Charlie AI Concierge** – Available 24/7 for relocation questions
2. **Neighborhood & City Research** – Customized to your lifestyle and priorities
3. **Vetted Local Agent Matching** – Top-producing agents in your destination market
4. **Property Search Strategy** – AI-powered home matching based on your criteria
5. **Moving & Logistics Coordination** – Moving companies, storage, delivery
6. **Schools, Healthcare, Utilities Setup** – Complete transition checklist
7. **Social & Community Integration** – Churches, clubs, local connections

### Cost to You:
**Zero.** This service is 100% complimentary for relocating families.

### How It Works:
1. Schedule a free 10-minute consultation with our team
2. Charlie begins your personalized relocation plan
3. We match you with a local agent in your destination city
4. We coordinate every detail of your move
5. You arrive in your new home fully prepared and connected

---

**Would you like to learn more?**

Contact us: [YOUR_EMAIL] | [YOUR_PHONE]
Visit: dysonanddyson.com

---

*Dyson & Dyson Concierge Relocation Services – Making Moves Seamless Since 2026*
`;

    return Response.json({
      emailTemplate,
      docTemplate,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});