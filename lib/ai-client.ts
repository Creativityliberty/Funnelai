import { GoogleGenAI } from "@google/genai";

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
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
  }
  return process.env.GEMINI_TEXT_MODEL || "gemini-3-flash-preview";
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
  return new GoogleGenAI({ apiKey });
}
