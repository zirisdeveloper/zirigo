"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { useAuth } from "@/lib/authContext";
import { usePreferences } from "@/lib/preferencesContext";

function ConnexionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const redirectParam = searchParams.get("redirect") || "/espace-perso";
  const modeParam = searchParams.get("mode") === "register" ? "register" : "login";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectParam);
    }
  }, [isLoading, user, redirectParam, router]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1rem",
        background:
          "radial-gradient(circle at top right, rgba(13, 148, 136, 0.08), transparent 45%), var(--bg-primary)",
      }}
    >
      <AuthPanel redirectTo={redirectParam} initialMode={modeParam} />
    </div>
  );
}

export default function ConnexionPage() {
  const { currency, setCurrency } = usePreferences();

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        favoriteCount={0}
        compareCount={0}
        onOpenCompare={() => {}}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <Suspense
        fallback={
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
            Chargement...
          </div>
        }
      >
        <ConnexionContent />
      </Suspense>

      <Footer />
    </main>
  );
}

