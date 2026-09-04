import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export async function interactionMotionAgent(layoutSpec: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es InteractionMotionAgent.
Tu reçois la spécification de layout suivante: ${JSON.stringify(layoutSpec)}.
Applique strictement le principe de conversion Interaction:
1. FAQ ACCORDION: Une seule question ouverte à la fois avec transition fluide.
2. CTA PULSE: Animation de pulse sur "Get Instant Access" et "Discover Plans".
3. TILT EFFECT: Effet interactif sur les pricing cards et bonus cards.
4. SCROLL REVEAL: Intersection Observer pour les sections Problem, Solution, How it Works.
5. Claires et légères, non distrayantes.
6. Faciles à coder en JS vanilla ou CSS Tailwind.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "InteractionMotionAgent",
  "task_id": "interaction_motion_01",
  "confidence": 0.9,
  "summary": "Interactions JS définies",
  "data": {
    "interactions": ["string"],
    "motion_rules": ["string"],
    "js_requirements": ["string"]
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
