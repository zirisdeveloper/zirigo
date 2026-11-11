"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Monitor,
  Megaphone,
  LayoutGrid,
  Type,
  SlidersHorizontal,
  ShieldCheck,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Menu,
  Share2,
} from "lucide-react";
import { DisplaySettings, LanguageCode, LocalizedText } from "@/lib/types";
import { DEFAULT_DISPLAY_SETTINGS } from "@/lib/displaySettingsDefaults";
import { useDisplaySettings } from "@/lib/displaySettingsContext";
import { SOCIAL_LINK_FIELDS } from "@/components/admin/SocialLinksCard";
import { useI18n } from "@/lib/i18n";
import styles from "../admin.module.css";

type VisibilityKey =
  | "showAdsSection"
  | "showCategoryIconsSection"
  | "showHeroHeader"
  | "showTypeTabs"
  | "showTrustBanner"
  | "showHeaderMenuButton";

type TextFieldKey =
  | "heroPromoText"
  | "heroTitleText"
  | "heroSubtitleText"
  | "trustItem1Text"
  | "trustItem2Text"
  | "trustItem3Text";

export default function AdminAffichagePage() {
  const { language, ext } = useI18n();
  const { refreshDisplaySettings } = useDisplaySettings();
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [editLang, setEditLang] = useState<LanguageCode>("fr");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/display-settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.showAdsSection === "boolean") {
          setSettings(data);
        }
      })
      .catch(() => {
        // default fallback
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistPatch = async (patch: Partial<DisplaySettings>, successMsg?: string) => {
    try {
      const res = await fetch("/api/display-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Erreur lors de la sauvegarde", "error");
        return false;
      }
      const updated = await res.json();
      setSettings(updated);
      await refreshDisplaySettings();
      if (successMsg) showToast(successMsg);
      return true;
    } catch {
      showToast("Erreur réseau", "error");
      return false;
    }
  };

  const handleToggleSection = async (key: VisibilityKey) => {
    const nextVal = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: nextVal }));
    const ok = await persistPatch(
      { [key]: nextVal },
      nextVal
        ? language === "en"
          ? "Section enabled"
          : language === "ar"
          ? "تم إظهار القسم"
          : "Section affichée"
        : language === "en"
        ? "Section hidden"
        : language === "ar"
        ? "تم إخفاء القسم"
        : "Section masquée"
    );
    if (!ok) {
      setSettings((prev) => ({ ...prev, [key]: !nextVal }));
    }
  };

  const handleTextChange = (field: TextFieldKey, value: string) => {
    setSettings((prev) => {
      const currentBlock: LocalizedText = prev[field];
      return {
        ...prev,
        [field]: {
          ...currentBlock,
          [editLang]: value,
        },
      };
    });
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await persistPatch(
      settings,
      language === "en"
        ? "Display settings saved"
        : language === "ar"
        ? "تم حفظ إعدادات العرض"
        : "Paramètres d'affichage enregistrés"
    );
    setIsSaving(false);
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/display-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const fresh = await res.json();
        setSettings(fresh);
        await refreshDisplaySettings();
        showToast(
          language === "en"
            ? "Defaults restored"
            : language === "ar"
            ? "تمت استعادة الإعدادات الافتراضية"
            : "Affichage par défaut restauré"
        );
      }
    } catch {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const pageTitle =
    language === "ar"
      ? "إدارة عرض الصفحة الرئيسية"
      : language === "en"
      ? "Homepage Display & Sections"
      : "Gestion de l'Affichage";

  const pageSub =
    language === "ar"
      ? "تحكم في إظهار أو إخفاء أقسام الشاشة الرئيسية وتعديل النصوص المعروضة."
      : language === "en"
      ? "Show or hide sections on the public homepage and customize hero and banner copy."
      : "Activez, masquez et personnalisez les sections et textes affichés sur la page d'accueil.";

  const sectionToggleCards: Array<{
    key: VisibilityKey;
    icon: React.ReactNode;
    title: string;
    desc: string;
    extraLink?: { href: string; label: string };
  }> = [
    {
      key: "showAdsSection",
      icon: <Megaphone size={19} style={{ color: "var(--brand-primary)" }} />,
      title:
        language === "ar"
          ? "قسم الإعلانات (أعلى الصفحة)"
          : language === "en"
          ? "Advertising Section (Top Banner)"
          : "Section Publicité",
      desc:
        language === "ar"
          ? "شريط الإعلانات الرئيسي والبنر الجانبي أسفل الهيدر مباشرة."
          : language === "en"
          ? "Main ad carousel and companion partner slot right under the header."
          : "Carrousel publicitaire principal et encart partenaire sous le header.",
      extraLink: {
        href: "/admin/ads",
        label:
          language === "en" ? "Manage ads" : language === "ar" ? "إدارة الإعلانات" : "Gérer les pubs",
      },
    },
    {
      key: "showCategoryIconsSection",
      icon: <LayoutGrid size={19} style={{ color: "var(--brand-primary)" }} />,
      title:
        language === "ar"
          ? "أيقونات الفئات أسفل الإعلان"
          : language === "en"
          ? "Category Icons Strip (Below Ads)"
          : "Section Icônes (Choix type) sous la pub",
      desc:
        language === "ar"
          ? "الأيقونات الدائرية: فنادق، شقق، فيلات، شاليهات، منتجعات وسبا، مهاجع."
          : language === "en"
          ? "Circular category icons: Hotels, Apartments, Villas, Chalets, Resorts & Spa, Dormitories."
          : "Médaillons circulaires : Hôtels, Appartements, Villas, Chalets, Resorts & Spa, Dortoirs.",
    },
    {
      key: "showTypeTabs",
      icon: <SlidersHorizontal size={19} style={{ color: "var(--brand-primary)" }} />,
      title:
        language === "ar"
          ? "أزرار اختيار نوع الإقامة"
          : language === "en"
          ? "Property Type Pill Buttons"
          : "Section Boutons Type (au-dessus de la recherche)",
      desc:
        language === "ar"
          ? "أزرار التصفية المتعددة فوق شريط البحث (الكل، فنادق، شقق، فيلات...)."
          : language === "en"
          ? "Multi-select category pill buttons directly above the search bar."
          : "Boutons de sélection multiple au-dessus de la barre de recherche.",
    },
    {
      key: "showHeaderMenuButton",
      icon: <Menu size={19} style={{ color: "var(--brand-primary)" }} />,
      title:
        language === "ar"
          ? "زر القائمة الجانبية (أعلى الصفحة)"
          : language === "en"
          ? "Header Slide-Over Menu Button"
          : "Bouton Menu latéral (à gauche de Zirigo)",
      desc:
        language === "ar"
          ? "إظهار أو إخفاء أيقونة القائمة بجانب شعار Zirigo (الحساب، الفئات، اتصل بنا، الشروط والخصوصية)."
          : language === "en"
          ? "Show or hide the menu icon beside the Zirigo logo (Account, Categories, Contact, Privacy, Terms)."
          : "Afficher ou masquer l'icône menu à gauche du logo Zirigo (Compte, Catégories, Contact, Confidentialité, Conditions).",
    },
  ];

  const renderVisibilityBadge = (visible: boolean) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.28rem 0.7rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.78rem",
        fontWeight: 700,
        backgroundColor: visible ? "var(--deal-green-bg)" : "var(--alert-red-bg)",
        color: visible ? "var(--deal-green)" : "var(--alert-red)",
      }}
    >
      {visible ? <Eye size={13} /> : <EyeOff size={13} />}
      <span>
        {visible
          ? language === "en"
            ? "Visible"
            : language === "ar"
            ? "مرئي"
            : "Affiché"
          : language === "en"
          ? "Hidden"
          : language === "ar"
          ? "مخفي"
          : "Masqué"}
      </span>
    </span>
  );

  if (isLoading) {
    return (
      <div style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        <Loader2 size={30} className="animate-spin" style={{ margin: "0 auto" }} />
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div className={styles.toastContainer}>
          <div
            className={`${styles.toast} ${
              toast.type === "success" ? styles.toastSuccess : styles.toastError
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--deal-green)" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "var(--alert-red)" }} />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {pageTitle}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {pageSub}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          <Link
            href="/"
            target="_blank"
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            <ExternalLink size={15} />
            <span>{ext.backToPublicSite}</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            <RotateCcw size={15} />
            <span>
              {language === "ar"
                ? "استعادة الافتراضي"
                : language === "en"
                ? "Reset defaults"
                : "Réinitialiser"}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Section Visibility Cards (Pub, Category Icons, Type Tabs) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.15rem",
          marginBottom: "1.5rem",
        }}
      >
        {sectionToggleCards.map((card) => {
          const isVisible = settings[card.key];
          return (
            <div key={card.key} className={styles.adminCard}>
              <div className={styles.adminCardHeader}>
                <div className={styles.cardTitle}>
                  {card.icon}
                  <span>{card.title}</span>
                </div>
                {renderVisibilityBadge(isVisible)}
              </div>
              <div
                style={{
                  padding: "1.15rem 1.35rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {card.desc}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSection(card.key)}
                    className={isVisible ? "btn btn-secondary" : "btn btn-primary"}
                    style={{
                      padding: "0.48rem 0.95rem",
                      fontSize: "0.82rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                    <span>
                      {isVisible
                        ? language === "en"
                          ? "Hide section"
                          : language === "ar"
                          ? "إخفاء القسم"
                          : "Masquer cette section"
                        : language === "en"
                        ? "Show section"
                        : language === "ar"
                        ? "إظهار القسم"
                        : "Afficher cette section"}
                    </span>
                  </button>

                  {card.extraLink && (
                    <Link
                      href={card.extraLink.href}
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--brand-primary)",
                      }}
                    >
                      {card.extraLink.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form for Section Visibility + Editable Text Zones */}
      <form onSubmit={handleSaveAll} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Language selector bar for editing texts */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Monitor size={19} style={{ color: "var(--brand-primary)" }} />
              <span>
                {language === "ar"
                  ? "لغة النصوص المحررة"
                  : language === "en"
                  ? "Editing language for custom texts"
                  : "Langue d'édition des textes personnalisés"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.45rem" }}>
              {(
                [
                  { code: "fr", label: "Français (FR)" },
                  { code: "en", label: "English (EN)" },
                  { code: "ar", label: "العربية (AR)" },
                ] as const
              ).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setEditLang(item.code)}
                  className={editLang === item.code ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Zone 3: Hero Headline / Value Proposition ("Réservez au Meilleur Tarif... service caché") */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Type size={19} style={{ color: "var(--brand-primary)" }} />
              <span>
                {language === "ar"
                  ? "قسم العنوان والنص الترحيبي (أعلى البحث)"
                  : language === "en"
                  ? "Hero Text Section (« Book at the Best Rate... hidden fees »)"
                  : "Section Texte Principal (« Réservez au Meilleur Tarif... service caché »)"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {renderVisibilityBadge(settings.showHeroHeader)}
              <button
                type="button"
                onClick={() => handleToggleSection("showHeroHeader")}
                className="btn btn-secondary"
                style={{ padding: "0.38rem 0.8rem", fontSize: "0.8rem" }}
              >
                {settings.showHeroHeader ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <div
            style={{
              padding: "1.35rem",
              display: "grid",
              gap: "1rem",
              opacity: settings.showHeroHeader ? 1 : 0.6,
            }}
          >
            <div>
              <label className={styles.formLabel}>
                Badge supérieur ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                className={styles.formInput}
                dir={editLang === "ar" ? "rtl" : "ltr"}
                value={settings.heroPromoText[editLang]}
                onChange={(e) => handleTextChange("heroPromoText", e.target.value)}
              />
            </div>

            <div>
              <label className={styles.formLabel}>
                Titre principal ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                className={styles.formInput}
                dir={editLang === "ar" ? "rtl" : "ltr"}
                value={settings.heroTitleText[editLang]}
                onChange={(e) => handleTextChange("heroTitleText", e.target.value)}
              />
            </div>

            <div>
              <label className={styles.formLabel}>
                Description / Sous-titre ({editLang.toUpperCase()})
              </label>
              <textarea
                rows={3}
                className={styles.formInput}
                dir={editLang === "ar" ? "rtl" : "ltr"}
                value={settings.heroSubtitleText[editLang]}
                onChange={(e) => handleTextChange("heroSubtitleText", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Zone 5: Section Below Search Bar (Trust Banner) */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <ShieldCheck size={19} style={{ color: "var(--brand-primary)" }} />
              <span>
                {language === "ar"
                  ? "القسم أسفل شريط البحث (المزايا والضمانات)"
                  : language === "en"
                  ? "Section Below Search Bar (Trust & Perks Metrics)"
                  : "Section en dessous de la barre de recherche (Garanties / Avantages)"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {renderVisibilityBadge(settings.showTrustBanner)}
              <button
                type="button"
                onClick={() => handleToggleSection("showTrustBanner")}
                className="btn btn-secondary"
                style={{ padding: "0.38rem 0.8rem", fontSize: "0.8rem" }}
              >
                {settings.showTrustBanner ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <div
            style={{
              padding: "1.35rem",
              display: "grid",
              gap: "1rem",
              opacity: settings.showTrustBanner ? 1 : 0.6,
            }}
          >
            <div>
              <label className={styles.formLabel}>
                Élément 1 ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                className={styles.formInput}
                dir={editLang === "ar" ? "rtl" : "ltr"}
                value={settings.trustItem1Text[editLang]}
                onChange={(e) => handleTextChange("trustItem1Text", e.target.value)}
              />
            </div>

            <div>
              <label className={styles.formLabel}>
                Élément 2 ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                className={styles.formInput}
                dir={editLang === "ar" ? "rtl" : "ltr"}
                value={settings.trustItem2Text[editLang]}
                onChange={(e) => handleTextChange("trustItem2Text", e.target.value)}
              />
            </div>

            <div>
              <label className={styles.formLabel}>
                Élément 3 ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                className={styles.formInput}
                dir={editLang === "ar" ? "rtl" : "ltr"}
                value={settings.trustItem3Text[editLang]}
                onChange={(e) => handleTextChange("trustItem3Text", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Zone 6: Social Media Links (Instagram, Facebook, LinkedIn) */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Share2 size={19} style={{ color: "var(--brand-primary)" }} />
              <span>
                {language === "ar"
                  ? "روابط شبكات التواصل الاجتماعي (إنستغرام، فيسبوك، لينكدإن)"
                  : language === "en"
                  ? "Social Links (Instagram, Facebook, LinkedIn)"
                  : "Réseaux Sociaux (Instagram, Facebook, LinkedIn)"}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "1.35rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {SOCIAL_LINK_FIELDS.map((field) => (
              <div key={field.key}>
                <label className={styles.formLabel}>{field.label}</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={field.placeholder}
                  value={settings[field.key]}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={{
              padding: "0.75rem 1.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Save size={17} />
            <span>{isSaving ? ext.saving : ext.saveChanges}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

