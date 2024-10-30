import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 500;

export async function POST(req: Request) {
  const { model, prompt }: { model: string; prompt: string } = await req.json();

  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const result = await streamText({
    model: openai(model),
    prompt,
  });

  return result.toDataStreamResponse();
}
