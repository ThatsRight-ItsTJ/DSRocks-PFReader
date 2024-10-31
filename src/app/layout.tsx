import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
