import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { getPropertyById, getAllBookings, updateProperty } from "@/lib/serverStore";
import {
  getAllAvailabilityBlocks,
  getBlocksForProperty,
  createAvailabilityBlock,
  syncBookingAvailabilityBlock,
} from "@/lib/availabilityStore";
import { AvailabilityBlock, AvailabilityBlockReason } from "@/lib/types";

function toPublicBlock(b: AvailabilityBlock) {
  return {
    id: b.id,
    propertyId: b.propertyId,
    startDate: b.startDate,
    endDate: b.endDate,
    reason: b.reason,
    source: b.source,
    createdAt: b.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const allBookings = getAllBookings();

    // Global public calendar snapshot across all properties (used by homepage search filtering)
    if (!propertyId) {
      const publicBlocks = getAllAvailabilityBlocks().map(toPublicBlock);
      return NextResponse.json({ blocks: publicBlocks });
    }

    const property = getPropertyById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }

    const blocks = getBlocksForProperty(propertyId);
    const user = await getSessionUser();
    const isAuthorizedManager =
      Boolean(user) && (user?.role === "admin" || property.ownerId === user?.id);

    if (isAuthorizedManager) {
      const propertyBookings = allBookings.filter((b) => b.propertyId === propertyId);
      return NextResponse.json({
        propertyId,
        autoBlockOnAccept: property.autoBlockOnAccept !== false,
        blocks,
        bookings: propertyBookings,
      });
    }

    // Public view: omit guest notes / personal metadata
    return NextResponse.json({
      propertyId,
      autoBlockOnAccept: property.autoBlockOnAccept !== false,
      blocks: blocks.map(toPublicBlock),
    });
  } catch (error) {
    console.error("API GET /api/availability error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des disponibilités." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const propertyId = String(body.propertyId || "").trim();
    const property = getPropertyById(propertyId);

    if (!property) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }

    if (user.role !== "admin" && property.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier les disponibilités de ce bien." },
        { status: 403 }
      );
    }

    const allowedReasons: AvailabilityBlockReason[] = [
      "external_offer",
      "maintenance",
      "owner_block",
    ];
    const reason: AvailabilityBlockReason = allowedReasons.includes(body.reason)
      ? body.reason
      : "external_offer";

    // Ensure seeded blocks are loaded before checking overlaps
    getAllBookings();

    const result = createAvailabilityBlock({
      propertyId,
      startDate: String(body.startDate || ""),
      endDate: String(body.endDate || ""),
      reason,
      source: user.role === "admin" ? "manual_admin" : "manual_owner",
      note: typeof body.note === "string" ? body.note : undefined,
      createdBy: user.id,
      allowSingleDay: true,
    });

    if (result.conflict) {
      return NextResponse.json(
        { error: result.error, conflict: result.conflict },
        { status: 409 }
      );
    }

    if (result.error || !result.block) {
      return NextResponse.json(
        { error: result.error || "Dates invalides." },
        { status: 400 }
      );
    }

    return NextResponse.json(result.block, { status: 201 });
  } catch (error) {
    console.error("API POST /api/availability error:", error);
    return NextResponse.json(
      { error: "Impossible de bloquer ces dates." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const propertyId = String(body.propertyId || "").trim();
    const property = getPropertyById(propertyId);

    if (!property) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }

    if (user.role !== "admin" && property.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé pour ce bien." },
        { status: 403 }
      );
    }

    const autoBlockOnAccept = Boolean(body.autoBlockOnAccept);
    const updated = updateProperty(propertyId, { autoBlockOnAccept });

    if (autoBlockOnAccept) {
      const bookings = getAllBookings().filter(
        (b) => b.propertyId === propertyId && b.status === "confirmed"
      );
      for (const bk of bookings) {
        syncBookingAvailabilityBlock(bk, true);
      }
    }

    return NextResponse.json({
      success: true,
      autoBlockOnAccept: updated?.autoBlockOnAccept !== false,
      blocks: getBlocksForProperty(propertyId),
    });
  } catch (error) {
    console.error("API PATCH /api/availability error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du paramètre." },
      { status: 500 }
    );
  }
}

