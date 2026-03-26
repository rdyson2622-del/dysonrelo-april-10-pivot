import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

// Using /src/ to bypass the broken @ alias
import { queryClientInstance } from '/src/lib/query-client';
import { AuthProvider } from '/src/lib/AuthContext';
import { Toaster } from "/src/components/ui/toaster";

// Verified Page Components - Adding /src/ to every path
import Dashboard from '/src/pages/Dashboard';
import Admin from '/src/pages/Admin';
import CharlieScripts from '/src/pages/CharlieScripts';
import GeminiSession from '/src/pages/GeminiSession';
import RelocationIntake from '/src/pages/RelocationIntake';
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