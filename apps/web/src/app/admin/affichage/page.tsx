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
  Hotel,
  Building2,
  Home,
  Trees,
  Umbrella,
  BedDouble,
  Landmark,
} from "lucide-react";
import {
  DisplaySettings,
  EnabledPropertyTypes,
  LanguageCode,
  LocalizedText,
  Property,
  PropertyType,
} from "@/lib/types";
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

const PROPERTY_TYPE_CONFIG: {
  key: PropertyType;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: Record<LanguageCode, string>;
  desc: Record<LanguageCode, string>;
}[] = [
  {
    key: "hotel",
    icon: Hotel,
    title: {
      fr: "Hôtels",
      en: "Hotels",
      ar: "فنادق",
    },
    desc: {
      fr: "Hôtels de charme, boutique-hôtels et résidences",
      en: "Boutique hotels, luxury hotels, and serviced residences",
      ar: "فنادق مميزة، فنادق بوتيك وإقامات فندقية",
    },
  },
  {
    key: "apartment",
    icon: Building2,
    title: {
      fr: "Appartements",
      en: "Apartments",
      ar: "شقق",
    },
    desc: {
      fr: "Appartements urbains, studios, duplex et lofts modernes",
      en: "City apartments, studios, duplexes, and modern lofts",
      ar: "شقق عصرية، استوديوهات ومساكن حضرية",
    },
  },
  {
    key: "villa",
    icon: Home,
    title: {
      fr: "Villas",
      en: "Villas",
      ar: "فيلات",
    },
    desc: {
      fr: "Villas de prestige avec piscine et propriétés d'exception",
      en: "Prestige villas with pools and luxury private estates",
      ar: "فيلات راقية مع مسابح وممتلكات استثنائية",
    },
  },
  {
    key: "chalet",
    icon: Trees,
    title: {
      fr: "Chalets",
      en: "Chalets",
      ar: "شاليهات",
    },
    desc: {
      fr: "Chalets alpins, refuges de montagne et séjours nature",
      en: "Alpine chalets, mountain lodges, and nature retreats",
      ar: "شاليهات جبلية وإقامات طبيعية هادئة",
    },
  },
  {
    key: "resort",
    icon: Umbrella,
    title: {
      fr: "Resorts & Spa",
      en: "Resorts & Spa",
      ar: "منتجعات وسبا",
    },
    desc: {
      fr: "Complexes hôteliers tout compris, thalasso et détente",
      en: "All-inclusive resorts, spa retreats, and wellness stays",
      ar: "منتجعات سياحية متكاملة، استجمام وسبا",
    },
  },
  {
    key: "dormitory",
    icon: BedDouble,
    title: {
      fr: "Dortoirs",
      en: "Dormitories",
      ar: "مهاجع",
    },
    desc: {
      fr: "Auberges de jeunesse, dortoirs et hébergements partagés",
      en: "Youth hostels, dormitories, and shared accommodations",
      ar: "نزل شباب، مهاجع وإقامات مشتركة اقتصادية",
    },
  },
  {
    key: "complex",
    icon: Landmark,
    title: {
      fr: "Complexes",
      en: "Complexes",
      ar: "مجمعات سياحية",
    },
    desc: {
      fr: "Complexes touristiques, villages vacances et centres balnéaires",
      en: "Tourist complexes, holiday villages, and multi-amenity seaside compounds",
      ar: "مجمعات سياحية وترفيهية، قرى العطلات ومراكز الاستجمام",
    },
  },
];

