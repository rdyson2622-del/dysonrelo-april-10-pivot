import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

const PEOPLE_API = "https://people.googleapis.com/v1";

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized — admin only" }, { status: 401 });
    }

    const body = req.body || {};
    const source = body.source || "saved"; // 'saved' | 'other' | 'all'
    const batchName =
      body.batch_name ||
      `gmail_${source}_${new Date().toISOString().split("T")[0]}`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection(
      "google_contacts"
    );
    if (!accessToken) {
      return Response.json(
        { error: "Google Contacts connector not connected" },
        { status: 400 }
      );
    }

    // Load existing google_contact_ids to dedupe
    const existing = await base44.asServiceRole.entities.BobDysonContact.list(
      "-created_date",
      10000
    );
    const seenIds = new Set(
      (existing || [])
        .filter((c) => c.google_contact_id)
        .map((c) => c.google_contact_id)
    );

    let imported = 0;
    let skipped = 0;
    let pages = 0;
    const errors = [];

    const flushBatch = async (batch) => {
      if (batch.length === 0) return;
      await base44.asServiceRole.entities.BobDysonContact.bulkCreate(batch);
      imported += batch.length;
    };

    // ── Saved contacts ──
    if (source === "saved" || source === "all") {
      let pageToken = null;
      let batch = [];

      do {
        const url = new URL(`${PEOPLE_API}/people/me/connections`);
        url.searchParams.set(
          "personFields",
          "names,emailAddresses,phoneNumbers,organizations,biographies,addresses,memberships"
        );
        url.searchParams.set("pageSize", "1000");
        if (pageToken) url.searchParams.set("pageToken", pageToken);

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          errors.push(`Saved contacts page ${pages}: ${errText}`);
          break;
        }

        const data = await res.json();
        pages++;
        const connections = data.connections || [];

        for (const person of connections) {
          const resourceName = person.resourceName;
          if (!resourceName || seenIds.has(resourceName)) {
            skipped++;
            continue;
          }

          const name = person.names?.[0];
          const given = name?.givenName || "";
          const family = name?.familyName || "";
          const fullName =
            `${given} ${family}`.trim() ||
            name?.displayName ||
            person.emailAddresses?.[0]?.value ||
            "";

          if (!fullName) {
            skipped++;
            continue;
          }

          const emails = (person.emailAddresses || [])
            .map((e) => e.value)
            .filter(Boolean);
          const phones = (person.phoneNumbers || [])
            .map((p) => p.value)
            .filter(Boolean);
          const org = person.organizations?.[0];
          const addr = person.addresses?.[0];
          const tags = (person.memberships || [])
            .map((m) => m.contactGroupMembership?.contactGroupName)
            .filter(Boolean);

          batch.push({
            full_name: fullName,
            first_name: given,
            last_name: family,
            email: emails[0] || "",
            emails,
            phone: phones[0] || "",
            phones,
            company: org?.name || "",
            title: org?.title || "",
            city: addr?.city || "",
            state: addr?.region || "",
            notes: person.biographies?.[0]?.value || "",
            google_contact_id: resourceName,
            google_resource_name: resourceName,
            import_batch: batchName,
            tags,
            status: "active",
          });

          seenIds.add(resourceName);

          if (batch.length >= 200) {
            await flushBatch(batch);
            batch = [];
          }
        }

        pageToken = data.nextPageToken;
      } while (pageToken);

      await flushBatch(batch);
    }

    // ── Other contacts (people emailed but never saved) ──
    if (source === "other" || source === "all") {
      let pageToken = null;
      let batch = [];

      do {
        const url = new URL(`${PEOPLE_API}/otherContacts`);
        url.searchParams.set(
          "readMask",
          "names,emailAddresses,phoneNumbers"
        );
        url.searchParams.set("pageSize", "1000");
        if (pageToken) url.searchParams.set("pageToken", pageToken);

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          errors.push(`Other contacts page: ${errText}`);
          break;
        }

        const data = await res.json();
        pages++;
        const contacts = data.otherContacts || [];

        for (const person of contacts) {
          const resourceName = person.resourceName;
          if (!resourceName || seenIds.has(resourceName)) {
            skipped++;
            continue;
          }

          const name = person.names?.[0];
          const given = name?.givenName || "";
          const family = name?.familyName || "";
          const fullName =
            `${given} ${family}`.trim() ||
            name?.displayName ||
            person.emailAddresses?.[0]?.value ||
            "";

          if (!fullName) {
            skipped++;
            continue;
          }

          const emails = (person.emailAddresses || [])
            .map((e) => e.value)
            .filter(Boolean);
          const phones = (person.phoneNumbers || [])
            .map((p) => p.value)
            .filter(Boolean);

          batch.push({
            full_name: fullName,
            first_name: given,
            last_name: family,
            email: emails[0] || "",
            emails,
            phone: phones[0] || "",
            phones,
            google_contact_id: resourceName,
            google_resource_name: resourceName,
            import_batch: batchName,
            tags: ["other_contact"],
            status: "active",
          });

          seenIds.add(resourceName);

          if (batch.length >= 200) {
            await flushBatch(batch);
            batch = [];
          }
        }

        pageToken = data.nextPageToken;
      } while (pageToken);

      await flushBatch(batch);
    }

    return Response.json({
      status: "success",
      source,
      imported,
      skipped,
      pages,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Import failed" },
      { status: 500 }
    );
  }
}