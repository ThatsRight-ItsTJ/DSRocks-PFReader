import type { Metadata } from "next";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "Waner Proofreader",
  description:
    "An AI-powered tool designed to help non-native English speakers proofread their text effectively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased">
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              {children}
            </ErrorBoundary>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
