"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { Property } from "@/lib/types";
import styles from "../../../admin.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetch(`/api/properties/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        } else {
          setError("Impossible de trouver l'annonce spécifiée.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion lors du chargement de l'annonce.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "1rem" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
        <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Chargement des informations de l'annonce...
        </span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.adminCard} style={{ padding: "3rem", textAlign: "center" }}>
        <AlertCircle size={48} style={{ color: "var(--alert-red)", margin: "0 auto 1rem" }} />
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          {error || "Annonce introuvable"}
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          L'annonce demandée n'existe pas ou a été supprimée.
        </p>
        <Link href="/admin/properties" className="btn btn-primary">
          Retour à la liste des annonces
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PropertyForm initialData={property} isEdit={true} />
    </div>
  );
}

