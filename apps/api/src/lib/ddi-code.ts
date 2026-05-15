/** Human-readable DDI code: DDI-XXXX-XXXX-XXXX-XXXX */
import { randomBytes } from "node:crypto";

export function generateDDICode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () => {
    let g = "";
    for (let i = 0; i < 4; i++) g += chars[Math.floor(Math.random() * chars.length)];
    return g;
  };
  return ["DDI", segment(), segment(), segment(), segment()].join("-");
}

export function generateChallenge(): string {
  // Node-safe, URL-friendly challenge token
  // (base64url avoids + / = so it is path-safe without extra encoding)
  return randomBytes(24).toString("base64url");
}
