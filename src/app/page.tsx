"use client";

import { useRef, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { useCompletion } from "ai/react";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";
import {
  Select,
  SelectItem,
  Card,
  CardBody,
  Link,
  NextUIProvider,
} from "@nextui-org/react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";
import { ErrorBoundary } from "react-error-boundary";

import { EditIcon, LightbulbIcon, GithubIcon } from "@/components/Icon";

import {
  models,
  contexts,
  instructions,
  generate_system_prompt,
} from "@/lib/prompt";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import IconButton from "@/components/IconButton";

export default function HomePage() {
  const { theme } = useTheme();

  const editorRef = useRef<MonacoDiffEditor | null>(null);

  const [model, setModel] = useLocalStorageState("model", {
    defaultValue: models[0],
  });
  const [context, setContext] = useLocalStorageState("context", {
    defaultValue: contexts[0].key,
  });
  const [instruction, setInstruction] = useLocalStorageState("instruction", {
    defaultValue: instructions[0].key,
  });
  const [originalText, setOriginalText] = useLocalStorageState<string | null>(
    "originalText",
    {
      defaultValue: null,
    }
  );
  const [modifiedText, setModifiedText] = useLocalStorageState<string | null>(
    "modifiedText",
    {
      defaultValue: null,
    }
  );
  const [leftHeaderWidth, setLeftHeaderWidth] = useState<number | null>(null);

  useEffect(() => {
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
  }, [model, context, instruction]);

  const originalTextInitialized = useRef(false);
  const modifiedTextInitialized = useRef(false);
  useEffect(() => {
    if (
      !originalTextInitialized.current &&
      editorRef.current !== null &&
      originalText !== null
    ) {
      editorRef.current?.getOriginalEditor().setValue(originalText);
      originalTextInitialized.current = true;
    }
  }, [editorRef.current, originalText]);
  useEffect(() => {
    if (
      !modifiedTextInitialized.current &&
      editorRef.current !== null &&
      modifiedText !== null
    ) {
      editorRef.current?.getModifiedEditor().setValue(modifiedText);
      modifiedTextInitialized.current = true;
    }
  }, [editorRef.current, modifiedText]);

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor;

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
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
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
                            keys?.currentKey &&
                            setModel(keys.currentKey as string)
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
                            <SelectItem key={context.key}>
                              {context.label}
                            </SelectItem>
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
                        <IconButton
                          tooltip="GitHub repository"
                          icon={<GithubIcon className="dark:invert h-7 w-7" />}
                          as={Link}
                          isIconOnly
                          href="https://github.com/AuroraDysis/waner-proofreader"
                          isExternal
                        />
                        <ThemeSwitcher />
                        <IconButton
                          tooltip={
                            <div className="max-w-md">
                              {generate_system_prompt(context, instruction)}
                            </div>
                          }
                          icon={
                            <LightbulbIcon className="dark:invert h-7 w-7" />
                          }
                        />
                        <IconButton
                          tooltip="Proofread"
                          icon={<EditIcon className="dark:invert h-7 w-7" />}
                          isLoading={isLoading}
                          onPress={() => handleProofread()}
                        />
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <div
                        className="flex justify-center"
                        style={{
                          width: `${
                            leftHeaderWidth ? leftHeaderWidth - 14 : "50%"
                          }px`,
                        }}
                      >
                        Original Text
                      </div>
                      <div className="flex justify-center flex-1">
                        Modified Text
                      </div>
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
        </ErrorBoundary>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
