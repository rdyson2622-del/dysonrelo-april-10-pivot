import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const BATCHDATA_API_KEY = Deno.env.get("BATCHDATA_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    if (!BATCHDATA_API_KEY) {
      return Response.json({ error: 'BATCHDATA_API_KEY not configured' }, { status: 500 });
    }

    // Get Palo Alto listings from our DB that haven't been skip traced yet
    const listings = await base44.asServiceRole.entities.ListingImport.filter(
      { city: 'Palo Alto', state: 'CA', status: 'active' },
      '-list_date',
      10
    );

    if (listings.length === 0) {
      return Response.json({
        success: true,
        message: 'No Palo Alto listings found. Run findPaloAltoListings first.',
        tip: 'Make sure to run the findPaloAltoListings function first to import listings.'
      });
    }

    console.log(`Skip tracing ${listings.length} Palo Alto listings...`);

    // BatchData skip trace accepts up to 100 properties per request in bulk
    // Docs: https://developer.batchdata.com/docs/batchdata/batchdata-v1/operations/create-a-property-skip-trace
    const skipTraceRequests = listings.map(listing => ({
      propertyAddress: {
        street: listing.property_address,
        city: listing.city || 'Palo Alto',
        state: listing.state || 'CA',
        zip: listing.zip || ''
      }
    }));

    console.log("Sending skip trace request for", skipTraceRequests.length, "properties...");
    console.log("Sample request:", JSON.stringify(skipTraceRequests[0], null, 2));

    const response = await fetch("https://api.batchdata.com/api/v1/property/skip-trace", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: skipTraceRequests
      })
    });

    const responseText = await response.text();
    console.log("Skip trace response status:", response.status);
    console.log("Skip trace raw response (first 3000 chars):", responseText.substring(0, 3000));
    console.log("Response headers:", {
      contentType: response.headers.get('content-type'),
      location: response.headers.get('location')
    });

    if (!response.ok) {
      return Response.json({
        error: `BatchData skip trace API error: ${response.status} ${response.statusText}`,
        details: responseText
      }, { status: 502 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      // Try to parse as HTML and extract JSON from it
      console.log("JSON parse failed, attempting HTML parse...");
      
      // Look for JSON inside HTML (common in error responses)
      const jsonMatch = responseText.match(/<pre[^>]*>(.*?)<\/pre>/s) || responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extracted = jsonMatch[1] || jsonMatch[0];
          data = JSON.parse(extracted);
          console.log("Successfully extracted JSON from HTML");
        } catch {
          return Response.json({ 
            error: 'HTML response detected, could not extract JSON', 
            html_preview: responseText.substring(0, 500),
            statusCode: response.status 
          }, { status: 502 });
        }
      } else {
        return Response.json({ 
          error: 'Failed to parse BatchData response (HTML instead of JSON)',
          response_type: response.headers.get('content-type'),
          status_code: response.status,
          html_preview: responseText.substring(0, 500)
        }, { status: 502 });
      }
    }

    // BatchData returns results array matching input order
    const results = data?.results || data?.data || [];
    console.log(`Received ${results.length} skip trace results`);

    const owners_created = [];
    const errors = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const listing = listings[i];

      if (!listing) continue;

      // Extract owner info from BatchData response
      // Response structure: result.owner or result.owners or result.person
      const ownerData = result?.owner || result?.owners?.[0] || result?.person || result;
      const ownerName = ownerData?.name?.full
        || ownerData?.ownerName
        || ownerData?.fullName
        || [ownerData?.name?.first, ownerData?.name?.last].filter(Boolean).join(' ')
        || 'Unknown Owner';

      // Phone numbers — BatchData returns array of phone objects
      const phones = ownerData?.phones || ownerData?.phoneNumbers || result?.phones || [];
      const primaryPhone = phones[0]?.number || phones[0]?.phone || phones[0] || '';

      // Email addresses
      const emails = ownerData?.emails || ownerData?.emailAddresses || result?.emails || [];
      const primaryEmail = emails[0]?.email || emails[0]?.address || emails[0] || '';

      // Check if owner already exists for this address
      const existing = await base44.asServiceRole.entities.ListingOwner.filter({
        property_address: listing.property_address
      });

      if (existing.length > 0) {
        // Update with fresh contact info if we have it
        if (primaryPhone || primaryEmail) {
          await base44.asServiceRole.entities.ListingOwner.update(existing[0].id, {
            phone: primaryPhone || existing[0].phone,
            email: primaryEmail || existing[0].email,
            notes: `Re-skip traced via BatchData on ${new Date().toLocaleDateString()}`
          });
          owners_created.push({
            address: listing.property_address,
            owner: ownerName,
            phone: primaryPhone,
            email: primaryEmail,
            action: 'updated'
          });
        } else {
          errors.push({ address: listing.property_address, reason: 'No contact info returned by skip trace' });
        }
        continue;
      }

      // Create new ListingOwner record
      const owner = await base44.asServiceRole.entities.ListingOwner.create({
        owner_name: ownerName,
        phone: primaryPhone,
        email: primaryEmail,
        property_address: listing.property_address,
        property_city: listing.city || 'Palo Alto',
        property_state: listing.state || 'CA',
        listing_price: listing.price,
        contact_status: 'not_contacted',
        notes: `Skip traced via BatchData on ${new Date().toLocaleDateString()}. ${phones.length} phone(s) found, ${emails.length} email(s) found.`
      });

      owners_created.push({
        id: owner.id,
        address: listing.property_address,
        price: listing.price,
        owner: ownerName,
        phone: primaryPhone,
        email: primaryEmail,
        all_phones: phones.map(p => p.number || p.phone || p).filter(Boolean),
        all_emails: emails.map(e => e.email || e.address || e).filter(Boolean),
        action: 'created'
      });
    }

    return Response.json({
      success: true,
      listings_processed: listings.length,
      owners_found: owners_created.length,
      errors: errors.length,
      owners: owners_created,
      errors_detail: errors,
      raw_sample: results[0] || null  // Show first result structure for debugging
    });

  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});