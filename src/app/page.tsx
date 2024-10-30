"use client";

import { useRef } from "react";
import { Button, NextUIProvider, Select, SelectItem } from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor, Monaco } from "@monaco-editor/react";

export default function Home() {
  const editorRef = useRef<MonacoDiffEditor | null>(null);

  const handleEditorDidMount = (editor: MonacoDiffEditor, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const handleSubmit = () => {
    const editor = editorRef.current;
    if (editor) {
      const value = editor.getOriginalEditor().getValue();
      console.log(value);
      editor.getModifiedEditor().setValue(value + "\n// modified");
    }
  };

  const contexts = [
    { key: "academic", label: "Academic" },
    { key: "chat", label: "Chat" },
    { key: "email", label: "Email" },
    { key: "oral", label: "Oral" },
  ];

  return (
    <NextUIProvider>
      <div className="flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <Select label="Select a context" className="max-w-xs p-4">
            {contexts.map((context) => (
              <SelectItem key={context.key}>{context.label}</SelectItem>
            ))}
          </Select>
          <Button className="ml-4" onPress={handleSubmit}>
            Submit
          </Button>
        </div>
        <DiffEditor
          className="h-screen"
          language="plaintext"
          options={{ originalEditable: true }}
          original="// the original code"
          modified="// the modified code"
          onMount={handleEditorDidMount}
        />
      </div>
    </NextUIProvider>
  );
}
