import Groq from "groq-sdk";

// Use server-only API key - this file should only be imported in server contexts
const apiKey = process.env.GROQ_API_KEY;

let groqClient: Groq | null = null;

if (apiKey) {
  try {
    groqClient = new Groq({
      apiKey,
    });
  } catch {
    // Failed to initialize Groq client
  }
}

export function getGroqClient(): Groq | null {
  return groqClient;
}

export function isAIServiceAvailable(): boolean {
  return !!groqClient;
}
