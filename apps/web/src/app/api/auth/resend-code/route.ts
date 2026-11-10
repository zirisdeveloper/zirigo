import { NextRequest, NextResponse } from "next/server";
import { resendActivationCode } from "@/lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Adresse e-mail requise." }, { status: 400 });
    }

    const result = resendActivationCode(email);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Un nouveau code d'activation vient d'être envoyé.",
      devSimulatedEmail: result.simulatedEmail,
    });
  } catch (error) {
    console.error("API POST /api/auth/resend-code error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du code." }, { status: 500 });
  }
}

