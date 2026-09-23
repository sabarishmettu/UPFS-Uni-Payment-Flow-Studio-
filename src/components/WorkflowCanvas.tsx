import React, { useState, useRef, useEffect } from 'react';
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
  Trash2,
  Unlink,
  Link2,
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  CheckCircle2, 
  Sparkles,
  X
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onSelectNode: (node: FlowNode) => void;
  onOpenPalette: () => void;
  isRunning: boolean;
  activeExecutionIndex?: number;
  activeNodeId?: string | null;
  executedNodeIds?: string[];
  onExecuteWorkflow: () => void;
  onUpdateNodePosition: (nodeId: string, pos: { x: number; y: number }) => void;
  onAddEdge?: (sourceId: string, targetId: string) => void;
  onDeleteEdge?: (edgeId: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onSelectNode,
  onOpenPalette,
  isRunning,
  activeExecutionIndex = -1,
  activeNodeId = null,
  executedNodeIds = [],
  onExecuteWorkflow,
  onUpdateNodePosition,
  onAddEdge,
  onDeleteEdge
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [refreshingBankNodeId, setRefreshingBankNodeId] = useState<Record<string, boolean>>({});
  
  // Connection line authoring state
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const hasDraggedRef = useRef(false);
  const dragStartCoordsRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const PORT_Y_OFFSET = 26;

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
    if (connectingSourceId) return; // Don't drag node if currently connecting
    e.stopPropagation();
    hasDraggedRef.current = false;
    dragStartCoordsRef.current = { x: e.clientX, y: e.clientY };
    setDraggedNodeId(node.id);
    setDragOffset({
      x: e.clientX / zoom - node.position.x,
      y: e.clientY / zoom - node.position.y
    });
  };

  // Start connection wire from output port
  const handleStartConnect = (e: React.MouseEvent, sourceId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setConnectingSourceId(sourceId);
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentCanvasX = (e.clientX - rect.left - pan.x) / zoom;
      const currentCanvasY = (e.clientY - rect.top - pan.y) / zoom;
      setMouseCanvasPos({ x: currentCanvasX, y: currentCanvasY });
    }
  };

  // Complete connection wire at target input port
  const handleCompleteConnect = (e: React.MouseEvent | MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (connectingSourceId && connectingSourceId !== targetId) {
      if (onAddEdge) {
        onAddEdge(connectingSourceId, targetId);
      }
    }
    setConnectingSourceId(null);
  };

  // Window-level event handling for zero-latency dragging, panning, and connecting
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const currentCanvasX = (e.clientX - rect.left - pan.x) / zoom;
        const currentCanvasY = (e.clientY - rect.top - pan.y) / zoom;
        setMouseCanvasPos({ x: currentCanvasX, y: currentCanvasY });
      }

      if (draggedNodeId) {
        const distance = Math.hypot(
          e.clientX - dragStartCoordsRef.current.x,
          e.clientY - dragStartCoordsRef.current.y
        );
        if (distance > 3) {
          hasDraggedRef.current = true;
        }
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingSourceId(null);
        setSelectedEdgeId(null);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId) {
        if (onDeleteEdge) {
          onDeleteEdge(selectedEdgeId);
          setSelectedEdgeId(null);
        }
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [draggedNodeId, isPanning, dragOffset, zoom, pan, onUpdateNodePosition, selectedEdgeId, onDeleteEdge]);

  const getSmoothBezierPath = (sx: number, sy: number, tx: number, ty: number) => {
    const dx = tx - sx;
    const dy = ty - sy;

    if (dx >= 20) {
      const curvature = Math.max(Math.abs(dx) * 0.5, 40);
      return `M ${sx} ${sy} C ${sx + curvature} ${sy}, ${tx - curvature} ${ty}, ${tx} ${ty}`;
    } else {
      const offset = Math.max(Math.abs(dy) * 0.35, 60);
      const midY = (sy + ty) / 2 + (dy === 0 ? 50 : 0);
      return `M ${sx} ${sy} C ${sx + offset} ${sy}, ${sx + offset} ${midY}, ${(sx + tx) / 2} ${midY} C ${tx - offset} ${midY}, ${tx - offset} ${ty}, ${tx} ${ty}`;
    }
  };

  const renderEdge = (edge: FlowEdge, index: number) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    const sx = sourceNode.position.x + 240;
    const sy = sourceNode.position.y + PORT_Y_OFFSET;
    const tx = targetNode.position.x;
    const ty = targetNode.position.y + PORT_Y_OFFSET;

    const pathD = getSmoothBezierPath(sx, sy, tx, ty);

    const isStepActive = isRunning && (activeNodeId ? edge.target === activeNodeId : activeExecutionIndex === index);
    const isStepPassed = executedNodeIds.length > 0 
      ? executedNodeIds.includes(edge.target)
      : (activeExecutionIndex > index || (!isRunning && activeExecutionIndex === nodes.length - 1));
    const isHovered = hoveredEdgeId === edge.id;
    const isSelected = selectedEdgeId === edge.id;

    // Midpoint for interactive action badge
    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2 + (tx < sx + 20 && ty === sy ? 50 : 0);

    return (
      <g 
        key={edge.id}
        onMouseEnter={() => setHoveredEdgeId(edge.id)}
        onMouseLeave={() => setHoveredEdgeId(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEdgeId(edge.id);
        }}
        className="cursor-pointer group"
      >
        {/* Invisible wider hit area for easy hover and click */}
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth={24}
          className="pointer-events-auto"
        />

        {/* Glow halo when active, hovered, or selected */}
        {(isStepActive || isHovered || isSelected) && (
          <path
            d={pathD}
            fill="none"
            stroke={isSelected ? '#f43f5e' : isHovered ? '#ff6d5a' : '#ff6d5a'}
            strokeWidth={isHovered || isSelected ? 8 : 6}
            strokeOpacity={0.4}
            className="animate-pulse"
          />
        )}

        {/* Main visible connection wire */}
        <path
          d={pathD}
          fill="none"
          stroke={isSelected ? '#f43f5e' : isHovered ? '#ff6d5a' : isStepActive ? '#ff6d5a' : isStepPassed ? '#10b981' : '#3b3f54'}
          strokeWidth={isSelected || isHovered ? 3 : isStepActive ? 2.5 : 2}
          strokeDasharray={isSelected ? '6 3' : 'none'}
          className={isStepActive ? 'animate-unifi-flow' : ''}
        />

        {/* Connector Pin Heads */}
        <circle cx={sx} cy={sy} r={isHovered ? 4.5 : 3} fill={isSelected ? '#f43f5e' : isHovered ? '#ff6d5a' : isStepActive ? '#ff6d5a' : isStepPassed ? '#10b981' : '#676a82'} />
        <circle cx={tx} cy={ty} r={isHovered ? 4.5 : 3} fill={isSelected ? '#f43f5e' : isHovered ? '#ff6d5a' : isStepActive ? '#ff6d5a' : isStepPassed ? '#10b981' : '#676a82'} />

        {/* Interactive "Disconnect / Delete Connection" Badge on Hover or Selection */}
        {(isHovered || isSelected) && (
          <foreignObject
            x={midX - 45}
            y={midY - 14}
            width={90}
            height={28}
            className="pointer-events-auto overflow-visible"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteEdge) {
                  onDeleteEdge(edge.id);
                }
                setSelectedEdgeId(null);
              }}
              title="Delete this connection line"
              className="px-2 py-1 bg-[#14151c] hover:bg-rose-950/90 text-rose-300 hover:text-rose-100 border border-rose-500/50 hover:border-rose-400 rounded-md text-[10px] font-mono font-bold shadow-lg flex items-center justify-center gap-1 transition-all"
            >
              <Trash2 className="w-2.5 h-2.5 text-rose-400" />
              <span>Disconnect</span>
            </button>
          </foreignObject>
        )}
      </g>
    );
  };

  // Render live connecting wire while dragging/clicking from output port
  const renderLiveConnectingWire = () => {
    if (!connectingSourceId) return null;
    const sourceNode = nodes.find(n => n.id === connectingSourceId);
    if (!sourceNode) return null;

    const sx = sourceNode.position.x + 240;
    const sy = sourceNode.position.y + PORT_Y_OFFSET;
    const tx = mouseCanvasPos.x;
    const ty = mouseCanvasPos.y;

    const pathD = getSmoothBezierPath(sx, sy, tx, ty);

    return (
      <g className="pointer-events-none z-30">
        <path
          d={pathD}
          fill="none"
          stroke="#ff6d5a"
          strokeWidth={6}
          strokeOpacity={0.4}
          className="animate-pulse"
        />
        <path
          d={pathD}
          fill="none"
          stroke="#ff6d5a"
          strokeWidth={2.5}
          strokeDasharray="5 3"
        />
        <circle cx={sx} cy={sy} r={4} fill="#ff6d5a" />
        <circle cx={tx} cy={ty} r={5} fill="#ff6d5a" className="animate-ping" />
      </g>
    );
  };

  return (
    <div 
      ref={canvasRef}
      onMouseDown={() => {
        if (!connectingSourceId) setIsPanning(true);
        setSelectedEdgeId(null);
      }}
      onClick={() => {
        if (connectingSourceId) setConnectingSourceId(null);
      }}
      className={`w-full h-full relative overflow-hidden select-none unifi-grid-pattern flex-1 ${
        connectingSourceId ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
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
          {renderLiveConnectingWire()}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node, index) => {
          const isCurrent = isRunning && (activeNodeId ? activeNodeId === node.id : activeExecutionIndex === index);
          const isDone = executedNodeIds.length > 0 
            ? executedNodeIds.includes(node.id) 
            : (activeExecutionIndex > index || (!isRunning && activeExecutionIndex === nodes.length - 1));
          const isConnectingSource = connectingSourceId === node.id;
          const canBeTarget = connectingSourceId && connectingSourceId !== node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDownNode(e, node)}
              onMouseUp={(e) => {
                if (connectingSourceId && connectingSourceId !== node.id) {
                  handleCompleteConnect(e, node.id);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (connectingSourceId) {
                  if (connectingSourceId !== node.id) {
                    handleCompleteConnect(e, node.id);
                  }
                  return;
                }
                if (hasDraggedRef.current) return;
                onSelectNode(node);
              }}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`
              }}
              className={`absolute w-[240px] rounded-xl bg-[#1c1e29] border transition-colors duration-150 cursor-pointer z-10 unifi-node-shadow group ${
                isConnectingSource
                  ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl'
                  : canBeTarget
                  ? 'border-dashed border-emerald-400/80 hover:border-emerald-300 ring-2 ring-emerald-500/20'
                  : isCurrent
                  ? 'border-[#ff6d5a] ring-2 ring-[#ff6d5a]/40 shadow-xl shadow-[#ff6d5a]/20 scale-105'
                  : isDone
                  ? 'border-emerald-500/50 hover:border-emerald-400'
                  : 'border-[#2c2f3f] hover:border-[#ff6d5a]/60 hover:bg-[#222533]'
              }`}
            >
              {/* Left Input Port Connector Handle */}
              {node.type !== 'unifi.identityMaster' && (
                <div 
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    if (connectingSourceId) {
                      handleCompleteConnect(e, node.id);
                    }
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (connectingSourceId) {
                      handleCompleteConnect(e, node.id);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (connectingSourceId) {
                      handleCompleteConnect(e, node.id);
                    }
                  }}
                  className={`absolute -left-[9px] top-[26px] -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#1c1e29] border-2 flex items-center justify-center transition-all shadow-md z-20 cursor-pointer ${
                    canBeTarget 
                      ? 'border-emerald-400 bg-emerald-950 scale-125 animate-pulse' 
                      : 'border-[#3b3f54] group-hover:border-[#ff6d5a]'
                  }`}
                  title={connectingSourceId ? "Click/Release to connect wire here" : "Input Port (Receive Funds/Trigger)"}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${canBeTarget ? 'bg-emerald-400' : 'bg-[#9ea2b8] group-hover:bg-[#ff6d5a]'}`} />
                </div>
              )}

              {/* Right Output Port Connector Handle (Interactive Wire Creator) */}
              <div 
                onMouseDown={(e) => handleStartConnect(e, node.id)}
                onClick={(e) => handleStartConnect(e, node.id)}
                className={`absolute -right-[9px] top-[26px] -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#1c1e29] border-2 flex items-center justify-center transition-all shadow-md z-20 cursor-pointer ${
                  isConnectingSource 
                    ? 'border-[#ff6d5a] bg-[#ff6d5a]/30 scale-125' 
                    : 'border-[#3b3f54] hover:border-[#ff6d5a] hover:scale-115'
                }`}
                title="Drag or Click to connect this node to another"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isConnectingSource ? 'bg-[#ff6d5a]' : 'bg-[#9ea2b8] group-hover:bg-[#ff6d5a]'}`} />
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

      {/* Connection Wire Helper Banner */}
      {connectingSourceId && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#1c1e29]/95 backdrop-blur-md border border-[#ff6d5a] px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 text-xs text-white animate-bounce font-mono">
          <Link2 className="w-4 h-4 text-[#ff6d5a] animate-spin" />
          <span>Click any node's <strong>Left Input Dot</strong> to complete connection</span>
          <button
            type="button"
            onClick={() => setConnectingSourceId(null)}
            className="ml-2 px-1.5 py-0.5 bg-[#2c2f3f] hover:bg-[#3b3f54] rounded text-[10px] text-[#9ea2b8] hover:text-white flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Canvas Top Overlay: Live Execution Trace Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-[#111218]/90 backdrop-blur-md border border-[#2c2f3f] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 text-xs text-[#9ea2b8] pointer-events-auto font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff6d5a] animate-pulse" />
            <span className="font-semibold text-white">UPFS Visual DAG Engine</span>
          </div>
          <span className="text-[#3b3f54]">|</span>
          <span>{nodes.length} Nodes</span>
          <span className="text-[#3b3f54]">|</span>
          <span>{edges.length} Connections</span>
          <span className="text-[#3b3f54]">|</span>
          <span className="text-cyan-400">Click right dots to link • Hover lines to disconnect</span>
        </div>

        {/* Floating Add Node Action */}
        <button
          onClick={onOpenPalette}
          className="bg-[#ff6d5a] hover:bg-[#ff5740] text-white p-2.5 rounded-xl shadow-xl shadow-[#ff6d5a]/25 pointer-events-auto flex items-center gap-1.5 text-xs font-bold transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Node</span>
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
