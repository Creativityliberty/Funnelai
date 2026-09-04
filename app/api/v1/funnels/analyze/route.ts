import { NextRequest, NextResponse } from "next/server";
import { analyzeOfferIntent } from "@/lib/services/funnel-orchestrator";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, templateId } = body;

    if (!request || typeof request !== "string" || !request.trim()) {
      return NextResponse.json(
        { success: false, error: "Le champ 'request' (description de l'offre) est obligatoire." },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await analyzeOfferIntent(request, templateId);
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err: any) {
    console.error("API /api/v1/funnels/analyze error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Erreur interne lors de l'analyse de l'offre.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
