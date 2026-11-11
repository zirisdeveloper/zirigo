import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import {
  getContactSettings,
  updateContactSettings,
  resetContactSettings,
} from "@/lib/contactSettingsStore";

export async function GET() {
  try {
    const settings = getContactSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API GET /api/contact-settings error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des paramètres de la page Contact." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = updateContactSettings(body || {});
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API PATCH /api/contact-settings error:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour les paramètres de la page Contact." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (body?.action === "reset") {
      const fresh = resetContactSettings();
      return NextResponse.json(fresh);
    }
    const updated = updateContactSettings(body || {});
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API POST /api/contact-settings error:", error);
    return NextResponse.json(
      { error: "Action impossible sur les paramètres de la page Contact." },
      { status: 500 }
    );
  }
}

