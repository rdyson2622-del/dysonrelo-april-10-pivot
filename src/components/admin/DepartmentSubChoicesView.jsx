import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Newspaper, GitBranch, ClipboardList, MapPin, Building2, SendHorizontal, 
  Video, Edit, Library, Clapperboard, Zap, BarChart3, Users, Send, Shield, 
  BookOpen, Star, FileCheck, DollarSign, Archive, ArrowRight, Sparkles,
  Map, ShieldCheck, FileSearch, Home, ShoppingBag, TrendingUp, Calendar,
  MessageCircle, Fingerprint, List, ExternalLink, Play, Mail, MessageSquare, CheckCircle2, Inbox, Clock,
  Calculator, CloudSun, Mic, Brain, Compass, Thermometer, Phone, ScrollText,
  Monitor, Plug, Megaphone, FileText, LayoutDashboard, Layers
} from 'lucide-react';
import { ADMIN_DEPT_MINI_APPS } from './AdminMiniAppsGrid';
import { DEPARTMENT_DATA } from './departmentData';
import LiveEmailTextStatusPanel from './LiveEmailTextStatusPanel';
import CalendarMiniApp from '@/components/miniapps/CalendarMiniApp';
import CalculatorMiniApp from '@/components/miniapps/CalculatorMiniApp';
import WeatherMiniApp from '@/components/miniapps/WeatherMiniApp';

const GOLD = '#D4AF37';

export { DEPARTMENT_DATA };

