import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Direct paths - No "@" symbols
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import CharlieScripts from './pages/CharlieScripts';import RelocationIntake from '/src/pages/RelocationIntake';
import RelocationRoadmap from '/src/pages/RelocationRoadmap';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/scripts" element={<CharlieScripts />} />
            <Route path="/gemini" element={<GeminiSession />} />
            <Route path="/intake" element={<RelocationIntake />} />
            <Route path="/roadmap" element={<RelocationRoadmap />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;