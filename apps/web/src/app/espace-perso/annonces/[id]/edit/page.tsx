"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { Property } from "@/lib/types";
import styles from "../../espacePerso.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EspacePersoEditPropertyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/espace-perso/properties/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        } else {
          const errData = await res.json();
          setError(errData.error || "Annonce introuvable ou accès refusé.");
        }
      } catch {
        setError("Erreur lors du chargement.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "0.75rem" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
        <span>Chargement de votre annonce...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.sectionCard} style={{ padding: "3rem", textAlign: "center" }}>
        <AlertCircle size={42} style={{ color: "var(--alert-red)", margin: "0 auto 1rem" }} />
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          {error || "Annonce introuvable"}
        </h2>
        <Link href="/espace-perso/annonces" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>
          Retour à mes annonces
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PropertyForm initialData={property} isEdit={true} mode="user" />
    </div>
  );
}

