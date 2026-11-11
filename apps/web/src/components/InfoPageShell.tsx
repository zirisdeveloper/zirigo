"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useI18n } from "../lib/i18n";
import { usePreferences } from "../lib/preferencesContext";

interface InfoPageShellProps {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
}

export function InfoPageShell({ title, subtitle, badge, children }: InfoPageShellProps) {
  const { t, isRTL } = useI18n();
  const { currency, setCurrency } = usePreferences();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        favoriteCount={0}
        compareCount={0}
        onOpenCompare={() => {}}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <main style={{ flex: 1, padding: "2.5rem 0 4rem", backgroundColor: "var(--bg-primary)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "var(--brand-primary)",
              marginBottom: "1.25rem",
            }}
          >
            <ArrowLeft
              size={16}
              style={isRTL ? { transform: "rotate(180deg)" } : undefined}
            />
            <span>{t.home}</span>
          </Link>

          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {badge && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "rgba(13, 148, 136, 0.12)",
                  color: "var(--brand-primary)",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                }}
              >
                {badge}
              </span>
            )}
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.6,
                marginTop: "0.45rem",
                marginBottom: "2rem",
              }}
            >
              {subtitle}
            </p>

            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

