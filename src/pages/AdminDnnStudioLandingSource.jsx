import React from 'react';
import LockedPageSourceViewer from '@/components/dnn/LockedPageSourceViewer';
import { DNN_STUDIO_LANDING_SOURCE } from '@/lib/dnnStudioLandingSource';

// Admin-only reference page — holds the locked, verified source code of
// src/pages/DnnStudioLanding.jsx. This code is NEVER shown on the live
// landing page itself; it lives here so the correct version can always
// be recovered without re-hunting for it.
export default function AdminDnnStudioLandingSource() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <LockedPageSourceViewer
        title="Locked Source: DNN Studio Landing Page"
        filePath="src/pages/DnnStudioLanding.jsx"
        code={DNN_STUDIO_LANDING_SOURCE}
      />
    </div>
  );
}