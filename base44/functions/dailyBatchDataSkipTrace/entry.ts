import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const BATCHDATA_API_KEY = Deno.env.get("BATCHDATA_API_KEY");
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE = Deno.env.get("TWILIO_FROM_PHONE");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Admin-only
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get latest 50 active listings in San Francisco, $2M+
    const listings = await base44.entities.ListingImport.filter(
      { status: 'active', city: 'San Francisco', state: 'CA', price: { '$gte': 2000000 } },
      '-list_date',
      50
    );

    if (listings.length === 0) {
      return Response.json({ success: true, message: 'No active listings to process' });
    }

    const results = [];
    const errors = [];

    for (const listing of listings) {
      try {
        // Call BatchData skip trace API
        const batchDataResponse = await fetch('https://api.batchdata.com/v1/property/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BATCHDATA_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: listing.property_address,
            city: listing.city,
            state: listing.state,
            zip: listing.zip
          })
        });

        if (!batchDataResponse.ok) {
          errors.push({ address: listing.property_address, error: 'BatchData API error' });
          continue;
        }

        const batchDataResult = await batchDataResponse.json();
        const ownerData = batchDataResult.data?.[0];

        if (!ownerData) {
          errors.push({ address: listing.property_address, error: 'No owner data found' });
          continue;
        }

        // Create or update ListingOwner
        const ownerRecord = {
          owner_name: ownerData.owner_name || 'Unknown',
          property_address: listing.property_address,
          property_city: listing.city,
          property_state: listing.state,
          listing_price: listing.price,
          phone: ownerData.phone,
          email: ownerData.email || '',
          contact_status: 'not_contacted',
          notes: `Skip traced via BatchData on ${new Date().toLocaleDateString()}`
        };

        const createdOwner = await base44.entities.ListingOwner.create(ownerRecord);
        results.push({ address: listing.property_address, owner_id: createdOwner.id, phone: ownerData.phone });

        // Send SMS via Twilio if phone exists
        if (ownerData.phone && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE) {
          const messageBody = `Hi ${ownerData.owner_name?.split(' ')[0] || 'there'}, we found a buyer interested in your property at ${listing.property_address}. Interested in learning more? Reply YES or call us.`;

          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              From: TWILIO_PHONE,
              To: ownerData.phone,
              Body: messageBody
            }).toString()
          });
        }

      } catch (err) {
        errors.push({ address: listing.property_address, error: err.message });
      }
    }

    return Response.json({
      success: true,
      processed: results.length,
      errors: errors.length,
      details: { results, errors }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});