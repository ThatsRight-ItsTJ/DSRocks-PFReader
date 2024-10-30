"use client";

import { debounce } from "lodash";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useRef, useEffect, useMemo } from "react";
import { useCompletion } from "ai/react";
import {
  Button,
  NextUIProvider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";

const modelAtom = atomWithStorage("model", "anthropic/claude-3.5-sonnet");
const contextAtom = atomWithStorage("modelContext", "academic");
const instructionAtom = atomWithStorage("instruction", "basicProofread");
const textOriginalEditorAtom = atomWithStorage<string | undefined>(
  "textOriginalEditor",
  undefined
);
const textModifiedEditorAtom = atomWithStorage<string | undefined>(
  "textModifiedEditor",
  undefined
);

export default function Home() {
  const editorRef = useRef<MonacoDiffEditor | null>(null);
  const isInitializing = useRef(true);
  const [model, setModel] = useAtom(modelAtom);
  const [context, setContext] = useAtom(contextAtom);
  const [instruction, setInstruction] = useAtom(instructionAtom);
  const [originalText, setOriginalText] = useAtom(textOriginalEditorAtom);
  const [modifiedText, setModifiedText] = useAtom(textModifiedEditorAtom);

  const debouncedSetOriginalText = useMemo(
    () => debounce(setOriginalText, 300),
    [setOriginalText]
  );

  const debouncedSetModifiedText = useMemo(
    () => debounce(setModifiedText, 300),
    [setModifiedText]
  );

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor;

    // Set the initial content for the editors
    editor.getOriginalEditor().getModel()?.setValue(originalText || "");
    editor.getModifiedEditor().getModel()?.setValue(modifiedText || "");

    const handleOriginalContentChange = () => {
      if (isInitializing.current) return;
      const value = editor.getOriginalEditor().getValue();
      if (value !== originalText) {
        debouncedSetOriginalText(value);
      }
    };

    const handleModifiedContentChange = () => {
      if (isInitializing.current) return;
      const value = editor.getModifiedEditor().getValue();
      if (value !== modifiedText) {
        debouncedSetModifiedText(value);
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
  }, [completion, modifiedText, setModifiedText]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentOriginalValue = editor.getOriginalEditor().getValue();
      if (originalText !== currentOriginalValue) {
        editor.getOriginalEditor().getModel()?.setValue(originalText || "");
      }
    }
  }, [originalText]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentModifiedValue = editor.getModifiedEditor().getValue();
      if (modifiedText !== currentModifiedValue) {
        editor.getModifiedEditor().getModel()?.setValue(modifiedText || "");
      }
    }
  }, [modifiedText]);

  const handleProofread = async () => {
    if (editorRef.current) {
      try {
        await complete(instruction + ":\n" + originalText, {
          body: {
            model: model,
          },
        });
      } catch (error) {
        console.error("Proofreading failed:", error);
      }
    }
  };

  const models = [
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-3-opus",
    "openai/chatgpt-4o-latest",
    "openai/gpt-4",
  ];

  const contexts = [
    { key: "academic", label: "Academic" },
    { key: "chat", label: "Chat" },
    { key: "email", label: "Email" },
    { key: "oral", label: "Oral" },
  ];

  const instructions = [
    {
      key: "basicProofread",
      description: "最基本的校稿指令",
      prompt: "Proofread this text",
    },
    {
      key: "awkwardParts",
      description:
        "仅作些许编辑, 修正非英语母语人士常犯的错误, 包括用词、语法和逻辑",
      prompt: "Fix only awkward parts",
    },
    {
      key: "streamline",
      description: "精简和梳理不通顺之处, 使整体内容更清晰",
      prompt: "Streamline any awkward words or phrases",
    },
    {
      key: "polish",
      description: "更积极地编辑和润饰, 修改程度更高",
      prompt: "Polish any awkward words or phrases",
    },
    {
      key: "trim",
      description: "如果文本太过冗长",
      prompt: "Trim the fat",
    },
    {
      key: "clarityAndFlow",
      description: "提高清晰度和流畅性",
      prompt: "Improve clarity and flow",
    },
    {
      key: "significantClarityAndFlow",
      description: "显著提高清晰度和流畅性",
      prompt: "Significantly improving clarity and flow",
    },
  ];

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
              <SelectItem
                key={instruction.key}
                description={instruction.description}
              >
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
