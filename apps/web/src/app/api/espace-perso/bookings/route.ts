import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { getAllBookings, getAllProperties } from "@/lib/serverStore";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const ownedPropertyIds = new Set(
      getAllProperties()
        .filter((p) => p.ownerId === user.id)
        .map((p) => p.id)
    );

    const ownerBookings = getAllBookings().filter((b) =>
      ownedPropertyIds.has(b.propertyId)
    );

    return NextResponse.json(ownerBookings);
  } catch (error) {
    console.error("API GET /api/espace-perso/bookings error:", error);
    return NextResponse.json(
      { error: "Impossible de charger vos réservations." },
      { status: 500 }
    );
  }
}

