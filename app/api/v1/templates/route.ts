import { NextResponse } from "next/server";
import { TEMPLATES } from "@/lib/templates";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      count: TEMPLATES.length,
      templates: TEMPLATES.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        thumbnail: t.thumbnail,
        config: t.config,
      })),
    },
    { headers: corsHeaders }
  );
}
