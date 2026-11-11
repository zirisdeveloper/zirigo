"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { InfoPageShell } from "@/components/InfoPageShell";
import { ContactLocationMap } from "@/components/ContactLocationMap";
import { DEFAULT_CONTACT_SETTINGS } from "@/lib/contactSettingsDefaults";
import { ContactPageSettings, LocalizedText } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { language } = useI18n();
  const [settings, setSettings] = useState<ContactPageSettings>(DEFAULT_CONTACT_SETTINGS);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contact-settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.pageTitle) {
          setSettings(data);
        }
      })
      .catch(() => {
        // fallback cleanly to DEFAULT_CONTACT_SETTINGS
      });
  }, []);

  const pick = (block: LocalizedText): string =>
    block?.[language] || block?.fr || block?.en || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error || "Erreur lors de l'envoi.");
        return;
      }
      setSentSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setErrorMsg("Erreur réseau.");
    } finally {
      setIsSending(false);
    }
  };

  const phoneHref = `tel:${settings.phoneValue.replace(/[^\d+]/g, "")}`;

  return (
    <InfoPageShell
      title={pick(settings.pageTitle)}
      subtitle={pick(settings.pageSubtitle)}
      badge={pick(settings.badgeText)}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}
      >
        {/* Coordinates + Map */}
        <div
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.1rem",
          }}
        >
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
            {pick(settings.directTitle)}
          </h2>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <Phone size={18} style={{ color: "var(--brand-primary)", marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                {pick(settings.phoneLabel)}
              </div>
              <a
                href={phoneHref}
                style={{ fontWeight: 700, fontSize: "0.95rem", color: "inherit", textDecoration: "none" }}
              >
                {settings.phoneValue}
              </a>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <Mail size={18} style={{ color: "var(--brand-primary)", marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                {pick(settings.emailLabel)}
              </div>
              <a
                href={`mailto:${settings.emailValue}`}
                style={{ fontWeight: 700, fontSize: "0.95rem", color: "inherit", textDecoration: "none" }}
              >
                {settings.emailValue}
              </a>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <MapPin size={18} style={{ color: "var(--brand-primary)", marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                {pick(settings.addressLabel)}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {pick(settings.addressValue)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <Clock size={18} style={{ color: "var(--brand-primary)", marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                {pick(settings.hoursLabel)}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {pick(settings.hoursValue)}
              </div>
            </div>
          </div>

          {settings.showMap && (
            <ContactLocationMap
              title={pick(settings.mapTitle)}
              addressQuery={settings.mapAddressQuery}
              lat={settings.mapLat}
              lng={settings.mapLng}
              zoom={settings.mapZoom}
              provider={settings.mapProvider}
              externalUrl={settings.mapExternalUrl}
              openInMapsLabel={pick(settings.openInMapsLabel)}
            />
          )}
        </div>

        {/* Contact Form */}
        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>
            {pick(settings.formTitle)}
          </h2>

          {sentSuccess ? (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-md)",
                background: "var(--deal-green-bg)",
                border: "1px solid var(--deal-green-border)",
                color: "var(--deal-green)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                <CheckCircle2 size={20} />
                <span>{pick(settings.successTitle)}</span>
              </div>
              <p style={{ marginTop: "0.4rem", fontSize: "0.9rem" }}>
                {pick(settings.successDesc)}
              </p>
              <button
                type="button"
                onClick={() => setSentSuccess(false)}
                className="btn btn-secondary"
                style={{ marginTop: "1rem", padding: "0.5rem 0.95rem", fontSize: "0.85rem" }}
              >
                {pick(settings.sendAnotherBtnText)}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.9rem" }}>
              {errorMsg && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--alert-red-bg)",
                    color: "var(--alert-red)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  {pick(settings.nameLabel)}
                </label>
                <input
                  type="text"
                  required
                  placeholder={pick(settings.namePlaceholder)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  {pick(settings.emailFieldLabel)}
                </label>
                <input
                  type="email"
                  required
                  placeholder={pick(settings.emailPlaceholder)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  {pick(settings.subjectLabel)}
                </label>
                <input
                  type="text"
                  placeholder={pick(settings.subjectPlaceholder)}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  {pick(settings.messageLabel)}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={pick(settings.messagePlaceholder)}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.4rem",
                }}
              >
                <Send size={16} />
                <span>{isSending ? pick(settings.sendingBtnText) : pick(settings.sendBtnText)}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </InfoPageShell>
  );
}
