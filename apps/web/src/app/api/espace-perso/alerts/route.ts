import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { getAllProperties } from "@/lib/serverStore";
import {
  createSearchAlert,
  doesPropertyMatchAlert,
  getPropertyLowestPrice,
  getUserAlerts,
} from "@/lib/userStore";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const alerts = getUserAlerts(user.id);
  const allProperties = getAllProperties();

  const enriched = alerts.map((alert) => {
    const matches = allProperties.filter((p) => doesPropertyMatchAlert(p, alert));
    return {
      ...alert,
      matchesCount: matches.length,
      matchingProperties: matches.slice(0, 6).map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        city: m.city,
        country: m.country,
        type: m.type,
        rating: m.rating,
        featuredImage: m.featuredImage,
        pricePerNight: getPropertyLowestPrice(m),
      })),
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Connectez-vous pour créer une demande de notification." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const allProperties = getAllProperties();

    const { alert, initialMatches } = createSearchAlert(
      user.id,
      {
        name: body.name || "Ma recherche personnalisée",
        query: body.query || "",
        propertyType: body.propertyType || "all",
        maxPricePerNight: body.maxPricePerNight ? Number(body.maxPricePerNight) : undefined,
        minRating: body.minRating ? Number(body.minRating) : undefined,
        minGuests: body.minGuests ? Number(body.minGuests) : undefined,
        amenities: Array.isArray(body.amenities) ? body.amenities : [],
        frequency: body.frequency || "instant",
        channel: body.channel || "both",
        isActive: body.isActive ?? true,
      },
      allProperties
    );

    return NextResponse.json(
      {
        alert,
        matchesCount: initialMatches.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API POST /api/espace-perso/alerts error:", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'alerte." }, { status: 500 });
  }
}

