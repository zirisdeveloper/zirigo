import { NextRequest, NextResponse } from "next/server";
import { toggleFeatured } from "@/lib/serverStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updated = toggleFeatured(id);

    if (!updated) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("API POST toggle-featured error:", error);
    return NextResponse.json({ error: "Failed to toggle featured" }, { status: 500 });
  }
}

