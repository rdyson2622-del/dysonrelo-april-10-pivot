import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, GraduationCap, DollarSign, Heart, Building2, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const categories = [
  { key: 'neighborhoods', label: 'Neighborhoods', icon: Building2, color: 'bg-blue-500' },
  { key: 'schools', label: 'Schools & Education', icon: GraduationCap, color: 'bg-emerald-500' },
  { key: 'cost', label: 'Cost of Living', icon: DollarSign, color: 'bg-amber-500' },
  { key: 'healthcare', label: 'Healthcare', icon: Heart, color: 'bg-red-500' },
  { key: 'recreation', label: 'Parks & Recreation', icon: TreePine, color: 'bg-green-500' },
  { key: 'culture', label: 'Local Culture', icon: MapPin, color: 'bg-purple-500' },
];

export default function CityGuide() {
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchCity = async (cat) => {
    if (!city.trim()) return;
    setSelectedCategory(cat);
    setLoading(true);
    setResult(null);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Provide a detailed guide about ${cat} in ${city}. Include specific, helpful information that someone relocating would need. Format with clear sections using markdown headers and bullet points. Be specific with names of places, price ranges, and practical advice.`,
      add_context_from_internet: true,
    });

    setResult(response);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3">
        <Link to="/Dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-slate-900 text-sm">City Guide</h1>
          <p className="text-xs text-slate-400">Research your new city</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Where are you moving?</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Enter city name (e.g., Austin, TX)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => searchCity(cat.label)}
              disabled={!city.trim() || loading}
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedCategory === cat.label
                  ? 'bg-white border-orange-200 shadow-md'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className={`w-9 h-9 rounded-xl ${cat.color} text-white flex items-center justify-center mb-3`}>
                <cat.icon className="w-4 h-4" />
              </div>
              <p className="font-medium text-sm text-slate-900">{cat.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Results */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm"
          >
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500">Charlie is researching {city}...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold text-slate-900">{selectedCategory} in {city}</h3>
            </div>
            <div className="prose prose-sm prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}