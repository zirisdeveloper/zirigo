import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { isOAuthSimulationEnabled, updateUserProfile } from "@/lib/userStore";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    user,
    oauthSimulationEnabled: isOAuthSimulationEnabled(),
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updateUserProfile(user.id, {
      name: body.name,
      phone: body.phone,
      avatarUrl: body.avatarUrl,
      preferredCurrency: body.preferredCurrency,
      preferredLanguage: body.preferredLanguage,
      preferredTheme: body.preferredTheme,
    });

    if (!updated) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("API PATCH /api/auth/me error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du profil." }, { status: 500 });
  }
}

