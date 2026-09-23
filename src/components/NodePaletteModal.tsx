import React, { useState } from 'react';
import { AVAILABLE_NODE_TEMPLATES } from '../data/workflowData';
import { 
  X, 
  Search, 
  Building2, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  ArrowDownLeft, 
  ArrowUpRight, 
  UserCheck,
  Sparkles 
} from 'lucide-react';

interface NodePaletteModalProps {
  onClose: () => void;
  onSelectTemplate: (template: typeof AVAILABLE_NODE_TEMPLATES[0]) => void;
}

export const NodePaletteModal: React.FC<NodePaletteModalProps> = ({ onClose, onSelectTemplate }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'banking', label: 'Bank & Penny Drop' },
    { id: 'investments', label: 'FDs & Mutual Funds' },
    { id: 'demat', label: 'Demat & Equities' },
    { id: 'treasury', label: 'Treasury Auto-Sweep' },
    { id: 'payout', label: 'Instant Payouts' }
  ];

  const filtered = AVAILABLE_NODE_TEMPLATES.filter(n => {
    const matchCat = activeCategory === 'all' || n.category === activeCategory;
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase()) || 
                        n.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-check': return <UserCheck className="w-5 h-5 text-cyan-400" />;
      case 'building-2': return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'trending-up': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'pie-chart': return <PieChart className="w-5 h-5 text-emerald-400" />;
      case 'bar-chart-3': return <BarChart3 className="w-5 h-5 text-amber-400" />;
      case 'arrow-down-left': return <ArrowDownLeft className="w-5 h-5 text-pink-400" />;
      case 'arrow-up-right': return <ArrowUpRight className="w-5 h-5 text-[#ff6d5a]" />;
      default: return <Sparkles className="w-5 h-5 text-[#ff6d5a]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-[#1c1e29] border border-[#3b3f54] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header Search */}
        <div className="p-4 border-b border-[#2c2f3f] bg-[#14151c] flex items-center justify-between gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-[#676a82] absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search Bank accounts, Fixed Deposits, Mutual Funds, Demat Stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1c1e29] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#676a82] focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9ea2b8] hover:text-white hover:bg-[#282b3a] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 border-b border-[#2c2f3f] bg-[#191a24] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#ff6d5a] text-white shadow-sm shadow-[#ff6d5a]/30'
                  : 'bg-[#1c1e29] text-[#9ea2b8] hover:text-white hover:bg-[#282b3a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Node Template List */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#14151c]">
          {filtered.map((item) => (
            <button
              key={item.type}
              onClick={() => onSelectTemplate(item)}
              className="p-3.5 bg-[#1c1e29] hover:bg-[#242735] border border-[#2c2f3f] hover:border-[#ff6d5a]/60 rounded-xl text-left transition-all group flex items-start gap-3 shadow-sm"
            >
              <div 
                className="p-2.5 rounded-xl bg-[#111218] border border-[#2c2f3f] group-hover:border-[#ff6d5a]/40 transition-colors flex-shrink-0"
              >
                {getIcon(item.icon)}
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#ff6d5a] transition-colors truncate">
                    {item.name}
                  </h4>
                </div>
                <p className="text-[11px] text-[#9ea2b8] line-clamp-2 leading-snug">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
