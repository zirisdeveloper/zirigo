import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import {
  getBookingById,
  getPropertyById,
  updateBookingStatus,
} from "@/lib/serverStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status || !["pending", "confirmed", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const existingBooking = getBookingById(id);
    if (!existingBooking) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    const property = getPropertyById(existingBooking.propertyId);
    if (user.role !== "admin" && property?.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Seul l'administrateur ou le propriétaire du bien peut modifier cette réservation." },
        { status: 403 }
      );
    }

    const result = updateBookingStatus(id, body.status);
    if (result.notFound) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    if (result.conflict) {
      return NextResponse.json(
        {
          error: `Impossible d'accepter : dates déjà bloquées (${result.conflict.startDate} → ${result.conflict.endDate}).`,
          conflict: result.conflict,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ...result.booking,
      availabilityAction: result.availabilityAction,
    });
  } catch (error) {
    console.error("API PATCH booking error:", error);
    return NextResponse.json({ error: "Échec de la mise à jour de la réservation." }, { status: 500 });
  }
}
