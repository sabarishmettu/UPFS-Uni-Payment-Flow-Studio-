import React, { useState } from 'react';
import { 
  Play, 
  Workflow, 
  CreditCard, 
  GitBranch, 
  Database, 
  Bell, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';

interface MockNode {
  id: string;
  label: string;
  type: 'trigger' | 'action' | 'condition' | 'ledger';
  icon: string;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'completed' | 'failed';
  output?: Record<string, any>;
}

export const WorkflowPreview: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const sampleNodes: MockNode[] = [
    {
      id: 'node-1',
      label: 'Stripe Webhook (Invoice Paid)',
      type: 'trigger',
      icon: 'zap',
      config: { event: 'invoice.paid', provider: 'stripe' },
      output: { amount: 15000, currency: 'USD', customer_id: 'cus_99341', invoice_id: 'inv_88294' }
    },
    {
      id: 'node-2',
      label: 'Fraud & Anomaly Guard',
      type: 'condition',
      icon: 'shield',
      config: { rule: 'amount < 50000 && ip_reputation > 0.8' },
      output: { passed: true, score: 0.96 }
    },
    {
      id: 'node-3',
      label: 'Platform Split & Payout',
      type: 'action',
      icon: 'credit-card',
      config: { platform_fee_pct: 10, payout_destination: 'acct_payout_merchant_1' },
      output: { merchant_amount: 13500, platform_fee: 1500 }
    },
    {
      id: 'node-4',
      label: 'Double-Entry Ledger Post',
      type: 'ledger',
      icon: 'book',
      config: { 
        debit: 'ASSET_STRIPE_CLEARING ($150.00)', 
        credit_1: 'MERCHANT_PAYABLE ($135.00)', 
        credit_2: 'PLATFORM_REVENUE ($15.00)' 
      },
      output: { transaction_id: 'tx_ledger_940284', status: 'posted', zero_sum_proof: '0.00 balance' }
    },
    {
      id: 'node-5',
      label: 'Send Email / Slack Notification',
      type: 'action',
      icon: 'bell',
      config: { channel: '#finance-alerts', template: 'payout_processed' },
      output: { delivered: true, recipient: 'finance@merchant.io' }
    }
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setActiveStep(0);

    sampleNodes.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        if (idx === sampleNodes.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
          }, 800);
        }
      }, (idx + 1) * 700);
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Workflow className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Workflow Engine & DAG Execution Model (Phases 3 & 4 Preview)</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            How JSON graph definitions map into DAG step execution, context passing, and automated double-entry ledger settlement.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            isRunning 
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isRunning ? 'Executing Graph...' : 'Simulate Workflow Run'}
        </button>
      </div>

      {/* DAG Node Graph Layout */}
      <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {sampleNodes.map((node, index) => {
            const isCompleted = activeStep > index || (!isRunning && activeStep === sampleNodes.length - 1);
            const isCurrent = isRunning && activeStep === index;

            return (
              <div
                key={node.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative ${
                  isCurrent
                    ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-950/80 scale-105'
                    : isCompleted
                    ? 'bg-slate-900/80 border-emerald-500/40'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      node.type === 'trigger' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      node.type === 'condition' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      node.type === 'ledger' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {node.type.toUpperCase()}
                    </span>

                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />}
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2">{node.label}</h4>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    {Object.entries(node.config).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-slate-500">{k}:</span> <span className="text-indigo-300">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {node.output && (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-300">
                    <span className="text-slate-500">Output: </span>
                    <span>{JSON.stringify(node.output).slice(0, 32)}...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow JSON Definition Preview */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            Serialized Workflow Graph (PostgreSQL JSONB Schema)
          </h3>
          <span className="text-xs font-mono text-slate-400">Stored in workflows.graph_definition</span>
        </div>
        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-200/90 overflow-x-auto max-h-60 leading-relaxed">
{JSON.stringify({
  version: "1.0",
  name: "Automated Invoice Settlement & Split Ledger",
  nodes: sampleNodes.map(n => ({ id: n.id, type: n.type, label: n.label, parameters: n.config })),
  edges: [
    { source: "node-1", target: "node-2" },
    { source: "node-2", target: "node-3", condition: "score > 0.8" },
    { source: "node-3", target: "node-4" },
    { source: "node-4", target: "node-5" }
  ]
}, null, 2)}
        </pre>
      </div>
    </div>
  );
};
