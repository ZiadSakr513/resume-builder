import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVForge - Resume Builder",
  description: "Create polished resumes with secure local accounts and instant PDF export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
