import { prisma, PresentationStatus, DDIStatus } from "@futuristic/db";
import type {
  FederationChallenge,
  VerifiablePresentation,
  RecognitionResult,
  DigitalDrivingIdentity,
} from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";
import { generateChallenge } from "../lib/ddi-code.js";
import * as ddiService from "./ddi.service.js";
import * as syncService from "./sync.service.js";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

const DISCLOSED_FIELDS = [
  "identity",
  "holderName",
  "homeCity",
  "licenses",
  "insurance",
  "mobilityNeeds",
  "languages",
  "aiPersona",
  "preferences",
];

export async function createChallenge(vehicleId: string): Promise<FederationChallenge> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.status !== "ACTIVE") throw new AppError(400, "Vehicle is not active");

  const challenge = generateChallenge();
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);

  const session = await prisma.presentationSession.create({
    data: {
      challenge,
      vehicleId,
      expiresAt,
      disclosedFields: DISCLOSED_FIELDS,
    },
  });

  return {
    sessionId: session.id,
    challenge: session.challenge,
    vehicleId: vehicle.id,
    vehicleLabel: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    expiresAt: session.expiresAt.toISOString(),
    status: session.status as FederationChallenge["status"],
  };
}

export async function presentDDI(
  userId: string,
  challengeToken: string,
): Promise<VerifiablePresentation> {
  const session = await prisma.presentationSession.findUnique({
    where: { challenge: challengeToken },
    include: { vehicle: true },
  });

  if (!session) throw new AppError(404, "Challenge not found");
  if (session.status !== PresentationStatus.PENDING) {
    throw new AppError(400, `Challenge already ${session.status.toLowerCase()}`);
  }
  if (session.expiresAt < new Date()) {
    await prisma.presentationSession.update({
      where: { id: session.id },
      data: { status: PresentationStatus.EXPIRED },
    });
    throw new AppError(410, "Challenge expired");
  }

  const ddi = await ddiService.getDDIByUserId(userId);
  if (!ddi) throw new AppError(404, "Issue a DDI before presenting to a vehicle");

  const verifiedAt = new Date();

  await prisma.presentationSession.update({
    where: { id: session.id },
    data: {
      ddiId: ddi.id,
      status: PresentationStatus.PRESENTED,
      presentedAt: verifiedAt,
    },
  });

  return {
    sessionId: session.id,
    challenge: session.challenge,
    ddi,
    disclosedFields: DISCLOSED_FIELDS,
    verifiedAt: verifiedAt.toISOString(),
    trustScore: ddi.trustScore,
  };
}

export async function verifyAndRecognize(challengeToken: string): Promise<RecognitionResult> {
  const session = await prisma.presentationSession.findUnique({
    where: { challenge: challengeToken },
    include: { vehicle: true, ddi: true },
  });

  if (!session) throw new AppError(404, "Challenge not found");

  if (session.expiresAt < new Date() && session.status === PresentationStatus.PENDING) {
    await prisma.presentationSession.update({
      where: { id: session.id },
      data: { status: PresentationStatus.EXPIRED },
    });
    return { sessionId: session.id, status: "EXPIRED" };
  }

  if (session.status === PresentationStatus.VERIFIED && session.ddi) {
    const ddi = await ddiService.getDDIByUserId(session.ddi.userId);
    if (!ddi) return { sessionId: session.id, status: "REJECTED" };
    const syncSession = session.syncSessionId
      ? await prisma.syncSession.findUnique({ where: { id: session.syncSessionId } })
      : null;
    return {
      sessionId: session.id,
      status: "VERIFIED",
      presentation: {
        sessionId: session.id,
        challenge: session.challenge,
        ddi,
        disclosedFields: DISCLOSED_FIELDS,
        verifiedAt: session.verifiedAt!.toISOString(),
        trustScore: ddi.trustScore,
      },
      syncPlan: syncSession?.syncPlan as RecognitionResult["syncPlan"],
      syncSessionId: session.syncSessionId ?? undefined,
      greeting: ddiService.greetingFor(ddi),
    };
  }

  if (session.status !== PresentationStatus.PRESENTED || !session.ddiId) {
    return {
      sessionId: session.id,
      status: session.status as RecognitionResult["status"],
    };
  }

  const ddiRecord = session.ddi;
  if (!ddiRecord || ddiRecord.status !== DDIStatus.ACTIVE) {
    await prisma.presentationSession.update({
      where: { id: session.id },
      data: { status: PresentationStatus.REJECTED },
    });
    return { sessionId: session.id, status: "REJECTED" };
  }

  const ddi = await ddiService.getDDIByUserId(ddiRecord.userId);
  if (!ddi) {
    return { sessionId: session.id, status: "REJECTED" };
  }

  const { session: syncSession, syncPlan } = await syncService.startSync(
    ddiRecord.userId,
    session.vehicleId,
  );

  const verifiedAt = new Date();
  await prisma.presentationSession.update({
    where: { id: session.id },
    data: {
      status: PresentationStatus.VERIFIED,
      verifiedAt,
      syncSessionId: syncSession.id,
    },
  });

  const presentation: VerifiablePresentation = {
    sessionId: session.id,
    challenge: session.challenge,
    ddi,
    disclosedFields: DISCLOSED_FIELDS,
    verifiedAt: verifiedAt.toISOString(),
    trustScore: ddi.trustScore,
  };

  return {
    sessionId: session.id,
    status: "VERIFIED",
    presentation,
    syncPlan,
    syncSessionId: syncSession.id,
    greeting: ddiService.greetingFor(ddi),
  };
}

export async function getSessionStatus(challengeToken: string): Promise<RecognitionResult> {
  return verifyAndRecognize(challengeToken);
}
