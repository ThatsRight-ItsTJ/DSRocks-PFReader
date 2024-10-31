import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { generate_system_prompt } from "@/lib/prompt";
import { NextRequest, NextResponse } from "next/server";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

interface RequestPayload {
  model: string;
  context: string;
  instruction: string;
  prompt: string;
  endpoint: string;
  apiKey: string;
}

const apiKeys = process.env.API_KEY?.split(",") || [];

export async function POST(req: NextRequest) {
  const {
    model,
    context,
    instruction,
    prompt,
    endpoint,
    apiKey,
  }: RequestPayload = await req.json();

  let baseURL = "";
  let openaiApiKey = "";

  if (endpoint === process.env.NEXT_PUBLIC_URL) {
    if (apiKeys.includes(apiKey)) {
      baseURL = process.env.OPENAI_BASE_URL!;
      openaiApiKey = process.env.OPENAI_API_KEY!;
    } else {
      // Return unauthorized error
      return new NextResponse("Unauthorized", { status: 401 });
    }
  } else {
    baseURL = endpoint;
    openaiApiKey = apiKey;
  }

  const openai = createOpenAI({
    baseURL: baseURL,
    apiKey: openaiApiKey,
  });

  const result = await streamText({
    model: openai(model),
    system: generate_system_prompt(context, instruction),
    prompt,
  });

  return result.toDataStreamResponse();
}
