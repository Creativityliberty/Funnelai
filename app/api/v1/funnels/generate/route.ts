import { NextRequest, NextResponse } from "next/server";
import { generateFullFunnel } from "@/lib/services/funnel-orchestrator";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, templateId, brandingOverrides, generateHeroImage = true } = body;

    if (!request || typeof request !== "string" || !request.trim()) {
      return NextResponse.json(
        { success: false, error: "Le champ 'request' est obligatoire pour concevoir le tunnel." },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await generateFullFunnel({
      request,
      templateId,
      brandingOverrides,
      generateHeroImage,
    });

    const frontendData = result.frontend?.data || {};

    return NextResponse.json(
      {
        success: true,
        data: {
          summary: result.intent?.summary || "Tunnel de vente généré",
          product_name: result.intent?.data?.product_name,
          price: result.intent?.data?.price,
          target_audience: result.intent?.data?.suspected_audience,
          core_promise: result.intent?.data?.core_promise,
          heroImage: result.heroImage,
          files: {
            index_html: frontendData.index_html || "",
            styles_css: frontendData.styles_css || "",
            script_js: frontendData.script_js || "",
          },
          rawAgents: {
            intent: result.intent?.data,
            structure: result.structure?.data,
            copy: result.copy?.data,
            branding: result.branding?.data,
            layout: result.layout?.data,
            spacing: result.spacing?.data,
            proof: result.proof?.data,
            interaction: result.interaction?.data,
          },
        },
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("API /api/v1/funnels/generate error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Erreur interne lors de la génération du tunnel.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
