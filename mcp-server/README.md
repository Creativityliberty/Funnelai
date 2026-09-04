# Funnel AI Studio™ — Universal MCP Server

Serveur MCP (Model Context Protocol) permettant à **ChatGPT, Claude Desktop, Antigravity, Cursor** et tout agent autonome de piloter directement la génération de tunnels de vente haute conversion via Funnel AI Studio.

---

## 🛠️ Outils (Tools) Exposés

1. **`funnel_create_complete`**
   - Génère l'intégralité du tunnel (HTML5 sémantique, CSS Luxe, Scripts JS, Image Hero, Copywriting 15 étapes Gusten Sun).
   - Paramètres : `request` (string, requis), `templateId` (string, optionnel), `generateHeroImage` (boolean).

2. **`funnel_analyze_offer`**
   - Analyse rapide de l'offre commerciale, formulation de la promesse centrale et proposition de valeur.

3. **`funnel_list_templates`**
   - Liste tous les templates de tunnel de vente calibrés disponibles.

4. **`funnel_engine_health`**
   - Contrôle la santé et la disponibilité de l'API Funnel AI.

---

## 🚀 Configuration dans Claude Desktop (`claude_desktop_config.json`)

Ajoutez cette configuration dans votre fichier `~/Library/Application Support/Claude/claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "funnel-ai": {
      "command": "node",
      "args": [
        "/Users/numtema/antigravity/MacOSapps/Funnelai/mcp-server/index.mjs"
      ],
      "env": {
        "FUNNEL_API_URL": "http://localhost:3000/api/v1"
      }
    }
  }
}
```

---

## 🤖 Configuration dans Antigravity / Cursor / Custom Agents

Dans la configuration MCP locale (`~/.gemini/antigravity/mcp` ou votre IDE) :

```json
{
  "command": "node",
  "args": ["/Users/numtema/antigravity/MacOSapps/Funnelai/mcp-server/index.mjs"],
  "env": {
    "FUNNEL_API_URL": "http://localhost:3000/api/v1"
  }
}
```

---

## 🌐 Utilisation avec ChatGPT (Custom GPTs / Actions)

Pour brancher ChatGPT via **Actions OpenAPI** :
Importez simplement l'URL de base : `http://localhost:3000/api/v1` (ou votre URL de production une fois déployé sur Coolify/Vercel) en pointant sur les endpoints :
- `POST /api/v1/funnels/generate`
- `POST /api/v1/funnels/analyze`
- `GET /api/v1/templates`
- `GET /api/v1/health`