export default function AdminAffichagePage() {
  const { language, ext } = useI18n();
  const { refreshDisplaySettings } = useDisplaySettings();
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [propertyCounts, setPropertyCounts] = useState<Record<string, number>>({});
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

    fetch("/api/properties?all=true")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Property[]) => {
        if (Array.isArray(data)) {
          const counts: Record<string, number> = {};
          data.forEach((p) => {
            counts[p.type] = (counts[p.type] || 0) + 1;
          });
          setPropertyCounts(counts);
        }
      })
      .catch(() => {});
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

  const handleTogglePropertyType = async (typeKey: PropertyType) => {
    const currentTypes =
      settings.enabledPropertyTypes || DEFAULT_DISPLAY_SETTINGS.enabledPropertyTypes;
    const nextVal = !currentTypes[typeKey];
    const nextTypes: EnabledPropertyTypes = { ...currentTypes, [typeKey]: nextVal };
    setSettings((prev) => ({
      ...prev,
      enabledPropertyTypes: nextTypes,
    }));
    const cfg = PROPERTY_TYPE_CONFIG.find((c) => c.key === typeKey);
    const label = cfg?.title[language] || typeKey;
    const ok = await persistPatch(
      { enabledPropertyTypes: nextTypes },
      nextVal
        ? language === "en"
          ? `${label} enabled on site`
          : language === "ar"
          ? `تم تفعيل ${label} على الموقع`
          : `${label} activé(s) sur le site`
        : language === "en"
          ? `${label} disabled on site`
          : language === "ar"
          ? `تم تعطيل ${label} من الموقع`
          : `${label} désactivé(s) du site`
    );
    if (!ok) {
      setSettings((prev) => ({
        ...prev,
        enabledPropertyTypes: currentTypes,
      }));
    }
  };

  const handleToggleAllTypes = async (enableAll: boolean) => {
    const nextTypes: EnabledPropertyTypes = {
      hotel: enableAll,
      apartment: enableAll,
      villa: enableAll,
      chalet: enableAll,
      resort: enableAll,
      dormitory: enableAll,
      complex: enableAll,
    };
    setSettings((prev) => ({ ...prev, enabledPropertyTypes: nextTypes }));
    await persistPatch(
      { enabledPropertyTypes: nextTypes },
      enableAll
        ? language === "en"
          ? "All accommodation types enabled"
          : language === "ar"
          ? "تم تفعيل جميع أنواع الإقامة"
          : "Tous les types d'hébergement ont été activés"
        : language === "en"
          ? "All accommodation types disabled"
          : language === "ar"
          ? "تم تعطيل جميع أنواع الإقامة"
          : "Tous les types d'hébergement ont été désactivés"
    );
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

      {/* Accommodation & Booking Types Visibility Card */}
      <div className={styles.adminCard} style={{ marginBottom: "1.75rem" }}>
        <div className={styles.adminCardHeader}>
          <div className={styles.cardTitle}>
            <Building2 size={20} style={{ color: "var(--brand-primary)" }} />
            <span>
              {language === "ar"
                ? "أنواع الحجز والإقامة المعروضة على الموقع"
                : language === "en"
                ? "Accommodation & Booking Types Displayed on Site"
                : "Types de réservation & d'hébergement à afficher sur le site"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                marginRight: "0.5rem",
              }}
            >
              {Object.values(settings.enabledPropertyTypes || {}).filter(Boolean).length} /{" "}
              {PROPERTY_TYPE_CONFIG.length}{" "}
              {language === "ar" ? "نشط" : language === "en" ? "active" : "actifs"}
            </span>
            <button
              type="button"
              onClick={() => handleToggleAllTypes(true)}
              className="btn btn-secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
            >
              {language === "ar" ? "تفعيل الكل" : language === "en" ? "Enable All" : "Tout activer"}
            </button>
            <button
              type="button"
              onClick={() => handleToggleAllTypes(false)}
              className="btn btn-secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
            >
              {language === "ar"
                ? "تعطيل الكل"
                : language === "en"
                ? "Disable All"
                : "Tout désactiver"}
            </button>
          </div>
        </div>

        <div style={{ padding: "1.25rem 1.35rem" }}>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              marginBottom: "1.25rem",
            }}
          >
            {language === "ar"
              ? "اختر أنواع الإقامة النشطة والمعروضة في المنصة (فنادق، شقق، فيلات، شاليهات، منتجعات وسبا، مهاجع). الأنواع المعطلة ستُخفى تلقائياً من شريط الأيقونات وفلاتر البحث والقائمة الجانبية وقائمة الإعلانات."
              : language === "en"
              ? "Select which booking types are active and displayed on the platform (hotels, apartments, villas, chalets, resorts & spa, dormitories). Disabled types will be automatically hidden from category strips, search filters, the menu drawer, and the public catalog."
              : "Choisissez les types d'hébergement actifs et visibles sur le site (hôtels, appartements, villas, chalets, resorts & spa, dortoirs). Les types désactivés sont automatiquement masqués du bandeau d'icônes, des filtres de recherche, du menu latéral et du catalogue public."}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: "1rem",
            }}
          >
            {PROPERTY_TYPE_CONFIG.map((item) => {
              const isEnabled =
                settings.enabledPropertyTypes?.[item.key] ??
                DEFAULT_DISPLAY_SETTINGS.enabledPropertyTypes[item.key];
              const IconComp = item.icon;
              const count = propertyCounts[item.key] ?? 0;

              return (
                <div
                  key={item.key}
                  style={{
                    border: isEnabled
                      ? "1px solid var(--border-medium)"
                      : "1px dashed var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem 1.15rem",
                    backgroundColor: isEnabled ? "var(--bg-primary)" : "var(--bg-muted)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.85rem",
                    transition: "all 0.2s ease",
                    opacity: isEnabled ? 1 : 0.65,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--radius-md)",
                        backgroundColor: isEnabled
                          ? "rgba(13, 148, 136, 0.12)"
                          : "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <IconComp
                        size={22}
                        style={{
                          color: isEnabled ? "var(--brand-primary)" : "var(--text-muted)",
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          marginBottom: "0.2rem",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            margin: 0,
                          }}
                        >
                          {item.title[language]}
                        </h3>
                        {renderVisibilityBadge(isEnabled)}
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.35,
                          margin: 0,
                        }}
                      >
                        {item.desc[language]}
                      </p>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: "0.35rem",
                          fontWeight: 600,
                        }}
                      >
                        {count}{" "}
                        {language === "ar"
                          ? "إعلان مسجل"
                          : language === "en"
                          ? count > 1
                            ? "listings in database"
                            : "listing in database"
                          : count > 1
                          ? "annonces dans la base"
                          : "annonce dans la base"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      borderTop: "1px solid var(--border-subtle)",
                      paddingTop: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleTogglePropertyType(item.key)}
                      className={isEnabled ? "btn btn-secondary" : "btn btn-primary"}
                      style={{
                        padding: "0.45rem 0.95rem",
                        fontSize: "0.82rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontWeight: 700,
                      }}
                    >
                      {isEnabled ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>
                        {isEnabled
                          ? language === "en"
                            ? `Disable ${item.title[language]}`
                            : language === "ar"
                            ? `تعطيل ${item.title[language]}`
                            : `Désactiver ${item.title[language]}`
                          : language === "en"
                            ? `Enable ${item.title[language]}`
                            : language === "ar"
                            ? `تفعيل ${item.title[language]}`
                            : `Activer ${item.title[language]}`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

