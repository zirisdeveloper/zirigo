import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  AuthProviderType,
  CurrencyCode,
  LanguageCode,
  Property,
  SearchAlert,
  ThemeMode,
  UserAccount,
  UserNotification,
} from "./types";
import { matchesPropertyQuery, matchesPropertyCategory } from "./searchUtils";

export const SESSION_COOKIE_NAME = "zirigo_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "zirigo-dev-session-secret-key-2026";

/**
 * Simulation OAuth en phase de développement uniquement.
 * À supprimer / désactiver (DISABLE_OAUTH_SIMULATION=true) lors du passage en production.
 */
export function isOAuthSimulationEnabled(): boolean {
  if (process.env.DISABLE_OAUTH_SIMULATION === "true") return false;
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_DEV_OAUTH_SIMULATION === "true";
}

interface StoredUser extends UserAccount {
  passwordHash?: string;
  activationCode?: string;
  activationExpiresAt?: string;
}

function getDataDirectory(): string {
  const possiblePaths = [
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "apps", "web", "data"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
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

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(getDataDirectory(), filename);
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filename, fallback);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const filePath = path.join(getDataDirectory(), filename);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

// ============================================================================
// Password & Session Helpers
// ============================================================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const keyBuf = Buffer.from(keyHex, "hex");
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

export function createSessionToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token?: string | null): { userId: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (!payload.userId || !payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function sanitizeUser(user: StoredUser): UserAccount {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    provider: user.provider,
    isVerified: user.isVerified,
    preferredCurrency: user.preferredCurrency || "DZD",
    preferredLanguage: user.preferredLanguage || "fr",
    preferredTheme: user.preferredTheme || "light",
    createdAt: user.createdAt,
  };
}

// ============================================================================
// Users Store & Authentication
// ============================================================================

function ensureDefaultAdmin(users: StoredUser[]): StoredUser[] {
  const hasAdmin = users.some((u) => u.role === "admin");
  if (hasAdmin) return users;
  const defaultAdmin: StoredUser = {
    id: "usr-admin-1",
    name: "Administrateur Zirigo",
    email: "admin@zirigo.com",
    role: "admin",
    provider: "email",
    isVerified: true,
    preferredCurrency: "DZD",
    preferredLanguage: "fr",
    preferredTheme: "light",
    passwordHash: hashPassword("AdminZirigo2026!"),
    createdAt: new Date().toISOString(),
  };
  const updated = [defaultAdmin, ...users];
  writeJsonFile("users.json", updated);
  return updated;
}

export function getAllUsers(): StoredUser[] {
  const users = readJsonFile<StoredUser[]>("users.json", []);
  return ensureDefaultAdmin(users);
}

function saveAllUsers(users: StoredUser[]): void {
  writeJsonFile("users.json", users);
}

export function getUserById(id: string): UserAccount | null {
  const users = getAllUsers();
  const found = users.find((u) => u.id === id);
  return found ? sanitizeUser(found) : null;
}

export function getUserByEmail(email: string): StoredUser | undefined {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

function generateActivationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface SimulatedEmailPayload {
  to: string;
  subject: string;
  code: string;
  expiresInMinutes: number;
}

export function registerWithEmail(params: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  preferredCurrency?: CurrencyCode;
  preferredLanguage?: LanguageCode;
  preferredTheme?: ThemeMode;
}):
  | {
      success: true;
      user: UserAccount;
      simulatedEmail?: SimulatedEmailPayload;
    }
  | { success: false; error: string } {
  const normalizedEmail = params.email.trim().toLowerCase();
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (existingIndex !== -1 && users[existingIndex].isVerified) {
    return { success: false, error: "Un compte vérifié existe déjà avec cette adresse e-mail." };
  }

  const code = generateActivationCode();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const passwordHash = hashPassword(params.password);

  let savedUser: StoredUser;

  if (existingIndex !== -1) {
    // Update unverified existing record with a fresh activation code
    savedUser = {
      ...users[existingIndex],
      name: params.name.trim(),
      phone: params.phone?.trim() || users[existingIndex].phone,
      passwordHash,
      provider: "email",
      isVerified: false,
      preferredCurrency: params.preferredCurrency || users[existingIndex].preferredCurrency || "DZD",
      preferredLanguage: params.preferredLanguage || users[existingIndex].preferredLanguage || "fr",
      preferredTheme: params.preferredTheme || users[existingIndex].preferredTheme || "light",
      activationCode: code,
      activationExpiresAt: expiresAt,
    };
    users[existingIndex] = savedUser;
  } else {
    savedUser = {
      id: `usr-${Date.now()}`,
      name: params.name.trim(),
      email: normalizedEmail,
      phone: params.phone?.trim() || "",
      role: "user",
      provider: "email",
      isVerified: false,
      preferredCurrency: params.preferredCurrency || "DZD",
      preferredLanguage: params.preferredLanguage || "fr",
      preferredTheme: params.preferredTheme || "light",
      passwordHash,
      activationCode: code,
      activationExpiresAt: expiresAt,
      createdAt: new Date().toISOString(),
    };
    users.unshift(savedUser);
  }

  saveAllUsers(users);

  console.info(
    `[ZIRIGO DEV EMAIL] Code d'activation envoyé à ${normalizedEmail} : ${code} (expire dans 30 min)`
  );

  return {
    success: true,
    user: sanitizeUser(savedUser),
    simulatedEmail:
      process.env.NODE_ENV !== "production"
        ? {
            to: normalizedEmail,
            subject: "Zirigo — Votre code d'activation",
            code,
            expiresInMinutes: 30,
          }
        : undefined,
  };
}

export function verifyActivationCode(
  email: string,
  code: string
): { success: true; user: UserAccount } | { success: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (idx === -1) {
    return { success: false, error: "Aucun compte trouvé pour cette adresse e-mail." };
  }

  const target = users[idx];
  if (target.isVerified) {
    return { success: true, user: sanitizeUser(target) };
  }

  if (!target.activationCode || target.activationCode !== code.trim()) {
    return { success: false, error: "Code d'activation invalide. Veuillez vérifier votre saisie." };
  }

  if (target.activationExpiresAt && new Date(target.activationExpiresAt).getTime() < Date.now()) {
    return {
      success: false,
      error: "Ce code d'activation a expiré. Veuillez demander un nouveau code.",
    };
  }

  users[idx] = {
    ...target,
    isVerified: true,
    activationCode: undefined,
    activationExpiresAt: undefined,
  };
  saveAllUsers(users);

  return { success: true, user: sanitizeUser(users[idx]) };
}

export function resendActivationCode(email: string):
  | { success: true; simulatedEmail?: SimulatedEmailPayload }
  | { success: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (idx === -1) {
    return { success: false, error: "Adresse e-mail introuvable." };
  }

  if (users[idx].isVerified) {
    return { success: false, error: "Ce compte est déjà activé." };
  }

  const code = generateActivationCode();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  users[idx] = {
    ...users[idx],
    activationCode: code,
    activationExpiresAt: expiresAt,
  };
  saveAllUsers(users);

  console.info(`[ZIRIGO DEV EMAIL] Nouveau code d'activation pour ${normalizedEmail} : ${code}`);

  return {
    success: true,
    simulatedEmail:
      process.env.NODE_ENV !== "production"
        ? {
            to: normalizedEmail,
            subject: "Zirigo — Nouveau code d'activation",
            code,
            expiresInMinutes: 30,
          }
        : undefined,
  };
}

export function loginWithEmail(
  email: string,
  password: string
):
  | { success: true; user: UserAccount }
  | {
      success: false;
      error: string;
      requiresVerification?: boolean;
      email?: string;
    } {
  const normalizedEmail = email.trim().toLowerCase();
  const target = getUserByEmail(normalizedEmail);

  if (!target) {
    return { success: false, error: "Identifiants incorrects." };
  }

  if (!target.passwordHash) {
    return {
      success: false,
      error: `Ce compte a été créé via ${target.provider}. Veuillez utiliser la connexion sociale correspondante.`,
    };
  }

  if (!verifyPassword(password, target.passwordHash)) {
    return { success: false, error: "Identifiants incorrects." };
  }

  if (!target.isVerified) {
    return {
      success: false,
      error: "Votre compte n'est pas encore activé. Veuillez saisir votre code d'activation.",
      requiresVerification: true,
      email: target.email,
    };
  }

  return { success: true, user: sanitizeUser(target) };
}

export function authenticateWithSocial(params: {
  provider: AuthProviderType;
  email: string;
  name: string;
  avatarUrl?: string;
  preferredCurrency?: CurrencyCode;
  preferredLanguage?: LanguageCode;
  preferredTheme?: ThemeMode;
}): { success: true; user: UserAccount } | { success: false; error: string } {
  if (!isOAuthSimulationEnabled()) {
    return {
      success: false,
      error:
        "La simulation OAuth est désactivée en production. Configurez les fournisseurs OAuth réels.",
    };
  }

  const normalizedEmail = params.email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { success: false, error: "L'adresse e-mail du compte social est requise." };
  }

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (idx !== -1) {
    // Mark verified if previously unverified via email, and update avatar if missing
    users[idx] = {
      ...users[idx],
      name: users[idx].name || params.name.trim(),
      avatarUrl: users[idx].avatarUrl || params.avatarUrl,
      isVerified: true,
    };
    saveAllUsers(users);
    return { success: true, user: sanitizeUser(users[idx]) };
  }

  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    name: params.name.trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    avatarUrl: params.avatarUrl,
    role: "user",
    provider: params.provider,
    isVerified: true,
    preferredCurrency: params.preferredCurrency || "DZD",
    preferredLanguage: params.preferredLanguage || "fr",
    preferredTheme: params.preferredTheme || "light",
    createdAt: new Date().toISOString(),
  };

  users.unshift(newUser);
  saveAllUsers(users);

  return { success: true, user: sanitizeUser(newUser) };
}

