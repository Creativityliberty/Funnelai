import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "funnelai.coolify.dallico.com";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const origin = `${proto}://${host}`;

  return NextResponse.json(
    {
      name: "funnel-ai-studio",
      version: "5.0.0",
      protocol_version: "2024-11-05",
      description: "Serveur MCP universel Funnel AI Studio (8 outils pour concevoir, affiner, créer des images IA, éditer en sandbox et exporter des tunnels de vente de luxe).",
      status: "online",
      endpoints: {
        openapi_yaml: `${origin}/api/v1/openapi.yaml`,
        openapi_json: `${origin}/api/v1/openapi`,
        health: `${origin}/api/v1/health`,
        templates: `${origin}/api/v1/templates`,
        analyze_offer: `${origin}/api/v1/funnels/analyze`,
        refine_strategy: `${origin}/api/v1/funnels/refine-strategy`,
        generate_funnel: `${origin}/api/v1/funnels/generate`,
        generate_image: `${origin}/api/v1/funnels/generate-image`,
        modify_sandbox: `${origin}/api/v1/funnels/modify`,
        export_bundle: `${origin}/api/v1/funnels/export`
      },
      tools: [
        {
          name: "funnel_create_complete",
          description: "Génère un tunnel de vente complet haute conversion en orchestrant les 10 agents IA (HTML, CSS, JS, Image Hero, Standalone).",
          endpoint: "POST /api/v1/funnels/generate"
        },
        {
          name: "funnel_analyze_offer",
          description: "Analyse l'offre commerciale et extrait promesse, cible et stratégie.",
          endpoint: "POST /api/v1/funnels/analyze"
        },
        {
          name: "funnel_refine_strategy",
          description: "Comble les lacunes stratégiques : 3 packages de prix, 3 études de cas, garantie inconditionnelle, livrables, trafic, délais.",
          endpoint: "POST /api/v1/funnels/refine-strategy"
        },
        {
          name: "funnel_generate_image",
          description: "Génère des images photoréalistes Hero via IA (Gemini Imagen) et renvoie le Data URI.",
          endpoint: "POST /api/v1/funnels/generate-image"
        },
        {
          name: "funnel_modify_code",
          description: "Éditeur Sandbox : modifie le code existant sur consigne (sections, couleurs, images, scripts).",
          endpoint: "POST /api/v1/funnels/modify"
        },
        {
          name: "funnel_export_bundle",
          description: "Exporte le tunnel sous forme d'archive ZIP ou fichier HTML autonome prêt à déployer.",
          endpoint: "POST /api/v1/funnels/export"
        },
        {
          name: "funnel_list_templates",
          description: "Liste tous les templates disponibles avec palettes et structures.",
          endpoint: "GET /api/v1/templates"
        },
        {
          name: "funnel_engine_health",
          description: "Vérifie l'état de fonctionnement et la latence du moteur.",
          endpoint: "GET /api/v1/health"
        }
      ]
    },
    { headers: corsHeaders }
  );
}
