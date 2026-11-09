"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Building2,
  PlusCircle,
  TrendingDown,
  CalendarCheck,
  Settings,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const navItems = [
    {
      label: "Tableau de bord",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Gestion des annonces",
      href: "/admin/properties",
      icon: Building2,
      exact: false,
    },
    {
      label: "Ajouter une annonce",
      href: "/admin/properties/new",
      icon: PlusCircle,
      exact: true,
    },
    {
      label: "Comparateur & Tarifs",
      href: "/admin/rates",
      icon: TrendingDown,
      exact: false,
    },
    {
      label: "Réservations",
      href: "/admin/bookings",
      icon: CalendarCheck,
      exact: false,
    },
    {
      label: "Paramètres & Données",
      href: "/admin/settings",
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar Overlay on mobile */}
      {isSidebarOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsSidebarOpen(false)}
          style={{ zIndex: 35 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brandLink}>
            <div className={styles.brandIcon}>
              <Compass size={22} />
            </div>
            <div className={styles.brandTitleGroup}>
              <span className={styles.brandName}>
                Ziri<span className={styles.brandAccent}>go</span>
              </span>
              <span className={styles.adminBadge}>Admin Platform</span>
            </div>
          </Link>
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionLabel}>Administration</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) &&
                (item.href !== "/admin" || pathname === "/admin");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.publicSiteBtn}>
            <ExternalLink size={15} />
            <span>Voir le site public</span>
          </Link>

          <div className={styles.adminUserCard}>
            <div className={styles.userAvatar}>AD</div>
            <div>
              <div className={styles.userName}>Administrateur</div>
              <div className={styles.userRole}>Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <div className={styles.topbarTitle}>
              <ShieldCheck size={20} style={{ color: "var(--brand-primary)" }} />
              <span>Console d'administration</span>
            </div>
          </div>

          <div className={styles.topbarActions}>
            <button
              onClick={toggleTheme}
              className={styles.actionIconBtn}
              title="Changer de thème"
              aria-label="Changer de thème"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link href="/admin/properties/new" className={styles.quickAddBtn}>
              <PlusCircle size={16} />
              <span>Nouvelle annonce</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageBody}>{children}</main>
      </div>
    </div>
  );
}
