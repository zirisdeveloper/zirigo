import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { updateUserProfile } from "@/lib/userStore";

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updateUserProfile(user.id, {
      preferredCurrency: body.preferredCurrency,
      preferredLanguage: body.preferredLanguage,
      preferredTheme: body.preferredTheme,
    });

    if (!updated) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        preferredCurrency: updated.preferredCurrency,
        preferredLanguage: updated.preferredLanguage,
        preferredTheme: updated.preferredTheme,
      },
      user: updated,
    });
  } catch (error) {
    console.error("API PATCH /api/auth/preferences error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde des préférences." },
      { status: 500 }
    );
  }
}

