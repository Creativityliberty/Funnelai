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
    version: "4.5.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools for ChatGPT, Claude, Antigravity
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "funnel_create_complete",
        description:
          "Génère un tunnel de vente complet haute conversion en orchestrant les 10 agents IA de Funnel AI Studio (Structure, Copywriting 15 étapes Gusten Sun, Design System Luxe, CSS, JS, Image Hero). Renvoie le code HTML, styles CSS, interactions JS et les paramètres business.",
        inputSchema: {
          type: "object",
          properties: {
            request: {
              type: "string",
              description:
                "Description détaillée de l'offre (produit/service, prix, promesse principale, cible, différenciateur).",
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
          },
          required: ["request"],
        },
      },
      {
        name: "funnel_analyze_offer",
        description:
          "Analyse l'offre commerciale et extrait la promesse centrale, l'audience cible, le type de funnel recommandé et la stratégie de conversion sans générer tout le code frontend.",
        inputSchema: {
          type: "object",
          properties: {
            request: {
              type: "string",
              description: "Description de l'offre commerciale.",
            },
            templateId: {
              type: "string",
              description: "ID optionnel du template de référence.",
            },
          },
          required: ["request"],
        },
      },
      {
        name: "funnel_list_templates",
        description:
          "Liste tous les templates de tunnel de vente haute conversion disponibles dans Funnel AI Studio avec leurs palettes et structures.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "funnel_engine_health",
        description: "Vérifie l'état de fonctionnement et la connectivité du moteur de génération Funnel AI Studio.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "funnel_create_complete") {
      const res = await fetch(`${API_BASE_URL}/funnels/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }

    if (name === "funnel_analyze_offer") {
      const res = await fetch(`${API_BASE_URL}/funnels/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }

    if (name === "funnel_list_templates") {
      const res = await fetch(`${API_BASE_URL}/templates`);
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }

    if (name === "funnel_engine_health") {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
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
  console.error("Serveur Funnel AI Studio MCP démarré sur le transport standard (stdio).");
}

run().catch((error) => {
  console.error("Échec critique du serveur MCP :", error);
  process.exit(1);
});
