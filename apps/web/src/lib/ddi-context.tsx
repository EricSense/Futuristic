"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  DigitalDrivingIdentity,
  IssueDDIInput,
  DDIMobilityNeeds,
  AIPersonaTone,
} from "@futuristic/shared";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

/** Client-facing DDI shape (matches API + legacy demos) */
export type DDI = DigitalDrivingIdentity & {
  /** @deprecated use mobilityNeeds */
  accessibility?: DDIMobilityNeeds;
};

export type CreateDDIInput = IssueDDIInput;

export interface DDIContextValue {
  ddi: DDI | null;
  loading: boolean;
  apiConnected: boolean;
  create: (input: CreateDDIInput) => Promise<DDI>;
  revoke: () => Promise<void>;
  refresh: () => Promise<void>;
}

const STORAGE_KEY = "futuristic_ddi_v2";

const DDIContext = createContext<DDIContextValue | null>(null);

function toClientDDI(record: DigitalDrivingIdentity): DDI {
  return {
    ...record,
    accessibility: record.mobilityNeeds,
  };
}

function fromLegacyStored(raw: Record<string, unknown>): DDI | null {
  if (!raw?.holderName) return null;
  const id = String(raw.id ?? raw.ddiCode ?? "DDI-LOCAL");
  return {
    id: String(raw.id ?? id),
    ddiCode: String(raw.ddiCode ?? id),
    userId: String(raw.userId ?? "local"),
    holderName: String(raw.holderName),
    homeCity: String(raw.homeCity ?? ""),
    status: "ACTIVE",
    issuedAt: String(raw.issuedAt ?? new Date().toISOString()),
    identity: (raw.identity as DDI["identity"]) ?? { verified: true, biometric: true },
    licenses: (raw.licenses as DDI["licenses"]) ?? [],
    insurance: (raw.insurance as DDI["insurance"]) ?? [],
    mobilityNeeds: (raw.mobilityNeeds ?? raw.accessibility ?? {}) as DDIMobilityNeeds,
    accessibility: (raw.accessibility ?? raw.mobilityNeeds ?? {}) as DDIMobilityNeeds,
    languages: (raw.languages as string[]) ?? ["en"],
    payment: (raw.payment as DDI["payment"]) ?? { primary: "Mobility Wallet" },
    aiPersona: (raw.aiPersona as DDI["aiPersona"]) ?? { tone: "concise" },
    trustedNetworks: (raw.trustedNetworks as string[]) ?? [],
    trustScore: Number(raw.trustScore ?? 900),
  };
}

export const SAMPLE_DDI: DDI = {
  id: "sample",
  ddiCode: "DDI-7K9F-4M2X-LP3R-WQ8N",
  userId: "sample",
  holderName: "Maya Chen",
  homeCity: "San Francisco, USA",
  status: "ACTIVE",
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
  mobilityNeeds: { mobility: "wheelchair", communication: "preferred-text" },
  accessibility: { mobility: "wheelchair", communication: "preferred-text" },
  languages: ["en", "ja"],
  payment: { primary: "Mobility Wallet **** 4242" },
  aiPersona: { tone: "concise" },
  trustedNetworks: ["Waymo", "BART Bay Area", "ANA Airlines", "Tokyo Smart City", "Lime", "TSA PreCheck"],
  trustScore: 982,
};

export function DDIProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [ddi, setDDI] = useState<DDI | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const loadLocal = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return fromLegacyStored(JSON.parse(stored));
    } catch {
      // ignore
    }
    return null;
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setDDI(loadLocal());
      setApiConnected(false);
      return;
    }
    try {
      const remote = await api.getDDI();
      setApiConnected(true);
      if (remote) {
        const client = toClientDDI(remote);
        setDDI(client);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
      } else {
        setDDI(null);
      }
    } catch {
      setApiConnected(false);
      setDDI(loadLocal());
    }
  }, [isAuthenticated, loadLocal]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh, isAuthenticated]);

  const create = useCallback(
    async (input: CreateDDIInput) => {
      if (isAuthenticated) {
        try {
          const remote = await api.issueDDI(input);
          const client = toClientDDI(remote);
          setDDI(client);
          setApiConnected(true);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
          return client;
        } catch {
          // fall through to local
        }
      }
      const local: DDI = {
        ...SAMPLE_DDI,
        id: crypto.randomUUID(),
        ddiCode: `DDI-${Date.now().toString(36).toUpperCase()}`,
        userId: "local",
        holderName: input.holderName.trim(),
        homeCity: input.homeCity.trim(),
        mobilityNeeds: input.mobilityNeeds ?? {},
        accessibility: input.mobilityNeeds ?? {},
        languages: input.languages ?? ["en"],
        aiPersona: { tone: (input.aiPersona ?? "concise") as AIPersonaTone },
        issuedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
      setDDI(local);
      return local;
    },
    [isAuthenticated],
  );

  const revoke = useCallback(async () => {
    if (isAuthenticated && apiConnected) {
      try {
        await api.revokeDDI();
      } catch {
        // still clear local
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setDDI(null);
  }, [isAuthenticated, apiConnected]);

  return (
    <DDIContext.Provider value={{ ddi, loading, apiConnected, create, revoke, refresh }}>
      {children}
    </DDIContext.Provider>
  );
}

export function useDDI() {
  const ctx = useContext(DDIContext);
  if (!ctx) throw new Error("useDDI must be used within DDIProvider");
  return ctx;
}

/** @deprecated use buildDDI via API issue */
export function buildDDI(input: CreateDDIInput): DDI {
  return {
    ...SAMPLE_DDI,
    id: "local",
    ddiCode: "DDI-LOCAL",
    userId: "local",
    holderName: input.holderName.trim(),
    homeCity: input.homeCity.trim(),
    mobilityNeeds: input.mobilityNeeds ?? {},
    accessibility: input.mobilityNeeds ?? {},
    languages: input.languages ?? ["en"],
    aiPersona: { tone: (input.aiPersona ?? "concise") as AIPersonaTone },
    issuedAt: new Date().toISOString(),
  };
}
