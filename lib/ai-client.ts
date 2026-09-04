import { GoogleGenAI } from "@google/genai";

const TEXT_FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const IMAGE_FALLBACK_MODELS = [
  "gemini-2.5-flash-image",
  "imagen-3.0-generate-002",
];

function isCapacityOrTransientError(err: any): boolean {
  const msg = (err?.message || err?.toString() || "").toLowerCase();
  const status = err?.status || err?.code;
  return (
    status === 503 ||
    status === 429 ||
    status === "UNAVAILABLE" ||
    status === "RESOURCE_EXHAUSTED" ||
    msg.includes("503") ||
    msg.includes("high demand") ||
    msg.includes("temporar") ||
    msg.includes("unavailable") ||
    msg.includes("overloaded") ||
    msg.includes("rate limit") ||
    msg.includes("resource has been exhausted")
  );
}

export function getGeminiApiKey(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("gemini_api_key");
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return (
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  );
}

export function getGeminiTextModel(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("gemini_text_model");
      if (saved && saved.trim()) {
        if (saved.trim() === "gemini-3-flash-preview") {
          localStorage.setItem("gemini_text_model", "gemini-2.5-flash");
          return "gemini-2.5-flash";
        }
        return saved.trim();
      }
    } catch (_) {}
  }
  return process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
}

export function getGeminiImageModel(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("gemini_image_model");
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
}

export function getAiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey || getGeminiApiKey();
  const client = new GoogleGenAI({ apiKey });

  const originalGenerateContent = client.models.generateContent.bind(client.models);

  client.models.generateContent = async (params: any) => {
    const requestedModel = params?.model || getGeminiTextModel();
    const isImage =
      requestedModel.includes("image") || requestedModel.includes("imagen");

    const fallbackList = isImage ? IMAGE_FALLBACK_MODELS : TEXT_FALLBACK_MODELS;
    const candidateModels = [
      requestedModel,
      ...fallbackList.filter((m) => m !== requestedModel),
    ];

    let lastError: any = null;

    for (let i = 0; i < candidateModels.length; i++) {
      const currentModel = candidateModels[i];
      const modelParams = { ...params, model: currentModel };

      try {
        const result = await originalGenerateContent(modelParams);
        return result;
      } catch (err: any) {
        lastError = err;
        if (isCapacityOrTransientError(err)) {
          console.warn(
            `[Funnel AI Engine] Modèle ${currentModel} indisponible (${err.message || "503 UNAVAILABLE"}). Bascule immédiate vers: ${candidateModels[i + 1] || 'fin de liste'}`
          );
          if (i < candidateModels.length - 1) {
            continue;
          }
        } else {
          // Not a capacity error (e.g. invalid auth), throw
          throw err;
        }
      }
    }

    throw lastError;
  };

  return client;
}
