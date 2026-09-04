'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Download, 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Globe, 
  CheckCircle2, 
  Activity, 
  Loader2, 
  Play, 
  Code2 
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';

interface IntegrationsViewProps {
  apiOrigin: string;
  copiedField: string | null;
  copyToClipboard: (text: string, fieldId: string) => void;
  apiTestStatus: 'idle' | 'testing' | 'success' | 'error';
  apiTestResult: any;
  handleTestApi: () => void;
}

export const IntegrationsView = ({
  apiOrigin,
  copiedField,
  copyToClipboard,
  apiTestStatus,
  apiTestResult,
  handleTestApi,
}: IntegrationsViewProps) => {
  return (
    <motion.div
      key="integrations"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Cpu className="text-primary drop-shadow-[0_0_8px_var(--color-primary)]" size={26} />
            API Headless &amp; Serveur MCP Universel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connectez Funnel AI Studio à ChatGPT, Claude Desktop, Antigravity, Cursor ou vos scripts automatiques.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/openapi.yaml"
            download="openapi.yaml"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-bold tracking-wider transition-colors shadow-xs"
          >
            <Download size={14} />
            OPENAPI YAML (CHATGPT)
          </a>
          <a
            href="/openapi.json"
            download="openapi.json"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold tracking-wider transition-colors shadow-xs"
          >
            <Download size={14} className="text-muted-foreground" />
            OPENAPI JSON
          </a>
        </div>
      </div>

      {/* Grid Cards: MCP + REST API + ChatGPT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MCP Server Card */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-primary" size={20} />
                <h3 className="font-bold text-base text-foreground">Serveur MCP (Model Context Protocol)</h3>
              </div>
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase rounded-lg border border-primary/20">
                Stdio Ready
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Permet à Claude Desktop, Cursor et Antigravity d&apos;invoquer directement les 13 agents IA pour créer des tunnels complets via des outils natifs (Tool Calling).
            </p>

            <div className="space-y-3">
              <div className="text-[11px] font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary" />
                Outils Exposés (Tools)
              </div>
              <ul className="text-xs space-y-2 text-muted-foreground font-mono bg-muted/40 p-3 rounded-xl border border-border">
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-bold">funnel_create_complete</span>
                  <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">Génération 100% autonome</span>
                </li>
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-semibold">funnel_analyze_offer</span>
                  <span className="text-[10px] text-muted-foreground">Analyse &amp; Diagnostic</span>
                </li>
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-semibold">funnel_refine_strategy</span>
                  <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">Tarifs, Garantie, Témoignages</span>
                </li>
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-semibold">funnel_generate_image</span>
                  <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">Image Hero IA (Gemini Imagen)</span>
                </li>
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-semibold">funnel_modify_code</span>
                  <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Édition Sandbox (HTML/CSS/JS)</span>
                </li>
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-semibold">funnel_export_bundle</span>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Export ZIP &amp; Standalone</span>
                </li>
                <li className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="text-foreground font-semibold">funnel_list_templates</span>
                  <span className="text-[10px] text-muted-foreground">Catalogue Templates</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-foreground font-semibold">funnel_engine_health</span>
                  <span className="text-[10px] text-muted-foreground">Statut &amp; Santé Moteur</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-2">Commande de lancement :</p>
            <div className="bg-muted/80 p-3 rounded-xl border border-border font-mono text-xs text-primary flex items-center justify-between">
              <code>npm run mcp</code>
              <button
                onClick={() => copyToClipboard('npm run mcp', 'mcp')}
                className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
                title="Copier"
              >
                {copiedField === 'mcp' ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* ChatGPT Actions Card */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="text-accent" size={20} />
                <h3 className="font-bold text-base text-foreground">ChatGPT Custom GPTs Actions</h3>
              </div>
              <span className="px-2.5 py-1 bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase rounded-lg border border-accent/20">
                OpenAPI 3.1
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Permet à ChatGPT d&apos;agir comme un concepteur de tunnels de vente en branchant l&apos;API via une Action Custom GPT sans une seule ligne de code.
            </p>

            <div className="space-y-3">
              <div className="text-[11px] font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-accent" />
                Guide Rapide de Configuration
              </div>
              <ol className="text-xs space-y-2 text-muted-foreground bg-muted/40 p-3.5 rounded-xl border border-border list-decimal list-inside">
                <li>Allez dans ChatGPT &gt; <strong>Explore GPTs</strong> &gt; <strong>Create a GPT</strong>.</li>
                <li>Dans l&apos;onglet <strong>Configure</strong>, cliquez sur <strong>Create new action</strong>.</li>
                <li>Dans <em>Import from URL</em>, collez l&apos;URL YAML recommandée ci-dessous.</li>
                <li>ChatGPT importe le schéma avec toutes les routes et peut générer des tunnels clé en main !</li>
              </ol>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  URL OpenAPI YAML (Recommandé) :
                </span>
                <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-semibold">ChatGPT Custom GPT</span>
              </div>
              <div className="bg-muted/80 p-2.5 rounded-xl border border-border font-mono text-xs text-primary flex items-center justify-between">
                <code className="truncate mr-2">{apiOrigin}/api/v1/openapi.yaml</code>
                <button
                  onClick={() => copyToClipboard(`${apiOrigin}/api/v1/openapi.yaml`, 'yaml')}
                  className="p-1 hover:text-foreground text-muted-foreground transition-colors shrink-0 cursor-pointer"
                  title="Copier"
                >
                  {copiedField === 'yaml' ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  URL OpenAPI JSON :
                </span>
              </div>
              <div className="bg-muted/80 p-2.5 rounded-xl border border-border font-mono text-xs text-accent flex items-center justify-between">
                <code className="truncate mr-2">{apiOrigin}/api/v1/openapi</code>
                <button
                  onClick={() => copyToClipboard(`${apiOrigin}/api/v1/openapi`, 'json')}
                  className="p-1 hover:text-foreground text-muted-foreground transition-colors shrink-0 cursor-pointer"
                  title="Copier"
                >
                  {copiedField === 'json' ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live API Tester */}
      <div className="bg-card p-5 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                Testeur Live API &amp; Healthcheck
                {apiTestStatus === 'success' && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">
                    En ligne ({apiTestResult?.latencyMs || 'OK'})
                  </span>
                )}
                {apiTestStatus === 'error' && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full border border-red-500/20">
                    Erreur
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                Vérifiez la connectivité en temps réel entre vos clients externes (ChatGPT, MCP, cURL) et le moteur API.
              </p>
            </div>
          </div>
          <button
            onClick={handleTestApi}
            disabled={apiTestStatus === 'testing'}
            className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-xl text-xs font-bold tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {apiTestStatus === 'testing' ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                TEST EN COURS...
              </>
            ) : (
              <>
                <Play size={14} />
                TESTER L&apos;API EN DIRECT
              </>
            )}
          </button>
        </div>

        {apiTestResult && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Réponse JSON reçue (/api/v1/health) :
            </div>
            <pre className="bg-muted/80 p-3 rounded-xl border border-border text-xs font-mono text-foreground overflow-x-auto max-h-40">
              {JSON.stringify(apiTestResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Code Configuration Snippets */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Code2 className="text-primary" size={18} />
          Snippets de Configuration &amp; Documentation API
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeBlock
            filename="claude_desktop_config.json"
            language="json"
            code={`{
  "mcpServers": {
    "funnel-ai-studio": {
      "command": "node",
      "args": ["/chemin/absolu/vers/mcp-server/index.mjs"],
      "env": {
        "FUNNEL_API_URL": "${apiOrigin}/api/v1"
      }
    }
  }
}`}
          />

          <CodeBlock
            filename="curl-generate-funnel.sh"
            language="bash"
            code={`curl -X POST ${apiOrigin}/api/v1/funnels/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "request": "Coaching privé High-Ticket pour dirigeants d entreprise, 3500€, promesse: doubler sa rentabilité en 90 jours",
    "templateId": "coaching-high-ticket",
    "generateHeroImage": true
  }'`}
          />
        </div>
      </div>
    </motion.div>
  );
};
