export type JurisdictionCode = 'IN' | 'US' | 'UK' | 'JP';

export interface JurisdictionConfig {
  code: JurisdictionCode;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  kycDocTypes: {
    id: string;
    label: string;
    placeholder: string;
    formatDesc: string;
    regex: string;
    example: string;
  }[];
  bankAccountFields: {
    id: string;
    label: string;
    placeholder: string;
    type: string;
    helpText: string;
  }[];
  instantPaymentRail: string;
  fdName: string;
  fdTypicalRate: number; // in %
  fdTenuresMonths: number[];
  sweepThresholdMinor: number;
  depositoryName: string;
  defaultBroker: string;
}

export const JURISDICTIONS: Record<JurisdictionCode, JurisdictionConfig> = {
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
    kycDocTypes: [
      {
        id: 'pan',
        label: 'PAN Card (Permanent Account Number)',
        placeholder: 'ABCDE1234F',
        formatDesc: '5 letters + 4 digits + 1 letter (4th letter P=Individual, C=Company)',
        regex: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
        example: 'ABCDE1234F'
      },
      {
        id: 'aadhaar_masked',
        label: 'Aadhaar (Masked VID)',
        placeholder: 'XXXX-XXXX-9482',
        formatDesc: '12-digit UIDAI standard or 16-digit Virtual ID',
        regex: '^X{4}-X{4}-[0-9]{4}$|^[0-9]{12}$',
        example: 'XXXX-XXXX-9482'
      },
      {
        id: 'gstin',
        label: 'GSTIN (Business Tax ID)',
        placeholder: '29ABCDE1234F1Z5',
        formatDesc: '2 digit state code + 10 char PAN + 1 entity + Z + 1 checksum',
        regex: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
        example: '29ABCDE1234F1Z5'
      }
    ],
    bankAccountFields: [
      { id: 'bank_name', label: 'Bank Name', placeholder: 'HDFC Bank / ICICI / SBI', type: 'text', helpText: 'Scheduled commercial bank' },
      { id: 'account_number', label: 'Account Number', placeholder: '50100294829103', type: 'text', helpText: '9 to 18 digits standard NRE/NRO/Savings' },
      { id: 'ifsc_code', label: 'IFSC Code', placeholder: 'HDFC0000240', type: 'text', helpText: '11 characters (4 alphabetic + 0 + 6 alphanumeric)' },
      { id: 'upi_vpa', label: 'UPI VPA Handle', placeholder: 'alex.rivera@okhdfcbank', type: 'text', helpText: 'Instant 24x7 NPCI payment address' },
      { id: 'beneficiary_name', label: 'Beneficiary Legal Name', placeholder: 'Alex Rivera Pvt Ltd', type: 'text', helpText: 'Must match PAN legal title' }
    ],
    instantPaymentRail: 'UPI / IMPS 2.0 (NPCI)',
    fdName: 'Fixed Deposit (FD)',
    fdTypicalRate: 7.25,
    fdTenuresMonths: [3, 6, 12, 24, 36, 60],
    sweepThresholdMinor: 5000000, // ₹50,000.00
    depositoryName: 'CDSL / NSDL',
    defaultBroker: 'Zerodha Broking Ltd'
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    kycDocTypes: [
      {
        id: 'ssn',
        label: 'SSN (Social Security Number)',
        placeholder: 'XXX-XX-8492',
        formatDesc: '9-digit US taxpayer identification (enc at rest)',
        regex: '^(XXX-XX-[0-9]{4}|[0-9]{3}-[0-9]{2}-[0-9]{4})$',
        example: 'XXX-XX-8492'
      },
      {
        id: 'ein',
        label: 'EIN (Federal Employer ID)',
        placeholder: '12-3456789',
        formatDesc: '9-digit corporate tax ID issued by IRS',
        regex: '^[0-9]{2}-[0-9]{7}$',
        example: '12-3456789'
      },
      {
        id: 'state_id',
        label: "Driver's License / State ID",
        placeholder: 'D19284920',
        formatDesc: 'State issued Real-ID compliant credential',
        regex: '^[A-Z0-9]{6,12}$',
        example: 'D19284920'
      }
    ],
    bankAccountFields: [
      { id: 'bank_name', label: 'Bank Name', placeholder: 'JPMorgan Chase / Silicon Valley Bank', type: 'text', helpText: 'FDIC Insured Depository' },
      { id: 'routing_number', label: 'ACH / ABA Routing Number', placeholder: '021000021', type: 'text', helpText: '9-digit Federal Reserve transit code' },
      { id: 'account_number', label: 'Checking / Savings Account', placeholder: '9284019284', type: 'text', helpText: '4 to 17 digits account number' },
      { id: 'account_type', label: 'Account Type', placeholder: 'CHECKING', type: 'select', helpText: 'Checking or Savings' },
      { id: 'beneficiary_name', label: 'Account Holder Name', placeholder: 'Alex Rivera LLC', type: 'text', helpText: 'Must match W-9 entity title' }
    ],
    instantPaymentRail: 'FedNow / RTP (The Clearing House)',
    fdName: 'Certificate of Deposit (CD) & Treasury',
    fdTypicalRate: 5.15,
    fdTenuresMonths: [3, 6, 12, 24, 60],
    sweepThresholdMinor: 1000000, // $10,000.00
    depositoryName: 'DTC (Depository Trust Company)',
    defaultBroker: 'Interactive Brokers LLC'
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    kycDocTypes: [
      {
        id: 'nino',
        label: 'National Insurance Number (NINO)',
        placeholder: 'QQ 12 34 56 A',
        formatDesc: '2 prefix letters + 6 numbers + 1 suffix letter (A-D)',
        regex: '^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]{1}$|^[A-CEGHJ-PR-TW-Z]{2}\\s[0-9]{2}\\s[0-9]{2}\\s[0-9]{2}\\s[A-D]{1}$',
        example: 'QQ 12 34 56 A'
      },
      {
        id: 'crn',
        label: 'Companies House CRN',
        placeholder: '08492019',
        formatDesc: '8 digits or 2 letters + 6 digits registered entity',
        regex: '^[0-9]{8}$|^[A-Z]{2}[0-9]{6}$',
        example: '08492019'
      },
      {
        id: 'passport',
        label: 'UK Passport Number',
        placeholder: '529402910',
        formatDesc: '9-digit HM Passport Office biometric document',
        regex: '^[0-9]{9}$',
        example: '529402910'
      }
    ],
    bankAccountFields: [
      { id: 'bank_name', label: 'Bank Name', placeholder: 'Barclays / HSBC / Revolut Business', type: 'text', helpText: 'PRA/FCA Authorized Bank' },
      { id: 'sort_code', label: 'Sort Code', placeholder: '20-00-00', type: 'text', helpText: '6-digit UK bank branch identifier' },
      { id: 'account_number', label: 'Account Number', placeholder: '12345678', type: 'text', helpText: '8-digit UK standard account number' },
      { id: 'iban', label: 'IBAN (Optional)', placeholder: 'GB29BARC20000012345678', type: 'text', helpText: 'International Bank Account Number' },
      { id: 'beneficiary_name', label: 'Payee Legal Name', placeholder: 'Alex Rivera Ltd', type: 'text', helpText: 'Confirmation of Payee (CoP) verified' }
    ],
    instantPaymentRail: 'Faster Payments Service (FPS) / Open Banking',
    fdName: 'Fixed Term Deposit / Bond (AER)',
    fdTypicalRate: 4.85,
    fdTenuresMonths: [6, 12, 24, 36],
    sweepThresholdMinor: 800000, // £8,000.00
    depositoryName: 'Euroclear UK & International (CREST)',
    defaultBroker: 'Hargreaves Lansdown'
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    flag: '🇯🇵',
    kycDocTypes: [
      {
        id: 'mynumber',
        label: 'My Number Card (個人番号)',
        placeholder: '1234 5678 9012',
        formatDesc: '12-digit Individual Social Security & Tax Number with Luhn check',
        regex: '^[0-9]{4}\\s?[0-9]{4}\\s?[0-9]{4}$',
        example: '1234 5678 9012'
      },
      {
        id: 'corporate_num',
        label: 'Corporate Number (法人番号)',
        placeholder: '1234567890123',
        formatDesc: '13-digit National Tax Agency corporate identification',
        regex: '^[0-9]{13}$',
        example: '1234567890123'
      },
      {
        id: 'driver_license_jp',
        label: 'Driver License (運転免許証)',
        placeholder: '301928492019',
        formatDesc: '12-digit Public Safety Commission issued ID',
        regex: '^[0-9]{12}$',
        example: '301928492019'
      }
    ],
    bankAccountFields: [
      { id: 'bank_name', label: 'Bank Name & Code (金融機関)', placeholder: 'MUFG (0005) / SMBC (0009)', type: 'text', helpText: '4-digit Zengin bank code' },
      { id: 'branch_code', label: 'Branch Code (支店コード)', placeholder: '001 (Main Branch)', type: 'text', helpText: '3-digit bank branch code' },
      { id: 'account_type_jp', label: 'Deposit Type (預金種目)', placeholder: 'Futsu (Ordinary / 普通預金)', type: 'text', helpText: 'Futsu (Ordinary) or Toza (Current)' },
      { id: 'account_number', label: 'Account Number (口座番号)', placeholder: '1234567', type: 'text', helpText: '7-digit Zengin standard account number' },
      { id: 'katakana_name', label: 'Account Name in Katakana (口座名義)', placeholder: 'リベラ アレックス', type: 'text', helpText: 'Full-width or half-width Katakana' }
    ],
    instantPaymentRail: 'Zengin System 24/7 (全銀システム) / Pay-easy',
    fdName: 'Teiki Yokin (定期預金 / Time Deposit)',
    fdTypicalRate: 0.95,
    fdTenuresMonths: [3, 6, 12, 24, 36, 60],
    sweepThresholdMinor: 1000000, // ¥1,000,000 (whole yen)
    depositoryName: 'JASDEC (Japan Securities Depository Center)',
    defaultBroker: 'Rakuten Securities'
  }
};

