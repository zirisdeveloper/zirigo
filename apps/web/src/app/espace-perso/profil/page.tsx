"use client";

import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sliders,
  Globe,
  Moon,
  Sun,
  Coins,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useI18n } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferencesContext";
import { CurrencyCode, LanguageCode, ThemeMode } from "@/lib/types";
import adminStyles from "@/app/admin/admin.module.css";
import styles from "../espacePerso.module.css";

export default function EspacePersoProfilPage() {
  const { user, refreshSession } = useAuth();
  const { ext, language: currentLang } = useI18n();
  const {
    currency,
    language,
    theme,
    saveAllPreferences,
  } = usePreferences();
  const ep = ext.espacePerso;

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [prefCurrency, setPrefCurrency] = useState<CurrencyCode>(currency);
  const [prefLanguage, setPrefLanguage] = useState<LanguageCode>(language);
  const [prefTheme, setPrefTheme] = useState<ThemeMode>(theme);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    setPrefCurrency(currency);
    setPrefLanguage(language);
    setPrefTheme(theme);
  }, [currency, language, theme]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const [profileRes, prefsSaved] = await Promise.all([
        fetch("/api/auth/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            preferredCurrency: prefCurrency,
            preferredLanguage: prefLanguage,
            preferredTheme: prefTheme,
          }),
        }),
        saveAllPreferences({
          currency: prefCurrency,
          language: prefLanguage,
          theme: prefTheme,
        }),
      ]);

      if (profileRes.ok && prefsSaved) {
        await refreshSession();
        showToast(ep.profileUpdated);
      } else {
        showToast("Error", "error");
      }
    } catch {
      showToast("Error", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const prefLabels = {
    title:
      currentLang === "ar"
        ? "تفضيلات العرض المحفوظة"
        : currentLang === "en"
        ? "Saved Display Preferences"
        : "Préférences d'affichage (Sauvegardées en base de données)",
    currency:
      currentLang === "ar" ? "العملة الافتراضية" : currentLang === "en" ? "Default Currency" : "Monnaie préférée",
    language:
      currentLang === "ar" ? "لغة الموقع" : currentLang === "en" ? "Site Language" : "Langue préférée",
    theme:
      currentLang === "ar" ? "الوضع الليلي" : currentLang === "en" ? "Theme Mode" : "Mode d'affichage (Nuit / Jour)",
    light:
      currentLang === "ar" ? "الوضع النهاري (فاتح)" : currentLang === "en" ? "Light Mode" : "Mode Jour (Clair)",
    dark:
      currentLang === "ar" ? "الوضع الليلي (داكن)" : currentLang === "en" ? "Dark Mode" : "Mode Nuit (Sombre)",
  };

  return (
    <div>
      {toastMessage && (
        <div className={adminStyles.toastContainer}>
          <div
            className={`${adminStyles.toast} ${
              toastMessage.type === "success" ? adminStyles.toastSuccess : adminStyles.toastError
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--deal-green)" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "var(--alert-red)" }} />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.65rem", fontWeight: 800 }}>{ep.profileTitle}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
          {ep.profileSubtitle}
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <UserIcon size={18} style={{ color: "var(--brand-primary)" }} />
              <span>{ep.accountInfoTitle}</span>
            </div>
            <span className={styles.verifiedPill}>
              <ShieldCheck size={14} />
              <span>{ep.statusActivated}</span>
            </span>
          </div>

          <div style={{ padding: "1.5rem" }}>
            <div className={adminStyles.formGrid}>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel}>{ext.auth.fullNameLabel}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={adminStyles.formInput}
                />
              </div>

              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel}>{ext.auth.phoneOptionalLabel}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className={adminStyles.formInput}
                />
              </div>

              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel}>{ext.auth.emailLabel}</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className={adminStyles.formInput}
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                />
              </div>

              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel}>{ep.authMethodLabel}</label>
                <input
                  type="text"
                  disabled
                  value={
                    user?.provider === "email"
                      ? ep.emailMethod
                      : `${user?.provider?.toUpperCase()} ${ep.simulatedSuffix}`
                  }
                  className={adminStyles.formInput}
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Preferences Card */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sliders size={18} style={{ color: "var(--brand-primary)" }} />
              <span>{prefLabels.title}</span>
            </div>
          </div>

          <div style={{ padding: "1.5rem" }}>
            <div className={adminStyles.formGrid}>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Coins size={15} style={{ color: "var(--brand-primary)" }} />
                  <span>{prefLabels.currency}</span>
                </label>
                <select
                  value={prefCurrency}
                  onChange={(e) => setPrefCurrency(e.target.value as CurrencyCode)}
                  className={adminStyles.formSelect}
                >
                  <option value="DZD">DZD (Dinar Algérien)</option>
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>

              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Globe size={15} style={{ color: "var(--brand-primary)" }} />
                  <span>{prefLabels.language}</span>
                </label>
                <select
                  value={prefLanguage}
                  onChange={(e) => setPrefLanguage(e.target.value as LanguageCode)}
                  className={adminStyles.formSelect}
                >
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (EN)</option>
                  <option value="ar">العربية (AR)</option>
                </select>
              </div>

              <div className={adminStyles.formGroup}>
                <label className={adminStyles.formLabel} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {prefTheme === "dark" ? (
                    <Moon size={15} style={{ color: "var(--brand-primary)" }} />
                  ) : (
                    <Sun size={15} style={{ color: "var(--brand-primary)" }} />
                  )}
                  <span>{prefLabels.theme}</span>
                </label>
                <select
                  value={prefTheme}
                  onChange={(e) => setPrefTheme(e.target.value as ThemeMode)}
                  className={adminStyles.formSelect}
                >
                  <option value="light">{prefLabels.light}</option>
                  <option value="dark">{prefLabels.dark}</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" disabled={isSaving} className="btn btn-primary">
                <Save size={16} />
                <span>{isSaving ? ext.saving : ext.saveChanges}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
