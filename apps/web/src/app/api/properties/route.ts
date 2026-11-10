import { NextRequest, NextResponse } from "next/server";
import { getAllProperties, getAllBookings, createProperty } from "@/lib/serverStore";
import { findConflictingBlock, isValidIsoDate } from "@/lib/availabilityStore";
import { matchesPropertyQuery, matchesPropertyCategory } from "@/lib/searchUtils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const city = searchParams.get("city")?.toLowerCase();
    const dateMode = searchParams.get("dateMode");
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const sortBy = searchParams.get("sortBy");

    let list = getAllProperties();

    if (
      dateMode === "fixed" &&
      isValidIsoDate(checkIn) &&
      isValidIsoDate(checkOut) &&
      checkIn < checkOut
    ) {
      getAllBookings();
      list = list.filter((p) => !findConflictingBlock(p.id, checkIn, checkOut));
    }

    if (search) {
      list = list.filter((p) => matchesPropertyQuery(p, search));
    }

    if (type && type !== "all") {
      const typesList = type
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      list = list.filter((p) => matchesPropertyCategory(p, typesList));
    }

    if (city) {
      list = list.filter((p) => p.city.toLowerCase().includes(city));
    }

    if (featured === "true") {
      list = list.filter((p) => p.isFeatured);
    }

    if (sortBy) {
      switch (sortBy) {
        case "price_asc":
          list.sort((a, b) => {
            const pA = a.rates?.[0]?.pricePerNight || 0;
            const pB = b.rates?.[0]?.pricePerNight || 0;
            return pA - pB;
          });
          break;
        case "price_desc":
          list.sort((a, b) => {
            const pA = a.rates?.[0]?.pricePerNight || 0;
            const pB = b.rates?.[0]?.pricePerNight || 0;
            return pB - pA;
          });
          break;
        case "rating":
          list.sort((a, b) => b.rating - a.rating);
          break;
        case "popular":
        default:
          list.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("API GET /api/properties error:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const created = createProperty(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("API POST /api/properties error:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}

