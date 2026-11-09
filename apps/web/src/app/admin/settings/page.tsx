"use client";

import React, { useState } from "react";
import {
  Settings,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
  ShieldCheck,
  Server,
  Layers,
} from "lucide-react";
import styles from "../admin.module.css";

export default function AdminSettingsPage() {
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportJSON = async () => {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const data = await res.json();
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data, null, 2)
        )}`;
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", jsonString);
        downloadAnchor.setAttribute("download", `zirigo-properties-${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Catalogue d'annonces exporté avec succès !");
      }
    } catch {
      showToast("Échec de l'exportation", "error");
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/properties/reset", {
        method: "POST",
      });
      if (res.ok) {
        showToast("Toutes les données ont été réinitialisées aux valeurs démo d'origine !");
        setShowResetModal(false);
      } else {
        showToast("Échec de la réinitialisation", "error");
      }
    } catch {
      showToast("Erreur lors de la réinitialisation", "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div
            className={`${styles.toast} ${
              toastMessage.type === "success" ? styles.toastSuccess : styles.toastError
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

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  backgroundColor: "var(--alert-red-bg)",
                  color: "var(--alert-red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Confirmer la réinitialisation</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Cette action remplacera toutes les annonces actuelles par les 6 hébergements d'origine.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                onClick={() => setShowResetModal(false)}
                className="btn btn-secondary"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                Annuler
              </button>
              <button
                onClick={handleResetData}
                disabled={isResetting}
                style={{
                  padding: "0.6rem 1.25rem",
                  backgroundColor: "var(--alert-red)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isResetting ? "Réinitialisation..." : "Réinitialiser les données"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Paramètres & Gestion des Données
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
          Sauvegardez vos données, gérez la persistance et configurez la plateforme.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Backup & Export */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Download size={20} style={{ color: "var(--brand-primary)" }} />
              <span>Export & Sauvegarde JSON</span>
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Téléchargez l'intégralité du catalogue des annonces d'hébergement au format JSON pour vos sauvegardes ou intégrations tierces.
            </p>
            <button
              onClick={handleExportJSON}
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={16} />
              <span>Télécharger le catalogue (.json)</span>
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className={styles.adminCard}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <RotateCcw size={20} style={{ color: "var(--alert-red)" }} />
              <span>Réinitialisation d'usine</span>
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Restaurez les 6 annonces de démonstration initiales (Villa Cassis, Loft Le Marais, Chalet Chamonix, etc.).
            </p>
            <button
              onClick={() => setShowResetModal(true)}
              className="btn btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--alert-red)",
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <RotateCcw size={16} />
              <span>Réinitialiser les données démo</span>
            </button>
          </div>
        </div>

        {/* System info */}
        <div className={styles.adminCard} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.adminCardHeader}>
            <div className={styles.cardTitle}>
              <Server size={20} style={{ color: "var(--brand-primary)" }} />
              <span>Architecture & Stockage Dynamique</span>
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div style={{ backgroundColor: "var(--bg-muted)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Moteur Serveur
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.25rem" }}>Next.js 15 App Router</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-muted)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Stockage Persistant
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.25rem" }}>JSON Store + Drizzle Schema</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-muted)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Mode de Rendu
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.25rem" }}>Hybride SSR / Client Dynamique</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-muted)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Sécurité & Rôles
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.25rem" }}>Super Admin Actif</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
