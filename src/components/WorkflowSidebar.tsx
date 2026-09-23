import React from 'react';
import { 
  Workflow, 
  Building2, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  User, 
  ChevronRight,
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
      icon: Workflow,
      badge: 'Visual Engine',
      color: '#ff6d5a'
    },
    {
      id: 'banks',
      label: 'Bank Accounts & Rails',
      icon: Building2,
      badge: 'Penny Drop',
      color: '#06b6d4'
    },
    {
      id: 'fds',
      label: 'Fixed Deposits (FDs / CDs)',
      icon: TrendingUp,
      badge: '7.25% APY',
      color: '#a855f7'
    },
    {
      id: 'mutual_funds',
      label: 'Mutual Funds & SIPs',
      icon: PieChart,
      badge: 'Direct Growth',
      color: '#10b981'
    },
    {
      id: 'demat',
      label: 'Demat & Stock Holdings',
      icon: BarChart3,
      badge: 'CDSL / DTC',
      color: '#f59e0b'
    },
    {
      id: 'account',
      label: 'Account & Sign In',
      icon: User,
      badge: 'Auth Portal',
      color: '#ec4899'
    }
  ] as const;

  return (
    <aside className="w-14 sm:w-56 bg-[#111218] border-r border-[#2c2f3f] flex flex-col justify-between select-none z-20 flex-shrink-0">
      <div className="py-3 flex flex-col gap-1 px-2">
        <div className="px-2 py-1.5 hidden sm:block text-[10px] font-bold uppercase tracking-wider text-[#676a82]">
          Financial Studio Hub
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveAppView)}
              className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#20222e] text-white border border-[#3b3f54] shadow-sm'
                  : 'text-[#9ea2b8] hover:text-white hover:bg-[#191a24]'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-[#ff6d5a]/15 text-[#ff6d5a]' : 'text-[#9ea2b8] group-hover:text-white'
                  }`}
                  style={{ color: isActive ? item.color : undefined }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#ff6d5a]/20 text-[#ff6d5a]' : 'bg-[#1e202c] text-[#676a82]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Account Sign-In & Profile Card */}
      <div className="p-3 border-t border-[#2c2f3f] hidden sm:block bg-[#0e0f14]">
        {currentUser ? (
          <button
            onClick={() => setActiveView('account')}
            className="w-full text-left p-2 rounded-xl bg-[#191a24] hover:bg-[#20222e] border border-[#2c2f3f] hover:border-[#ff6d5a]/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative flex-shrink-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-[#3b3f54]" 
                />
                <span className="absolute -bottom-0.5 -right-0.5 text-[9px]">{currentUser.flag}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate group-hover:text-[#ff6d5a] transition-colors">
                  {currentUser.name}
                </div>
                <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="capitalize">{currentUser.role}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#676a82] group-hover:text-white transition-colors" />
          </button>
        ) : (
          <button
            onClick={() => setActiveView('account')}
            className="w-full py-2 px-3 bg-[#ff6d5a] hover:bg-[#ff5740] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#ff6d5a]/20 flex items-center justify-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
