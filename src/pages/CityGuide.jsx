import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, GraduationCap, DollarSign, Heart, Building2, TreePine, MessageCircle, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

const categories = [
  { key: 'neighborhoods', label: 'Neighborhoods', icon: Building2, color: 'bg-blue-500', prompt: 'top neighborhoods and communities' },
  { key: 'schools', label: 'Schools & Education', icon: GraduationCap, color: 'bg-emerald-500', prompt: 'schools, school districts, and education options' },
  { key: 'cost', label: 'Cost of Living', icon: DollarSign, color: 'bg-amber-500', prompt: 'cost of living including housing, groceries, utilities, and taxes' },
  { key: 'healthcare', label: 'Healthcare', icon: Heart, color: 'bg-red-500', prompt: 'hospitals, medical centers, and healthcare options' },
  { key: 'recreation', label: 'Parks & Recreation', icon: TreePine, color: 'bg-green-500', prompt: 'parks, outdoor recreation, sports, and fitness options' },
  { key: 'culture', label: 'Local Culture', icon: MapPin, color: 'bg-purple-500', prompt: 'local culture, dining, arts, community life, and things to do' },
];

export default function CityGuide() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (city.trim()) setSubmittedCity(city.trim());
  };

  const searchCity = async (cat) => {
    if (!submittedCity) return;
    setSelectedCategory(cat);
    setLoading(true);
    setResult(null);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Provide a detailed, practical guide about ${cat.prompt} in ${submittedCity} for a family relocating there. Include specific names of places, realistic price ranges, neighborhoods, and actionable advice. Use markdown with headers and bullet points. Be specific — avoid vague generalities.`,
      add_context_from_internet: true,
    });

    // InvokeLLM returns the text directly (string)
    const text = typeof response === 'string' ? response : (response?.data || response?.result || JSON.stringify(response));
    setResult(text);
    setLoading(false);
  };

  const cityReady = !!submittedCity;

  return (
    <div className="min-h-screen" style={{ background: '#f8f8f8' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{ background: '#000', borderBottom: `1px solid rgba(212,175,55,0.2)` }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <Link to="/Home" className="flex-1 flex justify-center">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-9 w-auto" />
        </Link>
        <div className="w-8" />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>CITY GUIDE</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#111' }}>Research Your New City</h1>
          <p className="text-sm text-slate-500">Enter a destination city, then tap any category to get AI-powered research.</p>
        </div>

        {/* City Search */}
        <form onSubmit={handleCitySubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Enter city (e.g., Austin, TX)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl border-2"
                style={{ borderColor: submittedCity ? GOLD : undefined }}
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded-xl font-bold"
              style={{ background: GOLD, color: '#000' }}>
              Go
            </Button>
          </div>
          {submittedCity && (
            <p className="text-xs mt-2 ml-1 font-semibold" style={{ color: GOLD }}>
              ✓ Researching: {submittedCity} — tap a category below
            </p>
          )}
        </form>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => searchCity(cat)}
              disabled={!cityReady || loading}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                selectedCategory?.key === cat.key
                  ? 'shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              style={selectedCategory?.key === cat.key ? { background: '#fff', borderColor: GOLD } : {}}
            >
              <div className={`w-10 h-10 rounded-xl ${cat.color} text-white flex items-center justify-center mb-3`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-sm text-slate-900">{cat.label}</p>
              {!cityReady && <p className="text-xs text-slate-400 mt-1">Enter city first</p>}
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border-2 p-8 text-center mb-6"
              style={{ borderColor: 'rgba(212,175,55,0.3)' }}
            >
              <div className="w-8 h-8 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-700">
                Researching <span style={{ color: GOLD }}>{selectedCategory?.label}</span> in {submittedCity}...
              </p>
              <p className="text-xs text-slate-400 mt-1">Pulling live data from the web — this takes about 10 seconds</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border-2 p-6 mb-6"
              style={{ borderColor: 'rgba(212,175,55,0.3)' }}
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${selectedCategory?.color} text-white flex items-center justify-center`}>
                  {selectedCategory && <selectedCategory.icon className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedCategory?.label} in {submittedCity}</h3>
                  <p className="text-xs text-slate-400">AI research • Live data</p>
                </div>
              </div>

              <div className="prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>

              {/* CTA after results */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: '#0d0d0d', border: `1px solid ${GOLD}` }}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#fff' }}>
                  Want a personalized guide for your move to {submittedCity}?
                </p>
                <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Charlie can walk you through our full service — agents, schools, utilities — all tailored to your family.
                </p>
                <Link to="/Chat">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
                    style={{ background: GOLD, color: '#000' }}>
                    <MessageCircle className="w-4 h-4" />
                    Talk to Charlie — It's Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!cityReady && !loading && (
          <div className="text-center py-8 text-slate-400">
            <MapPin className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Enter a destination city above to unlock the research categories.</p>
          </div>
        )}
      </main>
    </div>
  );
}