import Groq from "groq-sdk";

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

let groqClient: Groq | null = null;

if (apiKey) {
  try {
    groqClient = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  } catch (error) {
    console.error("Failed to initialize Groq client:", error);
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
