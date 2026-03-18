import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { jsPDF } from 'npm:jspdf@4.0.0';

const TEMPLATES = {
  listing_agreement: {
    title: 'Listing Agreement',
    sections: [
      { heading: 'LISTING AGREEMENT', subheading: 'Exclusive Right to Sell', style: 'cover' },
      {
        heading: '1. PARTIES',
        body: 'This Listing Agreement ("Agreement") is entered into as of {{date}} between {{owner_name}} ("Seller") and the Brokerage ("Broker").',
      },
      {
        heading: '2. PROPERTY',
        body: 'Property Address: {{property_address}}\nListing Price: ${{listing_price}}\nProperty Description: Residential real property as described above.',
      },
      {
        heading: '3. LISTING PERIOD',
        body: 'This Agreement shall commence on {{date}} and expire in 6 months unless extended by written agreement.',
      },
      {
        heading: '4. COMPENSATION',
        body: 'Broker shall receive a commission of 6% of the final sale price at closing. In the event of a relocation referral, a referral fee of 25% of the gross commission shall be paid to the referring party.',
      },
      {
        heading: '5. SELLER OBLIGATIONS',
        body: 'Seller agrees to:\n- Provide accurate property information and disclosures\n- Allow reasonable access for showings\n- Refer all purchase inquiries to Broker\n- Cooperate with the relocation process if applicable',
      },
      {
        heading: '6. RELOCATION SERVICES',
        body: 'Seller acknowledges that Broker is coordinating relocation services to {{destination_city}}, {{destination_state}}. A relocation management fee of 15% of the gross commission applies.\nDestination Agent will be assigned by Broker.',
      },
      {
        heading: '7. SIGNATURES',
        body: 'By signing below, both parties agree to the terms of this Agreement.\n\nSeller Signature: _____________________________   Date: ____________\n\nPrinted Name: {{owner_name}}\n\nBroker Signature: _____________________________   Date: ____________',
      },
    ],
  },
  referral_contract: {
    title: 'Referral Agreement',
    sections: [
      { heading: 'REFERRAL AGREEMENT', subheading: 'Real Estate Referral & Relocation Services', style: 'cover' },
      {
        heading: '1. AGREEMENT PARTIES',
        body: 'This Referral Agreement ("Agreement") is entered into as of {{date}} between the Referring Broker ("We") and {{agent_name}} of {{agent_broker}} ("Receiving Agent").',
      },
      {
        heading: '2. REFERRED CLIENT',
        body: 'Client Name: {{owner_name}}\nProperty Being Sold: {{property_address}}\nDestination City/State: {{destination_city}}, {{destination_state}}\nEstimated Sale Price: ${{listing_price}}',
      },
      {
        heading: '3. REFERRAL FEE',
        body: 'Receiving Agent agrees to pay Referring Broker a referral fee equal to 25% of the gross commission earned on the destination-side transaction.\nThis fee is due and payable at the close of escrow of the destination property purchase.',
      },
      {
        heading: '4. RELOCATION MANAGEMENT FEE',
        body: 'In addition to the referral fee, a relocation management fee of 15% of the gross commission shall be paid to Referring Broker for coordination of relocation services, including destination agent selection, concierge support, and client communication.',
      },
      {
        heading: '5. AGENT RESPONSIBILITIES',
        body: 'Receiving Agent agrees to:\n- Contact the referred client within 24 hours of referral\n- Provide regular status updates (bi-weekly minimum)\n- Notify Referring Broker immediately upon offer acceptance and close of escrow\n- Maintain professional standards per NAR Code of Ethics',
      },
      {
        heading: '6. AGREEMENT TERM',
        body: 'This Agreement is effective on the date signed and shall remain in effect for 24 months or until the transaction closes, whichever is later.',
      },
      {
        heading: '7. SIGNATURES',
        body: 'Referring Broker Signature: _____________________________   Date: ____________\n\nReceiving Agent Signature: _____________________________   Date: ____________\n\nPrinted Name: {{agent_name}}\nLicense #: {{agent_license}}\nBrokerage: {{agent_broker}}',
      },
    ],
  },
  seller_disclosure: {
    title: 'Seller Disclosure Form',
    sections: [
      { heading: 'SELLER DISCLOSURE STATEMENT', subheading: 'Real Property Transfer Disclosure', style: 'cover' },
      {
        heading: 'PROPERTY INFORMATION',
        body: 'Property Address: {{property_address}}\nSeller Name(s): {{owner_name}}\nDate of Disclosure: {{date}}',
      },
      {
        heading: 'A. PROPERTY CONDITIONS',
        body: 'Seller discloses the following known conditions (check all that apply):\n\n[ ] The property has a history of water intrusion or flooding\n[ ] The property has known structural defects\n[ ] The roof has been repaired or replaced within the last 5 years\n[ ] HVAC systems have been serviced or replaced within the last 5 years\n[ ] The property has been treated for pests or termites\n[ ] There are known easements or encumbrances on the property',
      },
      {
        heading: 'B. LEGAL DISCLOSURES',
        body: '[ ] The property is located in a Special Flood Hazard Area\n[ ] The property is subject to CC&Rs or HOA regulations\n[ ] The property is in a designated wildfire zone\n[ ] There are any pending legal actions involving the property\n[ ] The property has had any unpermitted additions or improvements',
      },
      {
        heading: 'C. ENVIRONMENTAL DISCLOSURES',
        body: '[ ] The property has been tested for radon and results are attached\n[ ] The property has been tested for lead-based paint (pre-1978 construction)\n[ ] Underground storage tanks are present on the property\n[ ] The property is near hazardous materials or contamination sites',
      },
      {
        heading: 'D. RELOCATION ACKNOWLEDGMENT',
        body: 'Seller acknowledges that they are relocating to {{destination_city}}, {{destination_state}}, and that relocation referral services are being coordinated by Broker. Seller consents to sharing of contact information with destination agents for the purpose of assisting with housing needs at the destination.',
      },
      {
        heading: 'E. CERTIFICATION',
        body: 'The undersigned Seller certifies that the information provided in this disclosure is true and accurate to the best of their knowledge as of the date signed. Seller agrees to notify Broker of any changes to this disclosure prior to close of escrow.\n\nSeller Signature: _____________________________   Date: ____________\n\nPrinted Name: {{owner_name}}',
      },
    ],
  },
};

