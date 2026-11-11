"use client";

import React, { useState, useEffect } from "react";
import { Share2, Save, RotateCcw, Loader2, ExternalLink } from "lucide-react";
import { DEFAULT_DISPLAY_SETTINGS } from "@/lib/displaySettingsDefaults";
import { useDisplaySettings } from "@/lib/displaySettingsContext";
import { useI18n } from "@/lib/i18n";
import styles from "@/app/admin/admin.module.css";

export type SocialUrlFieldKey =
  | "socialInstagramUrl"
  | "socialFacebookUrl"
  | "socialLinkedInUrl";

export const SOCIAL_LINK_FIELDS: {
  key: SocialUrlFieldKey;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "socialInstagramUrl",
    label: "Instagram",
    placeholder: "https://instagram.com/zirigo",
  },
  {
    key: "socialFacebookUrl",
    label: "Facebook",
    placeholder: "https://facebook.com/zirigo",
  },
  {
    key: "socialLinkedInUrl",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/zirigo",
  },
];

interface SocialLinksCardProps {
  onNotify?: (message: string, type?: "success" | "error") => void;
}

/**
 * Admin card for configuring global Instagram, Facebook & LinkedIn links.
 */
export function SocialLinksCard({ onNotify }: SocialLinksCardProps) {
  const { language } = useI18n();
  const { displaySettings, refreshDisplaySettings } = useDisplaySettings();
  const [urls, setUrls] = useState<Record<SocialUrlFieldKey, string>>({
    socialInstagramUrl: displaySettings.socialInstagramUrl,
    socialFacebookUrl: displaySettings.socialFacebookUrl,
    socialLinkedInUrl: displaySettings.socialLinkedInUrl,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUrls({
      socialInstagramUrl: displaySettings.socialInstagramUrl,
      socialFacebookUrl: displaySettings.socialFacebookUrl,
      socialLinkedInUrl: displaySettings.socialLinkedInUrl,
    });
  }, [
    displaySettings.socialInstagramUrl,
    displaySettings.socialFacebookUrl,
    displaySettings.socialLinkedInUrl,
  ]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/display-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urls),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onNotify?.(err.error || "Erreur lors de la sauvegarde", "error");
        return;
      }
      await refreshDisplaySettings();
      onNotify?.(
        language === "ar"
          ? "تم تحديث روابط التواصل الاجتماعي"
          : language === "en"
          ? "Social links updated"
          : "Liens réseaux sociaux enregistrés"
      );
    } catch {
      onNotify?.("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setUrls({
      socialInstagramUrl: DEFAULT_DISPLAY_SETTINGS.socialInstagramUrl,
      socialFacebookUrl: DEFAULT_DISPLAY_SETTINGS.socialFacebookUrl,
      socialLinkedInUrl: DEFAULT_DISPLAY_SETTINGS.socialLinkedInUrl,
    });
  };

  const title =
    language === "ar"
      ? "روابط شبكات التواصل الاجتماعي (إنستغرام، فيسبوك، لينكدإن)"
      : language === "en"
      ? "Social Media Links (Instagram, Facebook, LinkedIn)"
      : "Liens Réseaux Sociaux (Instagram, Facebook, LinkedIn)";

  const helperDesc =
    language === "ar"
      ? "تُعرض هذه الروابط في القائمة الجانبية وفي تذييل الموقع. اترك الحقل فارغاً لإخفاء الأيقونة."
      : language === "en"
      ? "Displayed in the navigation drawer menu and footer. Leave a field empty to hide that icon."
      : "Ces URLs alimentent le menu tiroir du header et le pied de page. Laissez vide pour masquer une icône.";

  return (
    <div className={styles.adminCard} style={{ gridColumn: "1 / -1" }}>
      <div className={styles.adminCardHeader}>
        <div className={styles.cardTitle}>
          <Share2 size={20} style={{ color: "var(--brand-primary)" }} />
          <span>{title}</span>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="btn btn-secondary"
          style={{
            padding: "0.38rem 0.78rem",
            fontSize: "0.78rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <RotateCcw size={13} />
          <span>
            {language === "ar" ? "افتراضي" : language === "en" ? "Defaults" : "Par défaut"}
          </span>
        </button>
      </div>

      <form onSubmit={handleSave} style={{ padding: "1.35rem" }}>
        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginBottom: "1.1rem" }}>
          {helperDesc}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginBottom: "1.2rem",
          }}
        >
          {SOCIAL_LINK_FIELDS.map((field) => {
            const val = urls[field.key];
            return (
              <div key={field.key}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.35rem",
                  }}
                >
                  <label className={styles.formLabel} style={{ marginBottom: 0 }}>
                    {field.label}
                  </label>
                  {val.trim() && (
                    <a
                      href={/^https?:\/\//i.test(val.trim()) ? val.trim() : `https://${val.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.74rem",
                        color: "var(--brand-primary)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Tester</span>
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={field.placeholder}
                  value={val}
                  onChange={(e) =>
                    setUrls((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>
            {language === "ar"
              ? "حفظ الروابط"
              : language === "en"
              ? "Save Social Links"
              : "Enregistrer les liens sociaux"}
          </span>
        </button>
      </form>
    </div>
  );
}

