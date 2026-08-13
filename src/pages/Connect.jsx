import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Check, RefreshCw, Sparkles, MessageSquare, MousePointer, Code } from 'lucide-react';

export default function Connect() {
  const [copied, setCopied] = useState(false);
  const serverUrl = new URL('/api/mcp', window.location.origin).toString();

  const copyUrl = () => {
    navigator.clipboard.writeText(serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h2 className="text-3xl font-serif text-white mb-3">Connect Your AI Assistant to DysonRelo</h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Point any MCP-compatible AI client at DysonRelo's MCP server to let your assistant query app data, run backend functions, and message in-app agents — acting securely as your signed-in user.
          </p>
        </div>

        {/* Server URL Card */}
        <div className="mb-8 rounded-xl border border-dyson-gold/30 bg-dyson-gold/5 p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-dyson-gold mb-2 block">MCP Server URL</label>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-sm text-white font-mono overflow-x-auto whitespace-nowrap">
              {serverUrl}
            </code>
            <Button onClick={copyUrl} className="gold-btn border-0 shrink-0">
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">This URL is unique to this app. Copy it and paste it into your AI client below.</p>
        </div>

        {/* Client Tabs */}
        <Tabs defaultValue="claude" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-dyson-charcoal border border-white/10">
            <TabsTrigger value="claude" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Claude
            </TabsTrigger>
            <TabsTrigger value="chatgpt" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> ChatGPT
            </TabsTrigger>
            <TabsTrigger value="cursor" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <MousePointer className="w-3.5 h-3.5 mr-1.5" /> Cursor
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-dyson-gold/20 data-[state=active]:text-dyson-gold text-gray-400">
              <Code className="w-3.5 h-3.5 mr-1.5" /> Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="claude" className="rounded-xl border border-white/10 bg-dyson-charcoal/50 p-6">
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
            <ol className="space-y-4">
              {step(1, <>Open <strong className="text-white">Cursor</strong> → <strong className="text-white">Settings</strong> → <strong className="text-white">Tools & Integrations</strong>.</>)}
              {step(2, <>Click <strong className="text-white">"New MCP Server"</strong> — this opens <code className="text-dyson-gold">mcp.json</code>.</>)}
              {step(3, <>Add an entry with <code className="text-dyson-gold">"url"</code> set to the server URL above. Save and <strong className="text-white">toggle it on</strong>.</>)}
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