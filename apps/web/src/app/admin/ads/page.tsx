"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { AdBanner, AdPlacement } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import styles from "../admin.module.css";

interface AdFormState {
  id?: string;
  placement: AdPlacement;
  brandName: string;
  badgeFr: string;
  badgeEn: string;
  badgeAr: string;
  titleFr: string;
  titleEn: string;
  titleAr: string;
  subtitleFr: string;
  subtitleEn: string;
  subtitleAr: string;
  ctaFr: string;
  ctaEn: string;
  ctaAr: string;
  contactOrPromo: string;
  imageUrl: string;
  targetUrl: string;
  filterType: string;
  accentColor: string;
  order: number;
  isFullArtwork: boolean;
  isActive: boolean;
}

const EMPTY_FORM: AdFormState = {
  placement: "main",
  brandName: "",
  badgeFr: "Publicité",
  badgeEn: "Sponsored",
  badgeAr: "إعلان ممول",
  titleFr: "",
  titleEn: "",
  titleAr: "",
  subtitleFr: "",
  subtitleEn: "",
  subtitleAr: "",
  ctaFr: "Découvrir",
  ctaEn: "Explore",
  ctaAr: "اكتشف",
  contactOrPromo: "",
  imageUrl: "/images/ads/ad-villa-escape.jpg",
  targetUrl: "/?type=villa#catalog",
  filterType: "none",
  accentColor: "#0d9488",
  order: 1,
  isFullArtwork: false,
  isActive: true,
};