export interface BankAccountRecord {
  id: string;
  userId: string;
  jurisdiction: JurisdictionCode;
  bankName: string;
  accountIdentifier: string;
  details: Record<string, string>;
  isPrimary: boolean;
  status: 'verified' | 'pending_penny_drop' | 'failed';
  verifiedAt?: string;
}

export interface FixedDepositRecord {
  id: string;
  userId: string;
  jurisdiction: JurisdictionCode;
  accountNumber: string;
  principalAmountMinor: number;
  interestRateApy: number;
  tenureMonths: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'maturity';
  startedAt: string;
  maturityDate: string;
  projectedInterestMinor: number;
  status: 'active' | 'matured' | 'liquidated';
  autoRollover: boolean;
  linkedBankAccountId: string;
}

// ---------------------- MUTUAL FUNDS MODEL ----------------------
export interface MutualFundCatalogItem {
  id: string;
  name: string;
  amc: string;
  category: 'Flexi Cap' | 'Large Cap' | 'Index / ETF' | 'Liquid / Debt' | 'Hybrid';
  jurisdiction: JurisdictionCode;
  nav: number;
  return1Y: number;
  return3Y: number;
  rating: number; // 1-5 stars
  minSipMinor: number;
  minLumpsumMinor: number;
  expenseRatio: number;
  aum: string;
}

