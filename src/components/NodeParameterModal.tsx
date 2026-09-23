import React, { useState } from 'react';
import { FlowNode, FlowEdge, LinkedBankAccountItem } from '../data/workflowData';
import { 
  X, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  Code2, 
  CheckCircle2, 
  FileJson,
  UserCheck,
  Building2,
  Plus,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Link2,
  Unlink,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface NodeParameterModalProps {
  node: FlowNode;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  onClose: () => void;
  onUpdateParameters: (nodeId: string, parameters: Record<string, any>) => void;
  onDeleteNode: (nodeId: string) => void;
  onTestStep: (nodeId: string) => void;
  isExecutingStep?: boolean;
  onAddEdge?: (sourceId: string, targetId: string) => void;
  onDeleteEdge?: (edgeId: string) => void;
}

export const NodeParameterModal: React.FC<NodeParameterModalProps> = ({
  node,
  nodes = [],
  edges = [],
  onClose,
  onUpdateParameters,
  onDeleteNode,
  onTestStep,
  isExecutingStep = false,
  onAddEdge,
  onDeleteEdge
}) => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'connections' | 'input' | 'output'>('parameters');
  const [copied, setCopied] = useState(false);
  const [localParams, setLocalParams] = useState<Record<string, any>>(node.parameters || {});
  const [showMaskedAccount, setShowMaskedAccount] = useState<Record<string, boolean>>({});
  const [isRefreshingLiveBalance, setIsRefreshingLiveBalance] = useState(false);
  const [selectedConnectTargetId, setSelectedConnectTargetId] = useState<string>('');
  const [selectedConnectSourceId, setSelectedConnectSourceId] = useState<string>('');

  // New Bank Account Form Drawer State
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBankName, setNewBankName] = useState('Kotak Mahindra Bank');
  const [newAccountNumber, setNewAccountNumber] = useState('749201928410');
  const [newIfsc, setNewIfsc] = useState('KKBK0000281');
  const [newAccountType, setNewAccountType] = useState<LinkedBankAccountItem['accountType']>('Savings');
  const [newBalance, setNewBalance] = useState('₹64,000.00');

  const isIdentityNode = node.type === 'unifi.identityLinkedBanks' || node.type === 'unifi.identityMaster';
  const isBankAccountNode = node.type === 'unifi.bankAccountNode';

  const handleParamChange = (key: string, value: any) => {
    const updated = { ...localParams, [key]: value };
    setLocalParams(updated);
    onUpdateParameters(node.id, updated);
  };

  const handleCopyJSON = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Switch Primary Bank
  const handleSetPrimaryBank = (accountId: string) => {
    const accounts: LinkedBankAccountItem[] = localParams.linkedBankAccounts || [];
    const updatedAccounts = accounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === accountId
    }));
    handleParamChange('linkedBankAccounts', updatedAccounts);
  };

  // Remove a bank account
  const handleRemoveBank = (accountId: string) => {
    const accounts: LinkedBankAccountItem[] = localParams.linkedBankAccounts || [];
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    handleParamChange('linkedBankAccounts', updatedAccounts);
    handleParamChange('totalLinkedAccounts', updatedAccounts.length);
  };

  // Add new linked bank account
  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAcc: LinkedBankAccountItem = {
      id: `acc-${Date.now()}`,
      bankName: newBankName,
      accountNumber: newAccountNumber,
      ifscOrRouting: newIfsc,
      accountType: newAccountType,
      pennyDropStatus: 'VERIFIED',
      isPrimary: (localParams.linkedBankAccounts || []).length === 0,
      balanceFormatted: newBalance,
      currency: 'INR'
    };

    const currentAccounts: LinkedBankAccountItem[] = localParams.linkedBankAccounts || [];
    const updated = [...currentAccounts, newAcc];
    handleParamChange('linkedBankAccounts', updated);
    handleParamChange('totalLinkedAccounts', updated.length);
    setIsAddingBank(false);
  };

  // Preset KYC Profiles
  const kycPresets = [
    {
      name: 'Alex Rivera (India)',
      legalName: 'Alex Rivera',
      idType: 'PAN (Permanent Account Number)',
      idNum: 'ABCDE1234F',
      jurisdiction: 'IN',
      accounts: [
        {
          id: 'acc-01',
          bankName: 'HDFC Bank Ltd',
          accountNumber: '50100294829103',
          ifscOrRouting: 'HDFC0000240',
          accountType: 'Savings' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: true,
          balanceFormatted: '₹1,50,000.00',
          currency: 'INR'
        },
        {
          id: 'acc-02',
          bankName: 'ICICI Bank Ltd',
          accountNumber: '001205019284',
          ifscOrRouting: 'ICIC0000012',
          accountType: 'Current / Operating' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: false,
          balanceFormatted: '₹45,200.00',
          currency: 'INR'
        },
        {
          id: 'acc-03',
          bankName: 'State Bank of India (SBI)',
          accountNumber: '30291829481',
          ifscOrRouting: 'SBIN0001842',
          accountType: 'Business Escrow' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: false,
          balanceFormatted: '₹82,400.00',
          currency: 'INR'
        }
      ]
    },
    {
      name: 'Sarah Chen (US)',
      legalName: 'Sarah Chen',
      idType: 'SSN (Social Security Number)',
      idNum: 'XXX-XX-8492',
      jurisdiction: 'US',
      accounts: [
        {
          id: 'acc-us-01',
          bankName: 'JPMorgan Chase Bank, N.A.',
          accountNumber: '9284019284',
          ifscOrRouting: '021000021 (ABA)',
          accountType: 'Checking' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: true,
          balanceFormatted: '$14,500.00',
          currency: 'USD'
        },
        {
          id: 'acc-us-02',
          bankName: 'Silicon Valley Bank (SVB)',
          accountNumber: '4019284910',
          ifscOrRouting: '121140399 (ABA)',
          accountType: 'Current / Operating' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: false,
          balanceFormatted: '$38,200.00',
          currency: 'USD'
        }
      ]
    },
    {
      name: 'Priya Sharma (India)',
      legalName: 'Priya Sharma',
      idType: 'PAN (Permanent Account Number)',
      idNum: 'PRYAS8492K',
      jurisdiction: 'IN',
      accounts: [
        {
          id: 'acc-in-p1',
          bankName: 'Axis Bank Ltd',
          accountNumber: '91802004819201',
          ifscOrRouting: 'UTIB0000004',
          accountType: 'Savings' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: true,
          balanceFormatted: '₹2,10,000.00',
          currency: 'INR'
        },
        {
          id: 'acc-in-p2',
          bankName: 'Kotak Mahindra Bank',
          accountNumber: '839201928410',
          ifscOrRouting: 'KKBK0000281',
          accountType: 'Current / Operating' as const,
          pennyDropStatus: 'VERIFIED' as const,
          isPrimary: false,
          balanceFormatted: '₹95,000.00',
          currency: 'INR'
        }
      ]
    }
  ];

  const applyKycPreset = (preset: typeof kycPresets[0]) => {
    const updated = {
      ...localParams,
      customerLegalName: preset.legalName,
      governmentIdType: preset.idType,
      governmentIdNumber: preset.idNum,
      jurisdiction: preset.jurisdiction,
      totalLinkedAccounts: preset.accounts.length,
      linkedBankAccounts: preset.accounts
    };
    setLocalParams(updated);
    onUpdateParameters(node.id, updated);
  };

  const linkedAccounts: LinkedBankAccountItem[] = localParams.linkedBankAccounts || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-4xl bg-[#1c1e29] border border-[#3b3f54] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="h-14 px-5 border-b border-[#2c2f3f] flex items-center justify-between bg-[#14151c]">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: node.color || '#06b6d4' }}
            >
              {isIdentityNode ? <UserCheck className="w-4 h-4" /> : node.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{node.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242735] text-[#9ea2b8] border border-[#3b3f54]">
                  {node.type}
                </span>
              </div>
              <p className="text-[11px] text-[#9ea2b8]">{node.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTestStep(node.id)}
              disabled={isExecutingStep}
              className="px-3 py-1.5 bg-[#ff6d5a] hover:bg-[#ff5740] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-[#ff6d5a]/20"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isExecutingStep ? 'animate-spin' : ''}`} />
              <span>{isExecutingStep ? 'Testing Step...' : 'Test Step'}</span>
            </button>

            <button
              onClick={() => onDeleteNode(node.id)}
              className="p-1.5 text-[#676a82] hover:text-rose-400 hover:bg-[#282b3a] rounded-md transition-colors"
              title="Delete node"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#9ea2b8] hover:text-white hover:bg-[#282b3a] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 h-11 border-b border-[#2c2f3f] flex items-center justify-between bg-[#191a24]">
          <div className="flex items-center gap-1 h-full">
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-4 h-full text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'parameters'
                  ? 'border-[#ff6d5a] text-[#ff6d5a]'
                  : 'border-transparent text-[#9ea2b8] hover:text-white'
              }`}
            >
              {isIdentityNode ? <UserCheck className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
              <span>{isIdentityNode ? 'Identity & Linked Banks' : 'Parameters'}</span>
            </button>

            <button
              onClick={() => setActiveTab('connections')}
              className={`px-4 h-full text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'connections'
                  ? 'border-[#ff6d5a] text-[#ff6d5a]'
                  : 'border-transparent text-[#9ea2b8] hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Connections & Lines ({edges.filter(e => e.source === node.id || e.target === node.id).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 h-full text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'input'
                  ? 'border-[#ff6d5a] text-[#ff6d5a]'
                  : 'border-transparent text-[#9ea2b8] hover:text-white'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Input Data ({Object.keys(node.sampleInput || {}).length})</span>
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 h-full text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'output'
                  ? 'border-[#ff6d5a] text-[#ff6d5a]'
                  : 'border-transparent text-[#9ea2b8] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Output Data ({Object.keys(node.sampleOutput || {}).length})</span>
            </button>
          </div>

          <button
            onClick={() => handleCopyJSON(activeTab === 'parameters' ? localParams : activeTab === 'input' ? node.sampleInput : node.sampleOutput)}
            className="text-[11px] text-[#9ea2b8] hover:text-white flex items-center gap-1 py-1 px-2 rounded hover:bg-[#282b3a] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#14151c]">
          {activeTab === 'parameters' && (
            <div>
              {isIdentityNode ? (
                /* Dedicated Identity & Multi-Bank Linker UI */
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Preset quick profile loader */}
                  <div className="p-3.5 bg-[#1c1e29] rounded-xl border border-[#2c2f3f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#9ea2b8]">
                      <Sparkles className="w-4 h-4 text-[#ff6d5a]" />
                      <span className="font-semibold text-white">Load Verified Profile Preset:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {kycPresets.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyKycPreset(p)}
                          className="px-2.5 py-1 bg-[#14151c] hover:bg-[#282b3a] text-white border border-[#2c2f3f] hover:border-[#ff6d5a]/60 rounded-lg text-[11px] font-medium transition-colors"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Identity & Government ID Form */}
                  <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Customer KYC & Government ID Credentials
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>CKYC Verified</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#9ea2b8] font-medium mb-1">Customer Legal Name</label>
                        <input
                          type="text"
                          value={localParams.customerLegalName || ''}
                          onChange={(e) => handleParamChange('customerLegalName', e.target.value)}
                          placeholder="e.g. Alex Rivera"
                          className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#9ea2b8] font-medium mb-1">Government ID Type</label>
                        <input
                          type="text"
                          value={localParams.governmentIdType || ''}
                          onChange={(e) => handleParamChange('governmentIdType', e.target.value)}
                          placeholder="e.g. PAN / SSN / NINO / MyNumber"
                          className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[#9ea2b8] font-medium mb-1">National ID Number / Unique Identifier</label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={localParams.governmentIdNumber || ''}
                            onChange={(e) => handleParamChange('governmentIdNumber', e.target.value)}
                            placeholder="e.g. ABCDE1234F"
                            className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none tracking-wider uppercase"
                          />
                          <span className="absolute right-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Encrypted at Rest</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Linked Bank Accounts List */}
                  <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          <span>All Linked Bank Accounts ({linkedAccounts.length})</span>
                        </h4>
                        <p className="text-[11px] text-[#9ea2b8] mt-0.5">
                          Bank accounts registered and penny-drop verified for this customer identity.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddingBank(!isAddingBank)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Link Bank Account</span>
                      </button>
                    </div>

                    {/* Add Bank Form Drawer */}
                    {isAddingBank && (
                      <form onSubmit={handleAddBankAccount} className="p-4 bg-[#14151c] rounded-xl border border-cyan-500/40 space-y-3 animate-in fade-in">
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Link New Bank Account (with Instant ₹1.00 Penny Drop)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[#9ea2b8] mb-1">Bank Name</label>
                            <input
                              type="text"
                              required
                              value={newBankName}
                              onChange={(e) => setNewBankName(e.target.value)}
                              placeholder="e.g. Kotak Mahindra Bank"
                              className="w-full bg-[#1c1e29] border border-[#2c2f3f] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[#9ea2b8] mb-1">Account Number</label>
                            <input
                              type="text"
                              required
                              value={newAccountNumber}
                              onChange={(e) => setNewAccountNumber(e.target.value)}
                              placeholder="e.g. 84920192841"
                              className="w-full bg-[#1c1e29] border border-[#2c2f3f] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[#9ea2b8] mb-1">IFSC / Routing / Sort Code</label>
                            <input
                              type="text"
                              required
                              value={newIfsc}
                              onChange={(e) => setNewIfsc(e.target.value)}
                              placeholder="e.g. KKBK0000281"
                              className="w-full bg-[#1c1e29] border border-[#2c2f3f] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none uppercase"
                            />
                          </div>

                          <div>
                            <label className="block text-[#9ea2b8] mb-1">Account Type</label>
                            <select
                              value={newAccountType}
                              onChange={(e) => setNewAccountType(e.target.value as any)}
                              className="w-full bg-[#1c1e29] border border-[#2c2f3f] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                            >
                              <option value="Savings">Savings</option>
                              <option value="Current / Operating">Current / Operating</option>
                              <option value="Checking">Checking</option>
                              <option value="Business Escrow">Business Escrow</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingBank(false)}
                            className="px-3 py-1.5 bg-[#282b3a] text-[#9ea2b8] hover:text-white rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs"
                          >
                            Verify & Link Bank
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Bank Account Cards */}
                    <div className="space-y-3">
                      {linkedAccounts.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#9ea2b8] bg-[#14151c] rounded-xl border border-[#2c2f3f]">
                          No bank accounts linked. Click "+ Link Bank Account" above to register one.
                        </div>
                      ) : (
                        linkedAccounts.map((acc) => {
                          const isMasked = !showMaskedAccount[acc.id];
                          const displayAccNo = isMasked
                            ? `•••• •••• ${acc.accountNumber.slice(-4)}`
                            : acc.accountNumber;

                          return (
                            <div 
                              key={acc.id}
                              className={`p-4 rounded-xl border transition-all ${
                                acc.isPrimary 
                                  ? 'bg-[#14151c] border-cyan-500/50 shadow-md shadow-cyan-500/5' 
                                  : 'bg-[#14151c] border-[#2c2f3f] hover:border-[#3b3f54]'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white">{acc.bankName}</span>
                                    {acc.isPrimary && (
                                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                        ★ PRIMARY ACCOUNT
                                      </span>
                                    )}
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                      <ShieldCheck className="w-2.5 h-2.5" />
                                      <span>PENNY DROP VERIFIED</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs font-mono text-[#9ea2b8]">
                                    <span className="text-white font-bold">{displayAccNo}</span>
                                    <button
                                      type="button"
                                      onClick={() => setShowMaskedAccount(prev => ({ ...prev, [acc.id]: !prev[acc.id] }))}
                                      className="text-[#676a82] hover:text-white"
                                      title={isMasked ? 'Reveal full number' : 'Mask number'}
                                    >
                                      {isMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    </button>
                                    <span>•</span>
                                    <span>IFSC/Routing: <strong className="text-[#f0f1f5]">{acc.ifscOrRouting}</strong></span>
                                    <span>•</span>
                                    <span>Type: <strong className="text-[#f0f1f5]">{acc.accountType}</strong></span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 justify-between sm:justify-end">
                                  <div className="text-right">
                                    <span className="text-[10px] text-[#676a82] block">Operating Cash</span>
                                    <span className="text-xs font-mono font-bold text-emerald-400">
                                      {acc.balanceFormatted}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {!acc.isPrimary && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetPrimaryBank(acc.id)}
                                        className="px-2.5 py-1 bg-[#1e202c] hover:bg-[#282b3a] text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-semibold transition-colors"
                                      >
                                        Set Primary
                                      </button>
                                    )}

                                    {linkedAccounts.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveBank(acc.id)}
                                        className="p-1 text-[#676a82] hover:text-rose-400 hover:bg-[#282b3a] rounded-md transition-colors"
                                        title="Unlink bank account"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ) : isBankAccountNode ? (
                /* Dedicated Single Linked Bank Account Node Editor */
                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Linked Bank Account Configuration
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Penny Drop Verified</span>
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#9ea2b8] font-medium mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={localParams.bankName || ''}
                          onChange={(e) => handleParamChange('bankName', e.target.value)}
                          placeholder="e.g. HDFC Bank Ltd"
                          className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#9ea2b8] font-medium mb-1">Account Number</label>
                          <input
                            type="text"
                            value={localParams.accountNumber || ''}
                            onChange={(e) => handleParamChange('accountNumber', e.target.value)}
                            placeholder="e.g. 50100294829103"
                            className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#9ea2b8] font-medium mb-1">IFSC / ABA / Sort Code</label>
                          <input
                            type="text"
                            value={localParams.ifscOrRouting || ''}
                            onChange={(e) => handleParamChange('ifscOrRouting', e.target.value)}
                            placeholder="e.g. HDFC0000240"
                            className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#9ea2b8] font-medium mb-1">Account Classification</label>
                          <input
                            type="text"
                            value={localParams.accountType || ''}
                            onChange={(e) => handleParamChange('accountType', e.target.value)}
                            placeholder="e.g. Savings / Primary"
                            className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[#9ea2b8] font-medium">Operating Cash Balance</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsRefreshingLiveBalance(true);
                                setTimeout(() => setIsRefreshingLiveBalance(false), 700);
                              }}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                            >
                              <RefreshCw className={`w-2.5 h-2.5 ${isRefreshingLiveBalance ? 'animate-spin' : ''}`} />
                              <span>{isRefreshingLiveBalance ? 'Checking API...' : 'Live Check'}</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={localParams.balanceFormatted || ''}
                            onChange={(e) => handleParamChange('balanceFormatted', e.target.value)}
                            placeholder="e.g. ₹1,50,000.00"
                            className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Parameter Editor for other nodes */
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="text-xs text-[#9ea2b8] mb-2 flex items-center justify-between">
                    <span>Configure node runtime options and expressions:</span>
                    <span className="text-[11px] font-mono text-[#ff6d5a]">Supports {'{{ $json.field }}'} syntax</span>
                  </div>

                  {Object.entries(localParams).map(([key, value]) => {
                    const isBool = typeof value === 'boolean';
                    return (
                      <div key={key} className="p-3.5 bg-[#1c1e29] rounded-xl border border-[#2c2f3f] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <span className="text-[10px] font-mono text-[#676a82]">{typeof value}</span>
                        </div>

                        {isBool ? (
                          <button
                            onClick={() => handleParamChange(key, !value)}
                            className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                              value ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400' : 'bg-[#282b3a] text-[#9ea2b8]'
                            }`}
                          >
                            <span>{value ? 'Enabled' : 'Disabled'}</span>
                            <div className={`w-2 h-2 rounded-full ${value ? 'bg-emerald-400' : 'bg-[#676a82]'}`} />
                          </button>
                        ) : (
                          <input
                            type="text"
                            value={String(value)}
                            onChange={(e) => handleParamChange(key, e.target.value)}
                            className="w-full bg-[#111218] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-lg px-3 py-2 text-xs font-mono text-[#f0f1f5] focus:outline-none transition-colors"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Incoming Connections Section */}
              <div className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Incoming Connections (Sources)</h4>
                  </div>
                  <span className="text-[10px] text-[#9ea2b8] font-mono">
                    {edges.filter(e => e.target === node.id).length} links connected
                  </span>
                </div>

                <div className="space-y-2">
                  {edges.filter(e => e.target === node.id).length === 0 ? (
                    <div className="p-3 bg-[#1c1e29] rounded-lg border border-dashed border-[#2c2f3f] text-center text-xs text-[#9ea2b8]">
                      No incoming connections. This node acts as an entry/root trigger.
                    </div>
                  ) : (
                    edges.filter(e => e.target === node.id).map(edge => {
                      const sourceNode = nodes.find(n => n.id === edge.source);
                      return (
                        <div key={edge.id} className="flex items-center justify-between p-2.5 bg-[#1c1e29] border border-[#2c2f3f] rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <div>
                              <div className="text-xs font-semibold text-white">{sourceNode?.name || edge.source}</div>
                              <div className="text-[10px] text-[#9ea2b8] font-mono">{sourceNode?.type || 'Node'}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteEdge && onDeleteEdge(edge.id)}
                            className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 rounded text-[10px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <Unlink className="w-3 h-3" />
                            <span>Disconnect</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add new incoming connection */}
                <div className="pt-2 border-t border-[#242735] flex items-center gap-2">
                  <select
                    value={selectedConnectSourceId}
                    onChange={(e) => setSelectedConnectSourceId(e.target.value)}
                    className="flex-1 bg-[#1c1e29] border border-[#2c2f3f] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="">+ Connect another node as source...</option>
                    {nodes
                      .filter(n => n.id !== node.id && !edges.some(e => e.source === n.id && e.target === node.id))
                      .map(n => (
                        <option key={n.id} value={n.id}>
                          {n.name} ({n.type})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedConnectSourceId}
                    onClick={() => {
                      if (selectedConnectSourceId && onAddEdge) {
                        onAddEdge(selectedConnectSourceId, node.id);
                        setSelectedConnectSourceId('');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedConnectSourceId 
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md' 
                        : 'bg-[#282b3a] text-[#676a82] cursor-not-allowed'
                    }`}
                  >
                    Link Source
                  </button>
                </div>
              </div>

              {/* Outgoing Connections Section */}
              <div className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#ff6d5a]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Outgoing Connections (Targets)</h4>
                  </div>
                  <span className="text-[10px] text-[#9ea2b8] font-mono">
                    {edges.filter(e => e.source === node.id).length} links connected
                  </span>
                </div>

                <div className="space-y-2">
                  {edges.filter(e => e.source === node.id).length === 0 ? (
                    <div className="p-3 bg-[#1c1e29] rounded-lg border border-dashed border-[#2c2f3f] text-center text-xs text-[#9ea2b8]">
                      No outgoing connections. This node terminates the flow or output.
                    </div>
                  ) : (
                    edges.filter(e => e.source === node.id).map(edge => {
                      const targetNode = nodes.find(n => n.id === edge.target);
                      return (
                        <div key={edge.id} className="flex items-center justify-between p-2.5 bg-[#1c1e29] border border-[#2c2f3f] rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#ff6d5a]" />
                            <div>
                              <div className="text-xs font-semibold text-white">{targetNode?.name || edge.target}</div>
                              <div className="text-[10px] text-[#9ea2b8] font-mono">{targetNode?.type || 'Node'}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteEdge && onDeleteEdge(edge.id)}
                            className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 rounded text-[10px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <Unlink className="w-3 h-3" />
                            <span>Disconnect</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add new outgoing connection */}
                <div className="pt-2 border-t border-[#242735] flex items-center gap-2">
                  <select
                    value={selectedConnectTargetId}
                    onChange={(e) => setSelectedConnectTargetId(e.target.value)}
                    className="flex-1 bg-[#1c1e29] border border-[#2c2f3f] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="">+ Connect this node to target...</option>
                    {nodes
                      .filter(n => n.id !== node.id && !edges.some(e => e.source === node.id && e.target === n.id))
                      .map(n => (
                        <option key={n.id} value={n.id}>
                          {n.name} ({n.type})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedConnectTargetId}
                    onClick={() => {
                      if (selectedConnectTargetId && onAddEdge) {
                        onAddEdge(node.id, selectedConnectTargetId);
                        setSelectedConnectTargetId('');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedConnectTargetId 
                        ? 'bg-[#ff6d5a] hover:bg-[#e05645] text-white shadow-md' 
                        : 'bg-[#282b3a] text-[#676a82] cursor-not-allowed'
                    }`}
                  >
                    Link Target
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'input' && (
            <div className="space-y-2">
              <div className="text-xs text-[#9ea2b8]">Payload passed into this node:</div>
              <pre className="p-4 bg-[#111218] rounded-xl border border-[#2c2f3f] font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(node.sampleInput || {}, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'output' && (
            <div className="space-y-2">
              <div className="text-xs text-[#9ea2b8]">Normalized JSON output produced by this step:</div>
              <pre className="p-4 bg-[#111218] rounded-xl border border-[#2c2f3f] font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(node.sampleOutput || {}, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="h-12 px-5 border-t border-[#2c2f3f] flex items-center justify-between bg-[#191a24] text-xs text-[#9ea2b8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Node Configured & Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#282b3a] hover:bg-[#34384c] text-white rounded-md font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
