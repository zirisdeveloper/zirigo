"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Moon, Sun, Heart, Sparkles, Scale, Globe } from "lucide-react";
import { useI18n, Language } from "../lib/i18n";
import styles from "./Navbar.module.css";

interface NavbarProps {
  favoriteCount: number;
  compareCount: number;
  onOpenCompare: () => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
}

export function Navbar({
  favoriteCount,
  compareCount,
  onOpenCompare,
  currency,
  onCurrencyChange,
}: NavbarProps) {
  const { language, setLanguage, t, isRTL } = useI18n();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("zirigo_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("zirigo_theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("zirigo_theme", "light");
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navbarInner}`}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIconWrapper}>
            <Compass className={styles.logoIcon} />
          </div>
          <span className={styles.logoText}>
            Ziri<span className={styles.logoAccent}>go</span>
          </span>
          <span className={styles.tagline}>{t.tagline}</span>
        </Link>

        {/* Action Controls */}
        <div className={styles.navActions}>
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`${styles.actionBtn} ${compareCount > 0 ? styles.activeAction : ""}`}
            title={t.compare}
          >
            <Scale size={18} />
            <span className={styles.actionLabel}>{t.compare}</span>
            {compareCount > 0 && (
              <span className={styles.badgeCount}>{compareCount}</span>
            )}
          </button>

          {/* Favorites Button */}
          <div className={styles.actionBtn} title={t.wishlist}>
            <Heart size={18} />
            <span className={styles.actionLabel}>{t.wishlist}</span>
            {favoriteCount > 0 && (
              <span className={styles.badgeCount}>{favoriteCount}</span>
            )}
          </div>

          {/* Language Switcher */}
          <div className={styles.selectWrapper}>
            <Globe size={15} className={styles.selectIcon} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className={styles.languageSelect}
              aria-label="Select language"
            >
              <option value="en">English (EN)</option>
              <option value="fr">Français (FR)</option>
              <option value="ar">العربية (AR)</option>
            </select>
          </div>

          {/* Currency Switcher */}
          <div className={styles.currencyWrapper}>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className={styles.currencySelect}
              aria-label="Select currency"
            >
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
              <option value="DZD">DZD</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            title={t.themeToggle}
            aria-label={t.themeToggle}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* List Property CTA */}
          <button className={`btn btn-primary ${styles.listPropertyBtn}`}>
            <Sparkles size={16} />
            <span>{t.listProperty}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
