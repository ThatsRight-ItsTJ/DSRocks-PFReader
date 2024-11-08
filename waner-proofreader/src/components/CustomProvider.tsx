"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ErrorBoundary } from "react-error-boundary";

export default function CustomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" enableSystem>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          {children}
        </ErrorBoundary>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
