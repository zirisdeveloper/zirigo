import fs from "fs";
import path from "path";
import { ContactMapProvider, ContactPageSettings, LocalizedText } from "./types";
import { DEFAULT_CONTACT_SETTINGS } from "./contactSettingsDefaults";

type LocalizedFieldKey = {
  [K in keyof ContactPageSettings]: ContactPageSettings[K] extends LocalizedText ? K : never;
}[keyof ContactPageSettings];

const LOCALIZED_FIELDS: LocalizedFieldKey[] = [
  "badgeText",
  "pageTitle",
  "pageSubtitle",
  "directTitle",
  "phoneLabel",
  "emailLabel",
  "addressLabel",
  "addressValue",
  "hoursLabel",
  "hoursValue",
  "mapTitle",
  "openInMapsLabel",
  "formTitle",
  "nameLabel",
  "namePlaceholder",
  "emailFieldLabel",
  "emailPlaceholder",
  "subjectLabel",
  "subjectPlaceholder",
  "messageLabel",
  "messagePlaceholder",
  "sendBtnText",
  "sendingBtnText",
  "successTitle",
  "successDesc",
  "sendAnotherBtnText",
];

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

function getContactSettingsFilePath(): string {
  return path.join(getDataDirectory(), "contact-settings.json");
}

function mergeLocalized(
  incoming: Partial<LocalizedText> | undefined,
  fallback: LocalizedText
): LocalizedText {
  if (!incoming) return fallback;
  return {
    fr: typeof incoming.fr === "string" ? incoming.fr : fallback.fr,
    en: typeof incoming.en === "string" ? incoming.en : fallback.en,
    ar: typeof incoming.ar === "string" ? incoming.ar : fallback.ar,
  };
}

function clampFinite(value: unknown, min: number, max: number, fallback: number): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function sanitizeProvider(value: unknown, fallback: ContactMapProvider): ContactMapProvider {
  return value === "google" || value === "openstreetmap" ? value : fallback;
}

function mergeContactSettings(
  base: ContactPageSettings,
  updates: Partial<ContactPageSettings>
): ContactPageSettings {
  const merged: ContactPageSettings = {
    ...base,
    phoneValue: typeof updates.phoneValue === "string" ? updates.phoneValue : base.phoneValue,
    emailValue: typeof updates.emailValue === "string" ? updates.emailValue : base.emailValue,
    showMap: typeof updates.showMap === "boolean" ? updates.showMap : base.showMap,
    mapProvider: sanitizeProvider(updates.mapProvider, base.mapProvider),
    mapAddressQuery:
      typeof updates.mapAddressQuery === "string" ? updates.mapAddressQuery : base.mapAddressQuery,
    mapLat: clampFinite(updates.mapLat, -85, 85, base.mapLat),
    mapLng: clampFinite(updates.mapLng, -180, 180, base.mapLng),
    mapZoom: Math.round(clampFinite(updates.mapZoom, 2, 19, base.mapZoom)),
    mapExternalUrl:
      typeof updates.mapExternalUrl === "string" ? updates.mapExternalUrl : base.mapExternalUrl,
    updatedAt: typeof updates.updatedAt === "string" ? updates.updatedAt : base.updatedAt,
  };

  for (const field of LOCALIZED_FIELDS) {
    merged[field] = mergeLocalized(updates[field], base[field]);
  }

  return merged;
}

function writeContactSettings(settings: ContactPageSettings): void {
  try {
    const filePath = getContactSettingsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write contact-settings.json:", err);
  }
}

export function getContactSettings(): ContactPageSettings {
  const filePath = getContactSettingsFilePath();
  if (!fs.existsSync(filePath)) {
    writeContactSettings(DEFAULT_CONTACT_SETTINGS);
    return DEFAULT_CONTACT_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ContactPageSettings>;
    return mergeContactSettings(DEFAULT_CONTACT_SETTINGS, parsed);
  } catch (err) {
    console.error("Failed to read contact-settings.json:", err);
    return DEFAULT_CONTACT_SETTINGS;
  }
}

export function updateContactSettings(
  updates: Partial<ContactPageSettings>
): ContactPageSettings {
  const current = getContactSettings();
  const next = mergeContactSettings(current, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  writeContactSettings(next);
  return next;
}

export function resetContactSettings(): ContactPageSettings {
  const fresh: ContactPageSettings = {
    ...DEFAULT_CONTACT_SETTINGS,
    updatedAt: new Date().toISOString(),
  };
  writeContactSettings(fresh);
  return fresh;
}

