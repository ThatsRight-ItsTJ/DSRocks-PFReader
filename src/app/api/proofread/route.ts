import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus",
        messages: [
          {
            role: "system",
            content: "You are an expert proofreader and editor. Your task is to improve the text while maintaining its original meaning. Focus on grammar, clarity, and flow.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to proofread text");
    }

    const data = await response.json();
    return new NextResponse(data.choices[0].message.content);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to proofread text" },
      { status: 500 }
    );
  }
}