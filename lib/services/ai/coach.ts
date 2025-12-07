import { getGroqClient, isAIServiceAvailable } from "./client";
import type { CoachResponse } from "./types";

export async function getCoachResponse(prompt: string): Promise<CoachResponse> {
  if (!isAIServiceAvailable()) {
    return {
      response: "",
      error: "AI service is not available. Please check your API key.",
    };
  }

  const groq = getGroqClient();
  if (!groq) {
    return {
      response: "",
      error: "Failed to initialize AI client.",
    };
  }

  try {
    const systemPrompt = `You are an expert fitness coach and nutritionist named AIGymBro. 
    Provide helpful, accurate, and encouraging advice about workouts, nutrition, and overall fitness. 
    Keep responses concise but informative. Be motivating and supportive.
    If asked about medical conditions, recommend consulting a healthcare professional.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return {
        response: "",
        error: "Received empty response from AI service.",
      };
    }

    return { response };
  } catch (error) {
    console.error("Coach API error:", error);
    return {
      response: "",
      error: "Failed to get response from AI Coach. Please try again.",
    };
  }
}
