import fs from "fs";
import path from "path";
import { DisplaySettings, LocalizedText } from "./types";
import { DEFAULT_DISPLAY_SETTINGS } from "./displaySettingsDefaults";

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

function getSettingsFilePath(): string {
  return path.join(getDataDirectory(), "display-settings.json");
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

function sanitizeSocialUrl(incoming: unknown, fallback: string): string {
  if (typeof incoming !== "string") return fallback;
  const trimmed = incoming.trim();
  if (!trimmed) return "";
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getDisplaySettings(): DisplaySettings {
  const filePath = getSettingsFilePath();
  if (!fs.existsSync(filePath)) {
    writeDisplaySettings(DEFAULT_DISPLAY_SETTINGS);
    return DEFAULT_DISPLAY_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DisplaySettings>;
    return {
      showHeaderMenuButton:
        parsed.showHeaderMenuButton ?? DEFAULT_DISPLAY_SETTINGS.showHeaderMenuButton,
      showAdsSection: parsed.showAdsSection ?? DEFAULT_DISPLAY_SETTINGS.showAdsSection,
      showCategoryIconsSection:
        parsed.showCategoryIconsSection ?? DEFAULT_DISPLAY_SETTINGS.showCategoryIconsSection,
      showHeroHeader: parsed.showHeroHeader ?? DEFAULT_DISPLAY_SETTINGS.showHeroHeader,
      showTypeTabs: parsed.showTypeTabs ?? DEFAULT_DISPLAY_SETTINGS.showTypeTabs,
      showTrustBanner: parsed.showTrustBanner ?? DEFAULT_DISPLAY_SETTINGS.showTrustBanner,
      heroPromoText: mergeLocalized(parsed.heroPromoText, DEFAULT_DISPLAY_SETTINGS.heroPromoText),
      heroTitleText: mergeLocalized(parsed.heroTitleText, DEFAULT_DISPLAY_SETTINGS.heroTitleText),
      heroSubtitleText: mergeLocalized(
        parsed.heroSubtitleText,
        DEFAULT_DISPLAY_SETTINGS.heroSubtitleText
      ),
      trustItem1Text: mergeLocalized(
        parsed.trustItem1Text,
        DEFAULT_DISPLAY_SETTINGS.trustItem1Text
      ),
      trustItem2Text: mergeLocalized(
        parsed.trustItem2Text,
        DEFAULT_DISPLAY_SETTINGS.trustItem2Text
      ),
      trustItem3Text: mergeLocalized(
        parsed.trustItem3Text,
        DEFAULT_DISPLAY_SETTINGS.trustItem3Text
      ),
      socialFacebookUrl: sanitizeSocialUrl(
        parsed.socialFacebookUrl,
        DEFAULT_DISPLAY_SETTINGS.socialFacebookUrl
      ),
      socialInstagramUrl: sanitizeSocialUrl(
        parsed.socialInstagramUrl,
        DEFAULT_DISPLAY_SETTINGS.socialInstagramUrl
      ),
      socialLinkedInUrl: sanitizeSocialUrl(
        parsed.socialLinkedInUrl,
        DEFAULT_DISPLAY_SETTINGS.socialLinkedInUrl
      ),
      updatedAt: parsed.updatedAt || DEFAULT_DISPLAY_SETTINGS.updatedAt,
    };
  } catch (err) {
    console.error("Failed to read display-settings.json:", err);
    return DEFAULT_DISPLAY_SETTINGS;
  }
}

function writeDisplaySettings(settings: DisplaySettings): void {
  try {
    const filePath = getSettingsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write display-settings.json:", err);
  }
}

export function updateDisplaySettings(
  updates: Partial<DisplaySettings>
): DisplaySettings {
  const current = getDisplaySettings();
  const next: DisplaySettings = {
    showHeaderMenuButton:
      typeof updates.showHeaderMenuButton === "boolean"
        ? updates.showHeaderMenuButton
        : current.showHeaderMenuButton,
    showAdsSection:
      typeof updates.showAdsSection === "boolean"
        ? updates.showAdsSection
        : current.showAdsSection,
    showCategoryIconsSection:
      typeof updates.showCategoryIconsSection === "boolean"
        ? updates.showCategoryIconsSection
        : current.showCategoryIconsSection,
    showHeroHeader:
      typeof updates.showHeroHeader === "boolean"
        ? updates.showHeroHeader
        : current.showHeroHeader,
    showTypeTabs:
      typeof updates.showTypeTabs === "boolean"
        ? updates.showTypeTabs
        : current.showTypeTabs,
    showTrustBanner:
      typeof updates.showTrustBanner === "boolean"
        ? updates.showTrustBanner
        : current.showTrustBanner,
    heroPromoText: mergeLocalized(updates.heroPromoText, current.heroPromoText),
    heroTitleText: mergeLocalized(updates.heroTitleText, current.heroTitleText),
    heroSubtitleText: mergeLocalized(updates.heroSubtitleText, current.heroSubtitleText),
    trustItem1Text: mergeLocalized(updates.trustItem1Text, current.trustItem1Text),
    trustItem2Text: mergeLocalized(updates.trustItem2Text, current.trustItem2Text),
    trustItem3Text: mergeLocalized(updates.trustItem3Text, current.trustItem3Text),
    socialFacebookUrl:
      "socialFacebookUrl" in updates
        ? sanitizeSocialUrl(updates.socialFacebookUrl, current.socialFacebookUrl)
        : current.socialFacebookUrl,
    socialInstagramUrl:
      "socialInstagramUrl" in updates
        ? sanitizeSocialUrl(updates.socialInstagramUrl, current.socialInstagramUrl)
        : current.socialInstagramUrl,
    socialLinkedInUrl:
      "socialLinkedInUrl" in updates
        ? sanitizeSocialUrl(updates.socialLinkedInUrl, current.socialLinkedInUrl)
        : current.socialLinkedInUrl,
    updatedAt: new Date().toISOString(),
  };
  writeDisplaySettings(next);
  return next;
}

export function resetDisplaySettings(): DisplaySettings {
  const fresh: DisplaySettings = {
    ...DEFAULT_DISPLAY_SETTINGS,
    updatedAt: new Date().toISOString(),
  };
  writeDisplaySettings(fresh);
  return fresh;
}