export function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    avatarUrl?: string;
    preferredCurrency?: CurrencyCode;
    preferredLanguage?: LanguageCode;
    preferredTheme?: ThemeMode;
  }
): UserAccount | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const validCurrencies: CurrencyCode[] = ["DZD", "EUR", "USD", "GBP"];
  const validLanguages: LanguageCode[] = ["fr", "en", "ar"];
  const validThemes: ThemeMode[] = ["light", "dark"];

  users[idx] = {
    ...users[idx],
    name: updates.name !== undefined ? updates.name.trim() : users[idx].name,
    phone: updates.phone !== undefined ? updates.phone.trim() : users[idx].phone,
    avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : users[idx].avatarUrl,
    preferredCurrency:
      updates.preferredCurrency && validCurrencies.includes(updates.preferredCurrency)
        ? updates.preferredCurrency
        : users[idx].preferredCurrency || "DZD",
    preferredLanguage:
      updates.preferredLanguage && validLanguages.includes(updates.preferredLanguage)
        ? updates.preferredLanguage
        : users[idx].preferredLanguage || "fr",
    preferredTheme:
      updates.preferredTheme && validThemes.includes(updates.preferredTheme)
        ? updates.preferredTheme
        : users[idx].preferredTheme || "light",
  };
  saveAllUsers(users);
  return sanitizeUser(users[idx]);
}