export default function AdminAdsPage() {
  const { language, ext } = useI18n();
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ads?all=true");
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, order: ads.length + 1 });
    setShowForm(true);
  };

  const openEdit = (adItem: AdBanner) => {
    setForm({
      id: adItem.id,
      placement: adItem.placement,
      brandName: adItem.brandName,
      badgeFr: adItem.badgeText.fr,
      badgeEn: adItem.badgeText.en,
      badgeAr: adItem.badgeText.ar,
      titleFr: adItem.title.fr,
      titleEn: adItem.title.en,
      titleAr: adItem.title.ar,
      subtitleFr: adItem.subtitle.fr,
      subtitleEn: adItem.subtitle.en,
      subtitleAr: adItem.subtitle.ar,
      ctaFr: adItem.ctaText.fr,
      ctaEn: adItem.ctaText.en,
      ctaAr: adItem.ctaText.ar,
      contactOrPromo: adItem.contactOrPromo || "",
      imageUrl: adItem.imageUrl,
      targetUrl: adItem.targetUrl,
      filterType: adItem.filterType || "none",
      accentColor: adItem.accentColor || "#0d9488",
      order: adItem.order,
      isFullArtwork: Boolean(adItem.isFullArtwork),
      isActive: adItem.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      placement: form.placement,
      brandName: form.brandName.trim() || "Zirigo Partner",
      badgeText: {
        fr: form.badgeFr || "Publicité",
        en: form.badgeEn || form.badgeFr || "Sponsored",
        ar: form.badgeAr || form.badgeFr || "إعلان",
      },
      title: {
        fr: form.titleFr,
        en: form.titleEn || form.titleFr,
        ar: form.titleAr || form.titleFr,
      },
      subtitle: {
        fr: form.subtitleFr,
        en: form.subtitleEn || form.subtitleFr,
        ar: form.subtitleAr || form.subtitleFr,
      },
      ctaText: {
        fr: form.ctaFr || "Découvrir",
        en: form.ctaEn || form.ctaFr || "Explore",
        ar: form.ctaAr || form.ctaFr || "اكتشف",
      },
      contactOrPromo: form.contactOrPromo.trim(),
      imageUrl: form.imageUrl.trim() || "/images/ads/ad-villa-escape.jpg",
      targetUrl: form.targetUrl.trim() || "#catalog",
      filterType: form.filterType === "none" ? undefined : form.filterType,
      accentColor: form.accentColor || "#0d9488",
      order: Number(form.order) || 1,
      isFullArtwork: form.isFullArtwork,
      isActive: form.isActive,
    };

    try {
      const url = form.id ? `/api/ads/${form.id}` : "/api/ads";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Erreur", "error");
        return;
      }
      showToast(form.id ? "Publicité mise à jour" : "Publicité créée");
      setShowForm(false);
      await loadAds();
    } catch {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (adItem: AdBanner) => {
    try {
      const res = await fetch(`/api/ads/${adItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !adItem.isActive }),
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((a) => (a.id === adItem.id ? { ...a, isActive: !a.isActive } : a))
        );
        showToast(!adItem.isActive ? "Bannière activée" : "Bannière masquée");
      }
    } catch {
      showToast("Erreur", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a.id !== id));
        showToast("Publicité supprimée");
      }
    } catch {
      showToast("Erreur", "error");
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        await loadAds();
        showToast("Bannières par défaut restaurées");
      }
    } catch {
      showToast("Erreur", "error");
    }
  };

  const pageTitle =
    language === "ar"
      ? "إدارة الإعلانات والبنرات"
      : language === "en"
      ? "Ads & Banners Management"
      : "Gestion des Publicités & Bannières";

  const pageSub =
    language === "ar"
      ? "إدارة مساحة الإعلانات الرئيسية والجانبية المعروضة أعلى الصفحة الرئيسية."
      : language === "en"
      ? "Configure the main carousel banners and side partner ad displayed below the header."
      : "Gérez les bannières du carrousel principal et l'encart latéral affichés sous le header.";

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
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            <RotateCcw size={15} />
            <span>{language === "ar" ? "استعادة الافتراضي" : language === "en" ? "Restore defaults" : "Restaurer"}</span>
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            <Plus size={16} />
            <span>{language === "ar" ? "إعلان جديد" : language === "en" ? "New Banner" : "Nouvelle bannière"}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className={styles.adminCard} style={{ marginBottom: "1.75rem" }}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Megaphone size={18} style={{ color: "var(--brand-primary)" }} />
              <span>
                {form.id
                  ? language === "en"
                    ? "Edit Advertising Banner"
                    : "Modifier la bannière publicitaire"
                  : language === "en"
                  ? "Create Advertising Banner"
                  : "Créer une bannière publicitaire"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ color: "var(--text-muted)", padding: "0.3rem" }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className={styles.formLabel}>Emplacement / Placement</label>
                <select
                  className={styles.formSelect}
                  value={form.placement}
                  onChange={(e) => setForm({ ...form, placement: e.target.value as AdPlacement })}
                >
                  <option value="main">Bannière principale (Gauche - Carrousel)</option>
                  <option value="side">Encart compagnon (Droite)</option>
                </select>
              </div>

              <div>
                <label className={styles.formLabel}>Annonceur / Marque *</label>
                <input
                  required
                  className={styles.formInput}
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="Ex: Zirigo Prestige"
                />
              </div>

              <div>
                <label className={styles.formLabel}>Filtre catégorie au clic</label>
                <select
                  className={styles.formSelect}
                  value={form.filterType}
                  onChange={(e) => setForm({ ...form, filterType: e.target.value })}
                >
                  <option value="none">Lien direct (targetUrl uniquement)</option>
                  <option value="hotel">Hôtels (hotel)</option>
                  <option value="apartment">Appartements (apartment)</option>
                  <option value="villa">Villas (villa)</option>
                  <option value="chalet">Chalets (chalet)</option>
                  <option value="resort">Resorts & Spa (resort)</option>
                  <option value="dormitory">Dortoirs (dormitory)</option>
                </select>
              </div>

              <div>
                <label className={styles.formLabel}>Ordre d&apos;affichage</label>
                <input
                  type="number"
                  min={1}
                  className={styles.formInput}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className={styles.formLabel}>Titre (FR) *</label>
                <input
                  required
                  className={styles.formInput}
                  value={form.titleFr}
                  onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Titre (EN)</label>
                <input
                  className={styles.formInput}
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Titre (AR)</label>
                <input
                  dir="rtl"
                  className={styles.formInput}
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className={styles.formLabel}>Sous-titre (FR)</label>
                <input
                  className={styles.formInput}
                  value={form.subtitleFr}
                  onChange={(e) => setForm({ ...form, subtitleFr: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Bouton CTA (FR)</label>
                <input
                  className={styles.formInput}
                  value={form.ctaFr}
                  onChange={(e) => setForm({ ...form, ctaFr: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Code promo / Contact affiché</label>
                <input
                  className={styles.formInput}
                  value={form.contactOrPromo}
                  onChange={(e) => setForm({ ...form, contactOrPromo: e.target.value })}
                  placeholder="PROMO ZIRIGO25 · 0550 77 48 55"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className={styles.formLabel}>URL de l&apos;image *</label>
                <input
                  required
                  className={styles.formInput}
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.formLabel}>URL de destination</label>
                <input
                  className={styles.formInput}
                  value={form.targetUrl}
                  onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Couleur d&apos;accent</label>
                <input
                  type="color"
                  className={styles.formInput}
                  style={{ height: "42px", padding: "0.25rem" }}
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <span>Bannière active sur l&apos;accueil</span>
              </label>

              <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={form.isFullArtwork}
                  onChange={(e) => setForm({ ...form, isFullArtwork: e.target.checked })}
                />
                <span>Image prête avec texte intégré (masquer la surimpression)</span>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                {ext.cancel}
              </button>
              <button type="submit" disabled={isSaving} className="btn btn-primary">
                {isSaving ? ext.saving : ext.saveChanges}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.adminCard}>
        <div className={styles.adminCardHeader}>
          <div className={styles.cardTitle}>
            <Megaphone size={19} style={{ color: "var(--brand-primary)" }} />
            <span>
              {ads.length} bannière(s) configurée(s)
            </span>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <Loader2 size={26} className="animate-spin" style={{ margin: "0 auto" }} />
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Aperçu</th>
                  <th>Annonceur & Titre</th>
                  <th>Position</th>
                  <th>Action clic</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((adItem) => (
                  <tr key={adItem.id}>
                    <td>
                      <img
                        src={adItem.imageUrl}
                        alt={adItem.brandName}
                        style={{
                          width: 92,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{adItem.brandName}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {adItem.title[language] || adItem.title.fr}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          backgroundColor:
                            adItem.placement === "main"
                              ? "rgba(13, 148, 136, 0.12)"
                              : "rgba(59, 130, 246, 0.12)",
                          color: adItem.placement === "main" ? "var(--brand-primary)" : "#2563eb",
                        }}
                      >
                        {adItem.placement === "main" ? "Principale" : "Latérale"} #{adItem.order}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      {adItem.filterType ? `Filtre: ${adItem.filterType}` : adItem.targetUrl}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleActive(adItem)}
                        className="btn btn-secondary"
                        style={{
                          padding: "0.3rem 0.65rem",
                          fontSize: "0.78rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: adItem.isActive ? "var(--deal-green)" : "var(--text-muted)",
                        }}
                      >
                        {adItem.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        <span>{adItem.isActive ? "Active" : "Masquée"}</span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.45rem" }}>
                        <button
                          type="button"
                          onClick={() => openEdit(adItem)}
                          className="btn btn-secondary"
                          style={{ padding: "0.35rem 0.6rem" }}
                          title={ext.edit}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(adItem.id)}
                          className="btn btn-secondary"
                          style={{ padding: "0.35rem 0.6rem", color: "var(--alert-red)" }}
                          title={ext.delete}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
