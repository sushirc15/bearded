import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/auth/session";

const LoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local_client";
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${rateLimit.remainingSec}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const isValid = verifyPassword(result.data.password);

    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: "Incorrect admin password" },
        { status: 401 }
      );
    }

    resetRateLimit(ip);
    const token = createSessionToken();

    const response = NextResponse.json({ success: true, isAdmin: true });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}
