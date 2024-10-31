"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import lightModeSvg from "@/icons/light_mode.svg";
import darkModeSvg from "@/icons/dark_mode.svg";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco && mounted) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
    }
  }, [monaco, mounted, theme]);

  if (!mounted) return null;

  return (
    <Tooltip content="Toggle Theme">
      <Button
        isIconOnly
        className="h-12 w-12"
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {mounted && theme === "dark" ? (
          <div>
            <Image
              src={darkModeSvg}
              alt="Night Mode Icon"
              className="h-7 w-7 dark:invert"
            />
          </div>
        ) : (
          <div>
            <Image
              src={lightModeSvg}
              alt="Light Mode Icon"
              className="h-7 w-7 dark:invert"
            />
          </div>
        )}
      </Button>
    </Tooltip>
  );
}
