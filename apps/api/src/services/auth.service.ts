import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { prisma, UserRole } from "@futuristic/db";
import type { LoginInput, RegisterInput } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function signAccessToken(userId: string, role: UserRole) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "JWT secret not configured");
  return jwt.sign({ userId, role }, secret, { expiresIn: ACCESS_TTL });
}

async function createRefreshToken(userId: string) {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role as UserRole,
      ...(input.role === "DRIVER" ? { driverProfile: { create: {} } } : {}),
      ...(input.role === "FLEET_OPERATOR" ? { fleetOperator: { create: {} } } : {}),
    },
  });

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: stored.userId } });
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const accessToken = signAccessToken(user.id, user.role);
  const newRefreshToken = await createRefreshToken(user.id);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError(404, "User not found");
  return user;
}
