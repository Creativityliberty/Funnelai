import { GoogleGenAI } from "@google/genai";

export const DEFAULT_TEXT_MODEL = "deepseek-chat";
export const DEFAULT_IMAGE_MODEL = "Flux1schnell";

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

export function getDeApiApiKey(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("deapi_api_key");
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return (
    process.env.DEAPI_API_KEY ||
    process.env.NEXT_PUBLIC_DEAPI_API_KEY ||
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
      const saved = localStorage.getItem("active_text_model");
      if (saved && saved.trim()) {
        const val = saved.trim();
        if (val === "gemini-3-flash-preview" || val === "gemini-2.5-flash") {
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

export function getActiveImageModel(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("image_model") || localStorage.getItem("gemini_image_model");
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return (
    process.env.DEFAULT_IMAGE_MODEL ||
    process.env.GEMINI_IMAGE_MODEL ||
    DEFAULT_IMAGE_MODEL
  );
}

export const getGeminiImageModel = getActiveImageModel;

/**
 * Call deAPI for Ultra-Fast, Ultra-Affordable Image Generation (FLUX.1 Schnell, etc.)
 */
async function callDeApiImageGeneration(params: {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  steps?: number;
  apiKey?: string;
}): Promise<{ imageUrl: string; boostedPrompt?: string }> {
  const apiKey = params.apiKey || getDeApiApiKey();
  if (!apiKey) {
    throw new Error("DEAPI_API_KEY manquante. Veuillez renseigner votre clé API deAPI dans les Paramètres.");
  }

  const modelSlug = params.model && !params.model.includes("gemini") ? params.model : "Flux1schnell";
  const width = params.width || 1024;
  const height = params.height || 768;
  const steps = params.steps || (modelSlug === "Flux1schnell" ? 4 : 8);

  // 1. Submit job to deAPI v2 endpoint
  const submitRes = await fetch("https://api.deapi.ai/api/v2/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: modelSlug,
      prompt: params.prompt,
      width,
      height,
      steps,
      seed: -1,
      enhance_prompt: true,
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    throw new Error(`Erreur deAPI Image Generation (${submitRes.status}): ${errText}`);
  }

  const submitData = await submitRes.json();
  const requestId = submitData?.data?.request_id;
  if (!requestId) {
    throw new Error("Identifiant de requête non reçu depuis deAPI");
  }

  // 2. Poll for job completion (up to 35s)
  const maxAttempts = 25;
  let delay = 1000;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const statusRes = await fetch(`https://api.deapi.ai/api/v2/jobs/${requestId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (statusRes.ok) {
      const jobData = await statusRes.json();
      const job = jobData?.data;
      if (job?.status === "done") {
        const imageUrl = job.result_url || job.results_alt_formats?.webp || job.results_alt_formats?.jpg;
        if (!imageUrl) {
          throw new Error("URL de l'image générée introuvable dans le résultat deAPI");
        }
        return {
          imageUrl,
          boostedPrompt: job.prompt_boost?.prompt,
        };
      }
      if (job?.status === "failed") {
        throw new Error(`Génération deAPI échouée: ${job.error_reason || "Erreur interne"}`);
      }
    }
    if (i > 3) delay = 1500;
    if (i > 8) delay = 2000;
  }

  throw new Error("Délai de génération d'image deAPI dépassé (timeout)");
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
 * Unified AI Client supporting DeepSeek (Text/Reasoning), deAPI (Ultra-Low-Cost FLUX.1 Images), and Gemini
 */
export function getAiClient(customApiKey?: string): any {
  const geminiKey = customApiKey || getGeminiApiKey();
  const geminiClient = new GoogleGenAI({ apiKey: geminiKey });
  const deepSeekKey = getDeepSeekApiKey();
  const deApiKey = getDeApiApiKey();

  return {
    models: {
      generateContent: async (params: any) => {
        const requestedModel = params?.model || getActiveTextModel();
        const isImage =
          requestedModel.includes("image") ||
          requestedModel.includes("imagen") ||
          requestedModel.includes("Flux") ||
          requestedModel.includes("ZImage");

        // 1. Image generation: Try deAPI (FLUX.1 Schnell) first, fallback to Gemini Imagen
        if (isImage) {
          const isDeApiModel =
            requestedModel === "Flux1schnell" ||
            requestedModel.startsWith("Flux") ||
            requestedModel.startsWith("ZImage");

          if (deApiKey && (isDeApiModel || !geminiKey || requestedModel === DEFAULT_IMAGE_MODEL)) {
            try {
              let promptText = "";
              if (typeof params.contents === "string") {
                promptText = params.contents;
              } else if (params.contents?.parts?.[0]?.text) {
                promptText = params.contents.parts[0].text;
              } else {
                promptText = JSON.stringify(params.contents);
              }

              const deApiResult = await callDeApiImageGeneration({
                prompt: promptText,
                model: isDeApiModel ? requestedModel : "Flux1schnell",
                apiKey: deApiKey,
              });

              return {
                imageUrl: deApiResult.imageUrl,
                boostedPrompt: deApiResult.boostedPrompt,
                candidates: [
                  {
                    content: {
                      parts: [
                        {
                          imageUrl: deApiResult.imageUrl,
                          boostedPrompt: deApiResult.boostedPrompt,
                        },
                      ],
                    },
                  },
                ],
              };
            } catch (deApiErr: any) {
              console.warn(
                "[Funnel AI Engine] Avertissement deAPI, tentative de secours sur Gemini Imagen :",
                deApiErr.message
              );
              if (geminiKey) {
                return await geminiClient.models.generateContent({
                  model: "gemini-2.5-flash-image",
                  contents: params.contents,
                });
              }
              throw deApiErr;
            }
          }

          if (geminiKey) {
            return await geminiClient.models.generateContent({
              model: requestedModel.startsWith("gemini") ? requestedModel : "gemini-2.5-flash-image",
              contents: params.contents,
            });
          }

          throw new Error("Clé DEAPI_API_KEY ou GEMINI_API_KEY requise pour la génération d'images.");
        }

        // 2. Text / Reasoning / Agent generation: Route to DeepSeek whenever available
        const isDeepSeekExplicit = requestedModel.startsWith("deepseek");
        if (deepSeekKey && (isDeepSeekExplicit || !geminiKey || requestedModel === DEFAULT_TEXT_MODEL)) {
          try {
            return await callDeepSeekChat({
              model: isDeepSeekExplicit ? requestedModel : "deepseek-chat",
              contents: params.contents,
              config: params.config,
              apiKey: deepSeekKey,
            });
          } catch (deepSeekErr: any) {
            console.warn(
              "[Funnel AI Engine] Avertissement DeepSeek, tentative sur Gemini de secours :",
              deepSeekErr.message
            );
            if (geminiKey) {
              try {
                return await geminiClient.models.generateContent({
                  model: "gemini-2.5-flash",
                  contents: params.contents,
                  config: params.config,
                });
              } catch (geminiErr: any) {
                console.error("[Funnel AI Engine] Échec des deux moteurs d'IA :", geminiErr);
                throw new Error(
                  `Erreur IA : ${deepSeekErr.message || geminiErr.message}`
                );
              }
            }
            throw deepSeekErr;
          }
        }

        // 3. Fallback to Gemini with automatic DeepSeek failover on 429
        if (geminiKey) {
          try {
            return await geminiClient.models.generateContent({
              model: requestedModel.startsWith("gemini") ? requestedModel : "gemini-2.5-flash",
              contents: params.contents,
              config: params.config,
            });
          } catch (geminiErr: any) {
            console.warn(
              "[Funnel AI Engine] Quota/Erreur Gemini détecté, bascule automatique instantanée sur DeepSeek :",
              geminiErr.message
            );
            if (deepSeekKey) {
              return await callDeepSeekChat({
                model: "deepseek-chat",
                contents: params.contents,
                config: params.config,
                apiKey: deepSeekKey,
              });
            }
            throw geminiErr;
          }
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