export interface UserMutualFundHolding {
  id: string;
  fundId: string;
  userId: string;
  jurisdiction: JurisdictionCode;
  units: number;
  averageNav: number;
  investedAmountMinor: number;
  currentNav: number;
  currentValueMinor: number;
  isSipActive: boolean;
  sipMonthlyAmountMinor: number;
  sipExecutionDay: number;
  totalReturnsMinor: number;
  returnPercentage: number;
}

export const MUTUAL_FUNDS_CATALOG: MutualFundCatalogItem[] = [
  // India (INR)
  {
    id: 'mf-in-01',
    name: 'Parag Parikh Flexi Cap Fund - Direct Growth',
    amc: 'PPFAS Mutual Fund',
    category: 'Flexi Cap',
    jurisdiction: 'IN',
    nav: 82.45,
    return1Y: 28.4,
    return3Y: 21.8,
    rating: 5,
    minSipMinor: 100000, // ₹1,000
    minLumpsumMinor: 500000,
    expenseRatio: 0.62,
    aum: '₹68,450 Cr'
  },
  {
    id: 'mf-in-02',
    name: 'HDFC Nifty 50 Index Fund Direct',
    amc: 'HDFC Asset Management',
    category: 'Index / ETF',
    jurisdiction: 'IN',
    nav: 24.18,
    return1Y: 22.1,
    return3Y: 16.5,
    rating: 5,
    minSipMinor: 50000, // ₹500
    minLumpsumMinor: 100000,
    expenseRatio: 0.20,
    aum: '₹18,920 Cr'
  },
  {
    id: 'mf-in-03',
    name: 'ICICI Prudential Bluechip Fund Direct',
    amc: 'ICICI Prudential AMC',
    category: 'Large Cap',
    jurisdiction: 'IN',
    nav: 114.30,
    return1Y: 24.8,
    return3Y: 18.2,
    rating: 4,
    minSipMinor: 50000,
    minLumpsumMinor: 500000,
    expenseRatio: 0.89,
    aum: '₹55,200 Cr'
  },
  // US (USD)
  {
    id: 'mf-us-01',
    name: 'Vanguard 500 Index Fund Admiral (VFIAX)',
    amc: 'The Vanguard Group',
    category: 'Index / ETF',
    jurisdiction: 'US',
    nav: 512.40,
    return1Y: 25.8,
    return3Y: 14.2,
    rating: 5,
    minSipMinor: 10000, // $100
    minLumpsumMinor: 300000, // $3000
    expenseRatio: 0.04,
    aum: '$1.1 Trillion'
  },
  {
    id: 'mf-us-02',
    name: 'Fidelity Contrafund (FCNTX)',
    amc: 'Fidelity Investments',
    category: 'Large Cap',
    jurisdiction: 'US',
    nav: 21.64,
    return1Y: 31.2,
    return3Y: 15.6,
    rating: 5,
    minSipMinor: 5000, // $50
    minLumpsumMinor: 5000,
    expenseRatio: 0.39,
    aum: '$135 Billion'
  },
  // UK (GBP)
  {
    id: 'mf-uk-01',
    name: 'Vanguard FTSE 100 Index Unit Trust Direct',
    amc: 'Vanguard UK',
    category: 'Index / ETF',
    jurisdiction: 'UK',
    nav: 342.10,
    return1Y: 14.5,
    return3Y: 9.8,
    rating: 5,
    minSipMinor: 5000, // £50
    minLumpsumMinor: 50000, // £500
    expenseRatio: 0.06,
    aum: '£12.4 Billion'
  },
  {
    id: 'mf-uk-02',
    name: 'Baillie Gifford Global Discovery Fund',
    amc: 'Baillie Gifford',
    category: 'Flexi Cap',
    jurisdiction: 'UK',
    nav: 184.20,
    return1Y: 19.3,
    return3Y: 12.1,
    rating: 4,
    minSipMinor: 10000,
    minLumpsumMinor: 100000,
    expenseRatio: 0.72,
    aum: '£3.8 Billion'
  },
  // Japan (JPY)
  {
    id: 'mf-jp-01',
    name: 'eMAXIS Slim Worldwide Equity (All Country / オルカン)',
    amc: 'Mitsubishi UFJ Asset Management',
    category: 'Index / ETF',
    jurisdiction: 'JP',
    nav: 26840,
    return1Y: 34.5,
    return3Y: 22.4,
    rating: 5,
    minSipMinor: 1000, // ¥1,000
    minLumpsumMinor: 10000,
    expenseRatio: 0.057,
    aum: '¥3.2 兆円'
  },
  {
    id: 'mf-jp-02',
    name: 'Nomura TOPIX ETF Direct (1306)',
    amc: 'Nomura Asset Management',
    category: 'Large Cap',
    jurisdiction: 'JP',
    nav: 2890,
    return1Y: 21.2,
    return3Y: 15.8,
    rating: 5,
    minSipMinor: 5000,
    minLumpsumMinor: 10000,
    expenseRatio: 0.088,
    aum: '¥18 兆円'
  }
];

