import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma, UserRole } from "@futuristic/db";
import type { AuthTokens, AuthUser } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function generateTokens(user: AuthUser): AuthTokens {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions,
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
  );
  return { accessToken, refreshToken };
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: string,
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: role as UserRole,
      ...(role === "DRIVER" ? { driverProfile: { create: {} } } : {}),
      ...(role === "FLEET_OPERATOR" ? { fleetOperator: { create: {} } } : {}),
    },
  });

  const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  const tokens = generateTokens(authUser);
  return { user: authUser, tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  const tokens = generateTokens(authUser);
  return { user: authUser, tokens };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      throw new AppError(401, "User not found");
    }

    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    const tokens = generateTokens(authUser);
    return { user: authUser, tokens };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, "Invalid refresh token");
  }
}
