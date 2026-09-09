import React, { useState } from 'react';
import { 
  Calculator as CalcIcon, DollarSign, Percent, ShieldCheck, 
  HelpCircle, RefreshCw, ArrowRight, Home, Building2, Truck
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CalculatorMiniApp({ onBack }) {
  const [activeMode, setActiveMode] = useState('mortgage'); // 'mortgage' | 'pocket' | 'relo'

  // Mortgage Calculator State
  const [homePrice, setHomePrice] = useState(1250000);
  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.25);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.15); // e.g. 1.15% average
  const [annualInsurance, setAnnualInsurance] = useState(2400);

  // Relo Cost State
  const [movingDistanceMiles, setMovingDistanceMiles] = useState(1200);
  const [bedroomsCount, setBedroomsCount] = useState(4);
  const [needsStorageMonths, setNeedsStorageMonths] = useState(1);
  const [temporaryLodgingDays, setTemporaryLodgingDays] = useState(7);

  // Pocket Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState(null);
  const [calcOp, setCalcOp] = useState(null);
  const [calcWait, setCalcWait] = useState(false);

  // Mortgage Calculations
  const downPaymentAmount = (homePrice * downPercent) / 100;
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;

  const monthlyPrincipalAndInterest = monthlyRate > 0 && numPayments > 0
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;

  const monthlyPropertyTax = (homePrice * (propertyTaxRate / 100)) / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance;

  // Relocation Budget Calculations
  const estimatedVanLineCost = Math.round(bedroomsCount * 1400 + (movingDistanceMiles * 1.85));
  const estimatedStorageCost = needsStorageMonths * 350;
  const estimatedLodgingCost = temporaryLodgingDays * 220;
  const estimatedIncidentals = 1200;
  const totalReloBudget = estimatedVanLineCost + estimatedStorageCost + estimatedLodgingCost + estimatedIncidentals;

  // Pocket Calculator Handlers
  const handleDigit = (digit) => {
    if (calcWait) {
      setCalcDisplay(String(digit));
      setCalcWait(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? String(digit) : calcDisplay + digit);
    }
  };

  const handleDecimal = () => {
    if (calcWait) {
      setCalcDisplay('0.');
      setCalcWait(false);
      return;
    }
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setCalcPrev(null);
    setCalcOp(null);
    setCalcWait(false);
  };

  const handleOp = (nextOp) => {
    const inputValue = parseFloat(calcDisplay);
    if (calcPrev === null) {
      setCalcPrev(inputValue);
    } else if (calcOp) {
      const current = calcPrev || 0;
      let result = current;
      if (calcOp === '+') result = current + inputValue;
      else if (calcOp === '-') result = current - inputValue;
      else if (calcOp === '×') result = current * inputValue;
      else if (calcOp === '÷') result = inputValue !== 0 ? current / inputValue : 'Error';
      setCalcDisplay(String(result));
      setCalcPrev(result);
    }
    setCalcWait(true);
    setCalcOp(nextOp);
  };

  const handleEqual = () => {
    if (!calcOp || calcPrev === null) return;
    const inputValue = parseFloat(calcDisplay);
    let result = calcPrev;
    if (calcOp === '+') result = calcPrev + inputValue;
    else if (calcOp === '-') result = calcPrev - inputValue;
    else if (calcOp === '×') result = calcPrev * inputValue;
    else if (calcOp === '÷') result = inputValue !== 0 ? calcPrev / inputValue : 'Error';
    setCalcDisplay(String(result));
    setCalcPrev(null);
    setCalcOp(null);
    setCalcWait(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-white text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-[#10b981]/50"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)' }}
          >
            <CalcIcon className="w-6 h-6 text-[#34d399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40">
                MINI APP
              </span>
              <span className="text-[10px] text-white/50 font-semibold tracking-wider uppercase">
                FINANCIAL SUITE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              Relocation &amp; Payment Calculator
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('mortgage')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeMode === 'mortgage'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Mortgage
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('relo')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeMode === 'relo'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Move Budget
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('pocket')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeMode === 'pocket'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Pocket Calc
          </button>
        </div>
      </div>

      {/* MODE 1: MORTGAGE PAYMENT CALCULATOR */}
      {activeMode === 'mortgage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Purchase &amp; Financing Parameters</span>
              <span className="text-[10px] text-[#D4AF37] font-mono">Live Recalculation</span>
            </h3>

            {/* Price Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-semibold">Home Purchase Price</span>
                <span className="font-mono font-bold text-white text-sm">
                  ${Number(homePrice).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200000"
                max="5000000"
                step="25000"
                value={homePrice}
                onChange={e => setHomePrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-semibold">Down Payment ({downPercent}%)</span>
                <span className="font-mono font-bold text-[#D4AF37] text-sm">
                  ${Math.round(downPaymentAmount).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={downPercent}
                onChange={e => setDownPercent(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Rates & Terms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
                  Loan Term
                </label>
                <select
                  value={loanTermYears}
                  onChange={e => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value={30}>30 Years Fixed</option>
                  <option value={20}>20 Years Fixed</option>
                  <option value={15}>15 Years Fixed</option>
                  <option value={10}>10 Years Fixed</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={propertyTaxRate}
                  onChange={e => setPropertyTaxRate(Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-[10.5px] text-white/60">
              Tax rates vary widely between destination markets (e.g., CA ~1.15%, TX ~1.9%, AZ ~0.65%). Relocating clients also benefit from 0% state income tax in Texas, Florida, Nevada, and Tennessee.
            </div>
          </div>

          {/* Breakdown Card (5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                Estimated Monthly Payment
              </div>

              <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
                ${Math.round(totalMonthlyPayment).toLocaleString()}
                <span className="text-xs text-white/50 font-sans font-normal ml-1">/ month</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between text-white/80">
                  <span>Principal &amp; Interest:</span>
                  <span className="font-mono font-bold text-white">
                    ${Math.round(monthlyPrincipalAndInterest).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Est. Property Taxes:</span>
                  <span className="font-mono font-bold text-white">
                    ${Math.round(monthlyPropertyTax).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Est. Home Insurance:</span>
                  <span className="font-mono font-bold text-white">
                    ${Math.round(monthlyInsurance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Total Financed:</span>
                <span className="font-mono font-bold text-[#D4AF37]">
                  ${Math.round(loanAmount).toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#10b981]/40 text-[10px] text-[#10b981] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero buyer broker fees — funded by seller splits</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: RELOCATION MOVE BUDGET ESTIMATOR */}
      {activeMode === 'relo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
              Moving Logistics &amp; Travel Scope
            </h3>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-semibold">Moving Distance</span>
                <span className="font-mono font-bold text-white text-sm">
                  {movingDistanceMiles.toLocaleString()} Miles
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={movingDistanceMiles}
                onChange={e => setMovingDistanceMiles(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-semibold">Home Size</span>
                <span className="font-mono font-bold text-white text-sm">
                  {bedroomsCount} Bedrooms
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={bedroomsCount}
                onChange={e => setBedroomsCount(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
                  Storage (Months)
                </label>
                <select
                  value={needsStorageMonths}
                  onChange={e => setNeedsStorageMonths(Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  <option value={0}>No Storage</option>
                  <option value={1}>1 Month</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
                  Temporary Lodging
                </label>
                <select
                  value={temporaryLodgingDays}
                  onChange={e => setTemporaryLodgingDays(Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  <option value={0}>None (Same-day move)</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (1 Week)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                Estimated Relocation Moving Outlay
              </div>

              <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
                ${totalReloBudget.toLocaleString()}
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between text-white/80">
                  <span>Van Lines / Movers:</span>
                  <span className="font-mono font-bold text-white">${estimatedVanLineCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Vault Storage:</span>
                  <span className="font-mono font-bold text-white">${estimatedStorageCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Temporary Lodging:</span>
                  <span className="font-mono font-bold text-white">${estimatedLodgingCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Travel &amp; Packing Misc:</span>
                  <span className="font-mono font-bold text-white">${estimatedIncidentals.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#D4AF37]/40 text-[10px] text-[#D4AF37] leading-tight">
                Corporate HR relocations: All moving expenses can be invoiced directly to employer relocation packages.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: POCKET CALCULATOR */}
      {activeMode === 'pocket' && (
        <div className="max-w-xs mx-auto p-5 rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37]/50 shadow-2xl space-y-4">
          {/* Display */}
          <div className="h-20 p-3 rounded-2xl bg-[#161616] border border-white/10 flex flex-col justify-end text-right">
            {calcOp && (
              <span className="text-xs text-white/40 font-mono">
                {calcPrev} {calcOp}
              </span>
            )}
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white truncate">
              {calcDisplay}
            </span>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2 text-sm font-bold">
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-2xl bg-[#2a2a2a] text-[#ef4444] hover:bg-[#333] transition-all cursor-pointer shadow"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => setCalcDisplay(String(parseFloat(calcDisplay) * -1))}
              className="h-12 rounded-2xl bg-[#2a2a2a] text-white/80 hover:bg-[#333] transition-all cursor-pointer shadow"
            >
              ±
            </button>
            <button
              type="button"
              onClick={() => setCalcDisplay(String(parseFloat(calcDisplay) / 100))}
              className="h-12 rounded-2xl bg-[#2a2a2a] text-white/80 hover:bg-[#333] transition-all cursor-pointer shadow"
            >
              %
            </button>
            <button
              type="button"
              onClick={() => handleOp('÷')}
              className="h-12 rounded-2xl bg-[#D4AF37] text-black hover:brightness-110 transition-all cursor-pointer shadow font-black"
            >
              ÷
            </button>

            {[7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-12 rounded-2xl bg-[#1e1e1e] text-white hover:bg-[#282828] transition-all cursor-pointer shadow"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleOp('×')}
              className="h-12 rounded-2xl bg-[#D4AF37] text-black hover:brightness-110 transition-all cursor-pointer shadow font-black"
            >
              ×
            </button>

            {[4, 5, 6].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-12 rounded-2xl bg-[#1e1e1e] text-white hover:bg-[#282828] transition-all cursor-pointer shadow"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleOp('-')}
              className="h-12 rounded-2xl bg-[#D4AF37] text-black hover:brightness-110 transition-all cursor-pointer shadow font-black"
            >
              -
            </button>

            {[1, 2, 3].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-12 rounded-2xl bg-[#1e1e1e] text-white hover:bg-[#282828] transition-all cursor-pointer shadow"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleOp('+')}
              className="h-12 rounded-2xl bg-[#D4AF37] text-black hover:brightness-110 transition-all cursor-pointer shadow font-black"
            >
              +
            </button>

            <button
              type="button"
              onClick={() => handleDigit(0)}
              className="col-span-2 h-12 rounded-2xl bg-[#1e1e1e] text-white hover:bg-[#282828] transition-all cursor-pointer shadow"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDecimal}
              className="h-12 rounded-2xl bg-[#1e1e1e] text-white hover:bg-[#282828] transition-all cursor-pointer shadow"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleEqual}
              className="h-12 rounded-2xl bg-[#10b981] text-black hover:brightness-110 transition-all cursor-pointer shadow font-black"
            >
              =
            </button>
          </div>
        </div>
      )}
    </div>
  );
}