export interface LinkedBankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscOrRouting: string;
  accountType: 'Savings' | 'Current / Operating' | 'Checking' | 'Business Escrow';
  pennyDropStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  isPrimary: boolean;
  balanceFormatted: string;
  currency: string;
}

export interface FlowNode {
  id: string;
  name: string;
  type: string;
  category: 'banking' | 'investments' | 'demat' | 'treasury' | 'payout';
  icon: string;
  color: string;
  subtitle: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  sampleInput: Record<string, any>;
  sampleOutput: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export const AVAILABLE_NODE_TEMPLATES = [
  {
    type: 'unifi.identityMaster',
    name: 'Customer KYC Identity (Name & ID)',
    category: 'banking',
    icon: 'user-check',
    color: '#06b6d4',
    description: 'Registers verified Customer Legal Name and National ID Number (PAN/SSN/NINO/MyNumber) with biometric KYC verification.'
  },
  {
    type: 'unifi.bankAccountNode',
    name: 'Linked Bank Account (Penny Drop)',
    category: 'banking',
    icon: 'building-2',
    color: '#3b82f6',
    description: 'Binds a specific verified bank account (A/C No, IFSC/Routing) linked directly to the customer identity.'
  },
  {
    type: 'unifi.identityLinkedBanks',
    name: 'Identity & Multi-Bank Aggregator',
    category: 'banking',
    icon: 'user-check',
    color: '#06b6d4',
    description: 'All-in-one container displaying Customer Name, ID Number, and all linked bank accounts in a single consolidated node.'
  },
  {
    type: 'unifi.autoSweep',
    name: 'Treasury Auto-Sweep Rule',
    category: 'treasury',
    icon: 'arrow-down-left',
    color: '#ec4899',
    description: 'Automatically sweep idle operating cash exceeding threshold into high-yield FDs with auto-break reverse liquidity.'
  },
  {
    type: 'unifi.fixedDepositCreate',
    name: 'High-Yield Fixed Deposit (FD / CD)',
    category: 'investments',
    icon: 'trending-up',
    color: '#a855f7',
    description: 'Lock funds into quarterly compounding term deposits at 7.25% (INR), 5.15% (USD), 4.85% (GBP), or 0.95% (JPY).'
  },
  {
    type: 'unifi.mutualFundSip',
    name: 'Mutual Fund SIP & Lumpsum',
    category: 'investments',
    icon: 'pie-chart',
    color: '#10b981',
    description: 'Automate monthly Systematic Investment Plan (SIP) or direct lumpsum into top rated Index and Equity mutual funds.'
  },
  {
    type: 'unifi.dematStockTrade',
    name: 'Demat Account & Equity Execution',
    category: 'demat',
    icon: 'bar-chart-3',
    color: '#f59e0b',
    description: 'Execute equity stock purchases or rebalancing through CDSL, NSDL, DTC, CREST, or JASDEC depository holdings.'
  },
  {
    type: 'unifi.instantPayout',
    name: 'Instant Rail Payout',
    category: 'payout',
    icon: 'arrow-up-right',
    color: '#ff6d5a',
    description: 'Dispatch real-time zero-delay settlements over UPI 2.0, FedNow/RTP, Faster Payments (FPS), or Zengin.'
  }
];

export const DEFAULT_FLOW_NODES: FlowNode[] = [
  {
    id: 'node-identity',
    name: 'Customer KYC Identity',
    type: 'unifi.identityMaster',
    category: 'banking',
    icon: 'user-check',
    color: '#06b6d4',
    subtitle: 'Name & ID Master Node',
    position: { x: 30, y: 140 },
    parameters: {
      customerLegalName: 'Alex Rivera',
      governmentIdType: 'PAN (Permanent Account Number)',
      governmentIdNumber: 'ABCDE1234F',
      jurisdiction: 'IN',
      kycVerificationLevel: 'Level 3 (CKYC Confirmed)',
      linkedAccountsCount: 2
    },
    sampleInput: {
      lookup_customer_id: 'usr_in_94821',
      request_source: 'UNIFIED_FINANCIAL_STUDIO'
    },
    sampleOutput: {
      name: 'Alex Rivera',
      id_type: 'PAN',
      id_number: 'ABCDE1234F',
      kyc_status: 'VERIFIED',
      linked_bank_accounts_count: 2
    }
  },
  {
    id: 'node-bank-1',
    name: 'Bank Account 1: HDFC Bank',
    type: 'unifi.bankAccountNode',
    category: 'banking',
    icon: 'building-2',
    color: '#3b82f6',
    subtitle: 'Primary • ₹1,50,000.00',
    position: { x: 360, y: 50 },
    parameters: {
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50100294829103',
      ifscOrRouting: 'HDFC0000240',
      accountType: 'Savings / Primary',
      pennyDropStatus: 'VERIFIED',
      balanceFormatted: '₹1,50,000.00',
      isPrimary: true
    },
    sampleInput: {
      customer_id: 'ABCDE1234F',
      account_number: '50100294829103'
    },
    sampleOutput: {
      bank_name: 'HDFC Bank Ltd',
      penny_drop_status: 'SUCCESS',
      available_balance_minor: 15000000
    }
  },
  {
    id: 'node-bank-2',
    name: 'Bank Account 2: ICICI Bank',
    type: 'unifi.bankAccountNode',
    category: 'banking',
    icon: 'building-2',
    color: '#3b82f6',
    subtitle: 'Secondary • ₹45,200.00',
    position: { x: 360, y: 240 },
    parameters: {
      bankName: 'ICICI Bank Ltd',
      accountNumber: '001205019284',
      ifscOrRouting: 'ICIC0000012',
      accountType: 'Current / Operating',
      pennyDropStatus: 'VERIFIED',
      balanceFormatted: '₹45,200.00',
      isPrimary: false
    },
    sampleInput: {
      customer_id: 'ABCDE1234F',
      account_number: '001205019284'
    },
    sampleOutput: {
      bank_name: 'ICICI Bank Ltd',
      penny_drop_status: 'SUCCESS',
      available_balance_minor: 4520000
    }
  },
  {
    id: 'node-sweep',
    name: 'Treasury Auto-Sweep Rule',
    type: 'unifi.autoSweep',
    category: 'treasury',
    icon: 'arrow-down-left',
    color: '#ec4899',
    subtitle: 'Operating Cash > Threshold',
    position: { x: 700, y: 50 },
    parameters: {
      sourceBankAccountId: '50100294829103 (HDFC Bank)',
      thresholdAmount: '₹50,000.00',
      sweepAllocation: '60% FD, 40% Mutual Fund',
      autoBreakOnPayout: true
    },
    sampleInput: {
      source_account: '50100294829103',
      current_operating_balance: 15000000,
      threshold_minor: 5000000
    },
    sampleOutput: {
      excess_cash_swept_minor: 10000000,
      sweep_target: 'SPLIT_FD_AND_MF'
    }
  },
  {
    id: 'node-fd',
    name: 'High-Yield Fixed Deposit',
    type: 'unifi.fixedDepositCreate',
    category: 'investments',
    icon: 'trending-up',
    color: '#a855f7',
    subtitle: '7.25% APY Compounding',
    position: { x: 1040, y: 10 },
    parameters: {
      linkedBankAccountId: '50100294829103',
      tenureMonths: 12,
      interestRateApy: 7.25,
      compoundingFrequency: 'quarterly',
      autoRollover: true
    },
    sampleInput: {
      allocated_principal_minor: 6000000
    },
    sampleOutput: {
      fd_account_id: 'FD-IN-2026-84920',
      projected_interest_minor: 446700,
      maturity_date: '2027-09-23'
    }
  },
  {
    id: 'node-sip',
    name: 'Mutual Fund Monthly SIP',
    type: 'unifi.mutualFundSip',
    category: 'investments',
    icon: 'pie-chart',
    color: '#10b981',
    subtitle: 'Parag Parikh Flexi Cap',
    position: { x: 1040, y: 160 },
    parameters: {
      linkedBankMandate: '50100294829103 (HDFC eNACH)',
      fundId: 'mf-in-01',
      fundName: 'Parag Parikh Flexi Cap Direct Growth',
      monthlySipMinor: 4000000,
      executionDay: 5
    },
    sampleInput: {
      allocated_sip_amount_minor: 4000000
    },
    sampleOutput: {
      sip_registration_id: 'SIP-PPFAS-9921',
      allotted_units: 485.14,
      status: 'ACTIVE'
    }
  },
  {
    id: 'node-demat',
    name: 'Demat & Equity Portfolio',
    type: 'unifi.dematStockTrade',
    category: 'demat',
    icon: 'bar-chart-3',
    color: '#f59e0b',
    subtitle: 'CDSL / NSDL Holdings',
    position: { x: 1380, y: 160 },
    parameters: {
      dematAccountNumber: '1208160012345678',
      depository: 'CDSL',
      linkedBankTradingCash: 'HDFC Bank Ltd (50100294829103)',
      rebalanceFrequency: 'monthly',
      bluechipAllocation: '70%'
    },
    sampleInput: {
      portfolio_sync: true,
      demat_account: '1208160012345678'
    },
    sampleOutput: {
      demat_status: 'ACTIVE_VERIFIED',
      holdings_count: 3,
      total_portfolio_value_minor: 35925000
    }
  }
];

export const DEFAULT_FLOW_EDGES: FlowEdge[] = [
  // Identity (Name & ID) branching directly into the 2 linked bank accounts:
  { id: 'e-id-bank1', source: 'node-identity', target: 'node-bank-1', animated: true },
  { id: 'e-id-bank2', source: 'node-identity', target: 'node-bank-2', animated: true },
  // Primary Bank account flows into Treasury Auto-Sweep:
  { id: 'e-bank1-sweep', source: 'node-bank-1', target: 'node-sweep', animated: true },
  // Auto-Sweep splits into Fixed Deposit and Mutual Fund SIP:
  { id: 'e-sweep-fd', source: 'node-sweep', target: 'node-fd', animated: true },
  { id: 'e-sweep-sip', source: 'node-sweep', target: 'node-sip', animated: true },
  // Mutual Fund & Demat synergy:
  { id: 'e-sip-demat', source: 'node-sip', target: 'node-demat', animated: true }
];
