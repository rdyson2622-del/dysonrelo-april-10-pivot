import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { campaignId, action, platform, contentPillar } = await req.json();

    if (action === 'generate_copy') {
      // Fetch campaign to get context
      const campaign = await base44.asServiceRole.entities.MarketingCampaign.filter(
        { id: campaignId },
        '-created_date',
        1
      );

      if (!campaign?.[0]) {
        return Response.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const c = campaign[0];
      const platformContext = {
        linkedin: 'professional, thought leadership focused',
        facebook: 'community-focused, accessible',
        instagram: 'visual storytelling, inspirational',
        tiktok: 'trendy, conversational, short-form',
        twitter: 'punchy, timely, engagement-driven',
        email: 'conversational, benefit-driven',
        sms: 'ultra-short, action-oriented'
      }[platform];

      const prompt = `
You are a relocation marketing expert for Dyson & Dyson Concierge Relocation Services.

Campaign: ${c.campaign_name}
Theme: ${c.theme}
Target Audience: ${c.target_audience}
Content Pillar: ${contentPillar}
Platform: ${platform} (${platformContext})
Key Messages: ${c.key_messages?.join(', ') || 'Professional relocation expertise'}

Generate 3 distinct copy variations for a ${platform} post. Each should:
1. Align with the campaign theme
2. Speak to the target audience
3. Match the platform's tone (${platformContext})
4. Be concise but compelling
5. Include a subtle CTA

Return a JSON object with this structure:
{
  "variants": [
    {
      "variant_id": "v1",
      "text": "...",
      "tone": "professional|friendly|urgent|inspirational",
      "word_count": number
    },
    {
      "variant_id": "v2",
      "text": "...",
      "tone": "...",
      "word_count": number
    },
    {
      "variant_id": "v3",
      "text": "...",
      "tone": "...",
      "word_count": number
    }
  ]
}
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            variants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  variant_id: { type: 'string' },
                  text: { type: 'string' },
                  tone: { type: 'string' },
                  word_count: { type: 'number' }
                }
              }
            }
          }
        }
      });

      return Response.json({ variants: response.variants });
    }

    if (action === 'generate_image') {
      // Fetch campaign
      const campaign = await base44.asServiceRole.entities.MarketingCampaign.filter(
        { id: campaignId },
        '-created_date',
        1
      );

      if (!campaign?.[0]) {
        return Response.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const c = campaign[0];
      const audienceContext = {
        relocating_families: 'family moving to a new city, excited and organized',
        real_estate_agents: 'professional real estate agent at work',
        corporate_hr: 'corporate office setting with diverse employees',
        general_awareness: 'happy people in various relocation scenarios'
      }[c.target_audience] || 'people in a relocation context';

      const imagePrompt = `
Create a modern, professional marketing image for a relocation concierge service targeting ${c.target_audience}.

Campaign: ${c.campaign_name}
Theme: ${c.theme}
Content Pillar: ${contentPillar}

The image should feature: ${audienceContext}. 
Style: Modern, clean, professional, warm, trustworthy. 
Color palette: Gold accents with professional neutrals.
High quality, suitable for social media and marketing.
`;

      const imageRes = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      return Response.json({ image_url: imageRes.url });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});