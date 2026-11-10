import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  getUserById,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "./userStore";
import { UserAccount } from "./types";

export async function getSessionUser(): Promise<UserAccount | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const parsed = verifySessionToken(token);
    if (!parsed) return null;
    return getUserById(parsed.userId);
  } catch {
    return null;
  }
}

export function attachSessionCookie(response: NextResponse, userId: string): void {
  const token = createSessionToken(userId);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

