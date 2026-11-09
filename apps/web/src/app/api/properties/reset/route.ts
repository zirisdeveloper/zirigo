import { NextResponse } from "next/server";
import { resetPropertiesToDefault } from "@/lib/serverStore";

export async function POST() {
  try {
    const list = resetPropertiesToDefault();
    return NextResponse.json({ success: true, count: list.length, properties: list });
  } catch (error) {
    console.error("API POST reset error:", error);
    return NextResponse.json({ error: "Failed to reset properties" }, { status: 500 });
  }
}
