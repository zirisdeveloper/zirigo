import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { updateAd, deleteAd } from "@/lib/adStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateAd(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Publicité introuvable." }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API PATCH /api/ads/[id] error:", error);
    return NextResponse.json({ error: "Impossible de modifier la publicité." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const removed = deleteAd(id);
    if (!removed) {
      return NextResponse.json({ error: "Publicité introuvable." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API DELETE /api/ads/[id] error:", error);
    return NextResponse.json({ error: "Impossible de supprimer la publicité." }, { status: 500 });
  }
}

