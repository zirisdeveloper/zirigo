import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/serverStore";

export async function GET() {
  try {
    const stats = getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("API GET admin stats error:", error);
    return NextResponse.json({ error: "Failed to get admin stats" }, { status: 500 });
  }
}
