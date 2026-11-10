"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  CalendarRange,
  Bell,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  Loader2,
  FlaskConical,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { useAuth } from "@/lib/authContext";
import { useI18n } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferencesContext";
import styles from "./espacePerso.module.css";

export default function EspacePersoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, unreadNotificationsCount, logout } = useAuth();
  const { ext } = useI18n();
  const { currency, setCurrency } = usePreferences();
  const ep = ext.espacePerso;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navItems = [
    { label: ep.dashboard, href: "/espace-perso", icon: LayoutDashboard, exact: true },
    { label: ep.myListings, href: "/espace-perso/annonces", icon: Building2, exact: false },
    { label: ep.publishListing, href: "/espace-perso/annonces/new", icon: PlusCircle, exact: true },
    { label: ep.availabilityNav, href: "/espace-perso/disponibilites", icon: CalendarRange, exact: false },
    {
      label: ep.alertsNotifications,
      href: "/espace-perso/alertes",
      icon: Bell,
      exact: false,
      badge: unreadNotificationsCount,
    },
    { label: ep.myProfile, href: "/espace-perso/profil", icon: UserIcon, exact: true },
  ];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className={styles.pageShell}>
      <Navbar
        favoriteCount={0}
        compareCount={0}
        onOpenCompare={() => {}}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {isLoading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem",
            gap: "0.85rem",
          }}
        >
          <Loader2 size={32} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {ep.loading}
          </span>
        </div>
      ) : !user ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1rem",
          }}
        >
          <div
            style={{
              maxWidth: 500,
              width: "100%",
              marginBottom: "1rem",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            {ext.auth.gateInvite}
          </div>
          <AuthPanel redirectTo={pathname || "/espace-perso"} />
        </div>
      ) : (
        <div className={styles.workspaceContainer}>
          {/* User Sidebar */}
          <aside className={styles.sidebarCard}>
            <div className={styles.userBanner}>
              <div className={styles.userHeaderRow}>
                <div className={styles.avatarCircle}>{getInitials(user.name)}</div>
                <div style={{ minWidth: 0 }}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>

              <div className={styles.badgesRow}>
                {user.isVerified && (
                  <span className={styles.verifiedPill}>
                    <CheckCircle2 size={12} />
                    <span>{ep.accountActivated}</span>
                  </span>
                )}
                <span className={styles.providerPill}>
                  {user.provider !== "email" && <FlaskConical size={11} style={{ color: "#d97706" }} />}
                  <span>
                    {user.provider === "email"
                      ? ep.emailMethod
                      : `${user.provider} ${ep.simulatedSuffix}`}
                  </span>
                </span>
              </div>
            </div>

            <nav className={styles.navList}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href) &&
                    !(item.href === "/espace-perso/annonces" && pathname === "/espace-perso/annonces/new");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={styles.notifCountBadge}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}

              <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={18} />
                <span>{ext.logoutTitle}</span>
              </button>
            </nav>
          </aside>

          {/* Page Content */}
          <main className={styles.contentCol}>{children}</main>
        </div>
      )}

      <Footer />
    </div>
  );
}
