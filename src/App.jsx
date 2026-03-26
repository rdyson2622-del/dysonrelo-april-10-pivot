import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";

// Verified paths from your sidebar
import Dashboard from './pages/Dashboard';
import GeminiSession from './pages/GeminiSession';
import RelocationIntake from './pages/RelocationIntake';
import PageNotFound from './lib/PageNotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Re-linking the working Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Temporary placeholder for the roadmap until we verify the filename */}
            <Route path="/roadmap" element={<Dashboard />} /> 
            
            <Route path="/gemini" element={<GeminiSession />} />
            <Route path="/intake" element={<RelocationIntake />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}