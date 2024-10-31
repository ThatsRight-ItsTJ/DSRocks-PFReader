"use client";

import { useRef, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCompletion } from "ai/react";
import { useTheme } from "next-themes";
import {
  Button,
  Select,
  SelectItem,
  Card,
  CardBody,
  Tooltip,
  Link,
} from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";

import { EditIcon, LightbulbIcon, GithubIcon } from "@/components/icons";

import {
  models,
  contexts,
  instructions,
  generate_system_prompt,
} from "@/lib/prompt";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
const modelAtom = atomWithStorage("model", models[0]);
const contextAtom = atomWithStorage("modelContext", contexts[0].key);
const instructionAtom = atomWithStorage("instruction", instructions[0].key);
const textOriginalEditorAtom = atomWithStorage<string | undefined>(
  "textOriginalEditor",
  undefined
);
const textModifiedEditorAtom = atomWithStorage<string | undefined>(
  "textModifiedEditor",
  undefined
);
const leftHeaderWidthAtom = atom<number | undefined>(undefined);

export default function HomePage() {
  const { theme } = useTheme();

  const editorRef = useRef<MonacoDiffEditor | null>(null);

  const [model, setModel] = useAtom(modelAtom);
  const [context, setContext] = useAtom(contextAtom);
  const [instruction, setInstruction] = useAtom(instructionAtom);
  const [originalText, setOriginalText] = useAtom(textOriginalEditorAtom);
  const [modifiedText, setModifiedText] = useAtom(textModifiedEditorAtom);
  const [leftHeaderWidth, setLeftHeaderWidth] = useAtom(leftHeaderWidthAtom);

  // model must be one of the available models
  if (!models.includes(model)) {
    setModel(models[0]);
  }

  // context must be one of the available contexts
  if (!contexts.some((c) => c.key === context)) {
    setContext(contexts[0].key);
  }

  // instruction must be one of the available instructions
  if (!instructions.some((i) => i.key === instruction)) {
    setInstruction(instructions[0].key);
  }

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor;

    // Set the initial content for the editors
    editor.getOriginalEditor().setValue(originalText || "");
    editor.getModifiedEditor().setValue(modifiedText || "");

    const handleOriginalContentChange = () => {
      const value = editor.getOriginalEditor().getValue();
      if (value !== originalText) {
        setOriginalText(value);
      }
    };

    const handleModifiedContentChange = () => {
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

    editor.getOriginalEditor().onDidLayoutChange((layout) => {
      setLeftHeaderWidth(layout.width);
    });
  };

  const { completion, complete, isLoading } = useCompletion();

  useEffect(() => {
    if (completion && completion !== modifiedText) {
      editorRef.current?.getModifiedEditor().setValue(completion);
    }
  }, [completion, modifiedText, setModifiedText]);

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

  return (
    <main>
      <div className="m-4 h-[96vh]">
        <Card className="h-full">
          <CardBody className="overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <Select
                    label="Select a model"
                    selectedKeys={[model]}
                    onSelectionChange={(keys) =>
                      keys?.currentKey && setModel(keys.currentKey as string)
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
                      keys?.currentKey && setContext(keys?.currentKey)
                    }
                    className="max-w-40"
                  >
                    {contexts.map((context) => (
                      <SelectItem key={context.key}>{context.label}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Select an instruction"
                    selectedKeys={[instruction]}
                    onSelectionChange={(keys) =>
                      keys?.currentKey && setInstruction(keys?.currentKey)
                    }
                    className="max-w-md"
                  >
                    {instructions.map((instruction) => (
                      <SelectItem key={instruction.key}>
                        {instruction.prompt}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="GitHub repository" closeDelay={0}>
                    <Button
                      className="h-12 w-12"
                      as={Link}
                      isIconOnly
                      href="https://github.com/AuroraDysis/waner-proofreader"
                      isExternal
                    >
                      <GithubIcon className="dark:invert h-7 w-7" />
                    </Button>
                  </Tooltip>
                  <ThemeSwitcher />
                  <Tooltip
                    content={
                      <div className="max-w-md">
                        {generate_system_prompt(context, instruction)}
                      </div>
                    }
                    closeDelay={0}
                  >
                    <Button className="h-12 w-12" isIconOnly>
                      <LightbulbIcon className="dark:invert h-7 w-7" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Proofread" closeDelay={0}>
                    <Button
                      className="h-12 w-12"
                      isIconOnly
                      onPress={() => handleProofread()}
                      isLoading={isLoading}
                    >
                      <EditIcon className="dark:invert h-7 w-7" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div
                  className="flex justify-center"
                  style={{
                    width: `${
                      leftHeaderWidth !== undefined ? leftHeaderWidth - 14 : 0
                    }px`,
                  }}
                >
                  Original Text
                </div>
                <div className="flex justify-center flex-1">Modified Text</div>
              </div>
              <div className="flex-grow">
                <DiffEditor
                  className="h-full"
                  language="plaintext"
                  theme={theme === "dark" ? "vs-dark" : "vs"}
                  options={{ originalEditable: true, wordWrap: "on" }}
                  onMount={handleEditorDidMount}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
