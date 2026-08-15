import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BobDysonContactModal from "@/components/admin/BobDysonContactModal";
import {
  Users,
  Mail,
  Phone,
  Building2,
  Download,
  RefreshCw,
  Loader2,
  Search,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  UserPlus,
} from "lucide-react";

const GOLD = "#D4AF37";

function exportCSV(contacts) {
  const headers = [
    "full_name",
    "email",
    "phone",
    "company",
    "title",
    "city",
    "state",
    "tags",
    "import_batch",
  ];
  const rows = contacts.map((c) =>
    [
      c.full_name || "",
      c.email || "",
      c.phone || "",
      c.company || "",
      c.title || "",
      c.city || "",
      c.state || "",
      (c.tags || []).join("; "),
      c.import_batch || "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bob_dyson_contacts_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBobDysonContacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [importSource, setImportSource] = useState("saved");
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [filterTag, setFilterTag] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BobDysonContact.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bob_dyson_contacts"] }),
  });

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["bob_dyson_contacts"],
    queryFn: () => base44.entities.BobDysonContact.list("-created_date", 10000),
  });

  const allTags = useMemo(() => {
    const t = new Set();
    contacts.forEach((c) => (c.tags || []).forEach((tag) => t.add(tag)));
    return Array.from(t).sort();
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter((c) => {
      const matchesSearch =
        !q ||
        (c.full_name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.company || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q);
      const matchesTag = !filterTag || (c.tags || []).includes(filterTag);
      return matchesSearch && matchesTag;
    });
  }, [contacts, search, filterTag]);

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      withEmail: contacts.filter((c) => c.email).length,
      withPhone: contacts.filter((c) => c.phone).length,
      withCompany: contacts.filter((c) => c.company).length,
    };
  }, [contacts]);

  const runImport = async () => {
    setImporting(true);
    setImportResult(null);
    setImportError(null);
    try {
      const res = await base44.functions.invoke("bobDysonContactImport", {
        source: importSource,
      });
      const data = res?.data || res;
      if (data?.error) throw new Error(data.error);
      setImportResult(data);
      qc.invalidateQueries({ queryKey: ["bob_dyson_contacts"] });
    } catch (e) {
      setImportError(e.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif text-dyson-gold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Bob Dyson Contact List
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Gmail contacts imported from rdyson2622@gmail.com via Google Contacts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => { setEditingContact(null); setShowModal(true); }}
              className="gold-btn border-0"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add Contact
            </Button>
            <Button
              onClick={() => exportCSV(filtered)}
              disabled={filtered.length === 0}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV ({filtered.length})
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Contacts", value: stats.total, icon: Users },
            { label: "With Email", value: stats.withEmail, icon: Mail },
            { label: "With Phone", value: stats.withPhone, icon: Phone },
            { label: "With Company", value: stats.withCompany, icon: Building2 },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-4"
            >
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
              <p className="text-2xl font-bold" style={{ color: GOLD }}>
                {s.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Import Panel */}
        <div className="rounded-xl border border-dyson-gold/30 bg-dyson-gold/5 p-5 mb-6">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dyson-gold mb-3">
            Import from Gmail
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={importSource}
              onChange={(e) => setImportSource(e.target.value)}
              className="bg-black/40 border border-white/20 text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="saved">Saved Contacts only</option>
              <option value="other">Other Contacts (emailed, not saved)</option>
              <option value="all">All (Saved + Other)</option>
            </select>
            <Button
              onClick={runImport}
              disabled={importing}
              className="gold-btn border-0"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Import Contacts
                </>
              )}
            </Button>
            <span className="text-xs text-gray-500">
              Dedupes by Google contact ID — safe to re-run
            </span>
          </div>

          {importResult && (
            <div className="mt-3 flex items-start gap-2 text-sm bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <div className="text-gray-200">
                Imported <strong className="text-white">{importResult.imported}</strong> new
                contacts, skipped <strong className="text-white">{importResult.skipped}</strong>{" "}
                duplicates across {importResult.pages} pages
                {importResult.errors?.length > 0 && (
                  <span className="text-red-300"> ({importResult.errors.length} errors)</span>
                )}
                .
              </div>
            </div>
          )}

          {importError && (
            <div className="mt-3 flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{importError}</span>
            </div>
          )}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company, phone…"
              className="pl-10 bg-black/40 border-white/20 text-white"
            />
          </div>
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="bg-black/40 border border-white/20 text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="">All tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Contact List */}
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading contacts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-white/10 bg-dyson-charcoal/30">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-gray-400 text-sm">
              {contacts.length === 0
                ? "No contacts yet. Run an import above to pull from Gmail."
                : "No contacts match your search."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-dyson-charcoal text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Company</th>
                  <th className="text-left px-4 py-3 hidden xl:table-cell">Tags</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 500).map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{c.full_name}</div>
                      {(c.city || c.state) && (
                        <div className="text-xs text-gray-500">
                          {[c.city, c.state].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-300">
                      {c.email || "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-300">
                      {c.phone || "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-300">
                      {c.company || "—"}
                      {c.title && (
                        <div className="text-xs text-gray-500">{c.title}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(c.tags || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-dyson-gold/10 text-dyson-gold border border-dyson-gold/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingContact(c); setShowModal(true); }}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title="Edit contact"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-dyson-gold" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${c.full_name}?`)) deleteMutation.mutate(c.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete contact"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 500 && (
              <div className="px-4 py-3 bg-dyson-charcoal text-center text-xs text-gray-500">
                Showing first 500 of {filtered.length.toLocaleString()} contacts.
                Use search to narrow down, or Export CSV for the full list.
              </div>
            )}
          </div>
          )}
          </div>

          {showModal && (
          <BobDysonContactModal
           contact={editingContact}
           onClose={() => { setShowModal(false); setEditingContact(null); }}
           onSaved={() => qc.invalidateQueries({ queryKey: ["bob_dyson_contacts"] })}
          />
          )}
          </div>
          );
          }