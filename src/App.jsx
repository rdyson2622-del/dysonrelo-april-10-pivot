import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";

// These paths are updated to match your sidebar exactly
import Dashboard from './pages/Dashboard';
import MovingPlan from './MovingPlan'; // Removed /pages/ because it's in the root
import GeminiSession from './pages/GeminiSession';
import RelocationIntake from './pages/RelocationIntake';
import PageNotFound from './lib/PageNotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<MovingPlan />} /> 
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