import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  KeyRound, 
  Fingerprint, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  LogOut, 
  Sparkles, 
  Globe2, 
  Smartphone, 
  Laptop, 
  Shield, 
  Copy, 
  Check, 
  RefreshCw, 
  Users
} from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'merchant' | 'admin' | 'ops' | 'compliance';
  avatar: string;
  country: string;
  flag: string;
  idNumber?: string;
  jurisdiction?: string;
  kycLevel: 'Level 2 (Verified)' | 'Level 1 (Pending)' | 'Level 3 (Enterprise)';
  joinedDate: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export const PRESET_USERS: UserProfile[] = [
  {
    id: 'usr_8f4a1c90',
    name: 'Alex Rivera',
    email: 'alex.rivera@uniflow.io',
    role: 'merchant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    country: 'United States',
    flag: '🇺🇸',
    kycLevel: 'Level 2 (Verified)',
    joinedDate: 'Jan 2026',
    lastLogin: 'Just now (San Francisco, US)',
    twoFactorEnabled: true
  },
  {
    id: 'usr_in_94821',
    name: 'Priya Sharma',
    email: 'priya.sharma@uniflow.in',
    role: 'compliance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    country: 'India',
    flag: '🇮🇳',
    kycLevel: 'Level 3 (Enterprise)',
    joinedDate: 'Mar 2026',
    lastLogin: '5 mins ago (Bengaluru, IN)',
    twoFactorEnabled: true
  },
  {
    id: 'usr_uk_20194',
    name: 'Sarah Chen',
    email: 'sarah.chen@uniflow.co.uk',
    role: 'ops',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    flag: '🇬🇧',
    kycLevel: 'Level 2 (Verified)',
    joinedDate: 'Feb 2026',
    lastLogin: '1 hour ago (London, UK)',
    twoFactorEnabled: true
  },
  {
    id: 'usr_jp_33019',
    name: 'Takashi Sato (佐藤 健)',
    email: 'takashi.sato@uniflow.jp',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    country: 'Japan',
    flag: '🇯🇵',
    kycLevel: 'Level 3 (Enterprise)',
    joinedDate: 'Nov 2025',
    lastLogin: '2 hours ago (Tokyo, JP)',
    twoFactorEnabled: true
  }
];

interface AccountSignInProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onSignOut: () => void;
}

