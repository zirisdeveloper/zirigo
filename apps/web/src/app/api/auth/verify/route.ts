import { NextRequest, NextResponse } from "next/server";
import { verifyActivationCode } from "@/lib/userStore";
import { attachSessionCookie } from "@/lib/authServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Adresse e-mail et code d'activation requis." },
        { status: 400 }
      );
    }

    const result = verifyActivationCode(email, code);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({
      message: "Compte activé avec succès !",
      user: result.user,
    });
    attachSessionCookie(response, result.user.id);
    return response;
  } catch (error) {
    console.error("API POST /api/auth/verify error:", error);
    return NextResponse.json({ error: "Erreur lors de l'activation." }, { status: 500 });
  }
}

