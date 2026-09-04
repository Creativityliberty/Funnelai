/**
 * Ultra-robust JSON parser for AI outputs with automatic partial repair,
 * unescaped character fixing, markdown extraction and structural completion.
 */

function repairTruncatedJson(str: string): string {
  let s = str.trim();
  if (!s) return "{}";

  // If there's an unclosed quote, close it
  let inString = false;
  let isEscaped = false;
  const stack: ('{' | '[')[] = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (ch === '\\') {
      isEscaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (ch === '{') stack.push('{');
      else if (ch === '[') stack.push('[');
      else if (ch === '}') {
        if (stack[stack.length - 1] === '{') stack.pop();
      } else if (ch === ']') {
        if (stack[stack.length - 1] === '[') stack.pop();
      }
    }
  }

  // If ended while inside a string, close the string
  if (inString) {
    s += '"';
  }

  // Remove any trailing incomplete key/value or trailing commas
  s = s.replace(/,\s*$/, "");
  s = s.replace(/:\s*$/, ': ""');
  s = s.replace(/,\s*([\]}])/g, "$1");

  // Close all remaining open brackets/braces in reverse order
  while (stack.length > 0) {
    const last = stack.pop();
    if (last === '{') s += '}';
    else if (last === '[') s += ']';
  }

  return s;
}

export function parseJsonResponse(text: string | undefined): any {
  if (!text || typeof text !== "string") return {};

  let jsonStr = text.trim();

  // 1. Extract from markdown code fence if present
  const markdownMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    jsonStr = markdownMatch[1].trim();
  }

  // 2. Locate starting brace or bracket
  const firstBrace = jsonStr.indexOf('{');
  const firstBracket = jsonStr.indexOf('[');
  let startIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx !== -1) {
    jsonStr = jsonStr.slice(startIdx);
  }

  // 3. Direct parse attempt
  try {
    return JSON.parse(jsonStr);
  } catch (_) {}

  // 4. Try basic cleanup (trailing commas, control characters)
  try {
    const cleaned = jsonStr
      .replace(/,\s*([\]}])/g, '$1')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
        if (match === '\n' || match === '\r' || match === '\t') return match;
        return '';
      });
    return JSON.parse(cleaned);
  } catch (_) {}

  // 5. Try structural repair of truncated JSON (closing quotes, arrays, objects)
  try {
    const repaired = repairTruncatedJson(jsonStr);
    return JSON.parse(repaired);
  } catch (_) {}

  // 6. Progressive trimming from end if trailing noise exists
  const lastBrace = jsonStr.lastIndexOf('}');
  const lastBracket = jsonStr.lastIndexOf(']');
  let end = Math.max(lastBrace, lastBracket);

  while (end > 0) {
    const candidate = jsonStr.slice(0, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (_) {
      try {
        const repairedCandidate = repairTruncatedJson(candidate);
        return JSON.parse(repairedCandidate);
      } catch (_) {}
    }
    const nextBrace = jsonStr.lastIndexOf('}', end - 1);
    const nextBracket = jsonStr.lastIndexOf(']', end - 1);
    end = Math.max(nextBrace, nextBracket);
  }

  console.warn("[JSON Parser] Impossible de parser le JSON brut, retour objet vide de secours.", jsonStr.slice(0, 300));
  return {};
}
