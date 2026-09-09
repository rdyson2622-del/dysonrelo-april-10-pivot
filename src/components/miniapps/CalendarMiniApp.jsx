import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Clock, MapPin, CheckCircle2, AlertCircle, Download, ExternalLink,
  ShieldCheck, Share2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const DEFAULT_MILESTONES = [
  { id: '1', title: 'Relocation Intake Consultation', date: '2026-09-12', time: '10:00 AM', category: 'consultation', note: 'Charlie & Bob Dyson Initial Fiduciary Move Review' },
  { id: '2', title: 'Vetted Agent Selection Window', date: '2026-09-16', time: '2:00 PM', category: 'agent', note: 'Top 1% destination agents interview round' },
  { id: '3', title: 'Target Destination House Tour', date: '2026-09-22', time: 'All Day', category: 'property', note: 'In-person / virtual neighborhood walkthroughs' },
  { id: '4', title: 'Escrow Inspection & Audit Deadline', date: '2026-10-02', time: '5:00 PM', category: 'audit', note: 'Fiduciary document review by Dyson & Dyson' },
  { id: '5', title: 'Moving Day & Truck Dispatch', date: '2026-10-15', time: '8:00 AM', category: 'moving', note: 'White-glove moving crew packing & departure' },
];

export default function CalendarMiniApp({ onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Sept 2026 default
  const [selectedDay, setSelectedDay] = useState(12);
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('dyson_calendar_events');
      return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
    } catch (_) {
      return DEFAULT_MILESTONES;
    }
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '2026-09-15', time: '12:00 PM', note: '' });
  const [syncNotice, setSyncNotice] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    const item = {
      id: Date.now().toString(),
      ...newEvent,
      category: 'personal',
    };
    const updated = [...events, item];
    setEvents(updated);
    try {
      localStorage.setItem('dyson_calendar_events', JSON.stringify(updated));
    } catch (_) {}
    setShowAddModal(false);
    setNewEvent({ title: '', date: '2026-09-15', time: '12:00 PM', note: '' });
  };

  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//DysonRelo//MiniApp Calendar//EN\n";
    events.forEach(ev => {
      const cleanDate = ev.date.replace(/-/g, '');
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${ev.title}\n`;
      icsContent += `DESCRIPTION:${ev.note || 'DysonRelo Relocation Milestone'}\n`;
      icsContent += `DTSTART;VALUE=DATE:${cleanDate}\n`;
      icsContent += `DTEND;VALUE=DATE:${cleanDate}\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'DysonRelo_Milestones.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSyncNotice('iCal file downloaded! Import directly to Apple Calendar, Outlook, or Google.');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const currentMonthDatePrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const dayEvents = events.filter(ev => {
    const target = `${currentMonthDatePrefix}-${String(selectedDay).padStart(2, '0')}`;
    return ev.date === target;
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-white text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-[#3b82f6]/50"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)' }}
          >
            <CalendarIcon className="w-6 h-6 text-[#60a5fa]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/40">
                MINI APP
              </span>
              <span className="text-[10px] text-white/50 font-semibold tracking-wider uppercase">
                RELOCATION TIMELINE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              Relocation &amp; Move Calendar
            </h1>
          </div>
        </div>

        {/* Sync & Add Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportICS}
            className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 bg-[#161616] hover:bg-[#202020] text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Download .ics calendar sync file for Apple Calendar, Outlook, or Google"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all text-black hover:brightness-105"
            style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Date</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/50 text-xs text-[#10b981] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Grid: Calendar Month on Left, Day Schedule on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Month View (7 Cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-base sm:text-lg font-bold font-serif text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1 bg-[#1c1c1c] rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-wider text-[#D4AF37]/80">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentMonthDatePrefix}-${String(dayNum).padStart(2, '0')}`;
              const hasEvents = events.some(ev => ev.date === dateStr);
              const isSelected = selectedDay === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative border ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black font-bold border-white shadow-lg scale-105 z-10'
                      : hasEvents
                      ? 'bg-[#1e1b12] text-white border-[#D4AF37]/60 hover:border-[#D4AF37]'
                      : 'bg-[#181818] text-white/70 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <span className="text-[11px] leading-tight">{dayNum}</span>
                  {hasEvents && (
                    <span 
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-[#D4AF37]'}`} 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px] text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>Milestone or scheduled event</span>
            </span>
            <span>Tap date to view details</span>
          </div>
        </div>

        {/* Selected Day Agenda (5 Cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Agenda: {monthNames[month]} {selectedDay}, {year}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#D4AF37] px-2 py-0.5 rounded-full bg-[#1e1a10] border border-[#D4AF37]/40">
                {dayEvents.length} {dayEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {dayEvents.length === 0 ? (
                <div className="text-center py-10 text-white/40 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto opacity-40 text-[#D4AF37]" />
                  <p className="text-xs">No move dates scheduled on this day.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewEvent({ ...newEvent, date: `${currentMonthDatePrefix}-${String(selectedDay).padStart(2, '0')}` });
                      setShowAddModal(true);
                    }}
                    className="text-[11px] text-[#D4AF37] font-bold underline cursor-pointer"
                  >
                    + Add milestone to this date
                  </button>
                </div>
              ) : (
                dayEvents.map(ev => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-[#1a1a1a] border border-[#D4AF37]/40 shadow-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                        {ev.category || 'Milestone'}
                      </span>
                      <span className="text-[10px] text-white/60 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D4AF37]" /> {ev.time}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white font-serif leading-tight">
                      {ev.title}
                    </div>
                    {ev.note && (
                      <p className="text-[11px] text-white/70 leading-snug">
                        {ev.note}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Sync Card */}
          <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#10b981]" />
              <span>Calendar Integration Support</span>
            </div>
            <p className="text-[10.5px] text-white/60 leading-tight">
              Export your relocation timeline into Apple Calendar, Google Calendar, or Microsoft Outlook with live reminders for escrow contingency releases.
            </p>
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141414] border border-[#D4AF37] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold font-serif text-white">Add Relocation Date</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Event / Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Escrow Deposit Due, Move Inspection"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-[#202020] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-[#202020] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full bg-[#202020] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Notes / Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, responsible contact, or reminder detail"
                  value={newEvent.note}
                  onChange={e => setNewEvent({ ...newEvent, note: e.target.value })}
                  className="w-full bg-[#202020] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}