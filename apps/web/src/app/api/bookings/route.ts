import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, createBooking } from "@/lib/serverStore";

export async function GET() {
  try {
    const bookings = getAllBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("API GET bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.propertyId || !body.guestName || !body.guestEmail || !body.checkInDate || !body.checkOutDate) {
      return NextResponse.json(
        { error: "Veuillez renseigner les dates et vos coordonnées complètes." },
        { status: 400 }
      );
    }

    const result = createBooking({
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle || "Propriété Zirigo",
      roomTitle: body.roomTitle,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone || "",
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      guestsCount: body.guestsCount || 1,
      totalAmount: body.totalAmount || 0,
      currency: body.currency || "DZD",
      status: "pending",
      specialRequests: body.specialRequests || "",
    });

    if (result.conflict) {
      return NextResponse.json(
        {
          error: result.error,
          conflict: result.conflict,
        },
        { status: 409 }
      );
    }

    if (result.error || !result.booking) {
      return NextResponse.json(
        { error: result.error || "Dates de réservation invalides." },
        { status: 400 }
      );
    }

    return NextResponse.json(result.booking, { status: 201 });
  } catch (error) {
    console.error("API POST booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
