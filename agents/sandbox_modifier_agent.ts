import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export interface SandboxModifierInput {
  indexHtml?: string;
  stylesCss?: string;
  scriptJs?: string;
  standaloneHtml?: string;
  instruction: string;
  injectedAssets?: {
    heroImageUrl?: string;
    customImages?: { id: string; url: string }[];
    customColors?: { primary?: string; background?: string; text?: string };
    [key: string]: any;
  };
}

export async function sandboxModifierAgent(input: SandboxModifierInput) {
  const ai = getAiClient();

  let originalHtml = input.indexHtml || "";
  let originalCss = input.stylesCss || "";
  let originalJs = input.scriptJs || "";

  // If standaloneHtml is provided, try extracting parts or use whole
  if (input.standaloneHtml && !originalHtml) {
    const styleMatch = input.standaloneHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const scriptMatch = input.standaloneHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const bodyMatch = input.standaloneHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    originalCss = styleMatch ? styleMatch[1] : "";
    originalJs = scriptMatch ? scriptMatch[1] : "";
    originalHtml = bodyMatch ? bodyMatch[1] : input.standaloneHtml;
  }

  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es SandboxModifierAgent, un Ingénieur Frontend & Designer de Tunnels de Vente expert.

Ta tâche est de MODIFIER avec une précision chirurgicale le code d'un tunnel de vente existant selon les instructions données par l'utilisateur ou l'IA cliente.

INSTRUCTION DE MODIFICATION :
"${input.instruction}"

ASSETS / RESSOURCES INJECTÉES :
${JSON.stringify(input.injectedAssets || {})}

CODE HTML ACTUEL :
\`\`\`html
${originalHtml.slice(0, 15000)}
\`\`\`

CODE CSS ACTUEL :
\`\`\`css
${originalCss.slice(0, 8000)}
\`\`\`

CODE JS ACTUEL :
\`\`\`javascript
${originalJs.slice(0, 4000)}
\`\`\`

RÈGLES D'ÉDITION EN SANDBOX :
1. Applique scrupuleusement la demande (ex: ajout de section, modification de texte, changement de palette, insertion d'image, script d'animation/compte à rebours).
2. Si une nouvelle image (ex: heroImageUrl ou customImages) est fournie dans injectedAssets, remplace ou insère la balise <img src="..." /> avec cette URL dans la section ciblée.
3. Conserve l'architecture moderne, les classes CSS propres, le responsive design et l'esthétique Luxe Studio.
4. Réponds STRICTEMENT en JSON valide avec la structure suivante :

{
  "status": "success",
  "agent": "SandboxModifierAgent",
  "summary": "Résumé concis des modifications apportées",
  "data": {
    "index_html": "Code HTML complet modifié (contenu du body)",
    "styles_css": "Code CSS complet modifié",
    "script_js": "Code Javascript complet modifié",
    "changes_applied": [
      "Description modification 1",
      "Description modification 2"
    ]
  }
}
`,
  });

  const responseText = response.text || "";
  const parsed = parseJsonResponse(responseText);
  const data = parsed.data || parsed;

  const finalHtml = data.index_html || originalHtml;
  const finalCss = data.styles_css || originalCss;
  const finalJs = data.script_js || originalJs;

  const standaloneHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tunnel de Vente Modifié — Luxe Suite</title>
  <style>
${finalCss}
  </style>
</head>
<body>
${finalHtml}
  <script>
${finalJs}
  </script>
</body>
</html>`;

  return {
    success: true,
    data: {
      summary: data.summary || "Tunnel modifié en Sandbox avec succès",
      changes_applied: data.changes_applied || ["Mise à jour du code effectuée"],
      files: {
        index_html: finalHtml,
        styles_css: finalCss,
        script_js: finalJs,
        standalone_html: standaloneHtml,
      },
    },
  };
}
