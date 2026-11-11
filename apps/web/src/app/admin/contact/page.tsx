"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Type,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Inbox,
  Send,
} from "lucide-react";
import { ContactLocationMap } from "@/components/ContactLocationMap";
import { DEFAULT_CONTACT_SETTINGS } from "@/lib/contactSettingsDefaults";
import {
  ContactMapProvider,
  ContactPageSettings,
  LanguageCode,
  LocalizedText,
} from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import styles from "../admin.module.css";

type LocalizedFieldKey = {
  [K in keyof ContactPageSettings]: ContactPageSettings[K] extends LocalizedText ? K : never;
}[keyof ContactPageSettings];

interface FieldSpec {
  key: LocalizedFieldKey;
  label: string;
  multiline?: boolean;
}

interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const HEADER_AND_DIRECT_FIELDS: FieldSpec[] = [
  { key: "badgeText", label: "Badge d'en-tête" },
  { key: "pageTitle", label: "Titre principal de la page" },
  { key: "pageSubtitle", label: "Sous-titre introductif", multiline: true },
  { key: "directTitle", label: "Titre bloc Coordonnées directes" },
  { key: "phoneLabel", label: "Libellé Téléphone & WhatsApp" },
  { key: "emailLabel", label: "Libellé E-mail" },
  { key: "addressLabel", label: "Libellé Bureaux / Adresse" },
  { key: "addressValue", label: "Valeur Bureaux / Adresse (affichée)" },
  { key: "hoursLabel", label: "Libellé Disponibilité / Horaires" },
  { key: "hoursValue", label: "Valeur Disponibilité / Horaires" },
  { key: "mapTitle", label: "Titre de la carte GPS" },
  { key: "openInMapsLabel", label: "Texte du bouton « Ouvrir dans Maps »" },
];

const FORM_TEXT_FIELDS: FieldSpec[] = [
  { key: "formTitle", label: "Titre du formulaire" },
  { key: "nameLabel", label: "Libellé champ Nom" },
  { key: "namePlaceholder", label: "Placeholder champ Nom" },
  { key: "emailFieldLabel", label: "Libellé champ E-mail" },
  { key: "emailPlaceholder", label: "Placeholder champ E-mail" },
  { key: "subjectLabel", label: "Libellé champ Objet" },
  { key: "subjectPlaceholder", label: "Placeholder champ Objet" },
  { key: "messageLabel", label: "Libellé champ Message" },
  { key: "messagePlaceholder", label: "Placeholder champ Message" },
  { key: "sendBtnText", label: "Bouton Envoyer" },
  { key: "sendingBtnText", label: "Texte pendant l'envoi" },
  { key: "successTitle", label: "Titre message envoyé (succès)" },
  { key: "successDesc", label: "Description message envoyé (succès)", multiline: true },
  { key: "sendAnotherBtnText", label: "Bouton Envoyer un autre message" },
];

