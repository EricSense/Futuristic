"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface PassportCredential {
  type: string;
  issuer: string;
  verified: boolean;
}

export interface MobilityPassport {
  id: string;
  holderName: string;
  homeCity: string;
  issuedAt: string;
  identity: {
    verified: boolean;
    biometric: boolean;
  };
  licenses: PassportCredential[];
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

interface PassportContextValue {
  passport: MobilityPassport | null;
  loading: boolean;
  claim: (input: ClaimInput) => MobilityPassport;
  revoke: () => void;
}

export interface ClaimInput {
  holderName: string;
  homeCity: string;
  accessibility?: MobilityPassport["accessibility"];
  languages?: string[];
  aiPersona?: MobilityPassport["aiPersona"]["tone"];
}

const STORAGE_KEY = "futuristic_passport_v1";

const PassportContext = createContext<PassportContextValue | null>(null);

function generateDDIId(): string {
  const segments = 4;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const out: string[] = ["DDI"];
  for (let s = 0; s < segments; s++) {
    let g = "";
    for (let i = 0; i < 4; i++) g += chars[Math.floor(Math.random() * chars.length)];
    out.push(g);
  }
  return out.join("-");
}

export function buildPassport(input: ClaimInput): MobilityPassport {
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

export const SAMPLE_PASSPORT: MobilityPassport = {
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

export function PassportProvider({ children }: { children: ReactNode }) {
  const [passport, setPassport] = useState<MobilityPassport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) setPassport(JSON.parse(stored));
    } catch {
      // ignore corrupt storage
    }
    setLoading(false);
  }, []);

  const claim = useCallback((input: ClaimInput) => {
    const p = buildPassport(input);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    }
    setPassport(p);
    return p;
  }, []);

  const revoke = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    setPassport(null);
  }, []);

  return (
    <PassportContext.Provider value={{ passport, loading, claim, revoke }}>
      {children}
    </PassportContext.Provider>
  );
}

export function usePassport() {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error("usePassport must be used within PassportProvider");
  return ctx;
}
