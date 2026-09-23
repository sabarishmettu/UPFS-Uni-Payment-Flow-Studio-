import React from 'react';
import { 
  Play, 
  Sparkles,
  User
} from 'lucide-react';
import { UserProfile } from './AccountSignIn';

interface WorkflowNavbarProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  isRunning: boolean;
  onExecuteWorkflow: () => void;
  onResetWorkflow: () => void;
  onOpenPalette: () => void;
  phase1Approved?: boolean;
  onTogglePhase1Approval?: () => void;
  currentUser?: UserProfile;
  onOpenAccount: () => void;
}

export const WorkflowNavbar: React.FC<WorkflowNavbarProps> = ({
  workflowName,
  setWorkflowName,
  isActive,
  setIsActive,
  isRunning,
  onExecuteWorkflow,
  onOpenPalette,
  currentUser,
  onOpenAccount
}) => {
  return (
    <header className="h-14 bg-[#111218] border-b border-[#2c2f3f] px-4 flex items-center justify-between select-none z-30">
      {/* Left side: Logo & Breadcrumb / Name */}
      <div className="flex items-center gap-4">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff6d5a] to-[#ea4b71] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#ff6d5a]/20">
            UF
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-xs tracking-wide text-white flex items-center gap-1.5">
              <span>Uni Payment Flow Studio</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#242735] text-[#ff6d5a] border border-[#ff6d5a]/30 font-semibold">
                v2.0
              </span>
            </span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-[#2c2f3f] hidden sm:block" />

        {/* Workflow Title Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent hover:bg-[#1c1e29] focus:bg-[#1c1e29] border border-transparent hover:border-[#2c2f3f] focus:border-[#ff6d5a] text-white font-semibold text-xs sm:text-sm px-2.5 py-1 rounded-md transition-colors focus:outline-none max-w-[200px] sm:max-w-[320px] truncate"
            title="Click to rename workflow"
          />
        </div>
      </div>

      {/* Right side: Action controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Add Node Button */}
        <button
          onClick={onOpenPalette}
          className="px-3 py-1.5 bg-[#20222e] hover:bg-[#282b3a] text-white rounded-md border border-[#3b3f54] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span className="text-[#ff6d5a] font-bold text-sm">+</span>
          <span className="hidden sm:inline">Add Node</span>
        </button>

        {/* Active Toggle */}
        <div className="flex items-center gap-2 bg-[#191a24] px-2.5 py-1 rounded-md border border-[#2c2f3f]">
          <span className="text-[11px] font-medium text-[#9ea2b8] hidden lg:inline">Active</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
              isActive ? 'bg-[#ff6d5a]' : 'bg-[#2c2f3f]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                isActive ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Execute / Test Workflow Button */}
        <button
          onClick={onExecuteWorkflow}
          disabled={isRunning}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
            isRunning
              ? 'bg-[#2b2d3c] text-[#9ea2b8] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#ff6d5a] to-[#ea4b71] hover:brightness-110 text-white shadow-[#ff6d5a]/25'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Executing...' : 'Test Workflow'}</span>
        </button>

        {/* User Account / Sign In Pill */}
        {currentUser && (
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#191a24] hover:bg-[#20222e] border border-[#2c2f3f] hover:border-[#ff6d5a]/40 transition-colors"
            title="Account & Sign In Settings"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-5 h-5 rounded-full object-cover border border-[#ff6d5a]/40" 
            />
            <span className="text-xs font-semibold text-white hidden xl:inline">{currentUser.name.split(' ')[0]}</span>
            <span className="text-xs hidden sm:inline">{currentUser.flag}</span>
          </button>
        )}
      </div>
    </header>
  );
};
