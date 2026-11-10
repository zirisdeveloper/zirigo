import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/authServer";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Déconnexion réussie." });
  clearSessionCookie(response);
  return response;
}

