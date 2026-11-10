import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { getAllAds, createAd, resetAds } from "@/lib/adStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";

    if (includeInactive) {
      const user = await getSessionUser();
      if (user?.role === "admin") {
        return NextResponse.json(getAllAds(false));
      }
    }

    return NextResponse.json(getAllAds(true));
  } catch (error) {
    console.error("API GET /api/ads error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des publicités." }, { status: 500 });
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
      const ads = resetAds();
      return NextResponse.json({ success: true, ads });
    }

    if (!body?.brandName && !body?.title?.fr) {
      return NextResponse.json(
        { error: "Le nom de marque ou titre de la publicité est requis." },
        { status: 400 }
      );
    }

    const created = createAd(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("API POST /api/ads error:", error);
    return NextResponse.json({ error: "Impossible de créer la publicité." }, { status: 500 });
  }
}