// ---------------------- DEMAT & EQUITIES MODEL ----------------------
export interface DematAccountRecord {
  id: string;
  userId: string;
  jurisdiction: JurisdictionCode;
  depository: 'CDSL' | 'NSDL' | 'DTC' | 'CREST' | 'JASDEC';
  dematAccountNumber: string; // BO ID / Account #
  brokerName: string;
  status: 'active' | 'pending';
  linkedBankId: string;
  tradingCashBalanceMinor: number;
}

export interface EquityHoldingItem {
  id: string;
  dematId: string;
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE' | 'LSE' | 'TSE';
  jurisdiction: JurisdictionCode;
  quantity: number;
  averageBuyPriceMinor: number;
  currentPriceMinor: number;
  dayChangePercent: number;
  totalInvestedMinor: number;
  currentValueMinor: number;
  pnlMinor: number;
  pnlPercent: number;
}

export const INITIAL_DEMAT_ACCOUNTS: DematAccountRecord[] = [
  {
    id: 'demat-in-01',
    userId: 'usr_in_94821',
    jurisdiction: 'IN',
    depository: 'CDSL',
    dematAccountNumber: '1208160012345678',
    brokerName: 'Zerodha Broking Ltd',
    status: 'active',
    linkedBankId: 'bank-in-01',
    tradingCashBalanceMinor: 2500000 // ₹25,000.00
  },
  {
    id: 'demat-us-01',
    userId: 'usr_8f4a1c90',
    jurisdiction: 'US',
    depository: 'DTC',
    dematAccountNumber: 'DTC-8921-948201',
    brokerName: 'Interactive Brokers LLC',
    status: 'active',
    linkedBankId: 'bank-us-01',
    tradingCashBalanceMinor: 850000 // $8,500.00
  },
  {
    id: 'demat-uk-01',
    userId: 'usr_uk_20194',
    jurisdiction: 'UK',
    depository: 'CREST',
    dematAccountNumber: 'CREST-GB-401920',
    brokerName: 'Hargreaves Lansdown',
    status: 'active',
    linkedBankId: 'bank-uk-01',
    tradingCashBalanceMinor: 320000 // £3,200.00
  },
  {
    id: 'demat-jp-01',
    userId: 'usr_jp_33019',
    jurisdiction: 'JP',
    depository: 'JASDEC',
    dematAccountNumber: 'JASDEC-7749-0192',
    brokerName: 'Rakuten Securities (楽天証券)',
    status: 'active',
    linkedBankId: 'bank-jp-01',
    tradingCashBalanceMinor: 650000 // ¥650,000
  }
];

