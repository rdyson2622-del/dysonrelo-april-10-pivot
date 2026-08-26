import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, FileText, AlertTriangle, Download, Send } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import MasterAgreementText from '@/components/agreements/MasterAgreementText';
import SendAgreementModal from '@/components/agreements/SendAgreementModal';

const GOLD = '#D4AF37';

export default function AdminMasterAgreement() {
  const navigate = useNavigate();
  const [showSendModal, setShowSendModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  const downloadPdf = async () => {
    const el = printRef.current;
    if (!el || downloading) return;
    setDownloading(true);
    try {
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
      pdf.save('Master-Referral-Relocation-Agreement.pdf');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d' }}>
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden px-6 py-5 flex flex-col md:flex-row md:items-center gap-4"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
            <FileText className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Master Referral &amp; Relocation Management Agreement</h1>
            <p className="text-xs text-white">One agreement, both functions — signed by referring and receiving broker &amp; agent.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('/admin/agreement-submissions')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}>
            <FileText className="w-4 h-4" /> Sent Agreements
          </button>
          <button onClick={() => setShowSendModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}>
            <Send className="w-4 h-4" /> Send to Agent to Fill Out
          </button>
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}>
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={downloadPdf} disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            <Download className="w-4 h-4" /> {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {showSendModal && <SendAgreementModal onClose={() => setShowSendModal(false)} />}

      {/* Legal disclaimer — hidden when printing */}
      <div className="print:hidden max-w-4xl mx-auto mt-4 mb-2 px-4">
        <div className="flex items-start gap-3 p-4 rounded-xl text-xs text-white"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
          <p>
            This is a working draft for internal review. Before use with any broker or agent, have it reviewed
            by your real estate attorney — particularly for referral-fee and fee-splitting rules in each
            receiving agent's state, and RESPA applicability.
          </p>
        </div>
      </div>

      <div className="py-6 print:py-0">
        <div ref={printRef}>
          <MasterAgreementText />
        </div>
      </div>
    </div>
  );
}