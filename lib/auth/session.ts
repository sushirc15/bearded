import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "bearded_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "bearded_gamer_secret_key_2026_super_secure";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bearded2026";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// In-memory rate limiting map: ip/key -> { attempts, lockedUntil }
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();

export function checkRateLimit(key: string): { allowed: boolean; remainingSec: number } {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (entry && entry.lockedUntil > now) {
    return { allowed: false, remainingSec: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  if (entry && entry.lockedUntil <= now) {
    loginAttempts.delete(key);
  }

  return { allowed: true, remainingSec: 0 };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(key) || { attempts: 0, lockedUntil: 0 };
  entry.attempts += 1;

  if (entry.attempts >= 5) {
    entry.lockedUntil = now + 60 * 1000; // 60s lock
  }
  loginAttempts.set(key, entry);
}

export function resetRateLimit(key: string): void {
  loginAttempts.delete(key);
}

export function verifyPassword(password: string): boolean {
  if (!password) return false;

  // If hash is set in env, compare sha256 or bcrypt
  if (ADMIN_PASSWORD_HASH) {
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    if (hash === ADMIN_PASSWORD_HASH) return true;
  }

  // Fallback to configured admin password
  return password === DEFAULT_ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const timestamp = Date.now();
  const payload = `bearded_admin:${timestamp}`;
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  const payload = Buffer.from(payloadB64, "base64").toString("utf-8");

  const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

// Server-side check for API routes
export function isAdminRequest(request?: Request): boolean {
  if (request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match && verifySessionToken(match[1])) {
      return true;
    }
  }

  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
