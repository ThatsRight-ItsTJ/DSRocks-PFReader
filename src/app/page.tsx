"use client";

import { useRef } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor, Monaco } from "@monaco-editor/react";

export default function Home() {
  const editorRef = useRef<MonacoDiffEditor | null>(null);

  const handleEditorDidMount = (editor: MonacoDiffEditor, monaco: Monaco) => {
    editorRef.current = editor;
  };

  return (
    <NextUIProvider>
      <div className="flex justify-center items-center h-screen">
        <DiffEditor
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