export default function DepartmentSubChoicesView({ 
  deptId = 'dnn', 
  onSelectDept 
}) {
  const navigate = useNavigate();
  const dept = DEPARTMENT_DATA[deptId] || DEPARTMENT_DATA.dnn;
  const DeptIcon = dept.icon || Sparkles;

  return (
    <div className="space-y-5 text-left">
      {/* ── TOP MINI APPS STRIP SWITCHER ── */}
      <div className="p-3 rounded-2xl bg-[#0f0e0b] border border-white/10 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
          <span>DEPARTMENT MINI APPS ({ADMIN_DEPT_MINI_APPS.length}):</span>
          <span className="text-white/40 font-normal lowercase">switch department workspace</span>
        </div>

        {/* Mini Apps Horizontal Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {ADMIN_DEPT_MINI_APPS.map((app) => {
            const Icon = app.icon;
            const isActive = app.id === dept.id;

            return (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  if (onSelectDept) {
                    onSelectDept(app.id);
                  } else {
                    navigate(`/admin?dept=${app.id}`);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl shrink-0 font-bold text-xs transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-[#0a0a0a] border-2 border-[#D4AF37] text-white shadow-md scale-102'
                    : 'bg-[#181818] hover:bg-[#222222] border border-black/30 text-white/85 hover:text-white'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `${app.iconColor}25` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: app.iconColor }} />
                </div>
                <span className="truncate">{app.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DEPARTMENT BANNER ── */}
      <div 
        className="p-5 sm:p-6 rounded-3xl border shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #16130d 0%, #0c0b08 100%)',
          borderColor: `${dept.accentColor}70`,
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/10"
              style={{ background: `linear-gradient(135deg, ${dept.accentColor}33, #0a0a0a)` }}
            >
              <DeptIcon className="w-7 h-7 drop-shadow" style={{ color: dept.accentColor }} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black border text-[#D4AF37]"
                  style={{ borderColor: `${dept.accentColor}80` }}
                >
                  {dept.badge}
                </span>
                <span className="text-[11px] text-white/50 font-mono">
                  Department Sub-Choices
                </span>
              </div>

              <h2 
                className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {dept.name}
              </h2>
              <p className="text-xs text-white/70 mt-0.5">
                {dept.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/50 hidden sm:inline">
              Choose a direction below:
            </span>
          </div>
        </div>
      </div>

      {/* ── LIVE EMAIL OR TEXT STATUS & TEST PANEL (FOR EMAIL & TEXT DESKS) ── */}
      {(dept.id === 'email' || dept.id === 'text') && (
        <div className="animate-in fade-in duration-300">
          <LiveEmailTextStatusPanel mode={dept.id} />
        </div>
      )}

      {/* ── CALENDAR MINI APP EMBED (FOR CALENDAR DESK) ── */}
      {dept.id === 'calendar' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#a855f7]/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#a855f7] uppercase tracking-wider">
              INTERACTIVE RELOCATION &amp; MOVE CALENDAR
            </span>
            <Link 
              to="/calendar" 
              className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <CalendarMiniApp />
        </div>
      )}

      {/* ── CALCULATOR MINI APP EMBED (FOR CALCULATOR DESK) ── */}
      {dept.id === 'calculator' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#34d399]/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#34d399] uppercase tracking-wider">
              INTERACTIVE MORTGAGE &amp; RELOCATION CALCULATOR
            </span>
            <Link 
              to="/calculator" 
              className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <CalculatorMiniApp />
        </div>
      )}

      {/* ── WEATHER MINI APP EMBED (FOR WEATHER DESK) ── */}
      {dept.id === 'weather' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#38bdf8]/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
              DESTINATION MARKETS &amp; CLIMATE WEATHER HUB
            </span>
            <Link 
              to="/weather" 
              className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <WeatherMiniApp />
        </div>
      )}

      {/* ── CHARLIE AI VOICE CONCIERGE EMBED (FOR CHARLIE DESK) ── */}
      {dept.id === 'charlie' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              CHARLIE SIMMONS AI CONCIERGE · VOICE &amp; BRAIN CONTROLS
            </span>
            <Link 
              to="/talking-app" 
              className="text-xs text-[#10b981] hover:underline font-bold flex items-center gap-1"
            >
              <span>Launch Voice Studio (V2V)</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#10b981]/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">V2V REAL-TIME</span>
                <h4 className="text-sm font-bold text-white mt-1">Spoken Voice Concierge</h4>
                <p className="text-xs text-white/70 mt-1">Engage Charlie directly in high-fidelity two-way conversational voice mode powered by Gemini Live.</p>
              </div>
              <Link to="/talking-app" className="py-2 px-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-bold text-xs text-center">
                Launch Voice Studio
              </Link>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#a855f7]/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#a855f7] uppercase tracking-wider">KNOWLEDGE BASE</span>
                <h4 className="text-sm font-bold text-white mt-1">Trained Real Estate Q&amp;A</h4>
                <p className="text-xs text-white/70 mt-1">Review and fine-tune Charlie's answers on agent vetting, tax migration, and relocation process.</p>
              </div>
              <Link to="/admin/charlie-knowledge-base" className="py-2 px-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs text-center">
                Manage Q&amp;A Brain
              </Link>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">SCRIPT STUDIO</span>
                <h4 className="text-sm font-bold text-white mt-1">Spoken Broadcast Scripts</h4>
                <p className="text-xs text-white/70 mt-1">Configure and edit opening, body, and closing broadcast scripts voiced by Charlie.</p>
              </div>
              <Link to="/admin/charlie-scripts" className="py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs text-center">
                Open Script Studio
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-CHOICES GRID (THE 3-4 SUB DIRECTIONS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dept.subChoices.map((choice, idx) => {
          const ChoiceIcon = choice.icon;

          return (
            <div 
              key={choice.id}
              className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all shadow-2xl flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header with Icon & Sub-Choice Number */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow"
                      style={{ background: `linear-gradient(135deg, ${choice.color}25, #000)` }}
                    >
                      <ChoiceIcon className="w-5 h-5 drop-shadow" style={{ color: choice.color }} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] block">
                        DIRECTION #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                        {choice.title}
                      </h3>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-black border border-white/15 text-white/70 shrink-0">
                    {choice.badge}
                  </span>
                </div>

                {/* Subtitle / Description */}
                <p className="text-[11.5px] text-white/70 leading-relaxed font-normal">
                  {choice.description}
                </p>

                {/* Sub-Choices Direct Links List */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-white/40 block mb-1">
                    DESTINATIONS:
                  </span>
                  {choice.links.map((link, li) => (
                    <Link
                      key={li}
                      to={link.path}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        link.highlight
                          ? 'bg-[#1b1710] hover:bg-[#252014] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                          : 'bg-[#141414] hover:bg-[#1e1e1e] text-white/85 hover:text-white border border-white/5'
                      }`}
                    >
                      <span className="truncate">{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              {choice.primaryLink && (
                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigate(choice.primaryLink.path)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 bg-[#D4AF37] hover:bg-[#e8c84a] text-black"
                  >
                    <span>{choice.primaryLink.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}