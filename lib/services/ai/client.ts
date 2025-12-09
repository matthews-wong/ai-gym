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

export function getApiStatus() {
  return {
    apiKeyAvailable: !!apiKey,
    clientInitialized: !!groqClient,
    apiKeyLength: apiKey?.length || 0,
    modelAvailable: true,
    timestamp: new Date().toISOString(),
    responseStatus: {
      success: !!groqClient,
      message: groqClient
        ? "AI service is ready"
        : "AI service not available, please check your API key",
      serviceAvailable: !!groqClient,
    },
  };
}
