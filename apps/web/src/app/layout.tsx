import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic — Your Digital Driving Identity",
  description:
    "The car that knows you is the prototype for the world that knows you. Build your portable digital identity and sync it to any vehicle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