export default function AdminContactPage() {
  const { language } = useI18n();
  const [settings, setSettings] = useState<ContactPageSettings>(DEFAULT_CONTACT_SETTINGS);
  const [latInput, setLatInput] = useState(String(DEFAULT_CONTACT_SETTINGS.mapLat));
  const [lngInput, setLngInput] = useState(String(DEFAULT_CONTACT_SETTINGS.mapLng));
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [editLang, setEditLang] = useState<LanguageCode>("fr");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const applySettingsState = (cfg: ContactPageSettings) => {
    setSettings(cfg);
    setLatInput(String(cfg.mapLat));
    setLngInput(String(cfg.mapLng));
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/contact-settings", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("/api/contact", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ])
      .then(([cfg, inbox]) => {
        if (cfg && cfg.pageTitle) applySettingsState(cfg);
        if (Array.isArray(inbox)) setMessages(inbox);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLocalizedChange = (field: LocalizedFieldKey, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [editLang]: value,
      },
    }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/contact-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Erreur lors de la sauvegarde", "error");
        return;
      }
      const updated = await res.json();
      applySettingsState(updated);
      showToast(
        language === "en"
          ? "Contact page settings saved"
          : language === "ar"
          ? "تم حفظ إعدادات صفحة اتصل بنا"
          : "Paramètres de la page Contact enregistrés"
      );
    } catch {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/contact-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const fresh = await res.json();
        applySettingsState(fresh);
        showToast(
          language === "en"
            ? "Defaults restored"
            : language === "ar"
            ? "تمت استعادة الإعدادات الافتراضية"
            : "Valeurs par défaut restaurées"
        );
      }
    } catch {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderLocalizedField = ({ key, label, multiline }: FieldSpec) => (
    <div key={key}>
      <label
        style={{
          display: "block",
          fontSize: "0.82rem",
          fontWeight: 700,
          marginBottom: "0.35rem",
        }}
      >
        {label} ({editLang.toUpperCase()})
      </label>
      {multiline ? (
        <textarea
          rows={2}
          value={settings[key][editLang]}
          onChange={(e) => handleLocalizedChange(key, e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-medium)",
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: "0.88rem",
          }}
        />
      ) : (
        <input
          type="text"
          value={settings[key][editLang]}
          onChange={(e) => handleLocalizedChange(key, e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-medium)",
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: "0.88rem",
          }}
        />
      )}
    </div>
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

      {/* Top Header */}
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
            {language === "ar"
              ? "إعدادات صفحة اتصل بنا"
              : language === "en"
              ? "Contact Page Settings"
              : "Paramétrage Page Contactez-nous"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {language === "ar"
              ? "عدّل جميع البيانات والنصوص وموقع الخريطة في صفحة اتصل بنا."
              : language === "en"
              ? "Customize all contact details, GPS map location, and localized texts shown on /contact."
              : "Modifiez toutes les coordonnées directes, la carte GPS, le lien Maps et tous les textes FR / EN / AR de /contact."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          <Link
            href="/contact"
            target="_blank"
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            <ExternalLink size={15} />
            <span>
              {language === "ar"
                ? "معاينة صفحة اتصل بنا"
                : language === "en"
                ? "Open /contact"
                : "Voir la page /contact"}
            </span>
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

      <form onSubmit={handleSaveAll} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Coordinates & Map Card */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <MapPin size={19} style={{ color: "var(--brand-primary)" }} />
              <span>Coordonnées directes & Carte GPS (Section Coordonnées directes)</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, showMap: !prev.showMap }))}
              className={settings.showMap ? "btn btn-secondary" : "btn btn-primary"}
              style={{
                padding: "0.4rem 0.85rem",
                fontSize: "0.8rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {settings.showMap ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{settings.showMap ? "Carte affichée" : "Carte masquée"}</span>
            </button>
          </div>

          <div
            style={{
              padding: "1.35rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.35rem",
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: "0.95rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                  Téléphone & WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.phoneValue}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phoneValue: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                  E-mail de contact
                </label>
                <input
                  type="email"
                  value={settings.emailValue}
                  onChange={(e) => setSettings((prev) => ({ ...prev, emailValue: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.7fr", gap: "0.65rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Latitude
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={latInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setLatInput(raw);
                      const parsed = parseFloat(raw);
                      if (Number.isFinite(parsed)) {
                        setSettings((prev) => ({ ...prev, mapLat: parsed }));
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Longitude
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={lngInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setLngInput(raw);
                      const parsed = parseFloat(raw);
                      if (Number.isFinite(parsed)) {
                        setSettings((prev) => ({ ...prev, mapLng: parsed }));
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Zoom (2-19)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={19}
                    value={settings.mapZoom}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        mapZoom: Number.isFinite(parseInt(e.target.value, 10))
                          ? parseInt(e.target.value, 10)
                          : 14,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Fournisseur de carte
                  </label>
                  <select
                    value={settings.mapProvider}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        mapProvider: e.target.value as ContactMapProvider,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.58rem 0.7rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="openstreetmap">OpenStreetMap</option>
                    <option value="google">Google Maps Embed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Requête adresse (fallback)
                  </label>
                  <input
                    type="text"
                    value={settings.mapAddressQuery}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, mapAddressQuery: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Lien externe Maps personnalisé (optionnel)
                </label>
                <input
                  type="url"
                  placeholder="Laisser vide pour utiliser https://www.google.com/maps/search/?api=1&query=lat,lng"
                  value={settings.mapExternalUrl}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, mapExternalUrl: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "0.58rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
            </div>

            {/* Live Map Preview */}
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Aperçu en direct de la carte ({editLang.toUpperCase()})
              </div>
              {settings.showMap ? (
                <ContactLocationMap
                  title={settings.mapTitle[editLang]}
                  addressQuery={settings.mapAddressQuery}
                  lat={settings.mapLat}
                  lng={settings.mapLng}
                  zoom={settings.mapZoom}
                  provider={settings.mapProvider}
                  externalUrl={settings.mapExternalUrl}
                  openInMapsLabel={settings.openInMapsLabel[editLang]}
                  height={235}
                />
              ) : (
                <div
                  style={{
                    height: 235,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                  }}
                >
                  Carte désactivée (cliquez sur « Carte masquée » pour l&apos;activer)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Language Selector Bar for Editable Texts */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Type size={19} style={{ color: "var(--brand-primary)" }} />
              <span>Langue des textes édités (FR / EN / AR)</span>
            </div>
            <div style={{ display: "flex", gap: "0.45rem" }}>
              {(["fr", "en", "ar"] as LanguageCode[]).map((langCode) => (
                <button
                  key={langCode}
                  type="button"
                  onClick={() => setEditLang(langCode)}
                  className={editLang === langCode ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ padding: "0.35rem 0.78rem", fontSize: "0.8rem" }}
                >
                  {langCode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Header + Direct Contact Texts */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Mail size={19} style={{ color: "var(--brand-primary)" }} />
              <span>Textes En-tête & Coordonnées directes ({editLang.toUpperCase()})</span>
            </div>
          </div>
          <div
            style={{
              padding: "1.35rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {HEADER_AND_DIRECT_FIELDS.map(renderLocalizedField)}
          </div>
        </div>

        {/* Form & Success Texts */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Send size={19} style={{ color: "var(--brand-primary)" }} />
              <span>Textes du Formulaire & Confirmation ({editLang.toUpperCase()})</span>
            </div>
          </div>
          <div
            style={{
              padding: "1.35rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {FORM_TEXT_FIELDS.map(renderLocalizedField)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.6rem",
              fontSize: "0.95rem",
            }}
          >
            {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            <span>Enregistrer la page Contact</span>
          </button>
        </div>
      </form>

      {/* Received Contact Inquiries Summary */}
      <div className={styles.adminCard} style={{ marginTop: "1.75rem" }}>
        <div className={styles.adminCardHeader}>
          <div className={styles.cardTitle}>
            <Inbox size={19} style={{ color: "var(--brand-primary)" }} />
            <span>Messages reçus ({messages.length})</span>
          </div>
        </div>
        <div style={{ padding: "1.25rem" }}>
          {messages.length === 0 ? (
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Aucun message reçu pour le moment.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {messages.slice(0, 10).map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {msg.name} ({msg.email})
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--brand-primary)", marginBottom: "0.25rem" }}>
                    {msg.subject}
                  </div>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
