import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic — Portable Digital Identity Infrastructure",
  description:
    "Futuristic builds portable digital identity infrastructure for vehicles, autonomous systems, and the connected world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
