import React, { useState, useRef } from 'react';
import { FlowNode, FlowEdge } from '../data/workflowData';
import { 
  Building2, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  ArrowDownLeft, 
  ArrowUpRight, 
  UserCheck,
  ShieldCheck,
  CreditCard,
  Settings,
  SlidersHorizontal,
  Edit3,
  RefreshCw,
  Play, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onSelectNode: (node: FlowNode) => void;
  onOpenPalette: () => void;
  isRunning: boolean;
  activeExecutionIndex: number;
  onExecuteWorkflow: () => void;
  onUpdateNodePosition: (nodeId: string, pos: { x: number; y: number }) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onSelectNode,
  onOpenPalette,
  isRunning,
  activeExecutionIndex,
  onExecuteWorkflow,
  onUpdateNodePosition
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [refreshingBankNodeId, setRefreshingBankNodeId] = useState<Record<string, boolean>>({});
  const hasDraggedRef = useRef(false);
  const dragStartCoordsRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleRefreshBalance = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshingBankNodeId(prev => ({ ...prev, [nodeId]: true }));
    setTimeout(() => {
      setRefreshingBankNodeId(prev => ({ ...prev, [nodeId]: false }));
    }, 700);
  };

  const getNodeIcon = (node: FlowNode) => {
    if (node.type === 'unifi.identityLinkedBanks' || node.type === 'unifi.identityMaster' || node.icon === 'user-check') {
      return <UserCheck className="w-4 h-4 text-cyan-400" />;
    }
    switch (node.category) {
      case 'banking': return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'investments': return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'demat': return <BarChart3 className="w-4 h-4 text-amber-400" />;
      case 'treasury': return <ArrowDownLeft className="w-4 h-4 text-pink-400" />;
      case 'payout': return <ArrowUpRight className="w-4 h-4 text-[#ff6d5a]" />;
      default: return <Sparkles className="w-4 h-4 text-[#ff6d5a]" />;
    }
  };

  const handleMouseDownNode = (e: React.MouseEvent, node: FlowNode) => {
    e.stopPropagation();
    hasDraggedRef.current = false;
    dragStartCoordsRef.current = { x: e.clientX, y: e.clientY };
    setDraggedNodeId(node.id);
    setDragOffset({
      x: e.clientX / zoom - node.position.x,
      y: e.clientY / zoom - node.position.y
    });
  };

  // Window-level smooth event handling for zero-latency dragging & panning
  React.useEffect(() => {
    if (!draggedNodeId && !isPanning) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (draggedNodeId) {
        const distance = Math.hypot(
          e.clientX - dragStartCoordsRef.current.x,
          e.clientY - dragStartCoordsRef.current.y
        );
        if (distance > 3) {
          hasDraggedRef.current = true;
        }
        // Continuous, un-quantized coordinate for 60fps buttery smooth dragging
        const newX = Math.round(e.clientX / zoom - dragOffset.x);
        const newY = Math.round(e.clientY / zoom - dragOffset.y);
        onUpdateNodePosition(draggedNodeId, { x: newX, y: newY });
      } else if (isPanning) {
        setPan(prev => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      }
    };

    const handleWindowMouseUp = () => {
      setDraggedNodeId(null);
      setIsPanning(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 60);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggedNodeId, isPanning, dragOffset, zoom, onUpdateNodePosition]);

  const PORT_Y_OFFSET = 26;

  const renderEdge = (edge: FlowEdge, index: number) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    const sx = sourceNode.position.x + 240;
    const sy = sourceNode.position.y + PORT_Y_OFFSET;
    const tx = targetNode.position.x;
    const ty = targetNode.position.y + PORT_Y_OFFSET;

    const dx = Math.max(Math.abs(tx - sx) * 0.5, 40);
    const pathD = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;

    const isStepActive = isRunning && activeExecutionIndex === index;
    const isStepPassed = activeExecutionIndex > index || (!isRunning && activeExecutionIndex === nodes.length - 1);

    return (
      <g key={edge.id}>
        {isStepActive && (
          <path
            d={pathD}
            fill="none"
            stroke="#ff6d5a"
            strokeWidth={6}
            strokeOpacity={0.4}
            className="animate-pulse"
          />
        )}
        <path
          d={pathD}
          fill="none"
          stroke={isStepActive ? '#ff6d5a' : isStepPassed ? '#10b981' : '#3b3f54'}
          strokeWidth={isStepActive ? 2.5 : 2}
          className={isStepActive ? 'animate-unifi-flow' : ''}
        />
        {/* Connector Pin Heads */}
        <circle cx={sx} cy={sy} r={3} fill={isStepActive ? '#ff6d5a' : isStepPassed ? '#10b981' : '#676a82'} />
        <circle cx={tx} cy={ty} r={3} fill={isStepActive ? '#ff6d5a' : isStepPassed ? '#10b981' : '#676a82'} />
      </g>
    );
  };

  return (
    <div 
      ref={canvasRef}
      onMouseDown={() => setIsPanning(true)}
      className="w-full h-full relative overflow-hidden select-none unifi-grid-pattern cursor-grab active:cursor-grabbing flex-1"
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      {/* Interactive Scaled Canvas */}
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* SVG Edges Layer */}
        <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-0">
          {edges.map((edge, idx) => renderEdge(edge, idx))}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node, index) => {
          const isCurrent = isRunning && activeExecutionIndex === index;
          const isDone = activeExecutionIndex > index || (!isRunning && activeExecutionIndex === nodes.length - 1);

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDownNode(e, node)}
              onClick={(e) => {
                e.stopPropagation();
                if (hasDraggedRef.current) return;
                onSelectNode(node);
              }}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`
              }}
              className={`absolute w-[240px] rounded-xl bg-[#1c1e29] border transition-colors duration-150 cursor-pointer z-10 unifi-node-shadow group ${
                isCurrent
                  ? 'border-[#ff6d5a] ring-2 ring-[#ff6d5a]/40 shadow-xl shadow-[#ff6d5a]/20 scale-105'
                  : isDone
                  ? 'border-emerald-500/50 hover:border-emerald-400'
                  : 'border-[#2c2f3f] hover:border-[#ff6d5a]/60 hover:bg-[#222533]'
              }`}
            >
              {/* Left Input Port Connector Handle */}
              {node.type !== 'unifi.identityMaster' && (
                <div 
                  className="absolute -left-[7px] top-[26px] -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#1c1e29] border-2 border-[#3b3f54] group-hover:border-[#ff6d5a] flex items-center justify-center transition-colors shadow-sm z-20"
                  title="Input Port"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#9ea2b8] group-hover:bg-[#ff6d5a]" />
                </div>
              )}

              {/* Right Output Port Connector Handle */}
              <div 
                className="absolute -right-[7px] top-[26px] -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#1c1e29] border-2 border-[#3b3f54] group-hover:border-[#ff6d5a] flex items-center justify-center transition-colors shadow-sm z-20"
                title="Output Port"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#9ea2b8] group-hover:bg-[#ff6d5a]" />
              </div>

              {/* Node Card Header */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div 
                      className="p-1.5 rounded-lg bg-[#111218] border border-[#2c2f3f] flex-shrink-0"
                    >
                      {getNodeIcon(node)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#ff6d5a] transition-colors truncate">
                        {node.name}
                      </h4>
                      <p className="text-[10px] text-[#9ea2b8] truncate">{node.subtitle}</p>
                    </div>
                  </div>

                  {/* Actions: Settings Icon & Status Indicator */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNode(node);
                      }}
                      className="p-1 rounded bg-[#111218] hover:bg-[#282b3a] border border-[#2c2f3f] text-[#9ea2b8] hover:text-[#ff6d5a] transition-colors"
                      title="Edit Settings"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                    </button>

                    {isCurrent && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff6d5a] animate-ping" />
                    )}
                    {isDone && !isCurrent && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {!isCurrent && !isDone && (
                      <div className="w-2 h-2 rounded-full bg-[#3b3f54]" />
                    )}
                  </div>
                </div>

                {/* Specific Layout: Customer Identity Master Node (Name & ID) */}
                {node.type === 'unifi.identityMaster' && (
                  <div className="mt-2.5 pt-2 border-t border-[#2c2f3f] space-y-1.5 font-mono text-[11px] bg-[#14151c]/70 p-2.5 rounded-lg border border-[#242735]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9ea2b8]">name :</span>
                      <strong className="text-white font-semibold">{node.parameters.customerLegalName || 'Alex Rivera'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9ea2b8]">ID :</span>
                      <strong className="text-cyan-300 font-bold tracking-wider">{node.parameters.governmentIdNumber || 'ABCDE1234F'}</strong>
                    </div>
                    <div className="pt-1.5 border-t border-[#242735] flex items-center justify-between text-[10px] text-emerald-400">
                      <span>CKYC Level 3 Verified</span>
                      <span className="text-[#ff6d5a] font-bold">2 Bank Accounts ➔</span>
                    </div>
                  </div>
                )}

                {/* Specific Layout: Linked Bank Account Node */}
                {node.type === 'unifi.bankAccountNode' && (
                  <div className="mt-2 pt-2 border-t border-[#2c2f3f] space-y-1.5 font-mono text-[10px] bg-[#14151c]/70 p-2 rounded-lg border border-[#242735]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9ea2b8]">A/C :</span>
                      <span className="text-white font-bold">{node.parameters.accountNumber || '50100294829103'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9ea2b8]">IFSC :</span>
                      <span className="text-[#f0f1f5]">{node.parameters.ifscOrRouting || 'HDFC0000240'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#242735]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#9ea2b8]">Bal:</span>
                        <span className="text-emerald-400 font-semibold">{node.parameters.balanceFormatted || '₹1,50,000.00'}</span>
                        <button
                          type="button"
                          onClick={(e) => handleRefreshBalance(node.id, e)}
                          title="Check & Refresh Real-time Bank Balance"
                          className="p-1 rounded bg-[#1c1e29] hover:bg-[#282b3a] border border-[#2c2f3f] hover:border-emerald-500/50 text-[#9ea2b8] hover:text-emerald-400 transition-all flex items-center justify-center"
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${refreshingBankNodeId[node.id] ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>
                      </div>
                      <span className="text-emerald-400 text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 flex items-center gap-1">
                        {refreshingBankNodeId[node.id] ? (
                          <span className="text-cyan-300 animate-pulse font-sans">Checking...</span>
                        ) : (
                          <span>✓ Verified</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rich Preview for Identity & Multi-Linked Banks Aggregator */}
                {node.type === 'unifi.identityLinkedBanks' && node.parameters?.linkedBankAccounts && (
                  <div className="mt-2 pt-2 border-t border-[#242735] space-y-1.5 font-mono">
                    <div className="text-[11px] bg-[#14151c]/70 p-2 rounded-lg border border-[#242735] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#9ea2b8]">name :</span>
                        <strong className="text-white">{node.parameters.customerLegalName || 'Alex Rivera'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#9ea2b8]">ID :</span>
                        <strong className="text-cyan-300">{node.parameters.governmentIdNumber || 'ABCDE1234F'}</strong>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {node.parameters.linkedBankAccounts.slice(0, 3).map((acc: any, i: number) => (
                          <span 
                            key={i} 
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                              acc.isPrimary 
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                                : 'bg-[#14151c] text-[#9ea2b8] border-[#2c2f3f]'
                            }`}
                          >
                            {acc.bankName.split(' ')[0]} {acc.isPrimary ? '★' : ''}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleRefreshBalance(node.id, e)}
                        title="Check & Refresh All Bank Balances"
                        className="p-1 rounded bg-[#14151c] hover:bg-[#282b3a] border border-[#2c2f3f] text-[#9ea2b8] hover:text-emerald-400 transition-colors"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 ${refreshingBankNodeId[node.id] ? 'animate-spin text-emerald-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Explicit Edit Settings Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(node);
                  }}
                  className="w-full mt-2.5 py-1 px-2 bg-[#171922] hover:bg-[#ff6d5a]/15 border border-[#2c2f3f] hover:border-[#ff6d5a]/50 text-[#9ea2b8] hover:text-white rounded-lg text-[10px] font-semibold flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-[#ff6d5a]" />
                    <span>Edit Settings</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#676a82]">Config ➔</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Canvas Top Overlay: Live Execution Trace Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-[#111218]/90 backdrop-blur-md border border-[#2c2f3f] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 text-xs text-[#9ea2b8] pointer-events-auto font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff6d5a] animate-pulse" />
            <span className="font-semibold text-white">UnifiPay Visual DAG Engine</span>
          </div>
          <span className="text-[#3b3f54]">|</span>
          <span>{nodes.length} Nodes Connected</span>
          <span className="text-[#3b3f54]">|</span>
          <span className="text-emerald-400">Double-Entry Zero-Sum Guard: Active</span>
        </div>

        {/* Floating Add Node Action */}
        <button
          onClick={onOpenPalette}
          className="bg-[#ff6d5a] hover:bg-[#ff5740] text-white p-2.5 rounded-xl shadow-xl shadow-[#ff6d5a]/25 pointer-events-auto flex items-center gap-1.5 text-xs font-bold transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Step</span>
        </button>
      </div>

      {/* Floating Canvas Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1 bg-[#111218]/90 backdrop-blur-md border border-[#2c2f3f] p-1 rounded-xl shadow-xl">
        <button
          onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
          className="p-2 text-[#9ea2b8] hover:text-white hover:bg-[#20222e] rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="px-2 text-[11px] font-mono font-semibold text-white min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
          className="p-2 text-[#9ea2b8] hover:text-white hover:bg-[#20222e] rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-[#2c2f3f] my-auto" />
        <button
          onClick={() => { setZoom(1); setPan({ x: 40, y: 30 }); }}
          className="p-2 text-[#9ea2b8] hover:text-white hover:bg-[#20222e] rounded-lg transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
