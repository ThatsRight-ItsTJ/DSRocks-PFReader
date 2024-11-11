"use client";

import { useState } from "react";
import { useCompletion } from "ai/react";

import { ArticleEditor } from "@/components/ArticleEditor";
import { ArticleForm } from "@/components/ArticleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [style, setStyle] = useState<"formal" | "casual">("formal");
  const [originalText, setOriginalText] = useState("");
  const [humanizedText, setHumanizedText] = useState("");
  const [correctedText, setCorrectedText] = useState("");

  const { complete: generateArticle, isLoading: isGenerating } = useCompletion({
    api: "/api/generate",
    onError: (error) => {
      toast({
        title: "Error generating article",
        description: error.message,
        variant: "destructive",
      });
    },
    onFinish: (result) => {
      setOriginalText(result);
      humanizeText(result);
    },
  });

  const { complete: humanize, isLoading: isHumanizing } = useCompletion({
    api: "/api/humanize",
    onError: (error) => {
      toast({
        title: "Error humanizing text",
        description: error.message,
        variant: "destructive",
      });
    },
    onFinish: (result) => {
      setHumanizedText(result);
      proofreadText(result);
    },
  });

  const { complete: proofread, isLoading: isProofreading } = useCompletion({
    api: "/api/proofread",
    onError: (error) => {
      toast({
        title: "Error proofreading text",
        description: error.message,
        variant: "destructive",
      });
    },
    onFinish: (result) => {
      setCorrectedText(result);
    },
  });

  const humanizeText = async (text: string) => {
    await humanize(text);
  };

  const proofreadText = async (text: string) => {
    await proofread(text);
  };

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for the article",
        variant: "destructive",
      });
      return;
    }

    await generateArticle("", {
      body: {
        topic,
        length,
        style,
      },
    });
  };

  const isProcessing = isGenerating || isHumanizing || isProofreading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <main className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">AI Article Generator</h1>

        <div className="grid gap-8">
          <Card className="p-6">
            <ArticleForm
              topic={topic}
              onTopicChange={setTopic}
              length={length}
              onLengthChange={setLength}
              style={style}
              onStyleChange={setStyle}
            />
            <Button
              className="mt-4 w-full"
              onClick={handleGenerate}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Generate Article"}
            </Button>
          </Card>

          <ArticleEditor
            originalText={originalText}
            humanizedText={humanizedText}
            correctedText={correctedText}
            isLoading={isProcessing}
          />
        </div>
      </main>
    </div>
  );
}