"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface VerifiedCredential {
  type: string;
  issuer: string;
  verified: boolean;
}

export interface DDI {
  id: string;
  holderName: string;
  homeCity: string;
  issuedAt: string;
  identity: {
    verified: boolean;
    biometric: boolean;
  };
  licenses: VerifiedCredential[];
  insurance: { carrier: string; coverage: "domestic" | "global"; verified: boolean }[];
  accessibility: {
    mobility?: string;
    vision?: string;
    hearing?: string;
    communication?: string;
  };
  languages: string[];
  payment: { primary: string };
  aiPersona: { tone: "concise" | "warm" | "playful" };
  trustedNetworks: string[];
  trustScore: number;
}

export interface CreateDDIInput {
  holderName: string;
  homeCity: string;
  accessibility?: DDI["accessibility"];
  languages?: string[];
  aiPersona?: DDI["aiPersona"]["tone"];
}

interface DDIContextValue {
  ddi: DDI | null;
  loading: boolean;
  create: (input: CreateDDIInput) => DDI;
  revoke: () => void;
}

const STORAGE_KEY = "futuristic_ddi_v2";

const DDIContext = createContext<DDIContextValue | null>(null);

function generateDDIId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const out: string[] = ["DDI"];
  for (let s = 0; s < 4; s++) {
    let g = "";
    for (let i = 0; i < 4; i++) g += chars[Math.floor(Math.random() * chars.length)];
    out.push(g);
  }
  return out.join("-");
}

export function buildDDI(input: CreateDDIInput): DDI {
  return {
    id: generateDDIId(),
    holderName: input.holderName.trim(),
    homeCity: input.homeCity.trim(),
    issuedAt: new Date().toISOString(),
    identity: { verified: true, biometric: true },
    licenses: [
      { type: "Driver License", issuer: "California DMV", verified: true },
      { type: "International Driving Permit", issuer: "AAA", verified: true },
    ],
    insurance: [
      { carrier: "Lemonade Universal", coverage: "global", verified: true },
      { carrier: "Allianz Travel", coverage: "global", verified: true },
    ],
    accessibility: input.accessibility ?? {},
    languages: input.languages?.length ? input.languages : ["en"],
    payment: { primary: "Mobility Wallet **** 4242" },
    aiPersona: { tone: input.aiPersona ?? "concise" },
    trustedNetworks: [
      "Waymo",
      "BART Bay Area",
      "ANA Airlines",
      "Tokyo Smart City",
      "Lime",
      "TSA PreCheck",
    ],
    trustScore: 982,
  };
}

export const SAMPLE_DDI: DDI = {
  id: "DDI-7K9F-4M2X-LP3R-WQ8N",
  holderName: "Maya Chen",
  homeCity: "San Francisco, USA",
  issuedAt: "2026-01-14T09:00:00.000Z",
  identity: { verified: true, biometric: true },
  licenses: [
    { type: "Driver License", issuer: "California DMV", verified: true },
    { type: "International Driving Permit", issuer: "AAA", verified: true },
  ],
  insurance: [
    { carrier: "Lemonade Universal", coverage: "global", verified: true },
    { carrier: "Allianz Travel", coverage: "global", verified: true },
  ],
  accessibility: { mobility: "wheelchair", communication: "preferred-text" },
  languages: ["en", "ja"],
  payment: { primary: "Mobility Wallet **** 4242" },
  aiPersona: { tone: "concise" },
  trustedNetworks: ["Waymo", "BART Bay Area", "ANA Airlines", "Tokyo Smart City", "Lime", "TSA PreCheck"],
  trustScore: 982,
};

export function DDIProvider({ children }: { children: ReactNode }) {
  const [ddi, setDDI] = useState<DDI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) setDDI(JSON.parse(stored));
    } catch {
      // ignore corrupt storage
    }
    setLoading(false);
  }, []);

  const create = useCallback((input: CreateDDIInput) => {
    const next = buildDDI(input);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    setDDI(next);
    return next;
  }, []);

  const revoke = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("futuristic_passport_v1");
    }
    setDDI(null);
  }, []);

  return (
    <DDIContext.Provider value={{ ddi, loading, create, revoke }}>{children}</DDIContext.Provider>
  );
}

export function useDDI() {
  const ctx = useContext(DDIContext);
  if (!ctx) throw new Error("useDDI must be used within DDIProvider");
  return ctx;
}
