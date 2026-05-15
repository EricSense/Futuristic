import type { Metadata } from "next";
import { DDIProvider } from "@/lib/ddi-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic | Digital Driving Identity",
  description:
    "Futuristic is building Digital Driving Identity (DDI) for the future of mobility — so every vehicle can instantly understand the person inside. Try the interactive demo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">
        <DDIProvider>{children}</DDIProvider>
      </body>
    </html>
  );
}
