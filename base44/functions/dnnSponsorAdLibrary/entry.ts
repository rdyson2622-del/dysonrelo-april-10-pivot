import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnSponsorAdLibrary — manages the 7-slot DNN Sponsor Ad rotation.
 * DNN is the broadcast company; Bob Dyson and the Dyson Companies sponsor the
 * news. Each of the 7 ads is Bob's opinion + suggested response on a national
 * real estate issue (Fed policy, lending, federal legislation, etc.) — never a
 * single-city story.
 *
 * Actions (POST body):
 *   { action: "seed" }            → create the initial 7-day rotation (loopDay 1-7)
 *   { action: "startAll" }        → render all draft/failed ads
 *   { action: "checkAll" }        → poll all rendering ads
 *   { action: "start", adId }     → render one ad
 *   { action: "check", adId }     → poll one ad
 *
 * Auth: admin session.
 */

const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

const SEED = [
  {
    loopDay: 1,
    topic: 'federal_reserve',
    title: 'Day 1 — The Fed and Your Mortgage Rate',
    script: "Every time the Federal Reserve meets, my phone starts ringing. Here's what I'd suggest keeping in mind. The Fed doesn't set your mortgage rate directly, but it moves the whole board. Many of our clients have found it pays more to lock in a good rate on a good house than to gamble on timing the market perfectly. Nobody rings a bell at the bottom. If a move makes sense for your life, I wouldn't let a headline about the Fed talk you out of it.",
  },
  {
    loopDay: 2,
    topic: 'mortgage_lending',
    title: 'Day 2 — Lending Standards Are Shifting',
    script: "Lenders nationwide are tightening and loosening their standards depending on the month, and it's confusing people. One approach that's worked well for our clients is getting pre-approved early, before you even pick a neighborhood, so you know exactly where you stand. I'd suggest treating your lender relationship the same way you'd treat picking an agent. Shop it, ask questions, and don't assume the first number you hear is the only number available to you.",
  },
  {
    loopDay: 3,
    topic: 'federal_legislation',
    title: 'Day 3 — Washington and Your Housing Costs',
    script: "There's always a new bill in Washington touching property taxes or housing incentives, and most people never hear about it until it hits their bill. I'd suggest not waiting for that letter to show up. Many of our clients have found it's worth a quick conversation with someone who tracks this for a living, so you're planning around it instead of reacting to it. That's really the whole idea behind what we do here at Dyson and Dyson.",
  },
  {
    loopDay: 4,
    topic: 'national_housing_data',
    title: 'Day 4 — The Inventory Story Nobody Fixed',
    script: "Inventory is still tight in a lot of this country, and that shapes everything from your negotiating power to your timeline. You might think about widening your search a little, both in location and in property type, rather than waiting for the perfect listing to appear. I've watched clients hold out for months for one dream house that never showed up, when three other houses down the street would have made them just as happy.",
  },
  {
    loopDay: 5,
    topic: 'insurance_climate',
    title: 'Day 5 — Insurance Costs Are Part of the Price Now',
    script: "Insurance premiums have become their own line item in whether a home makes sense for a family, especially with climate risk pricing changing so fast. I'd suggest getting an insurance quote before you fall in love with a house, not after. Many of our clients have found a property they could afford on paper turned into a different conversation once the real premium came in. Better to know early than to find out at the closing table.",
  },
  {
    loopDay: 6,
    topic: 'regulatory_compliance',
    title: 'Day 6 — Buyer Agreements, Explained Simply',
    script: "The rules around buyer broker agreements have changed nationwide, and I think that's actually good for consumers, once people understand it. One thing I'd suggest is asking your agent to walk you through exactly what they do for you and how they get paid, in plain language, before you sign anything. That's how we've always run things at Dyson and Dyson, so this new standard just caught the rest of the industry up to where we already were.",
  },
  {
    loopDay: 7,
    topic: 'consumer_protection',
    title: 'Day 7 — Watch the Fees, Not Just the Price',
    script: "Closing costs and junk fees are getting more attention nationally, and rightly so. I'd suggest asking for a full breakdown of every fee in writing early in the process, not the week you're supposed to close. Many of our clients have found that a five minute question up front saves a very uncomfortable surprise later. That kind of transparency is the whole reason a concierge model like ours exists in the first place.",
  },
];

const DEFAULT_DISCLOSURE = '[Insert Bob Dyson broker license / DRE# here before airing] Sponsored by Dyson and Dyson Real Estate.';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { action } = body || {};
    const Ads = base44.asServiceRole.entities.DnnSponsorAd;

    const startRender = async (ad) => {
      const inputText = ad.disclosure ? `${ad.script} ${ad.disclosure}` : ad.script;
      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
            voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: inputText, emotion: 'Excited', speed: 1.15 },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Ads.update(ad.id, { status: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data };
      }
      await Ads.update(ad.id, { heygenId: videoId, status: 'rendering', errorMessage: '' });
      return { videoId };
    };

    const checkRender = async (ad) => {
      if (!ad.heygenId) return { skipped: true };
      const res = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(ad.heygenId)}`,
        { headers: { 'X-Api-Key': heygenKey } }
      );
      const data = await res.json();
      const status = data?.data?.status;

      if (status === 'completed') {
        const vidRes = await fetch(data?.data?.video_url);
        if (!vidRes.ok) return { error: 'download failed' };
        const buf = await vidRes.arrayBuffer();
        const file = new File([buf], `sponsorad_${ad.id}.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Ads.update(ad.id, { videoUrl: up.file_url, status: 'completed' });
        return { status: 'completed', url: up.file_url };
      }
      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen render failed';
        await Ads.update(ad.id, { status: 'failed', errorMessage: errMsg });
        return { status: 'failed', error: errMsg };
      }
      return { status: status || 'processing' };
    };

    if (action === 'seed') {
      const existing = await Ads.list();
      if (existing.length > 0) {
        return Response.json({ success: true, message: 'Already seeded', count: existing.length });
      }
      const created = await Ads.bulkCreate(SEED.map(s => ({ ...s, status: 'draft', isActive: true, disclosure: DEFAULT_DISCLOSURE })));
      return Response.json({ success: true, created: created.length });
    }

    if (action === 'startAll') {
      const ads = await Ads.list('loopDay', 20);
      const results = [];
      for (const ad of ads) {
        if (ad.status === 'draft' || ad.status === 'failed') {
          const r = await startRender(ad);
          results.push({ adId: ad.id, title: ad.title, ...r });
        }
      }
      return Response.json({ success: true, started: results.length, results });
    }

    if (action === 'checkAll') {
      const ads = await Ads.filter({ status: 'rendering' }, null, 20);
      const results = [];
      for (const ad of ads) {
        const r = await checkRender(ad);
        results.push({ adId: ad.id, title: ad.title, ...r });
      }
      return Response.json({ success: true, checked: results });
    }

    if (action === 'start' || action === 'check') {
      const { adId } = body;
      if (!adId) return Response.json({ error: 'adId required' }, { status: 400 });
      const arr = await Ads.filter({ id: adId });
      const ad = arr?.[0];
      if (!ad) return Response.json({ error: 'Ad not found' }, { status: 404 });
      const r = action === 'start' ? await startRender(ad) : await checkRender(ad);
      return Response.json({ success: !r.error, ...r });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});