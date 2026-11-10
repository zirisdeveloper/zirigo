import { NextRequest, NextResponse } from "next/server";
import { authenticateWithSocial, isOAuthSimulationEnabled } from "@/lib/userStore";
import { attachSessionCookie } from "@/lib/authServer";
import { AuthProviderType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    if (!isOAuthSimulationEnabled()) {
      return NextResponse.json(
        {
          error:
            "L'authentification sociale simulée n'est disponible qu'en environnement de développement.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { provider, email, name, avatarUrl, preferredCurrency, preferredLanguage, preferredTheme } = body;

    const validProviders: AuthProviderType[] = ["google", "facebook", "apple"];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: "Fournisseur OAuth non supporté." }, { status: 400 });
    }

    const result = authenticateWithSocial({
      provider,
      email: email || `utilisateur.${provider}@gmail.com`,
      name: name || `Utilisateur ${provider}`,
      avatarUrl,
      preferredCurrency,
      preferredLanguage,
      preferredTheme,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({
      message: `Connexion simulée via ${provider} réussie (Mode Développement).`,
      user: result.user,
      simulated: true,
    });
    attachSessionCookie(response, result.user.id);
    return response;
  } catch (error) {
    console.error("API POST /api/auth/social error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'authentification sociale simulée." },
      { status: 500 }
    );
  }
}

