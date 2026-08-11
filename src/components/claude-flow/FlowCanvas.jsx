import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const CATEGORY_COLORS = {
  context: { bg: '#1e3a5f', border: '#3b82f6', label: 'Context' },
  instruction: { bg: '#3d3517', border: '#D4AF37', label: 'Instruction' },
  prompt: { bg: '#2d1b4e', border: '#8b5cf6', label: 'Prompt' },
  reference: { bg: '#0d3320', border: '#10b981', label: 'Reference' },
  output: { bg: '#3d2517', border: '#f59e0b', label: 'Output' },
  decision: { bg: '#3d1717', border: '#ef4444', label: 'Decision' },
};

export const NODE_W = 220;
export const NODE_H = 90;

export default function FlowCanvas({ nodes, onPositionChange, onSavePosition, editable }) {
  const navigate = useNavigate();
  const [dragId, setDragId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [moved, setMoved] = useState(false);
  const canvasRef = useRef(null);

  const handleNodeMouseDown = (e, node) => {
    if (!editable) return;
    e.stopPropagation();
    setDragId(node.id);
    setDragOffset({ x: e.clientX - node.position_x, y: e.clientY - node.position_y });
    setMoved(false);
  };

  const handleMouseMove = (e) => {
    if (!dragId) return;
    if (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0) setMoved(true);
    const newX = Math.max(0, e.clientX - dragOffset.x);
    const newY = Math.max(0, e.clientY - dragOffset.y);
    onPositionChange(dragId, newX, newY);
  };

  const handleMouseUp = () => {
    if (!dragId) return;
    if (moved) {
      const node = nodes.find((n) => n.id === dragId);
      if (node) onSavePosition(dragId, node.position_x, node.position_y);
    } else {
      navigate(`/admin/claude-node/${dragId}`);
    }
    setDragId(null);
    setMoved(false);
  };

  const connections = [];
  nodes.forEach((node) => {
    (node.connected_to || []).forEach((targetId) => {
      const target = nodes.find((n) => n.id === targetId);
      if (target) {
        const sx = node.position_x + NODE_W;
        const sy = node.position_y + NODE_H / 2;
        const ex = target.position_x;
        const ey = target.position_y + NODE_H / 2;
        const midX = (sx + ex) / 2;
        connections.push({
          key: `${node.id}-${targetId}`,
          path: `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}`,
        });
      }
    });
  });

  return (
    <div
      ref={canvasRef}
      className="relative overflow-auto rounded-lg border border-white/10 bg-dyson-ink"
      style={{ height: 'calc(100vh - 220px)', cursor: dragId ? 'grabbing' : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative" style={{ width: 4000, height: 3000 }}>
        <svg className="absolute inset-0 pointer-events-none" style={{ width: 4000, height: 3000 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#D4AF37" opacity="0.6" />
            </marker>
          </defs>
          {connections.map((c) => (
            <path
              key={c.key}
              d={c.path}
              stroke="#D4AF37"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
              markerEnd="url(#arrowhead)"
            />
          ))}
        </svg>
        {nodes.map((node) => {
          const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.instruction;
          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              onClick={() => {
                if (!editable) navigate(`/admin/claude-node/${node.id}`);
              }}
              className="absolute rounded-lg border-2 p-3 transition-shadow hover:shadow-xl"
              style={{
                left: node.position_x,
                top: node.position_y,
                width: NODE_W,
                height: NODE_H,
                background: colors.bg,
                borderColor: colors.border,
                cursor: editable ? (dragId === node.id ? 'grabbing' : 'grab') : 'pointer',
                userSelect: 'none',
              }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: colors.border }}>
                {colors.label}
              </div>
              <div className="text-white text-sm font-medium truncate">{node.title}</div>
              {node.summary && (
                <div className="text-gray-400 text-xs mt-1 line-clamp-2">{node.summary}</div>
              )}
            </div>
          );
        })}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No nodes yet</p>
              <p className="text-sm">Click "Add Node" to create your first Claude node.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}