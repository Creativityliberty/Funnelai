import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export async function headlineCopyAgent(funnelStructure: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es HeadlineCopyAgent.
Tu reçois la structure du funnel suivante: ${JSON.stringify(funnelStructure)}.
Le headline doit être orienté outcome.
Le subheadline doit clarifier sans diluer.
Le CTA doit être spécifique.
Évite les généralités.
Pas de jargon inutile.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "HeadlineCopyAgent",
  "task_id": "headline_copy_01",
  "confidence": 0.9,
  "summary": "Copywriting du hero défini",
  "data": {
    "preheadline": "string",
    "headline": "string",
    "subheadline": "string",
    "primary_cta": "string",
    "secondary_cta": "string",
    "microcopy": {
      "trust_line": "string",
      "form_help": "string",
      "footer_note": "string"
    }
  },
  "issues": [],
  "next_actions": []
}
`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseJsonResponse(response.text);
}
