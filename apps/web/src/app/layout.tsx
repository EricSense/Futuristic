import type { Metadata } from "next";
import { DDIProvider } from "@/lib/ddi-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic | Digital Driving Identity",
  description:
    "Futuristic builds DDI — Digital Driving Identity. The future of transportation is not about owning smarter cars. It is about creating cars that instantly understand people.",
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
