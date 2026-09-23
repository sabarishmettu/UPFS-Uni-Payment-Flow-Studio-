import React, { useState } from 'react';
import { 
  JurisdictionCode, 
  JURISDICTIONS, 
  DematAccountRecord, 
  EquityHoldingItem, 
  INITIAL_DEMAT_ACCOUNTS, 
  INITIAL_EQUITY_HOLDINGS 
} from '../data/jurisdictionData';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  SlidersHorizontal,
  Wallet
} from 'lucide-react';

interface DematHoldingsHubProps {
  activeJurisdiction: JurisdictionCode;
  onSelectJurisdiction: (j: JurisdictionCode) => void;
}

export const DematHoldingsHub: React.FC<DematHoldingsHubProps> = ({
  activeJurisdiction,
  onSelectJurisdiction
}) => {
  const config = JURISDICTIONS[activeJurisdiction];

  const [dematAccounts, setDematAccounts] = useState<DematAccountRecord[]>(INITIAL_DEMAT_ACCOUNTS);
  const [holdings, setHoldings] = useState<EquityHoldingItem[]>(INITIAL_EQUITY_HOLDINGS);

  // Buy/Sell Trade Modal State
  const [selectedStockForTrade, setSelectedStockForTrade] = useState<EquityHoldingItem | null>(null);
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeSuccessToast, setTradeSuccessToast] = useState<string | null>(null);
  const [searchStock, setSearchStock] = useState('');

  const currentDemat = dematAccounts.find(d => d.jurisdiction === activeJurisdiction) || dematAccounts[0];
  const jurisdictionHoldings = holdings.filter(h => h.jurisdiction === activeJurisdiction);

  const formatCurrency = (minorUnits: number, jurisdiction: JurisdictionCode = activeJurisdiction) => {
    const c = JURISDICTIONS[jurisdiction];
    if (jurisdiction === 'JP') {
      return `${c.currencySymbol}${minorUnits.toLocaleString()}`;
    }
    return `${c.currencySymbol}${(minorUnits / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalPortfolioValue = jurisdictionHoldings.reduce((sum, h) => sum + h.currentValueMinor, 0);
  const totalInvested = jurisdictionHoldings.reduce((sum, h) => sum + h.totalInvestedMinor, 0);
  const totalPnL = totalPortfolioValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const filteredHoldings = jurisdictionHoldings.filter(h => 
    h.name.toLowerCase().includes(searchStock.toLowerCase()) || 
    h.symbol.toLowerCase().includes(searchStock.toLowerCase())
  );

  // Execute Buy / Sell Order
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockForTrade) return;

    setIsTrading(true);
    const sharesQty = Math.max(1, tradeShares);
    const orderValueMinor = selectedStockForTrade.currentPriceMinor * sharesQty;

    setTimeout(() => {
      if (tradeAction === 'BUY') {
        // Add to holding
        setHoldings(prev => prev.map(h => {
          if (h.id === selectedStockForTrade.id) {
            const newQty = h.quantity + sharesQty;
            const newInvested = h.totalInvestedMinor + orderValueMinor;
            const newAvgPrice = Math.round(newInvested / newQty);
            const newCurrentVal = h.currentPriceMinor * newQty;
            const newPnL = newCurrentVal - newInvested;
            return {
              ...h,
              quantity: newQty,
              averageBuyPriceMinor: newAvgPrice,
              totalInvestedMinor: newInvested,
              currentValueMinor: newCurrentVal,
              pnlMinor: newPnL,
              pnlPercent: Number(((newPnL / newInvested) * 100).toFixed(2))
            };
          }
          return h;
        }));

        // Deduct from trading cash
        setDematAccounts(prev => prev.map(d => {
          if (d.id === currentDemat.id) {
            return { ...d, tradingCashBalanceMinor: Math.max(0, d.tradingCashBalanceMinor - orderValueMinor) };
          }
          return d;
        }));

        setTradeSuccessToast(`Successfully BOUGHT ${sharesQty} shares of ${selectedStockForTrade.symbol} on ${selectedStockForTrade.exchange}!`);
      } else {
        // Sell shares
        setHoldings(prev => prev.map(h => {
          if (h.id === selectedStockForTrade.id) {
            const newQty = Math.max(0, h.quantity - sharesQty);
            const newInvested = h.averageBuyPriceMinor * newQty;
            const newCurrentVal = h.currentPriceMinor * newQty;
            const newPnL = newCurrentVal - newInvested;
            return {
              ...h,
              quantity: newQty,
              totalInvestedMinor: newInvested,
              currentValueMinor: newCurrentVal,
              pnlMinor: newPnL,
              pnlPercent: newInvested > 0 ? Number(((newPnL / newInvested) * 100).toFixed(2)) : 0
            };
          }
          return h;
        }));

        // Add to trading cash
        setDematAccounts(prev => prev.map(d => {
          if (d.id === currentDemat.id) {
            return { ...d, tradingCashBalanceMinor: d.tradingCashBalanceMinor + orderValueMinor };
          }
          return d;
        }));

        setTradeSuccessToast(`Successfully SOLD ${sharesQty} shares of ${selectedStockForTrade.symbol}! Funds credited to Demat cash.`);
      }

      setIsTrading(false);
      setSelectedStockForTrade(null);
      setTimeout(() => setTradeSuccessToast(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Jurisdiction Selector */}
      <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Demat Account & Equity Stock Holdings</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#14151c] text-amber-400 border border-amber-500/30">
                {config.depositoryName}
              </span>
            </h2>
            <p className="text-xs text-[#9ea2b8] mt-0.5">
              Dematerialized depository securities, live stock portfolios, and real-time exchange order routing.
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

      {/* Trade Success Notification */}
      {tradeSuccessToast && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{tradeSuccessToast}</span>
        </div>
      )}

      {/* Demat Profile & Balance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9ea2b8]">
            <span className="font-semibold uppercase tracking-wider">Depository Registration</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Active
            </span>
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#ff6d5a]" />
            <span>{currentDemat.brokerName}</span>
          </div>
          <div className="text-xs font-mono text-[#9ea2b8]">
            BO ID: <strong className="text-white">{currentDemat.dematAccountNumber}</strong>
          </div>
        </div>

        <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-2">
          <span className="text-xs font-semibold text-[#9ea2b8] uppercase tracking-wider block">Total Equity Portfolio Value</span>
          <div className="text-2xl font-black text-white font-mono">
            {formatCurrency(totalPortfolioValue)}
          </div>
          <div className={`text-xs font-mono font-bold flex items-center gap-1 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnL >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{totalPnL >= 0 ? `+${formatCurrency(totalPnL)}` : formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(2)}% Overall P&L)</span>
          </div>
        </div>

        <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] shadow-md space-y-2">
          <span className="text-xs font-semibold text-[#9ea2b8] uppercase tracking-wider block">Demat Trading Cash Available</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(currentDemat.tradingCashBalanceMinor)}
          </div>
          <div className="text-xs text-[#676a82] flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#ff6d5a]" />
            <span>Linked to primary verified bank account</span>
          </div>
        </div>
      </div>

      {/* Equity Holdings Table */}
      <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2c2f3f] pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Stock Holdings ({config.name})</span>
            </h3>
            <p className="text-[11px] text-[#9ea2b8]">Direct equity ownership held in {config.depositoryName}</p>
          </div>

          <div className="relative flex items-center max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-[#676a82] absolute left-2.5" />
            <input
              type="text"
              placeholder="Search ticker or company name..."
              value={searchStock}
              onChange={(e) => setSearchStock(e.target.value)}
              className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-amber-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2c2f3f] text-[#676a82] uppercase text-[10px] font-mono">
                <th className="pb-3 font-semibold">Instrument</th>
                <th className="pb-3 font-semibold">Qty</th>
                <th className="pb-3 font-semibold">Avg Price</th>
                <th className="pb-3 font-semibold">LTP (Current)</th>
                <th className="pb-3 font-semibold">Current Value</th>
                <th className="pb-3 font-semibold">Total P&L</th>
                <th className="pb-3 font-semibold text-right">Quick Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242735]">
              {filteredHoldings.map((stock) => (
                <tr key={stock.id} className="hover:bg-[#14151c] transition-colors group">
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      <span>{stock.symbol}</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#282b3a] text-[#9ea2b8] border border-[#3b3f54]">
                        {stock.exchange}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#9ea2b8]">{stock.name}</div>
                  </td>
                  <td className="py-3.5 pr-4 font-mono font-bold text-white">
                    {stock.quantity} shares
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[#9ea2b8]">
                    {formatCurrency(stock.averageBuyPriceMinor)}
                  </td>
                  <td className="py-3.5 pr-4 font-mono">
                    <div className="text-white font-bold">{formatCurrency(stock.currentPriceMinor)}</div>
                    <div className={`text-[10px] ${stock.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.dayChangePercent >= 0 ? `+${stock.dayChangePercent}%` : `${stock.dayChangePercent}%`}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-mono font-bold text-white">
                    {formatCurrency(stock.currentValueMinor)}
                  </td>
                  <td className="py-3.5 pr-4 font-mono">
                    <div className={`font-bold ${stock.pnlMinor >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.pnlMinor >= 0 ? `+${formatCurrency(stock.pnlMinor)}` : formatCurrency(stock.pnlMinor)}
                    </div>
                    <div className={`text-[10px] ${stock.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.pnlPercent >= 0 ? `+${stock.pnlPercent}%` : `${stock.pnlPercent}%`}
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedStockForTrade(stock);
                          setTradeAction('BUY');
                          setTradeShares(10);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Buy</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStockForTrade(stock);
                          setTradeAction('SELL');
                          setTradeShares(Math.min(10, stock.quantity));
                        }}
                        disabled={stock.quantity === 0}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-[#282b3a] disabled:text-[#676a82] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Sell</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Modal */}
      {selectedStockForTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="w-full max-w-md bg-[#1c1e29] border border-[#3b3f54] rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedStockForTrade.symbol}</span>
                  <span className="text-xs text-[#9ea2b8]">({selectedStockForTrade.exchange})</span>
                </h3>
                <span className="text-[11px] text-[#9ea2b8]">{selectedStockForTrade.name}</span>
              </div>
              <button 
                onClick={() => setSelectedStockForTrade(null)}
                className="text-[#9ea2b8] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="flex bg-[#14151c] p-1 rounded-xl border border-[#2c2f3f] text-xs font-semibold">
              <button
                onClick={() => setTradeAction('BUY')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  tradeAction === 'BUY' ? 'bg-emerald-600 text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                BUY ORDER
              </button>
              <button
                onClick={() => setTradeAction('SELL')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  tradeAction === 'SELL' ? 'bg-rose-600 text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                SELL ORDER
              </button>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9ea2b8] font-medium mb-1">Number of Shares</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={tradeAction === 'SELL' ? selectedStockForTrade.quantity : 10000}
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Number(e.target.value))}
                  className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-amber-500 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-[11px] text-[#9ea2b8] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Price per share:</span>
                  <span className="text-white font-bold">{formatCurrency(selectedStockForTrade.currentPriceMinor)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Depository:</span>
                  <span className="text-white">{config.depositoryName}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-[#2c2f3f]">
                  <span className="text-white">Total Order Value:</span>
                  <span className={tradeAction === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatCurrency(selectedStockForTrade.currentPriceMinor * tradeShares)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isTrading || (tradeAction === 'SELL' && selectedStockForTrade.quantity === 0)}
                className={`w-full py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-white ${
                  tradeAction === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isTrading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{isTrading ? 'Routing to Exchange...' : `Confirm ${tradeAction} Order`}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
