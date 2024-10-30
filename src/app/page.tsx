"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useRef } from "react";
import { useCompletion } from "ai/react";
import { Button, NextUIProvider, Select, SelectItem } from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";

const modelAtom = atomWithStorage("model", "anthropic/claude-3.5-sonnet");
const contextAtom = atomWithStorage("modelContext", "academic");
const instructionAtom = atomWithStorage("instruction", "basicProofread");
const textOriginalEditorAtom = atomWithStorage(
  "textOriginalEditor",
  "the original text"
);
const textModifiedEditorAtom = atomWithStorage(
  "textModifiedEditor",
  "the modified text"
);

export default function Home() {
  const editorRef = useRef<MonacoDiffEditor | null>(null);
  const [model, setModel] = useAtom(modelAtom);
  const [context, setContext] = useAtom(contextAtom);
  const [instruction, setInstruction] = useAtom(instructionAtom);
  const [originalText, setOriginalText] = useAtom(textOriginalEditorAtom);
  const [modifiedText, setModifiedText] = useAtom(textModifiedEditorAtom);

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor;
    editor.getOriginalEditor().onDidChangeModelContent((event) => {
      setOriginalText(editor.getOriginalEditor().getValue());
    });
    editor.getModifiedEditor().onDidChangeModelContent((event) => {
      setModifiedText(editor.getModifiedEditor().getValue());
    });
  };

  const { completion, complete } = useCompletion({
    initialCompletion: modifiedText,
  });
  setModifiedText(completion);

  const handleProofread = async () => {
    const editor = editorRef.current;
    if (editor) {
      await complete(instruction + ":\n" + originalText, {
        body: {
          model: model,
        },
      });
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

  return (
    <NextUIProvider>
      <div className="flex-col items-center justify-center h-screen">
        <div className="flex items-center justify-center h-10 mt-4 gap-4">
          <Select
            label="Select a model"
            selectedKeys={[model]}
            onSelectionChange={(keys) =>
              keys.currentKey && setModel(keys.currentKey)
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
              keys.currentKey && setContext(keys.currentKey)
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
              keys.currentKey && setInstruction(keys.currentKey)
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
          original={originalText}
          modified={modifiedText}
          onMount={handleEditorDidMount}
        />
      </div>
    </NextUIProvider>
  );
}
