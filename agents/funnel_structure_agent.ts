import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export async function funnelStructureAgent(offerIntent: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es FunnelStructureAgent.
Tu reçois l'intention commerciale suivante: ${JSON.stringify(offerIntent)}.
Applique la logique du document Funnel Designer:
1. 3 points of focus (Main, Second, Third),
2. CA.DA.CA. (Capture, Direct, Convert, Attention),
3. Consistent Hierarchy (hiérarchie claire et constante),
4. Ordre narratif cohérent.
Propose la structure la plus convertible.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "FunnelStructureAgent",
  "task_id": "funnel_structure_01",
  "confidence": 0.9,
  "summary": "Architecture du tunnel définie",
  "data": {
    "funnel_goal": "string",
    "page_model": "single_page|multi_step",
    "sections": ["hero", "proof", "problem", "benefits", "offer", "faq", "cta_final"],
    "section_objectives": { "hero": "string" },
    "cta_path": ["string"],
    "focus_hierarchy": {
      "main": "string",
      "secondary": "string",
      "tertiary": "string"
    },
    "cadaca_strategy": {
      "capture": "string",
      "direct": "string",
      "convert": "string",
      "attention": "string"
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
