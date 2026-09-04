import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export async function layoutHierarchyAgent(funnelStructure: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es LayoutHierarchyAgent.
Tu reçois la structure du funnel suivante: ${JSON.stringify(funnelStructure)}.
Applique strictement les 7 principes de conversion, en particulier:
1. Layout (Section, Row, Column, Structure)
2. Size (Headline Size: H1/92px, H2/56px, Text Size: Body/26px, Para/24px)
3. Image and font size, thickness in order of importance
4. Alignment & Grouping
Tu produis une spécification de structure, pas du CSS final.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "LayoutHierarchyAgent",
  "task_id": "layout_hierarchy_01",
  "confidence": 0.9,
  "summary": "Spécification de layout définie",
  "data": {
    "layout_spec": {
      "hero": {
        "grid": "string",
        "main_focus": "string",
        "secondary_focus": "string",
        "tertiary_focus": "string"
      }
    },
    "typography_sizes": {
      "h1": "92px",
      "h2": "56px",
      "body": "26px",
      "paragraph": "24px"
    },
    "alignment_rules": ["string"],
    "grouping_rules": ["string"],
    "container_rules": ["string"]
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