function fillPlaceholders(text, data) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || `[${key}]`);
}

function buildPDF(templateKey, data) {
  const template = TEMPLATES[templateKey];
  if (!template) throw new Error(`Unknown template: ${templateKey}`);

  const doc = new jsPDF({ format: 'letter', unit: 'mm' });
  const pageW = 215.9;
  const pageH = 279.4;
  const marginL = 20;
  const marginR = 20;
  const contentW = pageW - marginL - marginR;
  let y = 30;

  const addPage = () => {
    doc.addPage();
    y = 20;
  };

  const checkY = (needed = 10) => {
    if (y + needed > pageH - 20) addPage();
  };

  template.sections.forEach((section, idx) => {
    if (section.style === 'cover') {
      // Cover page header
      doc.setFillColor(30, 41, 59); // slate-800
      doc.rect(0, 0, pageW, 60, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(section.heading, pageW / 2, 28, { align: 'center' });
      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.text(section.subheading, pageW / 2, 40, { align: 'center' });

      // Meta info box
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      y = 80;
      const metaLines = [
        `Date: ${data.date}`,
        `Client: ${data.owner_name}`,
        `Property: ${data.property_address}`,
        data.destination_city ? `Destination: ${data.destination_city}, ${data.destination_state || ''}` : null,
      ].filter(Boolean);

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginL, y - 6, contentW, metaLines.length * 8 + 10, 3, 3, 'F');
      metaLines.forEach((line) => {
        doc.text(line, marginL + 6, y);
        y += 8;
      });
      y += 16;
      return;
    }

    // Regular section
    checkY(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(fillPlaceholders(section.heading, data), marginL, y);
    y += 7;

    // Underline
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(marginL, y, marginL + contentW, y);
    y += 5;

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const body = fillPlaceholders(section.body, data);
    const lines = doc.splitTextToSize(body, contentW);
    lines.forEach((line) => {
      checkY();
      doc.text(line, marginL, y);
      y += 6;
    });

    y += 8;
  });

  // Page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageW / 2, pageH - 8, { align: 'center' });
    doc.text('CONFIDENTIAL — For authorized use only', marginL, pageH - 8);
  }

  return doc.output('arraybuffer');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { template_type, campaign_id, send_email, recipient_email, recipient_name } = body;

    if (!template_type) return Response.json({ error: 'template_type required' }, { status: 400 });

    // Fetch campaign data if campaign_id provided
    let campaignData = {};
    if (campaign_id) {
      const campaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ id: campaign_id });
      if (campaigns.length > 0) {
        const c = campaigns[0];
        campaignData = {
          owner_name: c.owner_name || '',
          property_address: c.property_address || '',
          listing_price: c.listing_price ? c.listing_price.toLocaleString() : '0',
          destination_city: c.destination_city || '',
          destination_state: c.destination_state || '',
          owner_phone: c.owner_phone || '',
        };
      }
    }

    // Merge with any extra fields passed in
    const data = {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      agent_name: body.agent_name || '[Agent Name]',
      agent_broker: body.agent_broker || '[Brokerage]',
      agent_license: body.agent_license || '[License #]',
      ...campaignData,
      ...body.overrides,
    };

    const pdfBytes = buildPDF(template_type, data);

    // If send_email is true, use SendEmail integration
    if (send_email && recipient_email) {
      const templateTitles = {
        listing_agreement: 'Listing Agreement',
        referral_contract: 'Referral Agreement',
        seller_disclosure: 'Seller Disclosure Form',
      };

      const docTitle = templateTitles[template_type] || 'Document';

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: recipient_email,
        subject: `${docTitle} — ${data.property_address}`,
        body: `Dear ${recipient_name || data.owner_name},\n\nPlease find your ${docTitle} attached for the property at ${data.property_address}.\n\nThis document has been prepared for your review. Please contact us if you have any questions.\n\nBest regards,\nYour Relocation Team`,
      });

      return Response.json({
        success: true,
        emailed: true,
        recipient: recipient_email,
        document_title: docTitle,
      });
    }

    // Otherwise return the PDF for download
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template_type}_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});