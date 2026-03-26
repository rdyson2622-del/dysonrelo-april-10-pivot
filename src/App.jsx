import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

// We are using DIRECT paths to bypass the "@" alias errors
import { queryClientInstance } from './lib/query-client';
import { AuthProvider } from './lib/AuthContext';
import { Toaster } from "./components/ui/toaster";

// Verified Page Components
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