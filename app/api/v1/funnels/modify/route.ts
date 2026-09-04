import { NextRequest, NextResponse } from "next/server";
import { modifyFunnelSandbox } from "@/lib/services/funnel-orchestrator";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { indexHtml, stylesCss, scriptJs, standaloneHtml, instruction, injectedAssets } = body;

    if (!instruction || typeof instruction !== "string" || !instruction.trim()) {
      return NextResponse.json(
        { success: false, error: "Le champ 'instruction' de modification est obligatoire." },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await modifyFunnelSandbox({
      indexHtml,
      stylesCss,
      scriptJs,
      standaloneHtml,
      instruction,
      injectedAssets,
    });

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("API /api/v1/funnels/modify error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur lors de la modification en Sandbox." },
      { status: 500, headers: corsHeaders }
    );
  }
}
