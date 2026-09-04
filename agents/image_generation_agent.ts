import { getAiClient, getGeminiImageModel } from '@/lib/ai-client';

export interface ImageGenerationOptions {
  prompt?: string;
  style?: string;
  intent?: any;
  branding?: any;
  aspectRatio?: string;
}

export async function imageGenerationAgent(options: ImageGenerationOptions | any) {
  try {
    const ai = getAiClient();
    
    let prompt = options.prompt;
    if (!prompt) {
      const intentStr = options.intent ? JSON.stringify(options.intent) : "High-converting luxury digital offer";
      const brandingStr = options.branding ? JSON.stringify(options.branding) : "Clean, minimal, luxury lighting, premium materials";
      prompt = `Create a professional, high-converting hero image for a luxury landing page based on this offer: ${intentStr}. Style and branding guidelines: ${brandingStr}. 8k resolution, cinematic studio lighting, premium depth of field. No text or typography inside the image.`;
    }

    if (options.style) {
      prompt = `${prompt}. Visual Style: ${options.style}.`;
    }

    const response = await ai.models.generateContent({
      model: getGeminiImageModel(),
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    let imageUrl = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return {
      success: true,
      data: {
        imageUrl,
        prompt,
        aspectRatio: options.aspectRatio || "16:9",
      },
    };
  } catch (error) {
    console.error("Image generation failed:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}