// ============================================================================
// Search Alerts & Dynamic Notifications Engine
// ============================================================================

export function getPropertyLowestPrice(property: Property): number {
  const direct = property.rates?.find((r) =>
    r.platformName.toLowerCase().includes("direct")
  )?.pricePerNight;
  if (direct && direct > 0) return direct;
  if (property.rates && property.rates.length > 0) {
    return Math.min(...property.rates.map((r) => r.pricePerNight));
  }
  if (property.rooms && property.rooms.length > 0) {
    return Math.min(...property.rooms.map((r) => r.basePricePerNight));
  }
  return 0;
}

export function doesPropertyMatchAlert(property: Property, alert: SearchAlert): boolean {
  if (!matchesPropertyCategory(property, alert.propertyType)) {
    return false;
  }

  if (alert.query && alert.query.trim().length > 0) {
    if (!matchesPropertyQuery(property, alert.query)) return false;
  }

  if (alert.maxPricePerNight && alert.maxPricePerNight > 0) {
    const price = getPropertyLowestPrice(property);
    if (price > alert.maxPricePerNight) return false;
  }

  if (alert.minRating && alert.minRating > 0) {
    if (property.rating < alert.minRating) return false;
  }

  if (alert.minGuests && alert.minGuests > 0) {
    const maxCap =
      property.rooms && property.rooms.length > 0
        ? Math.max(...property.rooms.map((r) => r.capacityGuests))
        : 2;
    if (maxCap < alert.minGuests) return false;
  }

  if (alert.amenities && alert.amenities.length > 0) {
    const hasAll = alert.amenities.every((am) => property.amenities.includes(am));
    if (!hasAll) return false;
  }

  return true;
}

export function getAllAlerts(): SearchAlert[] {
  return readJsonFile<SearchAlert[]>("alerts.json", []);
}

function saveAllAlerts(alerts: SearchAlert[]): void {
  writeJsonFile("alerts.json", alerts);
}

export function getUserAlerts(userId: string): SearchAlert[] {
  return getAllAlerts().filter((a) => a.userId === userId);
}

export function getAllNotifications(): UserNotification[] {
  return readJsonFile<UserNotification[]>("notifications.json", []);
}

function saveAllNotifications(notifications: UserNotification[]): void {
  writeJsonFile("notifications.json", notifications);
}

