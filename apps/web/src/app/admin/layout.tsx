"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Building2,
  PlusCircle,
  TrendingDown,
  CalendarCheck,
  CalendarRange,
  Megaphone,
  Settings,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Lock,
  Mail,
  AlertCircle,
  FlaskConical,
  Loader2,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useI18n, Language } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferencesContext";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, refreshSession, logout } = useAuth();
  const { ext } = useI18n();
  const { language, setLanguage, isDark, toggleTheme } = usePreferences();
  const ad = ext.admin;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogout = async () => {
    await logout();
    router.refresh();
  };

  const performAdminLogin = async (email: string, password: string) => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid credentials");
        return;
      }
      if (data.user?.role !== "admin") {
        setLoginError(ad.notAdminWarning);
        return;
      }
      await refreshSession();
      router.refresh();
    } catch {
      setLoginError("Network error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performAdminLogin(loginEmail, loginPassword);
  };

  const navItems = [
    { label: ad.navDashboard, href: "/admin", icon: LayoutDashboard, exact: true },
    { label: ad.navProperties, href: "/admin/properties", icon: Building2, exact: false },
    { label: ad.navAddProperty, href: "/admin/properties/new", icon: PlusCircle, exact: true },
    { label: ad.navRates, href: "/admin/rates", icon: TrendingDown, exact: false },
    { label: ad.navBookings, href: "/admin/bookings", icon: CalendarCheck, exact: false },
    { label: ad.navAvailability, href: "/admin/disponibilites", icon: CalendarRange, exact: false },
    { label: ad.navAds, href: "/admin/ads", icon: Megaphone, exact: false },
    { label: ad.navSettings, href: "/admin/settings", icon: Settings, exact: false },
  ];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.85rem",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <Loader2 size={34} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
        <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          {ad.checkingSession}
        </span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background:
            "radial-gradient(circle at top left, rgba(13, 148, 136, 0.12), transparent 45%), var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <div
          style={{
            maxWidth: 460,
            width: "100%",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "2rem 2rem 1.35rem",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(2, 132, 199, 0.06))",
              borderBottom: "1px solid var(--border-subtle)",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "0.85rem", right: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Globe size={14} style={{ color: "var(--text-muted)" }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={styles.filterSelect}
                style={{ padding: "0.25rem 0.5rem", fontSize: "0.78rem" }}
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </div>

            <div className={styles.brandIcon} style={{ margin: "0 auto 0.9rem", width: 52, height: 52 }}>
              <ShieldCheck size={26} />
            </div>
            <h1 style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {ad.loginHeading}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
              {ad.loginSub}
            </p>
          </div>

          <div style={{ padding: "1.75rem 2rem 2rem" }}>
            {user && user.role !== "admin" && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  marginBottom: "1.15rem",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
                  {user.email}
                </div>
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.65rem" }}>
                  {ad.notAdminWarning}
                </p>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="btn btn-secondary"
                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", color: "var(--alert-red)" }}
                >
                  <LogOut size={14} />
                  <span>{ad.logoutCurrentAccount}</span>
                </button>
              </div>
            )}

            {loginError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 0.9rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--alert-red-bg)",
                  color: "var(--alert-red)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                <AlertCircle size={17} />
                <span>{loginError}</span>
              </div>
            )}

            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(13, 148, 136, 0.08)",
                border: "1px dashed var(--brand-primary)",
                marginBottom: "1.25rem",
                fontSize: "0.82rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontWeight: 700,
                  color: "var(--brand-primary)",
                  marginBottom: "0.35rem",
                }}
              >
                <FlaskConical size={14} />
                <span>{ad.devQuickAccess}</span>
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                <strong>admin@zirigo.com</strong> • <strong>AdminZirigo2026!</strong>
              </div>
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={() => performAdminLogin("admin@zirigo.com", "AdminZirigo2026!")}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.55rem", fontSize: "0.85rem" }}
              >
                {isLoggingIn ? ext.auth.loggingIn : ad.quickLoginBtn}
              </button>
            </div>

            <form
              onSubmit={handleAdminLoginSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{ad.adminEmailLabel}</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail
                    size={16}
                    style={{ position: "absolute", left: "0.85rem", color: "var(--text-muted)" }}
                  />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@zirigo.com"
                    className={styles.formInput}
                    style={{ width: "100%", paddingLeft: "2.45rem" }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{ext.auth.passwordLabel}</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Lock
                    size={16}
                    style={{ position: "absolute", left: "0.85rem", color: "var(--text-muted)" }}
                  />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.formInput}
                    style={{ width: "100%", paddingLeft: "2.45rem" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn btn-secondary"
                style={{ width: "100%", padding: "0.75rem", fontWeight: 700 }}
              >
                {isLoggingIn ? ext.auth.loggingIn : ad.adminLoginSubmit}
              </button>
            </form>

            <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
              <Link
                href="/"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <ExternalLink size={14} />
                <span>{ext.backToPublicSite}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      {isSidebarOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsSidebarOpen(false)}
          style={{ zIndex: 35 }}
        />
      )}

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
              <span className={styles.adminBadge}>{ad.platformBadge}</span>
            </div>
          </Link>
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close"
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
            <span>{ext.backToPublicSite}</span>
          </Link>

          <div className={styles.adminUserCard}>
            <div className={styles.userAvatar}>{getInitials(user.name)}</div>
            <div style={{ minWidth: 0 }}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.email}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            className={styles.publicSiteBtn}
            style={{
              color: "var(--alert-red)",
              borderColor: "rgba(239, 68, 68, 0.25)",
              backgroundColor: "var(--alert-red-bg)",
              cursor: "pointer",
            }}
          >
            <LogOut size={15} />
            <span>{ext.logoutTitle}</span>
          </button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
            <div className={styles.topbarTitle}>
              <ShieldCheck size={20} style={{ color: "var(--brand-primary)" }} />
              <span>{ad.consoleTitle}</span>
            </div>
          </div>

          <div className={styles.topbarActions}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Globe size={15} style={{ color: "var(--text-muted)" }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={styles.filterSelect}
                aria-label="Language"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="ar">AR</option>
              </select>
            </div>

            <button
              onClick={toggleTheme}
              className={styles.actionIconBtn}
              title="Theme"
              aria-label="Theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link href="/admin/properties/new" className={styles.quickAddBtn}>
              <PlusCircle size={16} />
              <span>{ad.navAddProperty}</span>
            </Link>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="btn btn-secondary"
              title={ext.logoutTitle}
              style={{
                padding: "0.55rem 0.95rem",
                fontSize: "0.85rem",
                color: "var(--alert-red)",
                borderColor: "rgba(239, 68, 68, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <LogOut size={15} />
              <span>{ext.logout}</span>
            </button>
          </div>
        </header>

        <main className={styles.pageBody}>{children}</main>
      </div>
    </div>
  );
}
