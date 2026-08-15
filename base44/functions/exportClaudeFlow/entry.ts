import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * exportClaudeFlow — generates a STANDALONE, self-contained HTML file
 * that renders the Agent Library as a sectioned navigation hub:
 *   HOME → 4 section boxes → sub-item lists → Google Doc links
 *
 * The exported HTML works completely independently of Base44.
 * Auth: admin only.
 */

const SECTIONS = [
  { key: 'departments', label: 'Departments', icon: '🏢', color: '#D4AF37', desc: 'Marketing, Operations, Sales & DNN News' },
  { key: 'agent_context', label: 'Agent Context', icon: '🧠', color: '#3b82f6', desc: 'Master files, brand voice, customer profiles & company knowledge' },
  { key: 'skills_sops', label: 'Skills & SOPs', icon: '📖', color: '#10b981', desc: 'Standard operating procedures & skill definitions' },
  { key: 'tools_integrations', label: 'Tools & Integrations', icon: '🔧', color: '#8b5cf6', desc: 'Gmail, Drive, Slack, Calendar & CRM connections' },
];

function escapeForScript(s) {
  return String(s || '').replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function buildHtml(nodes) {
  const nodesJson = JSON.stringify(nodes.map((n) => ({
    id: n.id,
    title: n.title,
    summary: n.summary || '',
    section: n.section || 'agent_context',
    subsection: n.subsection || '',
    google_doc_url: n.google_doc_url || '',
    content: n.content || '',
    is_priority: n.is_priority || false,
    node_order: n.node_order || 0,
  })));
  const sectionsJson = JSON.stringify(SECTIONS);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>DysonRelo Agent Library — Exported</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #fff; font-family: 'Inter', -apple-system, sans-serif; }
  #header { padding: 20px 32px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; }
  #header h1 { font-size: 22px; color: #D4AF37; font-family: Georgia, serif; }
  #header span { color: #888; font-size: 13px; }
  #back-btn { display: none; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 13px; }
  #back-btn:hover { background: rgba(255,255,255,0.08); }
  #container { max-width: 1100px; margin: 0 auto; padding: 32px; }

  /* HOME — section grid */
  .section-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 20px; }
  .section-box { border-radius: 16px; border: 2px solid; padding: 28px; cursor: pointer; transition: transform 0.15s, border-color 0.15s; display: flex; align-items: flex-start; gap: 18px; }
  .section-box:hover { transform: scale(1.02); }
  .section-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
  .section-title { font-size: 20px; font-family: Georgia, serif; margin-bottom: 4px; }
  .section-desc { color: #999; font-size: 14px; line-height: 1.5; }
  .section-count { display: inline-block; margin-top: 10px; font-size: 12px; padding: 3px 10px; border-radius: 999px; }

  /* SECTION VIEW */
  .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .section-header .section-icon { width: 56px; height: 56px; }
  .section-header h2 { font-size: 26px; font-family: Georgia, serif; }
  .section-header p { color: #999; font-size: 14px; }

  .subsection-title { font-size: 13px; font-weight: 600; color: #D4AF37; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; margin-top: 28px; }
  .subsection-title:first-child { margin-top: 0; }

  .item { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: #1a1a1a; margin-bottom: 8px; cursor: pointer; transition: border-color 0.15s, background 0.15s; text-decoration: none; color: inherit; }
  .item:hover { border-color: rgba(255,255,255,0.25); background: #222; }
  .item-icon { width: 18px; height: 18px; flex-shrink: 0; color: #666; }
  .item.priority .item-icon { color: #D4AF37; }
  .item-text { flex: 1; min-width: 0; }
  .item-title { font-size: 14px; font-weight: 500; }
  .item-summary { font-size: 12px; color: #888; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .item-ext { color: #555; flex-shrink: 0; }

  .empty { text-align: center; padding: 64px; color: #555; font-size: 16px; }
</style>
</head>
<body>
<div id="header">
  <div style="display:flex;align-items:center;gap:16px;">
    <button id="back-btn" onclick="goHome()">&#8592; Home</button>
    <h1 id="header-title">Agent Library</h1>
  </div>
  <span>Exported standalone — works offline</span>
</div>
<div id="container"></div>
<script>
  const NODES = ${escapeForScript(nodesJson)};
  const SECTIONS = ${escapeForScript(sectionsJson)};
  const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.key, s]));
  let activeSection = null;

  function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function render() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    document.getElementById('back-btn').style.display = activeSection ? 'inline-block' : 'none';

    if (!activeSection) {
      document.getElementById('header-title').textContent = 'Agent Library';
      const grid = document.createElement('div');
      grid.className = 'section-grid';
      SECTIONS.forEach(sec => {
        const count = NODES.filter(n => n.section === sec.key).length;
        const box = document.createElement('div');
        box.className = 'section-box';
        box.style.borderColor = sec.color + '40';
        box.style.background = sec.color + '0d';
        box.innerHTML =
          '<div class="section-icon" style="background:' + sec.color + '20;border:1px solid ' + sec.color + '50">' + sec.icon + '</div>' +
          '<div style="flex:1">' +
            '<div class="section-title">' + esc(sec.label) + '</div>' +
            '<div class="section-desc">' + esc(sec.desc) + '</div>' +
            '<span class="section-count" style="background:' + sec.color + '20;color:' + sec.color + '">' + count + (count === 1 ? ' item' : ' items') + '</span>' +
          '</div>' +
          '<div style="color:#555;font-size:20px">&#8250;</div>';
        box.onclick = () => { activeSection = sec.key; render(); };
        grid.appendChild(box);
      });
      container.appendChild(grid);
      return;
    }

    // Section view
    const sec = SECTION_MAP[activeSection];
    document.getElementById('header-title').textContent = sec.label;
    const items = NODES.filter(n => n.section === activeSection).sort((a,b) => (a.node_order||0) - (b.node_order||0));
    const hasSubs = activeSection === 'departments';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML =
      '<div class="section-icon" style="background:' + sec.color + '20;border:1px solid ' + sec.color + '50">' + sec.icon + '</div>' +
      '<div><h2>' + esc(sec.label) + '</h2><p>' + esc(sec.desc) + '</p></div>';
    container.appendChild(header);

    if (items.length === 0) {
      container.innerHTML += '<div class="empty">No nodes in this section yet.</div>';
      return;
    }

    if (hasSubs) {
      const subs = [...new Set(items.map(n => n.subsection || 'General'))];
      subs.forEach(sub => {
        const subEl = document.createElement('div');
        subEl.innerHTML = '<div class="subsection-title">' + esc(sub) + '</div>';
        const list = document.createElement('div');
        items.filter(n => (n.subsection || 'General') === sub).forEach(n => list.appendChild(renderItem(n)));
        container.appendChild(subEl);
        container.appendChild(list);
      });
    } else {
      items.forEach(n => container.appendChild(renderItem(n)));
    }
  }

  function renderItem(n) {
    const el = document.createElement('a');
    el.className = 'item' + (n.is_priority ? ' priority' : '');
    if (n.google_doc_url) { el.href = n.google_doc_url; el.target = '_blank'; }
    el.innerHTML =
      '<svg class="item-icon" viewBox="0 0 24 24" fill="' + (n.is_priority ? '#D4AF37' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14l-6-4.6h7.6z"/></svg>' +
      '<div class="item-text">' +
        '<div class="item-title">' + esc(n.title) + '</div>' +
        (n.summary ? '<div class="item-summary">' + esc(n.summary) + '</div>' : '') +
      '</div>' +
      (n.google_doc_url ? '<svg class="item-ext" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>' : '');
    return el;
  }

  function goHome() { activeSection = null; render(); }
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

    const file = new File([html], 'agent-library.html', { type: 'text/html' });
    const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      file_url: upload.file_url,
      node_count: nodes.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}