import { NextRequest, NextResponse } from "next/server";
import { registerWithEmail } from "@/lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, preferredCurrency, preferredLanguage, preferredTheme } = body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return NextResponse.json(
        { error: "Nom, adresse e-mail et mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    const result = registerWithEmail({
      name,
      email,
      password,
      phone,
      preferredCurrency,
      preferredLanguage,
      preferredTheme,
    });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json(
      {
        message: "Compte créé. Veuillez saisir le code d'activation envoyé par e-mail.",
        email: result.user.email,
        requiresVerification: true,
        devSimulatedEmail: result.simulatedEmail,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API POST /api/auth/register error:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }
}

