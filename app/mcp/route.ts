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
      status: "online",
      server: "Funnel AI Studio MCP Hub",
      version: "5.0.0",
      description: "Hub de documentation et passerelle MCP pour ChatGPT, Claude Desktop, Antigravity et Cursor.",
      docs: {
        openapi_yaml: `${origin}/api/v1/openapi.yaml`,
        openapi_json: `${origin}/api/v1/openapi`,
        mcp_manifest: `${origin}/api/v1/mcp`
      },
      tools: [
        "funnel_create_complete",
        "funnel_analyze_offer",
        "funnel_refine_strategy",
        "funnel_generate_image",
        "funnel_modify_code",
        "funnel_export_bundle",
        "funnel_list_templates",
        "funnel_engine_health"
      ]
    },
    { headers: corsHeaders }
  );
}
