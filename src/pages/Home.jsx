import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, CheckCircle2, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharlieAvatar from '../components/charlie/CharlieAvatar';

const features = [
  {
    icon: MessageCircle,
    title: 'Meet Charlie',
    desc: 'Your AI relocation assistant who knows everything about your new city.',
  },
  {
    icon: MapPin,
    title: 'City Intelligence',
    desc: 'Neighborhoods, schools, cost of living, and local culture — all researched for you.',
  },
  {
    icon: CheckCircle2,
    title: 'Moving Managed',
    desc: 'From utilities to doctors, Charlie handles every detail of your move.',
  },
  {
    icon: Shield,
    title: 'Trusted Network',
    desc: 'Vetted local professionals: realtors, movers, contractors, and more.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CharlieAvatar size="sm" />
          <span className="font-bold text-lg text-slate-900">ReloCharlie</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/Dashboard">
            <Button variant="ghost" className="text-sm">Dashboard</Button>
          </Link>
          <Link to="/Admin">
            <Button variant="outline" className="text-sm">Admin</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                AI-Powered Relocation
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Moving somewhere
                <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  you know no one?
                </span>
              </h1>
              <p className="text-lg text-slate-500 mt-6 max-w-lg leading-relaxed">
                Charlie is your personal relocation assistant. From finding the perfect neighborhood to setting up utilities — he handles everything so you can focus on the exciting parts of your new chapter.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/Dashboard">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white gap-2 rounded-xl px-6">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/Chat">
                  <Button size="lg" variant="outline" className="gap-2 rounded-xl px-6">
                    Talk to Charlie <MessageCircle className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 rounded-[2rem] blur-3xl opacity-20 scale-110" />
                <div className="relative bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 w-full max-w-sm">
                  <div className="flex justify-center mb-6">
                    <CharlieAvatar size="xl" speaking={true} />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-700">
                      Hey! I'm Charlie 👋 Ready to make your move stress-free?
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm ml-8">
                      I'm moving to Austin, TX!
                    </div>
                    <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-700">
                      Great choice! Austin's amazing. Let me pull up neighborhoods, schools, and cost of living for you... 🏡
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need for a fresh start</h2>
          <p className="text-slate-500 mt-3">Charlie handles the hard parts of relocating</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6 text-center">
        <p className="text-sm text-slate-400">© 2026 ReloCharlie. Making relocation human again.</p>
      </footer>
    </div>
  );
}