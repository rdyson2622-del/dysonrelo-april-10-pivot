import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import { jsPDF } from 'npm:jspdf@4.0.0';

const GOLD = [212, 175, 55];
const DARK = [20, 20, 20];
const GRAY = [100, 100, 100];
const LIGHT_GRAY = [240, 240, 240];

const CATEGORY_LABELS = {
  intake: 'Initial Intake',
  consultation: 'Consultation',
  agent: 'Agent Selection',
  search: 'Property Search',
  offer: 'Offer / Negotiation',
  escrow: 'Escrow Opened',
  title: 'Title',
  inspection: 'Inspection',
  financing: 'Financing / Loan',
  closing: 'Closing',
  post_close: 'Post-Close',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { client_id, client_name, destination_city, milestones } = await req.json();

    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 50;
    let y = margin;

    // ── Header bar ──
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, pageW, 70, 'F');

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('DYSON & DYSON', margin, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Concierge Relocation Services', margin, 46);
    doc.text('Confidential Transaction Record', pageW - margin, 46, { align: 'right' });

    y = 95;

    // ── Client block ──
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(`Transaction Record: ${client_name}`, margin, y);
    y += 18;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(`Destination: ${destination_city || 'TBD'}   ·   Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}   ·   Total Events: ${milestones.length}`, margin, y);
    y += 6;

    // Divider
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.line(margin, y, pageW - margin, y);
    y += 20;

    // ── Intro paragraph ──
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'italic');
    const intro = `This document constitutes a complete audit trail of all relocation-related events, communications, and decisions from initial client contact through close of escrow, as managed by Dyson & Dyson Concierge Relocation Services.`;
    const introLines = doc.splitTextToSize(intro, pageW - margin * 2);
    doc.text(introLines, margin, y);
    y += introLines.length * 13 + 16;

    // ── Timeline events ──
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];

      // Page break
      if (y > pageH - 120) {
        doc.addPage();
        y = margin;
      }

      const catLabel = CATEGORY_LABELS[m.category] || m.category;
      const dateStr = m.completed_date || (m.created_date ? new Date(m.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');

      // Row background
      doc.setFillColor(...LIGHT_GRAY);
      doc.roundedRect(margin, y - 4, pageW - margin * 2, 14, 2, 2, 'F');

      // Category pill
      doc.setFillColor(...GOLD);
      doc.roundedRect(margin + 4, y - 2, 90, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(catLabel.toUpperCase(), margin + 49, y + 5.5, { align: 'center' });

      // Title
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...DARK);
      const titleX = margin + 100;
      doc.text(m.title, titleX, y + 5.5, { maxWidth: pageW - margin * 2 - 180 });

      // Date
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - margin - 4, y + 5.5, { align: 'right' });

      // Critical badge
      if (m.is_critical) {
        doc.setFontSize(7);
        doc.setTextColor(180, 30, 30);
        doc.text('⚠ CRITICAL', pageW - margin - 4, y - 2, { align: 'right' });
      }

      y += 18;

      // Notes
      if (m.notes) {
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY);
        const noteLines = doc.splitTextToSize(m.notes, pageW - margin * 2 - 20);
        doc.text(noteLines, margin + 10, y);
        y += noteLines.length * 12;
      }

      // Parties
      if (m.parties_involved?.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(120, 100, 40);
        doc.text(`Parties: ${m.parties_involved.join(', ')}`, margin + 10, y);
        y += 12;
      }

      y += 8;
    }

    // ── Footer on each page ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(...GOLD);
      doc.rect(0, pageH - 30, pageW, 30, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('The Dyson & Dyson Companies | CA.DRE # 02303118 | Confidential', margin, pageH - 12);
      doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 12, { align: 'right' });
    }

    const pdfBytes = doc.output('arraybuffer');

    // Upload to storage and return URL
    const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({
      file: new Blob([pdfBytes], { type: 'application/pdf' }),
    });

    return Response.json({ pdf_url: file_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});