export function getUserNotifications(userId: string): UserNotification[] {
  return getAllNotifications().filter((n) => n.userId === userId);
}

export function createSearchAlert(
  userId: string,
  data: Omit<SearchAlert, "id" | "userId" | "createdAt">,
  existingProperties: Property[]
): { alert: SearchAlert; initialMatches: Property[] } {
  const alerts = getAllAlerts();
  const newAlert: SearchAlert = {
    id: `alert-${Date.now()}`,
    userId,
    name: data.name.trim() || "Alerte de recherche",
    query: data.query?.trim() || "",
    propertyType: data.propertyType || "all",
    maxPricePerNight: data.maxPricePerNight ? Number(data.maxPricePerNight) : undefined,
    minRating: data.minRating ? Number(data.minRating) : undefined,
    minGuests: data.minGuests ? Number(data.minGuests) : undefined,
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    frequency: data.frequency || "instant",
    channel: data.channel || "both",
    isActive: data.isActive ?? true,
    createdAt: new Date().toISOString(),
  };

  saveAllAlerts([newAlert, ...alerts]);

  const initialMatches = existingProperties.filter((p) =>
    doesPropertyMatchAlert(p, newAlert)
  );

  // Create initial notification for existing top match so the user sees immediate feedback
  if (initialMatches.length > 0 && newAlert.isActive) {
    const notifications = getAllNotifications();
    const firstMatch = initialMatches[0];
    const notif: UserNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      alertId: newAlert.id,
      alertName: newAlert.name,
      propertyId: firstMatch.id,
      propertySlug: firstMatch.slug,
      propertyTitle: firstMatch.title,
      propertyCity: `${firstMatch.city}, ${firstMatch.country}`,
      pricePerNight: getPropertyLowestPrice(firstMatch),
      message: `${initialMatches.length} hébergement(s) correspondent déjà à votre alerte « ${newAlert.name} », dont ${firstMatch.title}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    saveAllNotifications([notif, ...notifications]);
  }

  return { alert: newAlert, initialMatches };
}

export function updateSearchAlert(
  id: string,
  userId: string,
  updates: Partial<SearchAlert>
): SearchAlert | null {
  const alerts = getAllAlerts();
  const idx = alerts.findIndex((a) => a.id === id && a.userId === userId);
  if (idx === -1) return null;

  alerts[idx] = {
    ...alerts[idx],
    ...updates,
    id: alerts[idx].id,
    userId: alerts[idx].userId,
  };
  saveAllAlerts(alerts);
  return alerts[idx];
}

export function deleteSearchAlert(id: string, userId: string): boolean {
  const alerts = getAllAlerts();
  const next = alerts.filter((a) => !(a.id === id && a.userId === userId));
  if (next.length === alerts.length) return false;
  saveAllAlerts(next);
  return true;
}

export function triggerNotificationsForProperty(property: Property): number {
  const alerts = getAllAlerts().filter((a) => a.isActive);
  if (alerts.length === 0) return 0;

  const notifications = getAllNotifications();
  const newNotifications: UserNotification[] = [];

  for (const alert of alerts) {
    // Don't notify the owner about their own property
    if (property.ownerId && property.ownerId === alert.userId) continue;

    if (doesPropertyMatchAlert(property, alert)) {
      newNotifications.push({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        userId: alert.userId,
        alertId: alert.id,
        alertName: alert.name,
        propertyId: property.id,
        propertySlug: property.slug,
        propertyTitle: property.title,
        propertyCity: `${property.city}, ${property.country}`,
        pricePerNight: getPropertyLowestPrice(property),
        message: `Nouvelle annonce correspondant à votre alerte « ${alert.name} » : ${property.title} à ${property.city}.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  if (newNotifications.length > 0) {
    saveAllNotifications([...newNotifications, ...notifications]);
  }

  return newNotifications.length;
}

export function markNotificationRead(id: string, userId: string): boolean {
  const notifications = getAllNotifications();
  const idx = notifications.findIndex((n) => n.id === id && n.userId === userId);
  if (idx === -1) return false;
  notifications[idx].isRead = true;
  saveAllNotifications(notifications);
  return true;
}

export function markAllNotificationsRead(userId: string): void {
  const notifications = getAllNotifications().map((n) =>
    n.userId === userId ? { ...n, isRead: true } : n
  );
  saveAllNotifications(notifications);
}

export function deleteNotification(id: string, userId: string): boolean {
  const notifications = getAllNotifications();
  const next = notifications.filter((n) => !(n.id === id && n.userId === userId));
  if (next.length === notifications.length) return false;
  saveAllNotifications(next);
  return true;
}

