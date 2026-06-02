import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@futuristic/db";
import { AppError } from "./error-handler.js";

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }
  try {
    const token = header.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, "JWT secret not configured");
    req.user = jwt.verify(token, secret) as AuthPayload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError(401, "Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "Insufficient permissions"));
      return;
    }
    next();
  };
}
