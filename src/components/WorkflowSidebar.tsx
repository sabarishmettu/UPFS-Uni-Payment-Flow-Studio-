import React from 'react';
import { 
  Workflow, 
  Building2, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  UserCheck, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { UserProfile } from './AccountSignIn';

export type ActiveAppView = 'canvas' | 'banks' | 'fds' | 'mutual_funds' | 'demat' | 'account';

interface WorkflowSidebarProps {
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  currentUser?: UserProfile;
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ 
  activeView, 
  setActiveView,
  currentUser 
}) => {
  const navItems = [
    {
      id: 'canvas',
      label: 'Workflow Studio',
      sublabel: 'Visual DAG Builder',
      icon: Workflow,
      badge: 'Visual Engine',
      badgeColor: 'text-[#ff6d5a] bg-[#ff6d5a]/10 border-[#ff6d5a]/25',
      accentColor: '#ff6d5a',
      iconBg: 'bg-[#ff6d5a]/15 text-[#ff6d5a]'
    },
    {
      id: 'banks',
      label: 'Bank Accounts & Rails',
      sublabel: 'Penny Drop & KYC',
      icon: Building2,
      badge: 'Penny Drop',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
      accentColor: '#06b6d4',
      iconBg: 'bg-cyan-500/15 text-cyan-400'
    },
    {
      id: 'fds',
      label: 'Fixed Deposits (FD)',
      sublabel: 'Auto-Sweep Deposits',
      icon: TrendingUp,
      badge: '7.25% APY',
      badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/25',
      accentColor: '#a855f7',
      iconBg: 'bg-purple-500/15 text-purple-400'
    },
    {
      id: 'mutual_funds',
      label: 'Mutual Funds & SIP',
      sublabel: 'Automated Portfolio',
      icon: PieChart,
      badge: 'Direct Yield',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
      accentColor: '#10b981',
      iconBg: 'bg-emerald-500/15 text-emerald-400'
    },
    {
      id: 'demat',
      label: 'Demat & Holdings',
      sublabel: 'CDSL / DTC Clearing',
      icon: BarChart3,
      badge: 'CDSL / DTC',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
      accentColor: '#f59e0b',
      iconBg: 'bg-amber-500/15 text-amber-400'
    },
    {
      id: 'account',
      label: 'Account & Identity',
      sublabel: 'Auth & CKYC Tier 3',
      icon: UserCheck,
      badge: 'Auth Portal',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/25',
      accentColor: '#ec4899',
      iconBg: 'bg-pink-500/15 text-pink-400'
    }
  ] as const;

  return (
    <aside className="w-14 sm:w-64 bg-[#111218] border-r border-[#242735] flex flex-col justify-between select-none z-20 flex-shrink-0 transition-all duration-200">
      <div className="py-3.5 flex flex-col gap-1 px-2.5">
        {/* Section Header */}
        <div className="px-2.5 py-1.5 hidden sm:flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#676a82]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6d5a]" />
            <span>Financial Studio Hub</span>
          </div>
          <span className="text-[9px] font-mono text-[#4b4e66] font-normal">v2.0</span>
        </div>

        {/* Navigation Items List */}
        <div className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveAppView)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group relative ${
                  isActive
                    ? 'bg-[#1a1c27] text-white border border-[#32364a] shadow-md shadow-black/30'
                    : 'text-[#9ea2b8] hover:text-white hover:bg-[#161722] border border-transparent'
                }`}
                title={item.label}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                    style={{ backgroundColor: item.accentColor }}
                  />
                )}

                {/* Icon & Label */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-0.5">
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border ${
                      isActive 
                        ? `${item.iconBg} border-[#3b3f54] shadow-sm` 
                        : 'bg-[#161823] text-[#868a9e] border-[#222433] group-hover:text-white group-hover:border-[#32364a] group-hover:bg-[#1c1e2b]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="hidden sm:flex flex-col min-w-0 flex-1 pr-1">
                    <span className={`text-xs font-bold truncate leading-tight ${
                      isActive ? 'text-white' : 'text-[#c2c5d6] group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#676a82] group-hover:text-[#868a9e] truncate leading-tight mt-0.5 font-normal">
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                {/* Right Badge Pill (Single line, no wrapping) */}
                {item.badge && (
                  <div className="hidden sm:flex items-center flex-shrink-0">
                    <span 
                      className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md border whitespace-nowrap leading-none transition-all ${
                        isActive 
                          ? `${item.badgeColor} font-semibold shadow-xs` 
                          : 'bg-[#151722] text-[#71758d] border-[#242738] group-hover:border-[#32364a] group-hover:text-[#9ea2b8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom User Identity / Sign-in Status Card */}
      <div className="p-2.5 border-t border-[#202230] hidden sm:block bg-[#0d0e13]/90 backdrop-blur-xs">
        {currentUser ? (
          <button
            onClick={() => setActiveView('account')}
            className="w-full text-left p-2 rounded-xl bg-[#151722] hover:bg-[#1c1e2d] border border-[#242738] hover:border-[#ff6d5a]/40 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-lg object-cover border border-[#32364a]" 
                />
                <span className="absolute -bottom-1 -right-1 text-[10px] leading-none bg-[#111218] p-0.5 rounded-full border border-[#242738]">
                  {currentUser.flag}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate group-hover:text-[#ff6d5a] transition-colors">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 leading-tight mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="capitalize truncate font-medium">Verified CKYC Tier 3</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#53566e] group-hover:text-white transition-colors flex-shrink-0 ml-1" />
          </button>
        ) : (
          <button
            onClick={() => setActiveView('account')}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-[#ff6d5a] to-[#ea4b71] hover:from-[#ff5740] hover:to-[#e03c62] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#ff6d5a]/20 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Account Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
