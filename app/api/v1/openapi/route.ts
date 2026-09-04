import { NextRequest, NextResponse } from "next/server";
import openApiSpec from "@/public/openapi.json";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
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

  const dynamicSpec = {
    ...openApiSpec,
    servers: [
      {
        url: apiUrl,
        description: "Serveur Funnel AI Studio (Production / Coolify / Local)",
      },
    ],
  };

  return NextResponse.json(dynamicSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}
