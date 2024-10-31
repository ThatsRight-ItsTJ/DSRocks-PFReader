"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { Switch } from "@nextui-org/react";
import Image from "next/image";
import sunSvg from "@material-design-icons/svg/filled/wb_sunny.svg";
import moonSvg from "@material-design-icons/svg/filled/brightness_2.svg";

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
    <Switch
      size="lg"
      startContent={
        <div>
          <Image src={sunSvg} alt="Sun icon" width={16} height={16} />
        </div>
      }
      endContent={
        <div>
          <Image src={moonSvg} alt="Moon icon" width={16} height={16} />
        </div>
      }
      isSelected={theme === "dark"}
      onValueChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
}
