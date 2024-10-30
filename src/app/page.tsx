"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useRef, useEffect } from "react";
import { useCompletion } from "ai/react";
import { Button, NextUIProvider, Select, SelectItem } from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";

import { models, contexts, instructions } from "@/lib/prompt";

const modelAtom = atomWithStorage("model", "anthropic/claude-3.5-sonnet");
const contextAtom = atomWithStorage("modelContext", "academic");
const instructionAtom = atomWithStorage("instruction", "basicProofread");
const textOriginalEditorAtom = atomWithStorage<string | null>(
  "textOriginalEditor",
  null
);
const textModifiedEditorAtom = atomWithStorage<string | null>(
  "textModifiedEditor",
  null
);

export default function Home() {
  const editorRef = useRef<MonacoDiffEditor | null>(null);
  const isInitializing = useRef(true);
  const isUpdatingOriginalText = useRef(false);
  const isUpdatingModifiedText = useRef(false);

  const [model, setModel] = useAtom(modelAtom);
  const [context, setContext] = useAtom(contextAtom);
  const [instruction, setInstruction] = useAtom(instructionAtom);
  const [originalText, setOriginalText] = useAtom(textOriginalEditorAtom);
  const [modifiedText, setModifiedText] = useAtom(textModifiedEditorAtom);

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor;

    // Set the initial content for the editors
    editor
      .getOriginalEditor()
      .getModel()
      ?.setValue(originalText || "");
    editor
      .getModifiedEditor()
      .getModel()
      ?.setValue(modifiedText || "");

    const handleOriginalContentChange = () => {
      if (isInitializing.current || isUpdatingOriginalText.current) {
        isUpdatingOriginalText.current = false;
        return;
      }
      const value = editor.getOriginalEditor().getValue();
      if (value !== originalText) {
        setOriginalText(value);
      }
    };

    const handleModifiedContentChange = () => {
      if (isInitializing.current || isUpdatingModifiedText.current) {
        isUpdatingModifiedText.current = false;
        return;
      }
      const value = editor.getModifiedEditor().getValue();
      if (value !== modifiedText) {
        setModifiedText(value);
      }
    };

    editor
      .getOriginalEditor()
      .onDidChangeModelContent(handleOriginalContentChange);
    editor
      .getModifiedEditor()
      .onDidChangeModelContent(handleModifiedContentChange);

    // Set isInitializing to false after initial setup
    isInitializing.current = false;
  };

  const { completion, complete } = useCompletion();

  useEffect(() => {
    if (completion && completion !== modifiedText) {
      setModifiedText(completion);
    }
  }, [completion]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentOriginalValue = editor.getOriginalEditor().getValue();
      if (originalText !== currentOriginalValue) {
        isUpdatingOriginalText.current = true;
        editor
          .getOriginalEditor()
          .getModel()
          ?.setValue(originalText || "");
      }
    }
  }, [originalText]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentModifiedValue = editor.getModifiedEditor().getValue();
      if (modifiedText !== currentModifiedValue) {
        isUpdatingModifiedText.current = true;
        editor
          .getModifiedEditor()
          .getModel()
          ?.setValue(modifiedText || "");
      }
    }
  }, [modifiedText]);

  const handleProofread = async () => {
    if (editorRef.current) {
      try {
        await complete(originalText || "", {
          body: {
            model: model,
            context: context,
            instruction: instruction,
          },
        });
      } catch (error) {
        console.error("Proofreading failed:", error);
      }
    }
  };

  // Wait until originalText and modifiedText are loaded from storage
  if (originalText === undefined || modifiedText === undefined) {
    return null; // or a loading indicator
  }

  return (
    <NextUIProvider>
      <div className="flex-col items-center justify-center h-screen">
        <div className="flex items-center justify-center h-10 mt-4 gap-4">
          <Select
            label="Select a model"
            selectedKeys={[model]}
            onSelectionChange={(keys) =>
              keys && setModel(keys.currentKey as string)
            }
            className="max-w-64"
          >
            {models.map((model) => (
              <SelectItem key={model}>{model}</SelectItem>
            ))}
          </Select>
          <Select
            label="Select a context"
            selectedKeys={[context]}
            onSelectionChange={(keys) =>
              keys && setContext(keys.currentKey as string)
            }
            className="max-w-36"
          >
            {contexts.map((context) => (
              <SelectItem key={context.key}>{context.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="Select an instruction"
            selectedKeys={[instruction]}
            onSelectionChange={(keys) =>
              keys && setInstruction(keys.currentKey as string)
            }
            className="max-w-md"
          >
            {instructions.map((instruction) => (
              <SelectItem key={instruction.key}>
                {instruction.prompt}
              </SelectItem>
            ))}
          </Select>
          <Button onPress={handleProofread}>Proofread</Button>
        </div>
        <DiffEditor
          className="h-full mt-4"
          language="plaintext"
          options={{ originalEditable: true, wordWrap: "on" }}
          onMount={handleEditorDidMount}
        />
      </div>
    </NextUIProvider>
  );
}
