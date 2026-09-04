import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export async function proofNumbersAgent(offerIntent: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es ProofNumbersAgent.
Tu reçois l'intention commerciale suivante: ${JSON.stringify(offerIntent)}.
Applique strictement le principe de conversion Numbers:
1. Get attention with numbers
2. Build trust with data & stats
3. Rendre la preuve visible
S’il manque de vraies preuves, signale-le.
N’invente pas de données factuelles.
Réponds uniquement en JSON valide selon le contrat fourni.

Contrat JSON:
{
  "status": "success",
  "agent": "ProofNumbersAgent",
  "task_id": "proof_numbers_01",
  "confidence": 0.9,
  "summary": "Stratégie de preuve définie",
  "data": {
    "proof_strategy": "testimonial|numbers|logos|case_study|hybrid",
    "proof_blocks": ["string"],
    "missing_proof_flags": ["string"],
    "fallback_proof_copy": ["string"]
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
