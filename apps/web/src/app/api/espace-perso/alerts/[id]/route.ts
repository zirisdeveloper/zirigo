import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { deleteSearchAlert, updateSearchAlert } from "@/lib/userStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = updateSearchAlert(id, user.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Alerte introuvable." }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API PATCH /api/espace-perso/alerts/[id] error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteSearchAlert(id, user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Alerte introuvable." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

