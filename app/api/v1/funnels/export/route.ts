import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productName = "Mon-Tunnel-Luxe",
      indexHtml = "",
      stylesCss = "",
      scriptJs = "",
      standaloneHtml = "",
      format = "zip", // "zip" | "html" | "json"
    } = body;

    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");

    const fullHtml =
      standaloneHtml ||
      `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} — Luxe Conversion Suite</title>
  <style>
${stylesCss}
  </style>
</head>
<body>
${indexHtml}
  <script>
${scriptJs}
  </script>
</body>
</html>`;

    if (format === "html") {
      const base64Html = Buffer.from(fullHtml, "utf-8").toString("base64");
      return NextResponse.json(
        {
          success: true,
          format: "html",
          filename: `${sanitizedName}.html`,
          content: fullHtml,
          download_url: `data:text/html;base64,${base64Html}`,
        },
        { headers: corsHeaders }
      );
    }

    // Default ZIP bundle
    const zip = new JSZip();
    zip.file("index.html", fullHtml);
    if (stylesCss) zip.file("styles.css", stylesCss);
    if (scriptJs) zip.file("script.js", scriptJs);

    const readmeContent = `# ${productName} — Funnel AI Studio™

Tunnel de vente haute conversion clé en main généré avec Funnel AI Studio.

## Structure des fichiers :
- **index.html** : Page de vente complète avec styles et interactions intégrés (autonome et prête à déployer).
- **styles.css** : Feuilles de styles modulaires Luxe Studio.
- **script.js** : Interactions, compte à rebours et animations JavaScript.

## Déploiement :
1. Glissez simplement le contenu de ce dossier sur n'importe quel hébergeur (Vercel, Netlify, Coolify, Hostinger, Cloudflare Pages).
2. Aucun build ni serveur Node requis.
`;

    zip.file("README.md", readmeContent);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    const base64Zip = zipBuffer.toString("base64");

    return NextResponse.json(
      {
        success: true,
        format: "zip",
        filename: `${sanitizedName}-funnel-bundle.zip`,
        size_bytes: zipBuffer.length,
        download_url: `data:application/zip;base64,${base64Zip}`,
        summary: `Archive ZIP générée (${(zipBuffer.length / 1024).toFixed(1)} Ko) contenant index.html, styles.css, script.js et documentation de déploiement.`,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("API /api/v1/funnels/export error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur lors de l'exportation du tunnel." },
      { status: 500, headers: corsHeaders }
    );
  }
}
