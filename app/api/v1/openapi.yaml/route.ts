import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "localhost:3000";
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");

  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
  const apiUrl = `${appUrl.replace(/\/$/, "")}/api/v1`;

  try {
    const filePath = path.join(process.cwd(), "public", "openapi.yaml");
    let yamlContent = fs.readFileSync(filePath, "utf-8");

    // Dynamically replace the server URL with the active live server URL
    yamlContent = yamlContent.replace(
      /url:\s*https?:\/\/[^\s]+/g,
      `url: ${apiUrl}`
    );

    return new NextResponse(yamlContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/yaml; charset=utf-8",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Impossible de charger openapi.yaml" },
      { status: 500, headers: corsHeaders }
    );
  }
}
