import { NextRequest, NextResponse } from "next/server";
import { generateCustomImage } from "@/lib/services/funnel-orchestrator";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style, aspectRatio, intent, branding } = body;

    const result = await generateCustomImage({
      prompt,
      style,
      aspectRatio,
      intent,
      branding,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Échec de génération de l'image." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("API /api/v1/funnels/generate-image error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur lors de la génération d'image." },
      { status: 500, headers: corsHeaders }
    );
  }
}
