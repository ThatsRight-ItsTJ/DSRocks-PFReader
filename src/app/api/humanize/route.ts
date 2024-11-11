import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await hf.textGeneration({
      model: "meta-llama/Llama-2-70b-chat-hf",
      inputs: `Rewrite the following text to make it more human-like while preserving its meaning and intent. Make it flow naturally and vary the sentence structure:

${prompt}

Rewritten text:`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.2,
      },
    });

    return new NextResponse(response.generated_text);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to humanize text" },
      { status: 500 }
    );
  }
}