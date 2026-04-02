import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { city } = await req.json();
    if (!city) {
      return Response.json({ error: 'Missing city' }, { status: 400 });
    }

    // Get all owners in that city
    const owners = await base44.asServiceRole.entities.ListingOwner.filter({ property_city: city });
    
    if (!owners.length) {
      return Response.json({ error: `No owners found in ${city}` }, { status: 404 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');

    // Twilio Lookup API to validate phones
    const validateUrl = `https://lookups.twilio.com/v2/PhoneNumbers`;
    const results = {
      valid: [],
      invalid: [],
      no_phone: [],
      errors: [],
    };

    for (const owner of owners) {
      if (!owner.phone || !owner.phone.trim()) {
        results.no_phone.push({ id: owner.id, name: owner.owner_name });
        continue;
      }

      try {
        const phoneRes = await fetch(`${validateUrl}/${encodeURIComponent(owner.phone)}?CountryCode=US`, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          },
        });

        const phoneData = await phoneRes.json();

        if (phoneRes.ok) {
          results.valid.push({
            id: owner.id,
            name: owner.owner_name,
            phone: phoneData.phone_number,
            country: phoneData.country_code,
            carrier: phoneData.carrier?.name || 'Unknown',
          });
        } else {
          results.invalid.push({
            id: owner.id,
            name: owner.owner_name,
            phone: owner.phone,
            error: phoneData.message || 'Invalid format',
          });
        }
      } catch (err) {
        results.errors.push({
          id: owner.id,
          name: owner.owner_name,
          phone: owner.phone,
          error: err.message,
        });
      }
    }

    return Response.json({
      city,
      total_owners: owners.length,
      summary: {
        valid: results.valid.length,
        invalid: results.invalid.length,
        no_phone: results.no_phone.length,
        errors: results.errors.length,
      },
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});