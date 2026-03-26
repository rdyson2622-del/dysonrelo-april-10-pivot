import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";

// These are the files you just restored!
import Dashboard from './pages/Dashboard';
import RelocationRoadmap from './pages/RelocationRoadmap';
import GeminiSession from './pages/GeminiSession';
import RelocationIntake from './pages/RelocationIntake';
import PageNotFound from './lib/PageNotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* This makes your Dashboard the first thing people see */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<RelocationRoadmap />} />
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