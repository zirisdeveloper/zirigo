import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { getPropertyById } from "@/lib/serverStore";
import { getAllAvailabilityBlocks, deleteAvailabilityBlock } from "@/lib/availabilityStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const block = getAllAvailabilityBlocks().find((b) => b.id === id);
    if (!block) {
      return NextResponse.json({ error: "Période bloquée introuvable." }, { status: 404 });
    }

    const property = getPropertyById(block.propertyId);
    if (user.role !== "admin" && property?.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à débloquer ces dates." },
        { status: 403 }
      );
    }

    const deleted = deleteAvailabilityBlock(id);
    if (!deleted) {
      return NextResponse.json({ error: "Période bloquée introuvable." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("API DELETE /api/availability/[id] error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du blocage." },
      { status: 500 }
    );
  }
}

