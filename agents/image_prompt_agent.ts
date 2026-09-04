import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export async function imagePromptAgent(funnelData: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es ImagePromptAgent, un directeur artistique et prompt engineer d'élite spécialisé dans les visuels ultra-photoréalistes, haute conversion et rendu studio 8K pour les tunnels de vente 7-figures (FLUX.1 Schnell, Midjourney v6, Imagen).

Voici les données du tunnel: ${JSON.stringify(funnelData)}.

Ta mission est de concevoir des prompts d'images ULTRA-DÉTAILLÉS et IMMERSIFS selon les règles suivantes:
1. HERO_IMAGE (Crucial):
   - Définis un cadrage cinématographique précis (ex: vue éditoriale 3/4, grand angle architectural, bureau exécutif avec baie vitrée au crépuscule, workstation Apple avec écran Pro Display XDR reflétant la lumière d'accent).
   - Précise la focale et l'ouverture (ex: 85mm f/1.4 prime lens, shallow depth of field, creamy bokeh).
   - Décris l'éclairage studio professionnel (ex: volumetric softbox rim lighting, golden hour natural rim light, moody contrast, refined highlights on glass and matte black titanium).
   - Interdis formellement le texte ou les logos intégrés dans l'image (No text, letters, or watermarks).
   - Style: Photoréalisme éditorial haut de gamme, textures tangibles, 8k resolution.
2. PRODUCT_MOCKUP:
   - Mockup 3D réaliste d'appareil ou de packshot sur socle en marbre/obsidienne avec reflets subtils.
3. TESTIMONIAL_AVATARS:
   - 3 portraits réalistes et authentiques de professionnels/clients crédibles (lumière naturelle, expressions confiantes, diversité, pas de sourire artificiel stock photo).
4. BONUS_IMAGES:
   - Visuel d'illustration de coffret, blueprint holographique ou matériel premium.
5. ABOUT_IMAGE:
   - Portrait d'expert influent dans un environnement moderne et épuré.

Réponds STRICTEMENT en JSON valide selon ce contrat:
{
  "status": "success",
  "agent": "ImagePromptAgent",
  "data": {
    "hero_image": {
      "prompt": "Description complète en anglais riche (60-100 mots) incluant sujet, environnement, éclairage studio, caméra 85mm, matériaux et ambiance luxe sans aucun texte",
      "style": "Editorial photorealistic / 8k cinematic lighting",
      "aspect_ratio": "16:9",
      "negative_prompt": "blurry, low quality, cartoon, 3d render, distorted hands, watermark, text, signature, bad anatomy"
    },
    "product_mockup": {
      "prompt": "Description détaillée du mockup ou du rendu de produit en anglais",
      "style": "Studio Packshot 3D / Clean Glassmorphism"
    },
    "testimonial_avatars": [
      { "name": "Avatar 1", "prompt": "Portrait photo of a confident 35yo male tech founder in modern loft office, natural window lighting, 85mm lens" },
      { "name": "Avatar 2", "prompt": "Portrait photo of an elegant 40yo female marketing director in minimalist studio, softbox lighting, shallow DOF" },
      { "name": "Avatar 3", "prompt": "Portrait photo of a 28yo dynamic entrepreneur smiling authentically in co-working space, high resolution" }
    ],
    "bonus_images": [
      { "title": "Bonus 1", "prompt": "Luxury golden hardcover playbook workbook on dark marble desk with soft golden rim lighting" }
    ],
    "about_image": {
      "prompt": "Professional candid portrait of an authoritative agency mentor speaking on modern stage or in high-end studio",
      "style": "Executive Editorial Photography"
    }
  }
}
`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseJsonResponse(response.text);
}
