/** Digital Driving Identity — portable mobility identity for Futuristic federation */

export type DDIStatus = "ACTIVE" | "REVOKED" | "SUSPENDED";

export type AIPersonaTone = "concise" | "warm" | "playful";

export interface VerifiedCredential {
  type: string;
  issuer: string;
  verified: boolean;
}

export interface DDIInsurance {
  carrier: string;
  coverage: "domestic" | "global";
  verified: boolean;
}

export interface DDIIdentity {
  verified: boolean;
  biometric: boolean;
}

export interface DDIMobilityNeeds {
  mobility?: string;
  vision?: string;
  hearing?: string;
  communication?: string;
}

export interface DDIPayment {
  primary: string;
}

export interface DDIAIPersona {
  tone: AIPersonaTone;
}

/** Full DDI as returned by API and used in clients */
export interface DigitalDrivingIdentity {
  id: string;
  ddiCode: string;
  userId: string;
  holderName: string;
  homeCity: string;
  status: DDIStatus;
  issuedAt: string;
  identity: DDIIdentity;
  licenses: VerifiedCredential[];
  insurance: DDIInsurance[];
  mobilityNeeds: DDIMobilityNeeds;
  languages: string[];
  payment: DDIPayment;
  aiPersona: DDIAIPersona;
  trustedNetworks: string[];
  trustScore: number;
  /** Cabin preferences from linked driver profile */
  preferences?: DriverCabinPreferences;
}

export interface DriverCabinPreferences {
  seatConfig: Record<string, unknown>;
  mirrorConfig: Record<string, unknown>;
  climateConfig: Record<string, unknown>;
  infotainmentConfig: Record<string, unknown>;
  drivingMode: Record<string, unknown>;
  accessibility: Record<string, unknown>;
}

export interface IssueDDIInput {
  holderName: string;
  homeCity: string;
  mobilityNeeds?: DDIMobilityNeeds;
  languages?: string[];
  aiPersona?: AIPersonaTone;
}

export interface UpdateDDIInput {
  holderName?: string;
  homeCity?: string;
  mobilityNeeds?: DDIMobilityNeeds;
  languages?: string[];
  aiPersona?: AIPersonaTone;
}

export type PresentationStatus = "PENDING" | "PRESENTED" | "VERIFIED" | "EXPIRED" | "REJECTED";

export interface FederationChallenge {
  sessionId: string;
  challenge: string;
  vehicleId: string;
  vehicleLabel: string;
  expiresAt: string;
  status: PresentationStatus;
}

export interface VerifiablePresentation {
  sessionId: string;
  challenge: string;
  ddi: DigitalDrivingIdentity;
  disclosedFields: string[];
  verifiedAt: string;
  trustScore: number;
}

export interface RecognitionResult {
  sessionId: string;
  status: PresentationStatus;
  presentation?: VerifiablePresentation;
  syncPlan?: {
    items: Array<{
      category: string;
      setting: string;
      requestedValue: unknown;
      appliedValue: unknown;
      status: string;
      reason?: string;
    }>;
    summary: { applied: number; clamped: number; unsupported: number; total: number };
  };
  syncSessionId?: string;
  greeting?: string;
}
