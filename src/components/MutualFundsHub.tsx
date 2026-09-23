import React, { useState } from 'react';
import { 
  JurisdictionCode, 
  JURISDICTIONS, 
  MUTUAL_FUNDS_CATALOG, 
  MutualFundCatalogItem, 
  UserMutualFundHolding 
} from '../data/jurisdictionData';
import { 
  PieChart, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  Coins, 
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Search,
  Star
} from 'lucide-react';

interface MutualFundsHubProps {
  activeJurisdiction: JurisdictionCode;
  onSelectJurisdiction: (j: JurisdictionCode) => void;
}

export const MutualFundsHub: React.FC<MutualFundsHubProps> = ({
  activeJurisdiction,
  onSelectJurisdiction
}) => {
  const config = JURISDICTIONS[activeJurisdiction];

  // User Holdings State
  const [holdings, setHoldings] = useState<UserMutualFundHolding[]>([
    {
      id: 'h-in-01',
      fundId: 'mf-in-01',
      userId: 'usr_in_94821',
      jurisdiction: 'IN',
      units: 425.80,
      averageNav: 68.20,
      investedAmountMinor: 2903956, // ₹29,039.56
      currentNav: 82.45,
      currentValueMinor: 3510721,  // ₹35,107.21
      isSipActive: true,
      sipMonthlyAmountMinor: 500000, // ₹5,000 / mo
      sipExecutionDay: 5,
      totalReturnsMinor: 606765,
      returnPercentage: 20.89
    },
    {
      id: 'h-us-01',
      fundId: 'mf-us-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'US',
      units: 24.50,
      averageNav: 440.00,
      investedAmountMinor: 1078000, // $10,780.00
      currentNav: 512.40,
      currentValueMinor: 1255380,  // $12,553.80
      isSipActive: true,
      sipMonthlyAmountMinor: 50000, // $500 / mo
      sipExecutionDay: 1,
      totalReturnsMinor: 177380,
      returnPercentage: 16.45
    }
  ]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedFundForInvest, setSelectedFundForInvest] = useState<MutualFundCatalogItem | null>(null);
  const [investMode, setInvestMode] = useState<'sip' | 'lumpsum'>('sip');
  const [investAmountInput, setInvestAmountInput] = useState<string>('5000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // SIP Calculator State
  const [calcMonthly, setCalcMonthly] = useState(10000);
  const [calcYears, setCalcYears] = useState(10);
  const [calcReturnRate, setCalcReturnRate] = useState(14);

  const formatCurrency = (minorUnits: number, jurisdiction: JurisdictionCode = activeJurisdiction) => {
    const c = JURISDICTIONS[jurisdiction];
    if (jurisdiction === 'JP') {
      return `${c.currencySymbol}${minorUnits.toLocaleString()}`;
    }
    return `${c.currencySymbol}${(minorUnits / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const filteredCatalog = MUTUAL_FUNDS_CATALOG.filter(f => {
    const matchJurisdiction = f.jurisdiction === activeJurisdiction;
    const matchCat = categoryFilter === 'all' || f.category === categoryFilter;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        f.amc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchJurisdiction && matchCat && matchSearch;
  });

  const jurisdictionHoldings = holdings.filter(h => h.jurisdiction === activeJurisdiction);
  const totalInvested = jurisdictionHoldings.reduce((sum, h) => sum + h.investedAmountMinor, 0);
  const totalCurrentValue = jurisdictionHoldings.reduce((sum, h) => sum + h.currentValueMinor, 0);
  const totalGain = totalCurrentValue - totalInvested;

  // Handle Invest Submit
  const handleExecuteInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFundForInvest) return;

    setIsProcessing(true);
    const rawAmt = parseFloat(investAmountInput) || 1000;
    const minorAmt = activeJurisdiction === 'JP' ? rawAmt : rawAmt * 100;
    const unitsAllotted = Number((rawAmt / selectedFundForInvest.nav).toFixed(2));

    setTimeout(() => {
      const newHolding: UserMutualFundHolding = {
        id: `h-${activeJurisdiction.toLowerCase()}-${Date.now()}`,
        fundId: selectedFundForInvest.id,
        userId: 'usr_8f4a1c90',
        jurisdiction: activeJurisdiction,
        units: unitsAllotted,
        averageNav: selectedFundForInvest.nav,
        investedAmountMinor: minorAmt,
        currentNav: selectedFundForInvest.nav,
        currentValueMinor: minorAmt,
        isSipActive: investMode === 'sip',
        sipMonthlyAmountMinor: investMode === 'sip' ? minorAmt : 0,
        sipExecutionDay: 5,
        totalReturnsMinor: 0,
        returnPercentage: 0
      };

      setHoldings(prev => [...prev, newHolding]);
      setIsProcessing(false);
      setSelectedFundForInvest(null);
      setSuccessToast(
        investMode === 'sip' 
          ? `SIP of ${formatCurrency(minorAmt)} successfully registered for ${selectedFundForInvest.name}!` 
          : `Lumpsum investment of ${formatCurrency(minorAmt)} settled!`
      );
      setTimeout(() => setSuccessToast(null), 4000);
    }, 900);
  };

  const toggleSip = (holdingId: string) => {
    setHoldings(prev => prev.map(h => {
      if (h.id === holdingId) {
        return { ...h, isSipActive: !h.isSipActive };
      }
      return h;
    }));
  };

  // SIP Compound Calculation
  const calculateSipFutureValue = (monthly: number, years: number, annualRate: number) => {
    const i = annualRate / 12 / 100;
    const n = years * 12;
    const totalInvestedVal = monthly * n;
    const futureValue = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const estimatedReturns = futureValue - totalInvestedVal;
    return {
      invested: Math.round(totalInvestedVal),
      returns: Math.round(estimatedReturns),
      total: Math.round(futureValue)
    };
  };

  const sipResult = calculateSipFutureValue(calcMonthly, calcYears, calcReturnRate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Jurisdiction Selector */}
      <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Mutual Funds & Systematic Investment (SIP)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#14151c] text-emerald-400 border border-emerald-500/30">
                Direct Growth
              </span>
            </h2>
            <p className="text-xs text-[#9ea2b8] mt-0.5">
              Invest in zero-commission direct mutual funds, index ETFs, and automated recurring monthly SIPs.
            </p>
          </div>
        </div>

        {/* Multi-Jurisdiction Country Switcher */}
        <div className="flex items-center gap-1.5 bg-[#14151c] p-1.5 rounded-xl border border-[#2c2f3f]">
          {(['IN', 'US', 'UK', 'JP'] as JurisdictionCode[]).map((jCode) => {
            const j = JURISDICTIONS[jCode];
            const isSelected = activeJurisdiction === jCode;
            return (
              <button
                key={jCode}
                onClick={() => onSelectJurisdiction(jCode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#ff6d5a] text-white shadow-md shadow-[#ff6d5a]/25 scale-[1.02]'
                    : 'text-[#9ea2b8] hover:text-white hover:bg-[#20222e]'
                }`}
              >
                <span>{j.flag}</span>
                <span>{j.name}</span>
                <span className="text-[10px] font-mono opacity-80">({j.currency})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-[#9ea2b8] uppercase tracking-wider">Total Mutual Fund Value</span>
          <div className="text-xl font-extrabold text-white font-mono">
            {formatCurrency(totalCurrentValue)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active Portfolio</span>
          </div>
        </div>

        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-[#9ea2b8] uppercase tracking-wider">Total Invested Amount</span>
          <div className="text-xl font-extrabold text-white font-mono">
            {formatCurrency(totalInvested)}
          </div>
          <div className="text-[11px] text-[#676a82]">Cost of Acquisition</div>
        </div>

        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-[#9ea2b8] uppercase tracking-wider">Unrealized Gain / Return</span>
          <div className={`text-xl font-extrabold font-mono ${totalGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalGain >= 0 ? `+${formatCurrency(totalGain)}` : formatCurrency(totalGain)}
          </div>
          <div className="text-[11px] text-emerald-400">
            {totalInvested > 0 ? `+${((totalGain / totalInvested) * 100).toFixed(2)}% Total XIRR` : '0.00%'}
          </div>
        </div>

        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-[#9ea2b8] uppercase tracking-wider">Active Monthly SIPs</span>
          <div className="text-xl font-extrabold text-white font-mono">
            {jurisdictionHoldings.filter(h => h.isSipActive).length} Active
          </div>
          <div className="text-[11px] text-[#ff6d5a] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Auto-debited on 5th</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Fund Catalog & Active Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Mutual Funds Catalog */}
        <div className="lg:col-span-7 bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2c2f3f] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Top Rated Funds ({config.name})</span>
              </h3>
              <p className="text-[11px] text-[#9ea2b8]">Zero expense commission Direct-Growth plans</p>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-[#676a82] absolute left-2.5" />
              <input
                type="text"
                placeholder="Search fund name or AMC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-emerald-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Catalog List */}
          <div className="space-y-3">
            {filteredCatalog.map((fund) => (
              <div 
                key={fund.id}
                className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {fund.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {fund.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9ea2b8] flex items-center gap-3">
                    <span>{fund.amc}</span>
                    <span>•</span>
                    <span>AUM: <strong className="text-white font-mono">{fund.aum}</strong></span>
                    <span>•</span>
                    <span>TER: <strong className="text-white font-mono">{fund.expenseRatio}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">
                      NAV: {config.currencySymbol}{fund.nav.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-emerald-400">
                      +{fund.return1Y}% (1Y) • +{fund.return3Y}% (3Y)
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFundForInvest(fund);
                      setInvestAmountInput(String(fund.minSipMinor > 0 ? (activeJurisdiction === 'JP' ? fund.minSipMinor : fund.minSipMinor / 100) : 1000));
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invest</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Active Portfolio & SIP Calculator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Holdings Card */}
          <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#ff6d5a]" />
                <span>My Portfolio Holdings</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14151c] text-[#9ea2b8] border border-[#2c2f3f]">
                {jurisdictionHoldings.length} Funds
              </span>
            </div>

            {jurisdictionHoldings.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9ea2b8] bg-[#14151c] rounded-xl border border-[#2c2f3f]">
                No mutual funds invested yet in {config.name}. Select a fund from the left to start a recurring monthly SIP or lumpsum.
              </div>
            ) : (
              <div className="space-y-3">
                {jurisdictionHoldings.map((holding) => {
                  const fund = MUTUAL_FUNDS_CATALOG.find(f => f.id === holding.fundId);
                  return (
                    <div key={holding.id} className="p-3.5 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[200px]">
                          {fund?.name || 'Equity Growth Fund'}
                        </span>
                        <button
                          onClick={() => toggleSip(holding.id)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border transition-colors ${
                            holding.isSipActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-[#282b3a] text-[#9ea2b8] border-[#3b3f54]'
                          }`}
                          title="Toggle automated monthly recurring debit"
                        >
                          {holding.isSipActive ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5" />}
                          <span>{holding.isSipActive ? 'SIP Active' : 'SIP Paused'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-[#242735]">
                        <div>
                          <span className="text-[#676a82] block text-[10px]">Invested:</span>
                          <span className="text-white">{formatCurrency(holding.investedAmountMinor)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#676a82] block text-[10px]">Current Value:</span>
                          <span className="text-emerald-400 font-bold">{formatCurrency(holding.currentValueMinor)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive SIP Compound Growth Calculator */}
          <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>SIP Compound Wealth Calculator</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#9ea2b8] font-medium mb-1">
                  <span>Monthly Investment</span>
                  <span className="text-white font-mono font-bold">{config.currencySymbol}{calcMonthly.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={calcMonthly}
                  onChange={(e) => setCalcMonthly(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#9ea2b8] font-medium mb-1">
                  <span>Investment Horizon</span>
                  <span className="text-white font-mono font-bold">{calcYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcYears}
                  onChange={(e) => setCalcYears(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#9ea2b8] font-medium mb-1">
                  <span>Expected Annual Return</span>
                  <span className="text-emerald-400 font-mono font-bold">{calcReturnRate}% CAGR</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={calcReturnRate}
                  onChange={(e) => setCalcReturnRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#9ea2b8]">
                  <span>Total Amount Invested:</span>
                  <span className="text-white">{config.currencySymbol}{sipResult.invested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#9ea2b8]">
                  <span>Estimated Compounded Gains:</span>
                  <span className="text-emerald-400 font-bold">+{config.currencySymbol}{sipResult.returns.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1.5 border-t border-[#2c2f3f]">
                  <span>Projected Total Wealth:</span>
                  <span className="text-emerald-300 text-sm">{config.currencySymbol}{sipResult.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invest Modal Drawer */}
      {selectedFundForInvest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="w-full max-w-md bg-[#1c1e29] border border-[#3b3f54] rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedFundForInvest.name}</h3>
                <span className="text-[11px] text-[#9ea2b8]">{selectedFundForInvest.amc}</span>
              </div>
              <button 
                onClick={() => setSelectedFundForInvest(null)}
                className="text-[#9ea2b8] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* SIP vs Lumpsum switch */}
            <div className="flex bg-[#14151c] p-1 rounded-xl border border-[#2c2f3f] text-xs font-semibold">
              <button
                onClick={() => setInvestMode('sip')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  investMode === 'sip' ? 'bg-emerald-600 text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                Monthly SIP
              </button>
              <button
                onClick={() => setInvestMode('lumpsum')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  investMode === 'lumpsum' ? 'bg-emerald-600 text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                One-Time Lumpsum
              </button>
            </div>

            <form onSubmit={handleExecuteInvestment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9ea2b8] font-medium mb-1">
                  {investMode === 'sip' ? 'Monthly SIP Amount' : 'Lumpsum Amount'} ({config.currency})
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#676a82] font-mono font-bold">{config.currencySymbol}</span>
                  <input
                    type="number"
                    required
                    min="100"
                    value={investAmountInput}
                    onChange={(e) => setInvestAmountInput(e.target.value)}
                    className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-[11px] text-[#9ea2b8] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Current NAV:</span>
                  <span className="text-white">{config.currencySymbol}{selectedFundForInvest.nav}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Debit Rail:</span>
                  <span className="text-white">{config.instantPaymentRail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Execution Day:</span>
                  <span className="text-emerald-400">5th of every month</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{isProcessing ? 'Registering Order...' : (investMode === 'sip' ? 'Start Monthly SIP' : 'Confirm Lumpsum Buy')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
