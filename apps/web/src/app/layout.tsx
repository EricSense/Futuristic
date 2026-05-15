import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { DDIProvider } from "@/lib/ddi-context";
import { COMPANY_TAGLINE } from "@/lib/company-copy";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic | Digital Driving Identity (DDI)",
  description: COMPANY_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>
          <DDIProvider>{children}</DDIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
