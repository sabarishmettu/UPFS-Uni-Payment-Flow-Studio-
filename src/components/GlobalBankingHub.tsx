import React, { useState } from 'react';
import { 
  JurisdictionCode, 
  JURISDICTIONS, 
  BankAccountRecord, 
  FixedDepositRecord, 
  FundTransactionRecord 
} from '../data/jurisdictionData';
import { 
  Globe2, 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  Clock, 
  CreditCard, 
  Coins, 
  Zap, 
  FileText,
  DollarSign,
  Layers,
  ChevronRight
} from 'lucide-react';

interface GlobalBankingHubProps {
  initialTab?: 'kyc' | 'banks' | 'fds' | 'funds' | 'sweep';
  activeJurisdiction?: JurisdictionCode;
  onSelectJurisdiction?: (j: JurisdictionCode) => void;
}

export const GlobalBankingHub: React.FC<GlobalBankingHubProps> = ({
  initialTab = 'banks',
  activeJurisdiction: externalJurisdiction,
  onSelectJurisdiction: externalOnSelectJurisdiction
}) => {
  const [internalJurisdiction, setInternalJurisdiction] = useState<JurisdictionCode>('IN');
  const activeJurisdiction = externalJurisdiction || internalJurisdiction;
  const setActiveJurisdiction = externalOnSelectJurisdiction || setInternalJurisdiction;

  const [activeTab, setActiveTab] = useState<'kyc' | 'banks' | 'fds' | 'funds' | 'sweep'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const config = JURISDICTIONS[activeJurisdiction];

  // KYC State
  const [docInputValues, setDocInputValues] = useState<Record<string, string>>({
    pan: 'ABCDE1234F',
    aadhaar_masked: 'XXXX-XXXX-9482',
    gstin: '29ABCDE1234F1Z5',
    ssn: 'XXX-XX-8492',
    ein: '12-3456789',
    state_id: 'D19284920',
    nino: 'QQ 12 34 56 A',
    crn: '08492019',
    passport: '529402910',
    mynumber: '1234 5678 9012',
    corporate_num: '1234567890123',
    driver_license_jp: '301928492019'
  });
  const [verifiedDocs, setVerifiedDocs] = useState<Record<string, boolean>>({
    pan: true,
    ssn: true,
    nino: true,
    mynumber: true
  });
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccountRecord[]>([
    {
      id: 'bank-in-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'IN',
      bankName: 'HDFC Bank Ltd',
      accountIdentifier: '•••• •••• 9103',
      details: {
        account_number: '50100294829103',
        ifsc_code: 'HDFC0000240',
        upi_vpa: 'alex.rivera@okhdfcbank',
        beneficiary_name: 'Alex Rivera Pvt Ltd'
      },
      isPrimary: true,
      status: 'verified',
      verifiedAt: '2026-09-20'
    },
    {
      id: 'bank-us-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'US',
      bankName: 'JPMorgan Chase Bank',
      accountIdentifier: '•••• •••• 8492',
      details: {
        routing_number: '021000021',
        account_number: '9284019284',
        account_type: 'CHECKING',
        beneficiary_name: 'Alex Rivera LLC'
      },
      isPrimary: true,
      status: 'verified',
      verifiedAt: '2026-09-19'
    },
    {
      id: 'bank-uk-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'UK',
      bankName: 'Barclays Bank UK PLC',
      accountIdentifier: '•••• 5678',
      details: {
        sort_code: '20-00-00',
        account_number: '12345678',
        beneficiary_name: 'Alex Rivera Ltd'
      },
      isPrimary: true,
      status: 'verified',
      verifiedAt: '2026-09-18'
    },
    {
      id: 'bank-jp-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'JP',
      bankName: 'MUFG Bank (三菱UFJ銀行)',
      accountIdentifier: '•••• 1234',
      details: {
        bank_name: 'MUFG (0005)',
        branch_code: '001',
        account_type_jp: 'Futsu (Ordinary)',
        account_number: '1234567',
        katakana_name: 'リベラ アレックス'
      },
      isPrimary: true,
      status: 'verified',
      verifiedAt: '2026-09-17'
    }
  ]);

  // New Bank Form State
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBankForm, setNewBankForm] = useState<Record<string, string>>({});
  const [pennyDropRunning, setPennyDropRunning] = useState(false);

  // Operational Wallet Balances (in minor units: paise, cents, pence, whole yen)
  const [balances, setBalances] = useState<Record<JurisdictionCode, number>>({
    IN: 38450000, // ₹384,500.00
    US: 1452000,  // $14,520.00
    UK: 920000,   // £9,200.00
    JP: 2450000   // ¥2,450,000
  });

  // Fixed Deposits (FDs) State
  const [fixedDeposits, setFixedDeposits] = useState<FixedDepositRecord[]>([
    {
      id: 'fd-in-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'IN',
      accountNumber: 'FD-IN-2026-9482',
      principalAmountMinor: 25000000, // ₹250,000.00
      interestRateApy: 7.25,
      tenureMonths: 12,
      compoundingFrequency: 'quarterly',
      startedAt: '2026-01-15',
      maturityDate: '2027-01-15',
      projectedInterestMinor: 1862500, // ₹18,625.00
      status: 'active',
      autoRollover: true,
      linkedBankAccountId: 'bank-in-01'
    },
    {
      id: 'fd-us-01',
      userId: 'usr_8f4a1c90',
      jurisdiction: 'US',
      accountNumber: 'CD-US-2026-1029',
      principalAmountMinor: 1000000, // $10,000.00
      interestRateApy: 5.15,
      tenureMonths: 6,
      compoundingFrequency: 'monthly',
      startedAt: '2026-06-01',
      maturityDate: '2026-12-01',
      projectedInterestMinor: 26000, // $260.00
      status: 'active',
      autoRollover: false,
      linkedBankAccountId: 'bank-us-01'
    }
  ]);

  // Create FD Modal / Form State
  const [isCreatingFD, setIsCreatingFD] = useState(false);
  const [fdPrincipalInput, setFdPrincipalInput] = useState('50000');
  const [fdTenureInput, setFdTenureInput] = useState(12);

  // Auto-Sweep Rules State
  const [sweepEnabled, setSweepEnabled] = useState<Record<JurisdictionCode, boolean>>({
    IN: true,
    US: true,
    UK: false,
    JP: false
  });
  const [sweepThresholds, setSweepThresholds] = useState<Record<JurisdictionCode, number>>({
    IN: 50000,
    US: 10000,
    UK: 8000,
    JP: 1000000
  });

  // Helper formatting
  const formatMoney = (minorUnits: number, jurisdiction: JurisdictionCode) => {
    const c = JURISDICTIONS[jurisdiction];
    if (jurisdiction === 'JP') {
      return `${c.currencySymbol}${minorUnits.toLocaleString()}`;
    }
    return `${c.currencySymbol}${(minorUnits / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Compound Interest Calculation
  const calculateCompoundInterest = (principal: number, apyRate: number, tenureMonths: number) => {
    const r = apyRate / 100;
    const n = 4; // quarterly
    const t = tenureMonths / 12;
    const maturity = principal * Math.pow(1 + r / n, n * t);
    const interest = maturity - principal;
    return {
      maturity: Math.round(maturity),
      interest: Math.round(interest)
    };
  };

  // KYC Verification Trigger
  const handleVerifyDoc = (docId: string, regexStr: string) => {
    setVerifyingDocId(docId);
    const val = (docInputValues[docId] || '').trim();
    const regex = new RegExp(regexStr, 'i');
    const isValid = regex.test(val);

    setTimeout(() => {
      setVerifiedDocs(prev => ({ ...prev, [docId]: isValid }));
      setVerifyingDocId(null);
    }, 600);
  };

  // Add Bank Account Submit
  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setPennyDropRunning(true);

    setTimeout(() => {
      const newAcc: BankAccountRecord = {
        id: `bank-${activeJurisdiction.toLowerCase()}-${Date.now()}`,
        userId: 'usr_8f4a1c90',
        jurisdiction: activeJurisdiction,
        bankName: newBankForm.bank_name || `${config.name} Partner Bank`,
        accountIdentifier: `•••• ${String(newBankForm.account_number || '8839').slice(-4)}`,
        details: newBankForm,
        isPrimary: bankAccounts.filter(b => b.jurisdiction === activeJurisdiction).length === 0,
        status: 'verified',
        verifiedAt: new Date().toISOString().split('T')[0]
      };

      setBankAccounts(prev => [...prev, newAcc]);
      setPennyDropRunning(false);
      setIsAddingBank(false);
      setNewBankForm({});
    }, 1000);
  };

  // Create Fixed Deposit Submit
  const handleCreateFD = () => {
    const rawPrincipal = parseFloat(fdPrincipalInput) || 1000;
    const minorPrincipal = activeJurisdiction === 'JP' ? rawPrincipal : rawPrincipal * 100;

    if (balances[activeJurisdiction] < minorPrincipal) {
      alert(`Insufficient balance in ${config.currency} operational wallet!`);
      return;
    }

    const { interest } = calculateCompoundInterest(rawPrincipal, config.fdTypicalRate, fdTenureInput);
    const minorInterest = activeJurisdiction === 'JP' ? interest : interest * 100;

    const startDate = new Date();
    const matDate = new Date();
    matDate.setMonth(matDate.getMonth() + fdTenureInput);

    const newFD: FixedDepositRecord = {
      id: `fd-${activeJurisdiction.toLowerCase()}-${Date.now()}`,
      userId: 'usr_8f4a1c90',
      jurisdiction: activeJurisdiction,
      accountNumber: `FD-${activeJurisdiction}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      principalAmountMinor: minorPrincipal,
      interestRateApy: config.fdTypicalRate,
      tenureMonths: fdTenureInput,
      compoundingFrequency: 'quarterly',
      startedAt: startDate.toISOString().split('T')[0],
      maturityDate: matDate.toISOString().split('T')[0],
      projectedInterestMinor: minorInterest,
      status: 'active',
      autoRollover: true,
      linkedBankAccountId: bankAccounts.find(b => b.jurisdiction === activeJurisdiction)?.id || ''
    };

    // Deduct from operational wallet & add to FDs
    setBalances(prev => ({
      ...prev,
      [activeJurisdiction]: prev[activeJurisdiction] - minorPrincipal
    }));
    setFixedDeposits(prev => [newFD, ...prev]);
    setIsCreatingFD(false);
  };

  // Liquidate FD Early
  const handleLiquidateFD = (fdId: string) => {
    const fd = fixedDeposits.find(f => f.id === fdId);
    if (!fd) return;

    // Premature withdrawal penalty: return principal + 50% accrued interest
    const returnAmount = fd.principalAmountMinor + Math.round(fd.projectedInterestMinor * 0.35);

    setBalances(prev => ({
      ...prev,
      [fd.jurisdiction]: prev[fd.jurisdiction] + returnAmount
    }));

    setFixedDeposits(prev => prev.map(f => f.id === fdId ? { ...f, status: 'liquidated' } : f));
  };

  // Add Operational Funds
  const handleAddFunds = () => {
    const depositAmount = activeJurisdiction === 'JP' ? 500000 : 5000000; // ¥500,000 or 50,000 in currency
    setBalances(prev => ({
      ...prev,
      [activeJurisdiction]: prev[activeJurisdiction] + depositAmount
    }));
  };

  const filteredBanks = bankAccounts.filter(b => b.jurisdiction === activeJurisdiction);
  const filteredFDs = fixedDeposits.filter(f => f.jurisdiction === activeJurisdiction);
  const activeFDsTotal = filteredFDs
    .filter(f => f.status === 'active')
    .reduce((sum, f) => sum + f.principalAmountMinor, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Multi-Jurisdiction Switcher */}
      <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff6d5a]/15 text-[#ff6d5a] border border-[#ff6d5a]/30">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Global Multi-Jurisdiction Banking Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14151c] text-[#ff6d5a] border border-[#ff6d5a]/30">
                  IN • US • UK • JP
                </span>
              </h2>
              <p className="text-xs text-[#9ea2b8] mt-0.5">
                Compliant KYC (PAN/SSN/NINO/MyNumber), native bank rails, High-Yield Fixed Deposits (FDs), and automated treasury auto-sweep.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Country Jurisdiction Switcher Buttons */}
        <div className="flex items-center gap-2 bg-[#14151c] p-1.5 rounded-xl border border-[#2c2f3f]">
          {(['IN', 'US', 'UK', 'JP'] as JurisdictionCode[]).map((code) => {
            const j = JURISDICTIONS[code];
            const isSelected = activeJurisdiction === code;
            return (
              <button
                key={code}
                onClick={() => setActiveJurisdiction(code)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#ff6d5a] text-white shadow-md shadow-[#ff6d5a]/30 scale-105'
                    : 'text-[#9ea2b8] hover:text-white hover:bg-[#20222e]'
                }`}
              >
                <span className="text-base leading-none">{j.flag}</span>
                <span>{j.name}</span>
                <span className="text-[10px] font-mono opacity-80">({j.currency})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Jurisdiction Financial Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Operational Wallet Card */}
        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#9ea2b8] text-xs">
            <span className="font-semibold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#ff6d5a]" />
              Operational Balance
            </span>
            <span className="text-[10px] font-mono uppercase text-[#676a82]">{config.currency}</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {formatMoney(balances[activeJurisdiction], activeJurisdiction)}
          </div>
          <button
            onClick={handleAddFunds}
            className="w-full mt-2 py-1.5 bg-[#14151c] hover:bg-[#242735] text-[#ff6d5a] hover:text-white border border-[#2c2f3f] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Funds ({config.instantPaymentRail.split(' ')[0]})</span>
          </button>
        </div>

        {/* Fixed Deposits (FD) Active Portfolio */}
        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-2">
          <div className="flex items-center justify-between text-[#9ea2b8] text-xs">
            <span className="font-semibold flex items-center gap-1.5 text-purple-400">
              <TrendingUp className="w-4 h-4" />
              Active {config.fdName.split(' ')[0]}s
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{config.fdTypicalRate}% APY</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {formatMoney(activeFDsTotal, activeJurisdiction)}
          </div>
          <div className="text-[10px] text-[#676a82] flex items-center justify-between pt-1">
            <span>{filteredFDs.filter(f => f.status === 'active').length} Active Contracts</span>
            <span className="text-purple-400 font-medium">Compound Yield</span>
          </div>
        </div>

        {/* Verified Bank Accounts */}
        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-2">
          <div className="flex items-center justify-between text-[#9ea2b8] text-xs">
            <span className="font-semibold flex items-center gap-1.5 text-cyan-400">
              <Building2 className="w-4 h-4" />
              Linked Bank Rails
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Penny-Drop Ready</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {filteredBanks.length} Verified
          </div>
          <div className="text-[10px] text-[#676a82] flex items-center justify-between pt-1">
            <span className="truncate">{config.instantPaymentRail}</span>
          </div>
        </div>

        {/* Auto-Sweep Treasury Rule */}
        <div className="p-4 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-2">
          <div className="flex items-center justify-between text-[#9ea2b8] text-xs">
            <span className="font-semibold flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4" />
              Auto-Sweep Rule
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              sweepEnabled[activeJurisdiction] ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-[#14151c] text-[#676a82]'
            }`}>
              {sweepEnabled[activeJurisdiction] ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <div className="text-xs font-mono text-white pt-1">
            Threshold: <strong className="text-amber-300">{config.currencySymbol}{sweepThresholds[activeJurisdiction].toLocaleString()}</strong>
          </div>
          <p className="text-[10px] text-[#676a82] line-clamp-1">
            Excess cash automatically deposited into {config.fdTypicalRate}% FD
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-[#14151c] p-1.5 rounded-xl border border-[#2c2f3f] overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'kyc' ? 'bg-[#ff6d5a] text-white shadow-md shadow-[#ff6d5a]/20' : 'text-[#9ea2b8] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>1. {config.name} KYC Verification</span>
        </button>
        <button
          onClick={() => setActiveTab('banks')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'banks' ? 'bg-[#ff6d5a] text-white shadow-md shadow-[#ff6d5a]/20' : 'text-[#9ea2b8] hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Bank Accounts & Rails ({filteredBanks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('fds')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'fds' ? 'bg-[#ff6d5a] text-white shadow-md shadow-[#ff6d5a]/20' : 'text-[#9ea2b8] hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>3. Fixed Deposits ({config.fdName.split(' ')[0]}) ({filteredFDs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sweep')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'sweep' ? 'bg-[#ff6d5a] text-white shadow-md shadow-[#ff6d5a]/20' : 'text-[#9ea2b8] hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>4. Automated Treasury Auto-Sweep</span>
        </button>
      </div>

      {/* Tab 1: KYC Compliance & Document Verification */}
      {activeTab === 'kyc' && (
        <div className="bg-[#1c1e29] p-6 rounded-2xl border border-[#2c2f3f] space-y-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2c2f3f] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-xl">{config.flag}</span>
                <span>{config.name} Regulatory KYC & Tax Identity</span>
              </h3>
              <p className="text-xs text-[#9ea2b8] mt-0.5">
                Real-time government registry validation, regex checksum verification, and AES-256 encrypted tokenization.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              KYC Level 2 Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {config.kycDocTypes.map((doc) => {
              const isVerified = verifiedDocs[doc.id];
              const isVerifying = verifyingDocId === doc.id;
              const val = docInputValues[doc.id] || '';

              return (
                <div key={doc.id} className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white block">
                        {doc.label}
                      </label>
                      {isVerified ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          PENDING
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#676a82] leading-tight">{doc.formatDesc}</p>

                    <input
                      type="text"
                      value={val}
                      onChange={(e) => setDocInputValues(prev => ({ ...prev, [doc.id]: e.target.value }))}
                      placeholder={doc.placeholder}
                      className="w-full bg-[#1c1e29] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                    />

                    {/* Checksum Validation Indicator */}
                    <div className="text-[10px] font-mono text-[#676a82] flex items-center justify-between pt-1">
                      <span>Regex Pattern: <code className="text-[#9ea2b8]">{doc.regex.slice(0, 15)}...</code></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVerifyDoc(doc.id, doc.regex)}
                    disabled={isVerifying}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isVerified
                        ? 'bg-[#1c1e29] hover:bg-[#282b3a] text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#ff6d5a] hover:bg-[#ff5740] text-white'
                    }`}
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isVerified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>{isVerifying ? 'Verifying with Registry...' : isVerified ? 'Re-verify Document' : 'Verify Document'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Special Multi-Jurisdiction Identity Rules Note */}
          <div className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-xs text-[#9ea2b8] flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#ff6d5a] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold">Single Unified Identity Invariant: </strong>
              Regardless of jurisdiction ({config.code}), all verified credentials (PAN, SSN, NINO, My Number) link to the user's root <code className="text-[#ff6d5a]">users(id)</code>. This allows seamless cross-border multi-currency transactions, unified double-entry ledger journals, and automated tax reporting.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bank Accounts & Instant Rails */}
      {activeTab === 'banks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#1c1e29] p-4 rounded-xl border border-[#2c2f3f]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#ff6d5a]" />
                <span>{config.name} Bank Accounts & Settlement Rails</span>
              </h3>
              <p className="text-xs text-[#9ea2b8]">
                Linked commercial accounts with automated Penny Drop verification and instant payout support ({config.instantPaymentRail}).
              </p>
            </div>

            <button
              onClick={() => setIsAddingBank(true)}
              className="px-3 py-1.5 bg-[#ff6d5a] hover:bg-[#ff5740] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ff6d5a]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add {config.name} Bank</span>
            </button>
          </div>

          {/* List of Verified Banks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBanks.map((b) => (
              <div key={b.id} className="p-5 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] space-y-3 relative group hover:border-[#ff6d5a]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#14151c] text-[#ff6d5a] border border-[#2c2f3f]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{b.bankName}</h4>
                      <p className="text-xs font-mono text-[#9ea2b8]">{b.accountIdentifier}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.isPrimary && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff6d5a]/15 text-[#ff6d5a] border border-[#ff6d5a]/30 font-semibold">
                        PRIMARY
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="p-3 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-xs font-mono space-y-1.5 text-[#9ea2b8]">
                  {Object.entries(b.details).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-[#676a82] capitalize">{k.replace('_', ' ')}:</span>
                      <span className="text-white font-semibold truncate max-w-[220px]">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#676a82] pt-1">
                  <span>Penny Drop Match: 100% Legal Name Title</span>
                  <span className="text-emerald-400 font-mono">{config.instantPaymentRail.split(' ')[0]} Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Bank Modal / Form */}
          {isAddingBank && (
            <div className="p-5 bg-[#1c1e29] rounded-2xl border border-[#ff6d5a]/50 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#ff6d5a]" />
                  Add New {config.name} Bank Account ({config.currency})
                </h4>
                <button onClick={() => setIsAddingBank(false)} className="text-xs text-[#9ea2b8] hover:text-white">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddBankAccount} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {config.bankAccountFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-xs font-semibold text-white block">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={field.placeholder}
                        value={newBankForm[field.id] || ''}
                        onChange={(e) => setNewBankForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                      />
                      <span className="text-[10px] text-[#676a82]">{field.helpText}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-[#9ea2b8] flex items-center gap-2 font-mono">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Penny drop ({config.currencySymbol}1.00) will be initiated to verify account holder name</span>
                  </div>

                  <button
                    type="submit"
                    disabled={pennyDropRunning}
                    className="px-5 py-2 bg-[#ff6d5a] hover:bg-[#ff5740] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    {pennyDropRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{pennyDropRunning ? 'Running Penny Drop...' : 'Verify & Link Bank'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Fixed Deposits (FDs / CDs / Teiki Yokin) */}
      {activeTab === 'fds' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {config.name} {config.fdName} Portfolio
                </h3>
              </div>
              <p className="text-xs text-[#9ea2b8] mt-0.5">
                Earn up to <strong className="text-emerald-400">{config.fdTypicalRate}% APY</strong> with quarterly compound interest and guaranteed principal protection.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingFD(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-[#ff6d5a] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New {config.fdName.split(' ')[0]}</span>
            </button>
          </div>

          {/* Create FD Modal / Drawer Form */}
          {isCreatingFD && (
            <div className="p-6 bg-[#1c1e29] rounded-2xl border border-purple-500/50 space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  New {config.name} {config.fdName} Application
                </h4>
                <button onClick={() => setIsCreatingFD(false)} className="text-xs text-[#9ea2b8] hover:text-white">
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Principal input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Deposit Principal ({config.currency})</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono text-[#9ea2b8]">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={fdPrincipalInput}
                      onChange={(e) => setFdPrincipalInput(e.target.value)}
                      className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-purple-400 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-[#676a82]">Available: {formatMoney(balances[activeJurisdiction], activeJurisdiction)}</span>
                </div>

                {/* Tenure Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Tenure / Duration</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {config.fdTenuresMonths.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFdTenureInput(m)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                          fdTenureInput === m
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-[#14151c] text-[#9ea2b8] hover:text-white border border-[#2c2f3f]'
                        }`}
                      >
                        {m >= 12 ? `${m / 12} Year${m > 12 ? 's' : ''}` : `${m} Months`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Projected Return Summary */}
                {(() => {
                  const p = parseFloat(fdPrincipalInput) || 0;
                  const { maturity, interest } = calculateCompoundInterest(p, config.fdTypicalRate, fdTenureInput);
                  return (
                    <div className="p-3.5 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-1 text-xs font-mono">
                      <div className="text-[#676a82]">Maturity Calculation:</div>
                      <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                        <span>Maturity Value:</span>
                        <span>{config.currencySymbol}{maturity.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#9ea2b8]">
                        <span>Interest Earned:</span>
                        <span className="text-purple-400">+{config.currencySymbol}{interest.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-[#676a82] pt-1">
                        Compounding: Quarterly at {config.fdTypicalRate}% p.a.
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#2c2f3f]">
                <div className="text-xs text-[#9ea2b8]">
                  Automated double-entry ledger entry will post debits to Operational Clearing and credits to Term Deposit Asset.
                </div>
                <button
                  onClick={handleCreateFD}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                >
                  Confirm & Lock {config.fdName.split(' ')[0]}
                </button>
              </div>
            </div>
          )}

          {/* Active FDs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFDs.map((fd) => {
              const isLiquidated = fd.status === 'liquidated';
              return (
                <div 
                  key={fd.id} 
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isLiquidated
                      ? 'bg-[#14151c] border-[#2c2f3f] opacity-60'
                      : 'bg-[#1c1e29] border-[#2c2f3f] hover:border-purple-400/40 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-white">{fd.accountNumber}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isLiquidated ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isLiquidated ? 'LIQUIDATED' : 'ACTIVE & EARNING'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9ea2b8] mt-0.5">
                        Inception: {fd.startedAt} • Maturity: <strong className="text-white">{fd.maturityDate}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-purple-400 font-mono">{fd.interestRateApy}% APY</div>
                      <div className="text-[10px] text-[#676a82] capitalize">{fd.compoundingFrequency} Comp.</div>
                    </div>
                  </div>

                  {/* Financial Values Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-[#676a82]">Principal Deposit:</div>
                      <div className="text-sm font-bold text-white">{formatMoney(fd.principalAmountMinor, fd.jurisdiction)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#676a82]">Projected Interest:</div>
                      <div className="text-sm font-bold text-emerald-400">+{formatMoney(fd.projectedInterestMinor, fd.jurisdiction)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isLiquidated && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-[#9ea2b8] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Auto-Rollover on Maturity: {fd.autoRollover ? 'Enabled' : 'Disabled'}</span>
                      </div>

                      <button
                        onClick={() => handleLiquidateFD(fd.id)}
                        className="px-3 py-1 bg-[#14151c] hover:bg-rose-950/40 text-rose-400 border border-[#2c2f3f] hover:border-rose-500/40 rounded-lg text-xs font-semibold transition-colors"
                        title="Premature liquidation with standard penalty"
                      >
                        Premature Liquidation
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFDs.length === 0 && (
              <div className="col-span-2 p-8 bg-[#1c1e29] rounded-2xl border border-[#2c2f3f] text-center space-y-3">
                <div className="p-3 rounded-2xl bg-[#14151c] w-fit mx-auto text-[#676a82]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">No active {config.name} {config.fdName.split(' ')[0]}s yet</h4>
                <p className="text-xs text-[#9ea2b8] max-w-md mx-auto">
                  Deposit idle operational funds into a high-yield term deposit earning {config.fdTypicalRate}% APY or configure automated treasury auto-sweep.
                </p>
                <button
                  onClick={() => setIsCreatingFD(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Create First {config.fdName.split(' ')[0]}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Automated Treasury Auto-Sweep Engine */}
      {activeTab === 'sweep' && (
        <div className="bg-[#1c1e29] p-6 rounded-2xl border border-[#2c2f3f] space-y-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2c2f3f] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {config.name} Automated Treasury Auto-Sweep Policy
                </h3>
              </div>
              <p className="text-xs text-[#9ea2b8] mt-0.5">
                Automatically sweep idle operational liquidity into high-yield {config.fdName} when balance breaches operating ceiling.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#14151c] p-1.5 rounded-xl border border-[#2c2f3f]">
              <span className="text-xs font-semibold text-[#9ea2b8] px-2">Sweep Engine:</span>
              <button
                onClick={() => setSweepEnabled(prev => ({ ...prev, [activeJurisdiction]: !prev[activeJurisdiction] }))}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sweepEnabled[activeJurisdiction]
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-[#20222e] text-[#676a82]'
                }`}
              >
                {sweepEnabled[activeJurisdiction] ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#676a82]">
                Sweep Execution Parameters
              </h4>

              <div className="space-y-3">
                <div className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Operating Cash Ceiling (Threshold)</span>
                    <span className="text-[#ff6d5a] font-mono">{config.currencySymbol}{sweepThresholds[activeJurisdiction].toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={activeJurisdiction === 'JP' ? 100000 : 5000}
                    max={activeJurisdiction === 'JP' ? 10000000 : 500000}
                    step={activeJurisdiction === 'JP' ? 100000 : 5000}
                    value={sweepThresholds[activeJurisdiction]}
                    onChange={(e) => setSweepThresholds(prev => ({ ...prev, [activeJurisdiction]: Number(e.target.value) }))}
                    className="w-full accent-[#ff6d5a]"
                  />
                  <p className="text-[11px] text-[#676a82]">
                    Any balance exceeding this threshold at 23:59 UTC is automatically swept into a 12-month {config.fdName.split(' ')[0]}.
                  </p>
                </div>

                <div className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Reverse Liquidity (Auto-Break FD on Payout Deficit)</span>
                    <span className="text-emerald-400 font-mono">ENABLED</span>
                  </div>
                  <p className="text-[11px] text-[#676a82]">
                    If a workflow invoice payout or vendor charge exceeds operational balance, the newest FD will automatically break without manual intervention.
                  </p>
                </div>
              </div>
            </div>

            {/* Sweep Logic Flow Visualizer */}
            <div className="p-4 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-3 text-xs font-mono">
              <div className="text-[#676a82] uppercase tracking-wider text-[11px]">Workflow Trigger DAG Mapping:</div>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#1c1e29] rounded-lg border border-[#2c2f3f] text-cyan-300 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Daily Cron Trigger (23:59 UTC)</span>
                </div>
                <div className="p-2.5 bg-[#1c1e29] rounded-lg border border-[#2c2f3f] text-white flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-[#ff6d5a]" />
                  <span>2. IF Balance ({formatMoney(balances[activeJurisdiction], activeJurisdiction)}) &gt; Threshold ({config.currencySymbol}{sweepThresholds[activeJurisdiction].toLocaleString()})</span>
                </div>
                <div className="p-2.5 bg-[#1c1e29] rounded-lg border border-[#2c2f3f] text-purple-300 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Create {config.name} {config.fdName.split(' ')[0]} with excess funds at {config.fdTypicalRate}% APY</span>
                </div>
                <div className="p-2.5 bg-[#1c1e29] rounded-lg border border-[#2c2f3f] text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Post Balanced Double-Entry Journal Entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
