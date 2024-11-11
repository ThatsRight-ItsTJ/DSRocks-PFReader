import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic, length, style } = await req.json();

    const wordCount = {
      short: 300,
      medium: 600,
      long: 1000,
    }[length];

    const response = await fetch("https://api.airforce/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "lfm-40b-moe",
        messages: [
          {
            role: "system",
            content: `You are an expert article writer. Write articles that are engaging, informative, and well-structured. Use ${
              style === "formal" ? "formal language and professional tone" : "casual language and conversational tone"
            }.`,
          },
          {
            role: "user",
            content: `Write an article about "${topic}". The article should be approximately ${wordCount} words long.`,
          },
        ],
        max_tokens: Math.ceil((wordCount * 4) * 1.2), // Assuming average token length of 4 chars, add 20% buffer
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate article");
    }

    const data = await response.json();
    return new NextResponse(data.choices[0].message.content);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate article" },
      { status: 500 }
    );
  }
}