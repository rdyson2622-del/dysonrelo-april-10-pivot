import React, { useEffect, useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, CheckCircle2, Clock, Download } from 'lucide-react';
import MasterAgreementText from '@/components/agreements/MasterAgreementText';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const GOLD = '#D4AF37';

function StatusPill({ done, sentAt }) {
  if (done) return <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: '#22c55e' }}><CheckCircle2 className="w-3 h-3" /> Signed</span>;
  if (sentAt) return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/50"><Clock className="w-3 h-3" /> Awaiting signature</span>;
  return <span className="text-[11px] font-bold text-white/30">Not sent</span>;
}

export default function AdminAgreementSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const viewRef = useRef(null);

  useEffect(() => {
    base44.entities.ReferralAgreementSubmission.list('-created_date').then(res => {
      setItems(res);
      setLoading(false);
    });
  }, []);

  const downloadPdf = async () => {
    const el = viewRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`Referral-Agreement-${(viewing.client_name || 'client').replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d' }}>
      <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
            <FileText className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Sent Agreements</h1>
            <p className="text-xs text-white">Track referral agreements sent out for online completion and signature.</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {loading ? (
          <p className="text-sm text-white/60">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-white/60">No agreements have been sent yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="rounded-xl p-4 flex items-center justify-between gap-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div>
                  <p className="text-sm font-bold text-white">{item.client_name || 'Untitled Client'}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[11px] text-white/50">Referring: <StatusPill done={item.referring_completed} sentAt={item.sent_referring_at} /></span>
                    <span className="text-[11px] text-white/50">Receiving: <StatusPill done={item.receiving_completed} sentAt={item.sent_receiving_at} /></span>
                  </div>
                </div>
                <button onClick={() => setViewing(item)}
                  className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}>
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}` }}>
            <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="text-sm font-bold text-white">{viewing.client_name}</p>
              <div className="flex items-center gap-2">
                <button onClick={downloadPdf} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button onClick={() => setViewing(null)} className="text-xs font-bold px-3 py-1.5 rounded-full text-white/70">Close</button>
              </div>
            </div>
            <div className="overflow-y-auto p-4">
              <div ref={viewRef}>
                <MasterAgreementText data={viewing} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}