export const INITIAL_EQUITY_HOLDINGS: EquityHoldingItem[] = [
  // India (NSE)
  {
    id: 'eq-in-01',
    dematId: 'demat-in-01',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE',
    jurisdiction: 'IN',
    quantity: 40,
    averageBuyPriceMinor: 275000, // ₹2,750.00
    currentPriceMinor: 298000,    // ₹2,980.00
    dayChangePercent: 1.45,
    totalInvestedMinor: 11000000,
    currentValueMinor: 11920000,
    pnlMinor: 920000,
    pnlPercent: 8.36
  },
  {
    id: 'eq-in-02',
    dematId: 'demat-in-01',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    exchange: 'NSE',
    jurisdiction: 'IN',
    quantity: 80,
    averageBuyPriceMinor: 154000,
    currentPriceMinor: 168500,
    dayChangePercent: 0.85,
    totalInvestedMinor: 12320000,
    currentValueMinor: 13480000,
    pnlMinor: 1160000,
    pnlPercent: 9.42
  },
  {
    id: 'eq-in-03',
    dematId: 'demat-in-01',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    jurisdiction: 'IN',
    quantity: 25,
    averageBuyPriceMinor: 382000,
    currentPriceMinor: 421000,
    dayChangePercent: -0.35,
    totalInvestedMinor: 9550000,
    currentValueMinor: 10525000,
    pnlMinor: 975000,
    pnlPercent: 10.21
  },
  // US (NASDAQ / NYSE)
  {
    id: 'eq-us-01',
    dematId: 'demat-us-01',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    jurisdiction: 'US',
    quantity: 35,
    averageBuyPriceMinor: 10800, // $108.00
    currentPriceMinor: 13850,   // $138.50
    dayChangePercent: 3.24,
    totalInvestedMinor: 378000,
    currentValueMinor: 484750,
    pnlMinor: 106750,
    pnlPercent: 28.24
  },
  {
    id: 'eq-us-02',
    dematId: 'demat-us-01',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    jurisdiction: 'US',
    quantity: 50,
    averageBuyPriceMinor: 19500,
    currentPriceMinor: 22800,
    dayChangePercent: 0.65,
    totalInvestedMinor: 975000,
    currentValueMinor: 1140000,
    pnlMinor: 165000,
    pnlPercent: 16.92
  },
  // UK (LSE)
  {
    id: 'eq-uk-01',
    dematId: 'demat-uk-01',
    symbol: 'AZN',
    name: 'AstraZeneca PLC',
    exchange: 'LSE',
    jurisdiction: 'UK',
    quantity: 45,
    averageBuyPriceMinor: 11200, // £112.00
    currentPriceMinor: 12450,    // £124.50
    dayChangePercent: 1.12,
    totalInvestedMinor: 504000,
    currentValueMinor: 560250,
    pnlMinor: 56250,
    pnlPercent: 11.16
  },
  // Japan (TSE)
  {
    id: 'eq-jp-01',
    dematId: 'demat-jp-01',
    symbol: '7203',
    name: 'Toyota Motor Corp (トヨタ自動車)',
    exchange: 'TSE',
    jurisdiction: 'JP',
    quantity: 300,
    averageBuyPriceMinor: 2850, // ¥2,850
    currentPriceMinor: 3120,    // ¥3,120
    dayChangePercent: 1.80,
    totalInvestedMinor: 855000,
    currentValueMinor: 936000,
    pnlMinor: 81000,
    pnlPercent: 9.47
  }
];

export interface FundTransactionRecord {
  id: string;
  userId: string;
  jurisdiction: JurisdictionCode;
  type: 'deposit' | 'withdrawal' | 'fd_creation' | 'fd_interest' | 'mf_sip' | 'stock_buy' | 'auto_sweep' | 'payout';
  amountMinor: number;
  currency: string;
  status: 'settled' | 'processing';
  ledgerTransactionId: string;
  reference: string;
  timestamp: string;
}
