import { NextRequest, NextResponse } from "next/server";
import { loginWithEmail } from "@/lib/userStore";
import { attachSessionCookie } from "@/lib/authServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Adresse e-mail et mot de passe requis." },
        { status: 400 }
      );
    }

    const result = loginWithEmail(email, password);
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          requiresVerification: result.requiresVerification || false,
          email: result.email,
        },
        { status: result.requiresVerification ? 403 : 401 }
      );
    }

    const response = NextResponse.json({
      message: "Connexion réussie.",
      user: result.user,
    });
    attachSessionCookie(response, result.user.id);
    return response;
  } catch (error) {
    console.error("API POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Erreur lors de la connexion." }, { status: 500 });
  }
}

