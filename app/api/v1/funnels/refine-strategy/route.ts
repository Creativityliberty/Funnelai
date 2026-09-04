import { NextRequest, NextResponse } from "next/server";
import { refineFunnelStrategy } from "@/lib/services/funnel-orchestrator";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, identifiedGaps, userPreferences } = body;

    if (!request || typeof request !== "string" || !request.trim()) {
      return NextResponse.json(
        { success: false, error: "Le champ 'request' est obligatoire pour affiner la stratégie." },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await refineFunnelStrategy({
      request,
      identifiedGaps,
      userPreferences,
    });

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("API /api/v1/funnels/refine-strategy error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur lors de l'affinement stratégique." },
      { status: 500, headers: corsHeaders }
    );
  }
}
