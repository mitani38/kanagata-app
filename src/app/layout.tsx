import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanagata — Notion Viewer",
  description: "PC対応 Notion ビューワー",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
