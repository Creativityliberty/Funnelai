#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE_URL = process.env.FUNNEL_API_URL || "http://localhost:3000/api/v1";

const server = new Server(
  {
    name: "funnel-ai-studio",
    version: "5.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List all 8 high-performance tools for ChatGPT, Claude, Antigravity, Cursor
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "funnel_create_complete",
        description:
          "Génère un tunnel de vente complet haute conversion en orchestrant les 10 agents IA de Funnel AI Studio (Structure, Copywriting 15 étapes Gusten Sun, Design System Luxe, CSS, JS, Image Hero). Renvoie le code HTML, styles CSS, interactions JS, fichier standalone prêt à déployer et les paramètres business.",
        inputSchema: {
          type: "object",
          properties: {
            request: {
              type: "string",
              description:
                "Description détaillée de l'offre commerciale : produit/service, prix, promesse principale, cible, différenciateur.",
            },
            templateId: {
              type: "string",
              description:
                "ID optionnel du template (ex: 'coaching-high-ticket', 'ecommerce-drop', 'saas-minimal', 'webinar-masterclass').",
            },
            generateHeroImage: {
              type: "boolean",
              description: "Générer ou non l'image Hero photoréaliste via IA (défaut: true).",
            },
            brandingOverrides: {
              type: "object",
              description: "Personnalisation optionnelle des couleurs (primaryColor, backgroundColor, textColor).",
            },
          },
          required: ["request"],
        },
      },
      {
        name: "funnel_analyze_offer",
        description:
          "Analyse l'intention commerciale de l'offre, identifie l'audience cible, la promesse centrale, le positionnement et détecte les lacunes stratégiques à combler.",
        inputSchema: {
          type: "object",
          properties: {
            request: {
              type: "string",
              description: "Description de l'offre commerciale brute.",
            },
            templateId: {
              type: "string",
              description: "ID optionnel d'un template de référence.",
            },
          },
          required: ["request"],
        },
      },
      {
        name: "funnel_refine_strategy",
        description:
          "Comble les lacunes stratégiques d'une offre en générant : 3 paliers tarifaires (Starter, Pro, Elite), 3 témoignages/études de cas chiffrés, une garantie inconditionnelle à fort impact, la liste précise des livrables, la stratégie de trafic (Meta, Google, Outbound) et le calendrier des résultats.",
        inputSchema: {
          type: "object",
          properties: {
            request: {
              type: "string",
              description: "Description de l'offre initiale.",
            },
            identifiedGaps: {
              type: "array",
              items: { type: "string" },
              description: "Liste optionnelle des points spécifiques à enrichir.",
            },
            userPreferences: {
              type: "object",
              description: "Préférences personnalisées (prix cible, type de garantie, canaux d'acquisition favoris).",
            },
          },
          required: ["request"],
        },
      },
      {
        name: "funnel_generate_image",
        description:
          "Génère une image photoréaliste haute définition pour le Hero ou les sections du tunnel de vente via IA (Gemini Imagen) et renvoie le Data URI prêt à être inséré dans le HTML.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Description visuelle de l'image souhaitée.",
            },
            style: {
              type: "string",
              description: "Style visuel optionnel (ex: 'Luxe Studio Lighting', 'Dark Cyber Neon', 'Minimalist Editorial', '3D Tech Render').",
            },
            aspectRatio: {
              type: "string",
              description: "Ratio d'aspect (ex: '16:9', '1:1', '4:3').",
            },
          },
        },
      },
      {
        name: "funnel_modify_code",
        description:
          "Modifie le code source d'un tunnel de vente en sandbox (HTML, CSS, JS) selon une instruction précise (ex: insérer une image, changer la palette, ajouter une section FAQ/Garantie/Témoignages, ajouter un compte à rebours JS).",
        inputSchema: {
          type: "object",
          properties: {
            instruction: {
              type: "string",
              description: "Consigne de modification (ex: 'Ajoute une section Témoignages vidéo avec 3 cartes et change la couleur primaire en #00FF88').",
            },
            indexHtml: {
              type: "string",
              description: "Code HTML existant (optionnel si standaloneHtml est fourni).",
            },
            stylesCss: {
              type: "string",
              description: "Code CSS existant.",
            },
            scriptJs: {
              type: "string",
              description: "Code JS existant.",
            },
            standaloneHtml: {
              type: "string",
              description: "Fichier HTML autonome complet si disponible.",
            },
            injectedAssets: {
              type: "object",
              description: "Assets optionnels à injecter (heroImageUrl, customColors, etc.).",
            },
          },
          required: ["instruction"],
        },
      },
      {
        name: "funnel_export_bundle",
        description:
          "Exporte le tunnel de vente sous forme d'archive ZIP téléchargeable clé en main (index.html, styles.css, script.js, README de déploiement) ou sous forme de fichier HTML autonome.",
        inputSchema: {
          type: "object",
          properties: {
            productName: {
              type: "string",
              description: "Nom du produit pour nommer le fichier d'exportation.",
            },
            indexHtml: {
              type: "string",
              description: "Code HTML du tunnel.",
            },
            stylesCss: {
              type: "string",
              description: "Feuille de styles CSS.",
            },
            scriptJs: {
              type: "string",
              description: "Code Javascript d'interactions.",
            },
            standaloneHtml: {
              type: "string",
              description: "Code HTML autonome complet (optionnel).",
            },
            format: {
              type: "string",
              enum: ["zip", "html", "json"],
              description: "Format d'exportation souhaité (défaut: 'zip').",
            },
          },
        },
      },
      {
        name: "funnel_list_templates",
        description:
          "Liste tous les templates de tunnel de vente haute conversion disponibles dans Funnel AI Studio avec leurs palettes de couleurs, typographies et structures.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "funnel_engine_health",
        description: "Vérifie l'état de fonctionnement et la latence du moteur Funnel AI Studio.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Execute tool requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "funnel_create_complete") {
      const res = await fetch(`${API_BASE_URL}/funnels/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args || {}),
      });
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_analyze_offer") {
      const res = await fetch(`${API_BASE_URL}/funnels/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args || {}),
      });
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_refine_strategy") {
      const res = await fetch(`${API_BASE_URL}/funnels/refine-strategy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args || {}),
      });
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_generate_image") {
      const res = await fetch(`${API_BASE_URL}/funnels/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args || {}),
      });
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_modify_code") {
      const res = await fetch(`${API_BASE_URL}/funnels/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args || {}),
      });
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_export_bundle") {
      const res = await fetch(`${API_BASE_URL}/funnels/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args || {}),
      });
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_list_templates") {
      const res = await fetch(`${API_BASE_URL}/templates`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === "funnel_engine_health") {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    throw new Error(`Outil inconnu : ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Erreur lors de l'exécution de l'outil ${name}: ${error.message}`,
        },
      ],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Serveur Funnel AI Studio MCP v5.0 démarré avec 8 outils haute conversion.");
}

run().catch((error) => {
  console.error("Échec critique du serveur MCP :", error);
  process.exit(1);
});
