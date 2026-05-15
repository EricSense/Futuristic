import type { Metadata } from "next";
import { DDIProvider } from "@/lib/ddi-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic | Digital Driving Identity (DDI)",
  description:
    "Futuristic is building Digital Driving Identity (DDI) for a new mobility paradigm: not a car you own, but a car that knows you. Product demos, federation, and scale.",
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
