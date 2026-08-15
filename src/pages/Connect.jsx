import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Check, RefreshCw, Sparkles, MessageSquare, MousePointer, Code, Webhook } from 'lucide-react';

export default function Connect() {
  const [copied, setCopied] = useState('');
  const serverUrl = new URL('/api/mcp', window.location.origin).toString();
  const webhookUrl = new URL('/api/functions/claudeWebhook', window.location.origin).toString();

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const step = (n, content) => (
    <li className="flex gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-dyson-gold/20 text-dyson-gold flex items-center justify-center text-xs font-bold">{n}</span>
      <div className="text-sm text-gray-300 leading-relaxed pt-0.5">{content}</div>
    </li>
  );

  const consentStep = (n) => step(n, <>A browser window opens to the DysonRelo consent page — <strong className="text-white">sign in with your DysonRelo account</strong> and approve. Your assistant now acts securely as you.</>);

  return (
    <div className="min-h-screen bg-dyson-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <h1 className="text-lg font-serif text-dyson-gold">Connect AI Assistant</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-serif text-white mb-3">Connect Cursor &amp; Grok to DysonRelo</h2>
          <p className="text-gray-400 text-base leading-relaxed">
            <strong className="text-white">Claude is retired</strong> as the operating team. Use <strong className="text-white">Cursor</strong> to build the Base44 app and <strong className="text-white">Grok Bot</strong> for briefs and visuals.
            Departmental specialists live at <Link to="/admin/specialists" className="text-dyson-gold underline">/admin/specialists</Link>.
            The webhook and MCP options below still work if a client needs to trigger live tools.
          </p>
        </div>

        {/* Webhook URL Card — the working solution */}
        <div className="mb-8 rounded-xl border border-dyson-gold/30 bg-dyson-gold/5 p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2 block">Webhook API URL</label>
          <div className="flex items-center gap-3 mb-3">
            <code className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-sm text-white font-mono overflow-x-auto whitespace-nowrap">
              {webhookUrl}
            </code>
            <Button onClick={() => copy(webhookUrl, 'url')} className="gold-btn border-0 shrink-0">
              {copied === 'url' ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied === 'url' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <label className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2 block">API Key (put in x-api-key header)</label>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-sm text-white font-mono overflow-x-auto whitespace-nowrap">
              •••••••• (visible in Settings → Secrets)
            </code>
          </div>
          <div className="mt-3 rounded-lg border border-dyson-gold/30 bg-dyson-gold/10 p-3">
            <p className="text-xs text-white leading-relaxed">
              <strong className="text-dyson-gold">⚠️ IMPORTANT:</strong> The API key is the <em>secret value</em> you set for <code className="text-dyson-gold">CLAUDELIBRARYAPIKEY</code> in your app's <strong>Settings → Secrets</strong> dashboard — <strong className="text-white">NOT</strong> the literal string "CLAUDELIBRARYAPIKEY". Copy the actual value from the secrets dashboard and give it to your AI assistant to use as the <code className="text-dyson-gold">x-api-key</code> header.
            </p>
          </div>
        </div>

        {/* Client Tabs */}
        <Tabs defaultValue="cursor" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-dyson-charcoal border border-white/10">
            <TabsTrigger value="cursor" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <MousePointer className="w-3.5 h-3.5 mr-1.5" /> Cursor
            </TabsTrigger>
            <TabsTrigger value="grok" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Grok Bot
            </TabsTrigger>
            <TabsTrigger value="webhook" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <Webhook className="w-3.5 h-3.5 mr-1.5" /> Webhook API
            </TabsTrigger>
            <TabsTrigger value="chatgpt" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> ChatGPT
            </TabsTrigger>
            <TabsTrigger value="claude" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <Code className="w-3.5 h-3.5 mr-1.5" /> Claude (retired)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webhook" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-serif text-white mb-1">Simple Webhook API (Recommended)</h3>
              <p className="text-sm text-gray-400">No OAuth, no MCP protocol. Just a POST request with an API key header. Works with any AI client that can make HTTP requests.</p>
            </div>

            <div className="space-y-4">
              {/* How it works */}
              <div className="rounded-lg border border-dyson-gold/20 bg-black/30 p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2">How to Call</p>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{`POST ${webhookUrl}
Header: x-api-key: <your CLAUDELIBRARYAPIKEY value>
Content-Type: application/json

Body:
{
  "tool": "<tool_name>",
  "args": { ...tool arguments... }
}`}</pre>
              </div>

              {/* List tools */}
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2">List Available Tools</p>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{`GET ${webhookUrl}
Header: x-api-key: <your CLAUDELIBRARYAPIKEY value>`}</pre>
                <p className="text-xs text-gray-500 mt-2">Returns the full list of 8 tools with their required and optional arguments.</p>
              </div>

              {/* Example call */}
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2">Example: Generate Referral Agreement</p>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{`{
  "tool": "generate_referral_agreement",
  "args": {
    "list_agent_name": "Jane Smith",
    "broker_name": "Compass Realty",
    "property_address": "456 Oak Ave, Nashville TN"
  }
}`}</pre>
              </div>

              {/* The 8 tools */}
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-3">Available Tools (9)</p>
                <div className="space-y-2 text-xs">
                  {[
                    ['find_destination_agents', 'seller_outreach_id, destination_city, destination_state'],
                    ['create_owner_outreach_campaign', 'listing_owner_id'],
                    ['send_owner_sms_batch', 'owners (array)'],
                    ['run_morning_broadcast', 'action (generate|render|run|check)'],
                    ['generate_daily_articles', '(none)'],
                    ['trigger_broadcast_distribution', 'entity_id'],
                    ['render_article_video', 'article_id'],
                    ['generate_referral_agreement', 'list_agent_name, broker_name, property_address'],
                    ['list_referral_agents', '(none) — optional: list_name, city, status, limit'],
                  ].map(([name, reqArgs]) => (
                    <div key={name} className="flex flex-col sm:flex-row gap-1 sm:gap-3 pb-2 border-b border-white/5 last:border-0">
                      <code className="text-dyson-gold font-mono shrink-0">{name}</code>
                      <span className="text-gray-500">required: {reqArgs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cursor / Grok webhook instructions */}
              <div className="rounded-lg border border-dyson-gold/20 bg-dyson-gold/5 p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2">Using with Cursor or Grok</p>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2"><span className="text-dyson-gold font-bold">1.</span> In Cursor, name the departmental specialist, then ask it to call this webhook when a live tool is needed.</li>
                  <li className="flex gap-2"><span className="text-dyson-gold font-bold">2.</span> Give the assistant this instruction:<br/><code className="text-xs text-dyson-gold break-all">You have access to a webhook API at {webhookUrl}. Use the x-api-key header with the value [your CLAUDELIBRARYAPIKEY]. GET to list tools, POST with {`{"tool":"<name>","args":{...}}`} to execute.</code></li>
                  <li className="flex gap-2"><span className="text-dyson-gold font-bold">3.</span> Grok Bot should not call this webhook — it writes a brief; Cursor executes tools.</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="grok" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-serif text-white mb-1">Grok Bot — briefs and visuals</h3>
              <p className="text-sm text-gray-400">Grok does not edit the Base44 app. It writes a handoff; Cursor builds it. If the xAI account is still suspended, skip visuals and type the same brief in Cursor.</p>
            </div>
            <ol className="space-y-4">
              {step(1, <>Create <code className="text-dyson-gold">briefs/from-grok/YYYY-MM-DD-short-slug/HANDOFF.md</code> from the template in <code className="text-dyson-gold">briefs/HANDOFF_TEMPLATE.md</code>.</>)}
              {step(2, <>Set <strong className="text-white">Department</strong> to Marketing, Operations, Sales, DNN News, or Finance.</>)}
              {step(3, <>Put mockups or MP4s in <code className="text-dyson-gold">assets/from-grok/YYYY-MM-DD-short-slug/</code> when image tools are available again.</>)}
              {step(4, <>Open a GitHub PR (label <strong className="text-white">from-grok</strong> if it exists) and tell Cursor it is ready.</>)}
            </ol>
          </TabsContent>

          <TabsContent value="claude" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-100">Claude is retired as the DysonRelo operating team. Use Cursor + Grok. These MCP steps remain only as a legacy fallback.</p>
            </div>
            <ol className="space-y-4">
              {step(1, <>Open <strong className="text-white">Claude Desktop</strong> → click your profile menu (top-left) → <strong className="text-white">Settings</strong>.</>)}
              {step(2, <>Select <strong className="text-white">Connectors</strong> → click <strong className="text-white">"Add custom connector"</strong>.</>)}
              {step(3, <>Name it <strong className="text-white">DysonRelo</strong> and paste the server URL above. Click <strong className="text-white">Add</strong>.</>)}
              {consentStep(4)}
            </ol>
          </TabsContent>

          <TabsContent value="chatgpt" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
            <ol className="space-y-4">
              {step(1, <>Open <strong className="text-white">ChatGPT</strong> → go to <strong className="text-white">Apps</strong> and enable <strong className="text-white">Developer mode</strong> (accept the risk warning ChatGPT shows).</>)}
              {step(2, <>Click <strong className="text-white">"Create app"</strong> → name it <strong className="text-white">DysonRelo</strong> → paste the server URL above → <strong className="text-white">Create</strong>.</>)}
              {step(3, <>In the chat composer, <strong className="text-white">enable the DysonRelo app</strong> before prompting it.</>)}
              {consentStep(4)}
            </ol>
          </TabsContent>

          <TabsContent value="cursor" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-serif text-white mb-1">Cursor — builder and coordinator</h3>
              <p className="text-sm text-gray-400">Start a Cloud Agent at cursor.com/agents on this repo, or chat in Cursor desktop. Name the desk first: Marketing, Operations, Sales, DNN News, or Finance. No xAI login is required for Cursor.</p>
            </div>
            <ol className="space-y-4">
              {step(1, <>Open a Cursor Cloud Agent or desktop chat on the <strong className="text-white">dysonrelo-april-10-pivot</strong> repo.</>)}
              {step(2, <>Start with the specialist name, e.g. <code className="text-dyson-gold">DNN News Specialist: fix this morning&apos;s broadcast script review.</code></>)}
              {step(3, <>Optional live tools: <strong className="text-white">Settings</strong> → <strong className="text-white">Tools & Integrations</strong> → <strong className="text-white">New MCP Server</strong> and set <code className="text-dyson-gold">url</code> to the MCP server URL above.</>)}
              {consentStep(4)}
            </ol>
          </TabsContent>

          <TabsContent value="custom" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
            <ol className="space-y-4">
              {step(1, <>Copy the server URL above.</>)}
              {step(2, <>Add it as a <strong className="text-white">streamable HTTP MCP server</strong> in your client. A name and the URL are all most clients need.</>)}
              {step(3, <><strong className="text-white">Reload</strong> your client to pick up the tool list.</>)}
              {consentStep(4)}
            </ol>
          </TabsContent>
        </Tabs>

        {/* Refresh note */}
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4 flex items-start gap-3">
          <RefreshCw className="w-4 h-4 text-dyson-gold shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400">
            <strong className="text-white">Heads up:</strong> Assistants cache the tool list. If we ship changes to the exposed tools, refresh or re-add the connector in your client to pick up the new tools.
          </p>
        </div>
      </div>
    </div>
  );
}