import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
import { AuthProvider } from './lib/AuthContext';
import { Toaster } from "./components/ui/toaster";

// Page Imports
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import CharlieScripts from './pages/CharlieScripts';
import GeminiSession from './pages/GeminiSession';
import RelocationIntake from './pages/RelocationIntake';
import RelocationRoadmap from './pages/RelocationRoadmap';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/scripts" element={<CharlieScripts />} />
            <Route path="/gemini" element={<GeminiSession />} />
            <Route path="/intake" element={<RelocationIntake />} />
            <Route path="/roadmap" element={<RelocationRoadmap />} />
            
            {/* The "404 Killer" - redirects broken links to Dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;