import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

const GOLD = '#D4AF37';

export default function RelocationManagementModal({ isOpen, onClose }) {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!isOpen) return null;

  const nextSlide = () => {
    if (slideIndex < 2) setSlideIndex(slideIndex + 1);
  };

  const prevSlide = () => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden"
        style={{ background: '#0a0a0a' }}>

        {/* Close button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 hover:bg-white/10 rounded-lg transition-all">
          <X className="w-5 h-5" style={{ color: '#fff' }} />
        </button>

        {/* Slide 1: The Promise */}
        {slideIndex === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[90vh] px-8 py-12 text-center"
            style={{ background: '#1a1a1a' }}>
            <p className="text-sm font-black tracking-widest uppercase mb-6" style={{ color: GOLD }}>
              The Dyson Promise
            </p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
              maxWidth: '700px'
            }}>
              We Don't Send You a Map.
            </h1>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 500,
              color: GOLD,
              lineHeight: 1.3,
              marginBottom: '3rem'
            }}>
              We Make the Journey With You.
            </h2>

            <div className="max-w-2xl space-y-4">
              <p className="text-base leading-relaxed" style={{ color: '#fff' }}>
                We are <strong style={{ color: GOLD }}>Relocation Managers</strong>. Not Agents. Not a listing service. We help families and professionals sell their current home and find their next one, anywhere in the country. Every step below is something Charlie and your Dyson team actively advocate on your behalf, all the way through close of escrow and beyond.
              </p>
              <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                We intentionally work with a limited number of families at any given time. This isn't exclusivity — it's a commitment. Real relocation management requires deep local focus, market expertise, timeline coordination, and relentless attention to detail. We're not scaling a service. We're delivering one.
              </p>
            </div>
          </div>
        )}

        {/* Slide 2: Services */}
        {slideIndex === 1 && (
          <div className="flex flex-col items-center justify-center min-h-[90vh] px-8 py-12"
            style={{ background: '#2a2a2a' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              {[
                { icon: '💬', title: 'AI Concierge Chat', desc: 'Charlie is available 24/7 to answer questions' },
                { icon: '📍', title: 'Neighborhood Research', desc: 'Deep dive into schools, culture, and community' },
                { icon: '👥', title: 'Agent Selection', desc: 'We vet and match you with the best agents' },
                { icon: '🏠', title: 'Home Search', desc: 'Curated listings matched to your priorities' },
              ].map((service, i) => (
                <div key={i} className="p-6 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(212,175,55,0.3)` }}>
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: '#fff' }}>{service.title}</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 3: Fresh Start CTA */}
        {slideIndex === 2 && (
          <div className="flex flex-col items-center justify-center min-h-[90vh] px-8 py-12 text-center"
            style={{ background: '#333' }}>
            <p className="text-sm font-black tracking-widest uppercase mb-4" style={{ color: GOLD }}>
              Get Started Today
            </p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '0.5rem'
            }}>
              Ready for Your
            </h1>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 600,
              color: GOLD,
              lineHeight: 1.2,
              marginBottom: '2rem'
            }}>
              Fresh Start?
            </h2>

            <p className="text-base max-w-xl mb-8 leading-relaxed" style={{ color: '#fff' }}>
              Talk to Charlie right now. Share where you're moving and we'll take it from there — your relocation manager, your Gemini session, your plan. No hidden fees. Always free.
            </p>

            <a href="/chat" onClick={onClose}
              className="px-8 py-4 rounded-full font-black text-lg transition-all hover:opacity-90 inline-block"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
              Let's Plan My Relocation Move
            </a>
          </div>
        )}

        {/* Navigation */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
          <button
            onClick={prevSlide}
            disabled={slideIndex === 0}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30"
            style={{ background: GOLD, color: '#000' }}>
            ← Back
          </button>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: slideIndex === i ? GOLD : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            disabled={slideIndex === 2}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30 flex items-center gap-2"
            style={{ background: GOLD, color: '#000' }}>
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}