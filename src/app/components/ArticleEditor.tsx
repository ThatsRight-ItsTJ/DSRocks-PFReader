import { DiffEditor } from "@monaco-editor/react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ArticleEditorProps {
  originalText: string;
  humanizedText: string;
  correctedText: string;
  isLoading: boolean;
}

export function ArticleEditor({
  originalText,
  humanizedText,
  correctedText,
  isLoading,
}: ArticleEditorProps) {
  if (!originalText && !isLoading) {
    return (
      <Card className="flex min-h-[400px] items-center justify-center border-2 border-dashed p-8 text-center text-muted-foreground">
        Enter a topic and click Generate to create your article
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8">
        <Progress value={66} className="w-[60%]" />
        <p className="text-sm text-muted-foreground">Processing your article...</p>
      </Card>
    );
  }

  return (
    <Card className="min-h-[400px] p-6">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="text-center font-semibold">Original</div>
        <div className="text-center font-semibold">
          {correctedText ? "Final Version" : humanizedText ? "Humanized" : "Original"}
        </div>
      </div>
      <DiffEditor
        height="600px"
        language="markdown"
        original={originalText}
        modified={correctedText || humanizedText || originalText}
        options={{
          readOnly: true,
          renderSideBySide: true,
          wordWrap: "on",
        }}
      />
    </Card>
  );
}