export const AccountSignIn: React.FC<AccountSignInProps> = ({
  currentUser,
  onSelectUser,
  onSignOut
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'passkey' | 'magic'>('signin');
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 700);
  };

  const handleCopyJwt = () => {
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#ff6d5a] to-[#ea4b71] text-white shadow-md shadow-[#ff6d5a]/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Uni Payment Flow Studio — Account & Identity Portal</span>
              </h2>
              <p className="text-xs text-[#9ea2b8] mt-0.5">
                Sign in to manage global workflows, KYC credentials, bank payouts, and high-yield treasury rules.
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Account Status */}
        <div className="flex items-center gap-3 bg-[#14151c] px-3 py-2 rounded-xl border border-[#2c2f3f]">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#ff6d5a]/40 flex-shrink-0">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentUser.name}</span>
              <span className="text-xs">{currentUser.flag}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Signed In ({currentUser.role.toUpperCase()})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Switch Account / Quick Profiles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1c1e29] p-5 rounded-2xl border border-[#2c2f3f] space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#2c2f3f] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ff6d5a]" />
                <span>Instant Account Switcher</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14151c] text-[#9ea2b8] border border-[#2c2f3f]">
                4 Profiles
              </span>
            </div>

            <p className="text-xs text-[#9ea2b8]">
              Switch instantly between pre-configured merchant, compliance, and administrator accounts across all 4 jurisdictions:
            </p>

            <div className="space-y-2.5">
              {PRESET_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => onSelectUser(user)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#14151c] border-[#ff6d5a] shadow-md shadow-[#ff6d5a]/10 scale-[1.01]'
                        : 'bg-[#14151c] border-[#2c2f3f] hover:border-[#3b3f54] hover:bg-[#181a24]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-[#2c2f3f]"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs">{user.flag}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#ff6d5a]/20 text-[#ff6d5a] font-semibold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#9ea2b8] font-mono">{user.email}</div>
                        <div className="text-[10px] text-[#676a82] mt-0.5 flex items-center gap-2">
                          <span className="capitalize">{user.role}</span>
                          <span>•</span>
                          <span className="text-emerald-400">{user.kycLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#ff6d5a]" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#676a82]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device & Security Card */}
          <div className="bg-[#1c1e29] p-4 rounded-2xl border border-[#2c2f3f] space-y-3 text-xs text-[#9ea2b8]">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Active Session Security
              </span>
              <span className="text-[10px] font-mono text-emerald-400">TLS 1.3 + Argon2id</span>
            </div>
            <div className="p-3 bg-[#14151c] rounded-xl border border-[#2c2f3f] space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#676a82]">Device:</span>
                <span className="text-white flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-[#ff6d5a]" /> macOS Chrome 128
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#676a82]">Last Active:</span>
                <span className="text-white">{currentUser.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#676a82]">2FA Auth:</span>
                <span className="text-emerald-400 font-bold">Enabled (FIDO2 Passkey)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In / Authentication Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#1c1e29] p-6 rounded-2xl border border-[#2c2f3f] space-y-5 shadow-lg">
            {/* Tab selection */}
            <div className="flex items-center gap-1 bg-[#14151c] p-1.5 rounded-xl border border-[#2c2f3f] text-xs">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  authMode === 'signin' ? 'bg-[#ff6d5a] text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('passkey')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'passkey' ? 'bg-[#ff6d5a] text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Passkey (Biometric)</span>
              </button>
              <button
                onClick={() => setAuthMode('magic')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'magic' ? 'bg-[#ff6d5a] text-white shadow-md' : 'text-[#9ea2b8] hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Magic Link</span>
              </button>
            </div>

            {/* Main Form */}
            {authMode === 'signin' && (
              <form onSubmit={handleCustomLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white block">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#676a82] absolute left-3" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="merchant@uniflow.io"
                      className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white block">Password</label>
                    <span className="text-[11px] text-[#ff6d5a] hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#676a82] absolute left-3" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-[#14151c] border border-[#2c2f3f] focus:border-[#ff6d5a] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9ea2b8]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#ff6d5a]" />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-gradient-to-r from-[#ff6d5a] to-[#ea4b71] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#ff6d5a]/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Authenticating with UniFlow...' : 'Sign In to Uni Payment Flow'}</span>
                </button>
              </form>
            )}

            {authMode === 'passkey' && (
              <div className="p-6 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ff6d5a]/15 text-[#ff6d5a] border border-[#ff6d5a]/30 mx-auto flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Passwordless WebAuthn / Touch ID</h4>
                  <p className="text-xs text-[#9ea2b8] mt-1 max-w-sm mx-auto">
                    Authenticate instantly with your hardware security key, Apple TouchID, Windows Hello, or Android Biometric.
                  </p>
                </div>
                <button
                  onClick={handleCustomLogin}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#ff6d5a] hover:bg-[#ff5740] text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {isSubmitting ? 'Verifying Hardware Challenge...' : 'Touch Security Key / FaceID'}
                </button>
              </div>
            )}

            {authMode === 'magic' && (
              <div className="p-6 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mx-auto flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">One-Time Magic Link</h4>
                  <p className="text-xs text-[#9ea2b8] mt-1 max-w-sm mx-auto">
                    We will send a cryptographically signed login link directly to <strong>{emailInput}</strong>.
                  </p>
                </div>
                <button
                  onClick={handleCustomLogin}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {isSubmitting ? 'Dispatching Magic Link...' : 'Send Secure Magic Link'}
                </button>
              </div>
            )}

            {/* JWT Token Snapshot */}
            <div className="pt-4 border-t border-[#2c2f3f] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#ff6d5a]" />
                  Active RSA-256 JWT Token Bearer
                </span>
                <button
                  onClick={handleCopyJwt}
                  className="text-[11px] text-[#ff6d5a] hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? 'Copied!' : 'Copy Bearer'}</span>
                </button>
              </div>
              <div className="p-3 bg-[#14151c] rounded-xl border border-[#2c2f3f] text-[11px] font-mono text-[#9ea2b8] break-all leading-relaxed">
                <span className="text-rose-400">Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9</span>.
                <span className="text-cyan-400">eyJzdWIiOiI{currentUser.id}iLCJlbWFpbCI6Ie{currentUser.email}iLCJyb2xlIjoi{currentUser.role}iLCJqdXJpc2RpY3Rpb24iOiJHTE9CQUwifQ</span>.
                <span className="text-amber-400">dBjftJeZ4CVP-mB92K94...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
