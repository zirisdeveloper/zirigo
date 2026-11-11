import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

function getContactFilePath(): string {
  const dir = fs.existsSync(path.join(process.cwd(), "data"))
    ? path.join(process.cwd(), "data")
    : path.join(process.cwd(), "apps", "web", "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, "contact-messages.json");
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const filePath = getContactFilePath();
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return NextResponse.json(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    console.error("API GET /api/contact error:", error);
    return NextResponse.json(
      { error: "Impossible de charger les messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre nom, votre e-mail et votre message." },
        { status: 400 }
      );
    }

    const filePath = getContactFilePath();
    let existing: ContactSubmission[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
    }

    const entry: ContactSubmission = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || "Demande d'information",
      message,
      createdAt: new Date().toISOString(),
    };

    existing.unshift(entry);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre message pour le moment." },
      { status: 500 }
    );
  }
}

