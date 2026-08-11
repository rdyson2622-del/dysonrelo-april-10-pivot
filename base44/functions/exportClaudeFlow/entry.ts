import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * exportClaudeFlow — generates a STANDALONE, self-contained HTML file
 * that renders the full Claude node flow chart with clickable nodes.
 *
 * The exported HTML works completely independently of Base44 — open it
 * in any browser, share it, host it anywhere. All node content, positions,
 * and connections are embedded as JSON inside the file.
 *
 * Auth: admin only.
 */

const CATEGORY_COLORS = {
  context: { bg: '#1e3a5f', border: '#3b82f6', label: 'Context' },
  instruction: { bg: '#3d3517', border: '#D4AF37', label: 'Instruction' },
  prompt: { bg: '#2d1b4e', border: '#8b5cf6', label: 'Prompt' },
  reference: { bg: '#0d3320', border: '#10b981', label: 'Reference' },
  output: { bg: '#3d2517', border: '#f59e0b', label: 'Output' },
  decision: { bg: '#3d1717', border: '#ef4444', label: 'Decision' },
};

function escapeForScript(s) {
  return String(s || '').replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function buildHtml(nodes) {
  const nodesJson = JSON.stringify(nodes.map((n) => ({
    id: n.id,
    title: n.title,
    summary: n.summary || '',
    content: n.content || '',
    google_doc_url: n.google_doc_url || '',
    category: n.category || 'instruction',
    position_x: n.position_x || 100,
    position_y: n.position_y || 100,
    connected_to: n.connected_to || [],
  })));

  const colorsJson = JSON.stringify(CATEGORY_COLORS);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Claude Node Flow Chart — Exported</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #fff; font-family: 'Inter', -apple-system, sans-serif; overflow: hidden; }
  #header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; }
  #header h1 { font-size: 20px; color: #D4AF37; font-family: Georgia, serif; }
  #header span { color: #888; font-size: 13px; }
  #canvas-wrap { position: relative; width: 100%; height: calc(100vh - 60px); overflow: auto; }
  #canvas { position: relative; width: 4000px; height: 3000px; }
  #svg-layer { position: absolute; inset: 0; width: 4000px; height: 3000px; pointer-events: none; }
  .node { position: absolute; width: 220px; height: 90px; border-radius: 8px; border-width: 2px; border-style: solid; padding: 12px; cursor: pointer; user-select: none; transition: box-shadow 0.2s; }
  .node:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
  .node-cat { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .node-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .node-summary { font-size: 11px; color: #aaa; margin-top: 4px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  #modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
  #modal-overlay.active { display: flex; }
  #modal { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; max-width: 700px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 32px; }
  #modal-cat { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; border-width: 1px; border-style: solid; }
  #modal-title { font-size: 26px; font-family: Georgia, serif; margin-bottom: 8px; }
  #modal-summary { color: #999; font-size: 16px; margin-bottom: 20px; }
  #modal-doc-link { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(212,175,55,0.4); background: rgba(212,175,55,0.1); color: #e8c84a; font-size: 13px; text-decoration: none; margin-bottom: 20px; }
  #modal-doc-link:hover { background: rgba(212,175,55,0.2); }
  #modal-content { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.6; color: #ddd; font-size: 14px; }
  #modal-content h1, #modal-content h2, #modal-content h3 { color: #fff; margin: 12px 0 8px; }
  #modal-content h1 { font-size: 20px; } #modal-content h2 { font-size: 17px; } #modal-content h3 { font-size: 15px; }
  #modal-content code { background: #222; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  #modal-content pre { background: #222; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 8px 0; }
  #modal-content ul, #modal-content ol { padding-left: 24px; margin: 8px 0; }
  #modal-content a { color: #D4AF37; }
  #modal-links { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .link-group { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; }
  .link-group h4 { font-size: 12px; font-weight: 600; color: #D4AF37; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
  .link-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; }
  .link-item:hover { background: rgba(255,255,255,0.05); }
  .link-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  #close-btn { position: fixed; top: 20px; right: 20px; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 13px; z-index: 101; }
  #close-btn:hover { background: #2a2a2a; }
  .empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #555; font-size: 16px; }
</style>
</head>
<body>
<div id="header">
  <h1>Claude Node Flow Chart</h1>
  <span>Exported standalone — works offline</span>
</div>
<div id="canvas-wrap">
  <div id="canvas">
    <svg id="svg-layer">
      <defs><marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#D4AF37" opacity="0.6"/></marker></defs>
    </svg>
    <div id="nodes-layer"></div>
    <div class="empty" id="empty-msg" style="display:none;">No nodes in this export.</div>
  </div>
</div>
<div id="modal-overlay">
  <button id="close-btn" onclick="closeModal()">&times; Close</button>
  <div id="modal"></div>
</div>
<script>
  const NODES = ${escapeForScript(nodesJson)};
  const COLORS = ${escapeForScript(colorsJson)};
  const NODE_W = 220, NODE_H = 90;

  function render() {
    const nodesLayer = document.getElementById('nodes-layer');
    const svg = document.getElementById('svg-layer');
    nodesLayer.innerHTML = '';
    while (svg.children.length > 1) svg.removeChild(svg.lastChild);

    if (NODES.length === 0) { document.getElementById('empty-msg').style.display = 'flex'; return; }

    NODES.forEach(n => {
      const c = COLORS[n.category] || COLORS.instruction;
      const el = document.createElement('div');
      el.className = 'node';
      el.style.left = n.position_x + 'px';
      el.style.top = n.position_y + 'px';
      el.style.background = c.bg;
      el.style.borderColor = c.border;
      el.innerHTML = '<div class="node-cat" style="color:' + c.border + '">' + c.label + '</div>' +
        '<div class="node-title">' + esc(n.title) + '</div>' +
        (n.summary ? '<div class="node-summary">' + esc(n.summary) + '</div>' : '');
      el.onclick = () => openNode(n.id);
      nodesLayer.appendChild(el);
    });

    NODES.forEach(n => {
      (n.connected_to || []).forEach(tid => {
        const t = NODES.find(x => x.id === tid);
        if (!t) return;
        const sx = n.position_x + NODE_W, sy = n.position_y + NODE_H/2;
        const ex = t.position_x, ey = t.position_y + NODE_H/2;
        const midX = (sx + ex) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M ' + sx + ' ' + sy + ' C ' + midX + ' ' + sy + ', ' + midX + ' ' + ey + ', ' + ex + ' ' + ey);
        path.setAttribute('stroke', '#D4AF37');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.5');
        path.setAttribute('marker-end', 'url(#ah)');
        svg.appendChild(path);
      });
    });
  }

  function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function renderMarkdown(md) {
    return esc(md).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\`(.+?)\`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>').replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>');
  }

  function openNode(id) {
    const n = NODES.find(x => x.id === id);
    if (!n) return;
    const c = COLORS[n.category] || COLORS.instruction;
    const connected = (n.connected_to || []).map(tid => NODES.find(x => x.id === tid)).filter(Boolean);
    const incoming = NODES.filter(x => (x.connected_to || []).includes(id));

    let html = '<div id="modal-cat" style="background:' + c.bg + ';border-color:' + c.border + ';color:' + c.border + '">' + c.label + '</div>';
    html += '<div id="modal-title">' + esc(n.title) + '</div>';
    if (n.summary) html += '<div id="modal-summary">' + esc(n.summary) + '</div>';
    if (n.google_doc_url) html += '<a id="modal-doc-link" href="' + esc(n.google_doc_url) + '" target="_blank">Open Google Doc</a>';
    if (n.content) html += '<div id="modal-content">' + renderMarkdown(n.content) + '</div>';

    if (connected.length || incoming.length) {
      html += '<div id="modal-links">';
      if (connected.length) {
        html += '<div class="link-group"><h4>Connects To (' + connected.length + ')</h4>';
        connected.forEach(m => { const mc = COLORS[m.category] || COLORS.instruction; html += '<div class="link-item" onclick="openNode(\\'' + m.id + '\\')"><span class="link-dot" style="background:' + mc.border + '"></span>' + esc(m.title) + '</div>'; });
        html += '</div>';
      }
      if (incoming.length) {
        html += '<div class="link-group"><h4>Linked From (' + incoming.length + ')</h4>';
        incoming.forEach(m => { const mc = COLORS[m.category] || COLORS.instruction; html += '<div class="link-item" onclick="openNode(\\'' + m.id + '\\')"><span class="link-dot" style="background:' + mc.border + '"></span>' + esc(m.title) + '</div>'; });
        html += '</div>';
      }
      html += '</div>';
    }

    document.getElementById('modal').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
  }

  function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }
  document.getElementById('modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'modal-overlay') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  render();
</script>
</body>
</html>`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const nodes = await base44.asServiceRole.entities.ClaudeNode.list('node_order', 500);
    const html = buildHtml(nodes);

    const file = new File([html], 'claude-flow-chart.html', { type: 'text/html' });
    const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      file_url: upload.file_url,
      node_count: nodes.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}