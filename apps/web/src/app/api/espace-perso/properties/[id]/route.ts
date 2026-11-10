import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { deleteProperty, getPropertyById, updateProperty } from "@/lib/serverStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  if (property.ownerId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé à cette annonce." }, { status: 403 });
  }

  return NextResponse.json(property);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  if (property.ownerId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Vous ne pouvez modifier que vos propres annonces." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = updateProperty(id, {
      ...body,
      ownerId: property.ownerId,
      ownerName: property.ownerName,
      ownerEmail: property.ownerEmail,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API PUT /api/espace-perso/properties/[id] error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  if (property.ownerId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Vous ne pouvez supprimer que vos propres annonces." }, { status: 403 });
  }

  deleteProperty(id);
  return NextResponse.json({ success: true });
}

