import fs from "fs";
import path from "path";
import { AvailabilityBlock, AvailabilityBlockReason } from "./types";
import { addDaysIso, datesOverlap, isValidIsoDate } from "./dateUtils";

export { addDaysIso, datesOverlap, isValidIsoDate };

function getDataDirectory(): string {
  const possiblePaths = [
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "apps", "web", "data"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const defaultPath = fs.existsSync(path.join(process.cwd(), "package.json"))
    ? path.join(process.cwd(), "data")
    : path.join(process.cwd(), "apps", "web", "data");
  if (!fs.existsSync(defaultPath)) {
    try {
      fs.mkdirSync(defaultPath, { recursive: true });
    } catch {
      // ignore
    }
  }
  return defaultPath;
}

function getAvailabilityFilePath(): string {
  return path.join(getDataDirectory(), "availability.json");
}

export function normalizeDateRange(
  startDate: string,
  endDate: string,
  allowSingleDay = false
): { start: string; end: string } | null {
  const s = (startDate || "").trim();
  const e = (endDate || "").trim();
  if (!isValidIsoDate(s)) return null;

  if (allowSingleDay && (!e || e === s)) {
    return { start: s, end: addDaysIso(s, 1) };
  }

  if (!isValidIsoDate(e) || s >= e) return null;
  return { start: s, end: e };
}

function readBlocksRaw(): AvailabilityBlock[] {
  const filePath = getAvailabilityFilePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read availability.json:", err);
    return [];
  }
}

function writeBlocksRaw(blocks: AvailabilityBlock[]): void {
  try {
    const filePath = getAvailabilityFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(blocks, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write availability.json:", err);
  }
}

export interface SeedBookingInput {
  id: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  bookingReference: string;
  status: string;
}

export function ensureAvailabilityInitialized(seedBookings: SeedBookingInput[]): void {
  const filePath = getAvailabilityFilePath();
  if (fs.existsSync(filePath)) return;

  const initialBlocks: AvailabilityBlock[] = [];
  for (const b of seedBookings) {
    if (b.status !== "confirmed") continue;
    const range = normalizeDateRange(b.checkInDate, b.checkOutDate, false);
    if (!range) continue;
    initialBlocks.push({
      id: `blk-seed-${b.id}`,
      propertyId: b.propertyId,
      startDate: range.start,
      endDate: range.end,
      reason: "accepted_booking",
      source: "zirigo_booking",
      bookingId: b.id,
      note: `${b.guestName} (${b.bookingReference})`,
      createdAt: new Date().toISOString(),
    });
  }
  writeBlocksRaw(initialBlocks);
}

export function getAllAvailabilityBlocks(): AvailabilityBlock[] {
  return readBlocksRaw().sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getBlocksForProperty(propertyId: string): AvailabilityBlock[] {
  return getAllAvailabilityBlocks().filter((b) => b.propertyId === propertyId);
}

export function findConflictingBlock(
  propertyId: string,
  startDate: string,
  endDate: string,
  ignoreBookingId?: string
): AvailabilityBlock | null {
  const blocks = getBlocksForProperty(propertyId);
  return (
    blocks.find(
      (b) =>
        (!ignoreBookingId || b.bookingId !== ignoreBookingId) &&
        datesOverlap(startDate, endDate, b.startDate, b.endDate)
    ) || null
  );
}

export function createAvailabilityBlock(input: {
  propertyId: string;
  startDate: string;
  endDate: string;
  reason: AvailabilityBlockReason;
  source: "zirigo_booking" | "manual_owner" | "manual_admin";
  bookingId?: string;
  note?: string;
  createdBy?: string;
  allowSingleDay?: boolean;
}): { block?: AvailabilityBlock; conflict?: AvailabilityBlock; error?: string } {
  const range = normalizeDateRange(
    input.startDate,
    input.endDate,
    Boolean(input.allowSingleDay)
  );
  if (!range) {
    return { error: "Plage de dates invalide (la date de fin doit suivre la date de début)." };
  }

  const conflict = findConflictingBlock(
    input.propertyId,
    range.start,
    range.end,
    input.bookingId
  );
  if (conflict) {
    return {
      conflict,
      error: `Ces dates chevauchent une période déjà bloquée (${conflict.startDate} → ${conflict.endDate}).`,
    };
  }

  const blocks = readBlocksRaw();
  const block: AvailabilityBlock = {
    id: `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    propertyId: input.propertyId,
    startDate: range.start,
    endDate: range.end,
    reason: input.reason,
    source: input.source,
    bookingId: input.bookingId,
    note: input.note?.trim() || undefined,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
  };

  blocks.push(block);
  writeBlocksRaw(blocks);
  return { block };
}

export function syncBookingAvailabilityBlock(
  booking: SeedBookingInput,
  autoBlockOnAccept: boolean
): {
  ok: boolean;
  action: "blocked" | "released" | "skipped" | "conflict";
  block?: AvailabilityBlock;
  conflict?: AvailabilityBlock;
} {
  const blocks = readBlocksRaw();

  if (booking.status !== "confirmed") {
    const filtered = blocks.filter((b) => b.bookingId !== booking.id);
    if (filtered.length !== blocks.length) {
      writeBlocksRaw(filtered);
    }
    return { ok: true, action: "released" };
  }

  if (!autoBlockOnAccept) {
    const filtered = blocks.filter((b) => b.bookingId !== booking.id);
    if (filtered.length !== blocks.length) {
      writeBlocksRaw(filtered);
    }
    return { ok: true, action: "skipped" };
  }

  const range = normalizeDateRange(booking.checkInDate, booking.checkOutDate, false);
  if (!range) {
    return { ok: true, action: "skipped" };
  }

  const existing = blocks.find((b) => b.bookingId === booking.id);
  if (existing && existing.startDate === range.start && existing.endDate === range.end) {
    return { ok: true, action: "blocked", block: existing };
  }

  const conflict = findConflictingBlock(
    booking.propertyId,
    range.start,
    range.end,
    booking.id
  );
  if (conflict) {
    return { ok: false, action: "conflict", conflict };
  }

  const cleaned = blocks.filter((b) => b.bookingId !== booking.id);
  const newBlock: AvailabilityBlock = {
    id: `blk-${booking.id}-${Date.now()}`,
    propertyId: booking.propertyId,
    startDate: range.start,
    endDate: range.end,
    reason: "accepted_booking",
    source: "zirigo_booking",
    bookingId: booking.id,
    note: `${booking.guestName} (${booking.bookingReference})`,
    createdAt: new Date().toISOString(),
  };

  cleaned.push(newBlock);
  writeBlocksRaw(cleaned);
  return { ok: true, action: "blocked", block: newBlock };
}

export function deleteAvailabilityBlock(id: string): AvailabilityBlock | null {
  const blocks = readBlocksRaw();
  const target = blocks.find((b) => b.id === id) || null;
  if (!target) return null;
  writeBlocksRaw(blocks.filter((b) => b.id !== id));
  return target;
}

