import type { Metadata } from "next";
import { PassportProvider } from "@/lib/passport-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic | The Universal Mobility Passport",
  description:
    "DDI is your Universal Mobility Passport. One identity for every vehicle, every border, every mode. This car knows ME.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">
        <PassportProvider>{children}</PassportProvider>
      </body>
    </html>
  );
}
