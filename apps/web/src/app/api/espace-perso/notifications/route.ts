import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authServer";
import {
  deleteNotification,
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/userStore";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const notifications = getUserNotifications(user.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.markAll) {
      markAllNotificationsRead(user.id);
      return NextResponse.json({ success: true });
    }
    if (body.id) {
      markNotificationRead(body.id, user.id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requis." }, { status: 400 });
  }

  deleteNotification(id, user.id);
  return NextResponse.json({ success: true });
}

