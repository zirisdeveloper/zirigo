import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import { createProperty, getAllProperties } from "@/lib/serverStore";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const all = getAllProperties();
  const mine = all.filter((p) => p.ownerId === user.id);
  return NextResponse.json(mine);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour publier une annonce." },
      { status: 401 }
    );
  }

  if (!user.isVerified) {
    return NextResponse.json(
      { error: "Veuillez activer votre compte par e-mail avant de publier une annonce." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: "Le titre de l'annonce est obligatoire." }, { status: 400 });
    }

    const created = createProperty({
      ...body,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("API POST /api/espace-perso/properties error:", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'annonce." }, { status: 500 });
  }
}

