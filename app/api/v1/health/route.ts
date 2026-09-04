import { NextResponse } from "next/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  return NextResponse.json(
    {
      status: "operational",
      service: "Funnel AI Studio Luxe Engine",
      version: "4.5.0",
      engine: "Cognitive Multi-Agent Pipeline (13 Agents)",
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders }
  );
}
