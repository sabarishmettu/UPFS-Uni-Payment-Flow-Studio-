/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkflowNavbar } from './components/WorkflowNavbar';
import { WorkflowSidebar, ActiveAppView } from './components/WorkflowSidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeParameterModal } from './components/NodeParameterModal';
import { NodePaletteModal } from './components/NodePaletteModal';
import { GlobalBankingHub } from './components/GlobalBankingHub';
import { MutualFundsHub } from './components/MutualFundsHub';
import { DematHoldingsHub } from './components/DematHoldingsHub';
import { AccountSignIn, PRESET_USERS, UserProfile } from './components/AccountSignIn';
import { JurisdictionCode } from './data/jurisdictionData';
import { FlowNode, FlowEdge, DEFAULT_FLOW_NODES, DEFAULT_FLOW_EDGES, AVAILABLE_NODE_TEMPLATES } from './data/workflowData';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveAppView>('canvas');
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionCode>('IN');
  const [workflowName, setWorkflowName] = useState('Global Banking, SIP & Demat Pipeline');
  const [isActive, setIsActive] = useState(true);

  // Active User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[0]);

  // Nodes & Edges state
  const [nodes, setNodes] = useState<FlowNode[]>(DEFAULT_FLOW_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(DEFAULT_FLOW_EDGES);

  // Selected node for modal configuration
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Execution simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [executedNodeIds, setExecutedNodeIds] = useState<string[]>([]);
  const [isExecutingStep, setIsExecutingStep] = useState(false);

  // Check if adding edge would create a directed cycle
  const wouldCreateCycle = (sourceId: string, targetId: string, currentEdges: FlowEdge[]): boolean => {
    if (sourceId === targetId) return true;
    const visited = new Set<string>();
    const queue = [targetId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === sourceId) return true;
      if (!visited.has(current)) {
        visited.add(current);
        const nextNodes = currentEdges.filter(e => e.source === current).map(e => e.target);
        queue.push(...nextNodes);
      }
    }
    return false;
  };

  // Topological sorting for true DAG execution sequence
  const getTopologicalOrder = (): string[] => {
    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    
    nodes.forEach(n => {
      inDegree[n.id] = 0;
      adj[n.id] = [];
    });

    edges.forEach(e => {
      if (inDegree[e.target] !== undefined) {
        inDegree[e.target] = (inDegree[e.target] || 0) + 1;
      }
      if (adj[e.source]) {
        adj[e.source].push(e.target);
      }
    });

    const queue: string[] = [];
    nodes.forEach(n => {
      if ((inDegree[n.id] || 0) === 0) {
        queue.push(n.id);
      }
    });

    const order: string[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      order.push(u);
      (adj[u] || []).forEach(v => {
        inDegree[v]--;
        if (inDegree[v] === 0) {
          queue.push(v);
        }
      });
    }

    // Include any standalone or island nodes
    nodes.forEach(n => {
      if (!order.includes(n.id)) {
        order.push(n.id);
      }
    });

    return order;
  };

  // Run full workflow DAG simulation
  const handleExecuteWorkflow = () => {
    if (isRunning) return;
    const executionOrder = getTopologicalOrder();
    if (executionOrder.length === 0) return;

    setIsRunning(true);
    setExecutedNodeIds([]);
    setActiveNodeId(executionOrder[0]);

    executionOrder.forEach((nodeId, idx) => {
      setTimeout(() => {
        setActiveNodeId(nodeId);
        setExecutedNodeIds(prev => [...prev, executionOrder[Math.max(0, idx - 1)]].filter(Boolean));

        if (idx === executionOrder.length - 1) {
          setTimeout(() => {
            setExecutedNodeIds(executionOrder);
            setActiveNodeId(null);
            setIsRunning(false);
          }, 900);
        }
      }, (idx + 1) * 850);
    });
  };

  const handleResetWorkflow = () => {
    setIsRunning(false);
    setActiveNodeId(null);
    setExecutedNodeIds([]);
  };

  const handleUpdateNodePosition = (nodeId: string, pos: { x: number; y: number }) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, position: pos } : n));
  };

  const handleUpdateParameters = (nodeId: string, parameters: Record<string, any>) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, parameters } : n));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, parameters } : null);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  };

  const handleTestStep = (nodeId: string) => {
    setIsExecutingStep(true);
    setTimeout(() => {
      setIsExecutingStep(false);
    }, 600);
  };

  const handleAddEdge = (sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    
    // Check for duplicates
    if (edges.some(e => e.source === sourceId && e.target === targetId)) {
      return;
    }

    // Check for cycle prevention
    if (wouldCreateCycle(sourceId, targetId, edges)) {
      console.warn(`Connection from ${sourceId} to ${targetId} blocked: would create a cycle.`);
      return;
    }

    setEdges(prev => [
      ...prev,
      {
        id: `e-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        source: sourceId,
        target: targetId,
        animated: true
      }
    ]);
  };

  const handleDeleteEdge = (edgeId: string) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
  };

  const handleSelectTemplate = (template: typeof AVAILABLE_NODE_TEMPLATES[0]) => {
    const newId = `node-${Date.now()}`;
    const anchorNode = selectedNode || nodes[nodes.length - 1];
    const newPos = anchorNode 
      ? { x: anchorNode.position.x + 280, y: anchorNode.position.y + 20 }
      : { x: 100, y: 200 };

    let defaultParams: Record<string, any> = { enabled: true, timeoutSeconds: 30 };
    let sampleInput: Record<string, any> = { triggered_at: new Date().toISOString() };
    let sampleOutput: Record<string, any> = { status: 'success', timestamp: Date.now() };

    if (template.type === 'unifi.identityLinkedBanks') {
      defaultParams = {
        customerLegalName: currentUser.name || 'Alex Rivera',
        governmentIdType: 'PAN (Permanent Account Number)',
        governmentIdNumber: currentUser.idNumber || 'ABCDE1234F',
        jurisdiction: currentUser.jurisdiction || 'IN',
        totalLinkedAccounts: 3,
        linkedBankAccounts: [
          {
            id: `acc-${Date.now()}-1`,
            bankName: 'HDFC Bank Ltd',
            accountNumber: '50100294829103',
            ifscOrRouting: 'HDFC0000240',
            accountType: 'Savings',
            pennyDropStatus: 'VERIFIED',
            isPrimary: true,
            balanceFormatted: '₹1,50,000.00',
            currency: 'INR'
          },
          {
            id: `acc-${Date.now()}-2`,
            bankName: 'ICICI Bank Ltd',
            accountNumber: '001205019284',
            ifscOrRouting: 'ICIC0000012',
            accountType: 'Current / Operating',
            pennyDropStatus: 'VERIFIED',
            isPrimary: false,
            balanceFormatted: '₹45,200.00',
            currency: 'INR'
          },
          {
            id: `acc-${Date.now()}-3`,
            bankName: 'State Bank of India (SBI)',
            accountNumber: '30291829481',
            ifscOrRouting: 'SBIN0001842',
            accountType: 'Business Escrow',
            pennyDropStatus: 'VERIFIED',
            isPrimary: false,
            balanceFormatted: '₹82,400.00',
            currency: 'INR'
          }
        ]
      };
      sampleInput = {
        lookup_customer_id: currentUser.id,
        aggregate_linked_banks: true
      };
      sampleOutput = {
        customer_legal_name: currentUser.name,
        government_id_number: currentUser.idNumber,
        kyc_status: 'VERIFIED_LEVEL_3',
        linked_bank_accounts_count: 3
      };
    }

    const newNode: FlowNode = {
      id: newId,
      name: template.name,
      type: template.type,
      category: template.category as any,
      icon: template.icon,
      color: template.color,
      subtitle: template.type === 'unifi.identityLinkedBanks'
        ? `${currentUser.name} • ${currentUser.idNumber} • 3 Banks`
        : template.description.slice(0, 30) + '...',
      position: newPos,
      parameters: defaultParams,
      sampleInput,
      sampleOutput
    };

    setNodes(prev => [...prev, newNode]);

    if (anchorNode) {
      setEdges(prev => [...prev, { id: `e-${Date.now()}`, source: anchorNode.id, target: newId, animated: true }]);
    }

    setIsPaletteOpen(false);
    setSelectedNode(newNode);
  };

  return (
    <div className="h-screen w-screen bg-[#14151c] text-[#f0f1f5] flex flex-col overflow-hidden font-sans select-none">
      {/* Top Navigation Bar */}
      <WorkflowNavbar
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        isActive={isActive}
        setIsActive={setIsActive}
        isRunning={isRunning}
        onExecuteWorkflow={handleExecuteWorkflow}
        onResetWorkflow={handleResetWorkflow}
        onOpenPalette={() => setIsPaletteOpen(true)}
        phase1Approved={true}
        onTogglePhase1Approval={() => {}}
        currentUser={currentUser}
        onOpenAccount={() => setActiveView('account')}
      />

      {/* Main Studio Body: Sidebar + Dynamic Content View */}
      <div className="flex-1 flex overflow-hidden relative">
        <WorkflowSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'canvas' && (
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onSelectNode={(node) => setSelectedNode(node)}
              onOpenPalette={() => setIsPaletteOpen(true)}
              isRunning={isRunning}
              activeNodeId={activeNodeId}
              executedNodeIds={executedNodeIds}
              onExecuteWorkflow={handleExecuteWorkflow}
              onUpdateNodePosition={handleUpdateNodePosition}
              onAddEdge={handleAddEdge}
              onDeleteEdge={handleDeleteEdge}
            />
          )}

          {activeView === 'banks' && (
            <div className="p-6 overflow-y-auto flex-1 bg-[#14151c]">
              <GlobalBankingHub 
                initialTab="banks"
                activeJurisdiction={activeJurisdiction}
                onSelectJurisdiction={setActiveJurisdiction}
              />
            </div>
          )}

          {activeView === 'fds' && (
            <div className="p-6 overflow-y-auto flex-1 bg-[#14151c]">
              <GlobalBankingHub 
                initialTab="fds"
                activeJurisdiction={activeJurisdiction}
                onSelectJurisdiction={setActiveJurisdiction}
              />
            </div>
          )}

          {activeView === 'mutual_funds' && (
            <div className="p-6 overflow-y-auto flex-1 bg-[#14151c]">
              <MutualFundsHub 
                activeJurisdiction={activeJurisdiction}
                onSelectJurisdiction={setActiveJurisdiction}
              />
            </div>
          )}

          {activeView === 'demat' && (
            <div className="p-6 overflow-y-auto flex-1 bg-[#14151c]">
              <DematHoldingsHub 
                activeJurisdiction={activeJurisdiction}
                onSelectJurisdiction={setActiveJurisdiction}
              />
            </div>
          )}

          {activeView === 'account' && (
            <div className="p-6 overflow-y-auto flex-1 bg-[#14151c]">
              <AccountSignIn 
                currentUser={currentUser}
                onSelectUser={(u) => setCurrentUser(u)}
                onSignOut={() => setCurrentUser(PRESET_USERS[0])}
              />
            </div>
          )}
        </main>
      </div>

      {/* Node Configuration Modal Drawer */}
      {selectedNode && (
        <NodeParameterModal
          node={selectedNode}
          nodes={nodes}
          edges={edges}
          onClose={() => setSelectedNode(null)}
          onUpdateParameters={handleUpdateParameters}
          onDeleteNode={handleDeleteNode}
          onTestStep={handleTestStep}
          isExecutingStep={isExecutingStep}
          onAddEdge={handleAddEdge}
          onDeleteEdge={handleDeleteEdge}
        />
      )}

      {/* "+ Add Node" Palette Modal */}
      {isPaletteOpen && (
        <NodePaletteModal
          onClose={() => setIsPaletteOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
}
