import { GoogleGenAI } from "@google/genai";

export const DEFAULT_TEXT_MODEL = "deepseek-chat";
export const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";

export function getDeepSeekApiKey(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("deepseek_api_key");
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return (
    process.env.DEEPSEEK_API_KEY ||
    process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY ||
    ""
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

export function getActiveTextModel(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("active_text_model") || localStorage.getItem("gemini_text_model");
      if (saved && saved.trim()) {
        const val = saved.trim();
        if (val === "gemini-3-flash-preview") {
          return DEFAULT_TEXT_MODEL;
        }
        return val;
      }
    } catch (_) {}
  }
  return process.env.ACTIVE_TEXT_MODEL || process.env.DEEPSEEK_TEXT_MODEL || DEFAULT_TEXT_MODEL;
}

// Backward-compatibility alias
export const getGeminiTextModel = getActiveTextModel;

export function getGeminiImageModel(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("gemini_image_model");
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return process.env.GEMINI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
}

/**
 * Call DeepSeek Chat Completions with strict JSON Output & Context Caching support
 */
async function callDeepSeekChat(params: {
  model: string;
  contents: any;
  config?: any;
  apiKey?: string;
  attempt?: number;
}): Promise<{ text: string }> {
  const apiKey = params.apiKey || getDeepSeekApiKey();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY manquante. Veuillez renseigner votre clé API DeepSeek dans les Paramètres.");
  }

  let promptText = "";
  if (typeof params.contents === "string") {
    promptText = params.contents;
  } else if (params.contents?.parts?.[0]?.text) {
    promptText = params.contents.parts[0].text;
  } else {
    promptText = JSON.stringify(params.contents);
  }

  const isJsonMode = params.config?.responseMimeType === "application/json" || promptText.toLowerCase().includes("json");

  const requestBody: any = {
    model: params.model.startsWith("deepseek-") ? params.model : "deepseek-chat",
    messages: [
      {
        role: "system",
        content: isJsonMode
          ? "You are an elite sales funnel architect and high-conversion copywriter. You must always return strictly valid JSON. Format your output strictly in JSON according to the schema provided."
          : "You are an elite sales funnel architect and high-conversion copywriter.",
      },
      {
        role: "user",
        content: promptText,
      },
    ],
    max_tokens: params.config?.maxOutputTokens || 8192,
    temperature: 0.5,
  };

  if (isJsonMode) {
    requestBody.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur DeepSeek API (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";

  // If DeepSeek occasionally returns empty content in JSON mode, retry once
  if (!content.trim() && (!params.attempt || params.attempt < 2)) {
    console.warn("[DeepSeek] Contenu vide reçu en mode JSON, nouvel essai...");
    return callDeepSeekChat({ ...params, attempt: (params.attempt || 1) + 1 });
  }

  return { text: content };
}

/**
 * Unified AI Client supporting DeepSeek (Text/Reasoning) and Gemini (Images/Fallback)
 */
export function getAiClient(customApiKey?: string): any {
  const geminiKey = customApiKey || getGeminiApiKey();
  const geminiClient = new GoogleGenAI({ apiKey: geminiKey });

  return {
    models: {
      generateContent: async (params: any) => {
        const requestedModel = params?.model || getActiveTextModel();
        const isImage =
          requestedModel.includes("image") || requestedModel.includes("imagen");

        // 1. Image generation always routes through Gemini
        if (isImage) {
          return await geminiClient.models.generateContent({
            model: requestedModel,
            contents: params.contents,
          });
        }

        // 2. If DeepSeek model requested (or default), execute via DeepSeek
        const isDeepSeek = requestedModel.startsWith("deepseek");
        const deepSeekKey = getDeepSeekApiKey();

        if (isDeepSeek && deepSeekKey) {
          try {
            return await callDeepSeekChat({
              model: requestedModel,
              contents: params.contents,
              config: params.config,
              apiKey: deepSeekKey,
            });
          } catch (deepSeekErr: any) {
            console.warn(
              "[Funnel AI Engine] Avertissement DeepSeek, bascule automatique sur Gemini de secours :",
              deepSeekErr.message
            );
            if (geminiKey) {
              return await geminiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: params.contents,
                config: params.config,
              });
            }
            throw deepSeekErr;
          }
        }

        // 3. Otherwise execute via Gemini
        if (geminiKey) {
          return await geminiClient.models.generateContent({
            model: requestedModel.startsWith("gemini") ? requestedModel : "gemini-2.5-flash",
            contents: params.contents,
            config: params.config,
          });
        }

        // 4. Fallback if only DeepSeek key is available
        if (deepSeekKey) {
          return await callDeepSeekChat({
            model: "deepseek-chat",
            contents: params.contents,
            config: params.config,
            apiKey: deepSeekKey,
          });
        }

        throw new Error(
          "Aucune clé API configurée. Veuillez ajouter votre clé DEEPSEEK_API_KEY ou GEMINI_API_KEY dans les paramètres."
        );
      },
    },
  };
}
