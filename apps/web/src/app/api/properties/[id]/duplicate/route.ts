import { NextRequest, NextResponse } from "next/server";
import { duplicateProperty } from "@/lib/serverStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const duplicated = duplicateProperty(id);

    if (!duplicated) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error("API POST duplicate error:", error);
    return NextResponse.json({ error: "Failed to duplicate property" }, { status: 500 });
  }
}
