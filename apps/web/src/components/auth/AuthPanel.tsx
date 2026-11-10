"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  FlaskConical,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useI18n } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferencesContext";
import { AuthProviderType } from "@/lib/types";
import styles from "./AuthPanel.module.css";

interface AuthPanelProps {
  redirectTo?: string;
  initialMode?: "login" | "register";
  onSuccess?: () => void;
}

interface SimulatedEmailState {
  to: string;
  subject: string;
  code: string;
  expiresInMinutes: number;
}

export function AuthPanel({
  redirectTo = "/espace-perso",
  initialMode = "login",
  onSuccess,
}: AuthPanelProps) {
  const router = useRouter();
  const { refreshSession, oauthSimulationEnabled } = useAuth();
  const { ext } = useI18n();
  const { currency, language, theme } = usePreferences();
  const a = ext.auth;

  const [mode, setMode] = useState<"login" | "register" | "verify">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login & Register fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Activation verification fields
  const [pendingEmail, setPendingEmail] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [simulatedEmail, setSimulatedEmail] = useState<SimulatedEmailState | null>(null);

  // OAuth Simulation Modal
  const [simModalProvider, setSimModalProvider] = useState<AuthProviderType | null>(null);
  const [simEmail, setSimEmail] = useState("");
  const [simName, setSimName] = useState("");

  const completeAuthentication = async () => {
    await refreshSession();
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresVerification) {
          setPendingEmail(data.email || email);
          setMode("verify");
          setError(data.error);
        } else {
          setError(data.error || "Erreur lors de la connexion.");
        }
        return;
      }

      setSuccessMsg("Connexion réussie ! Redirection en cours...");
      await completeAuthentication();
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          preferredCurrency: currency,
          preferredLanguage: language,
          preferredTheme: theme,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du compte.");
        return;
      }

      setPendingEmail(data.email || email);
      if (data.devSimulatedEmail) {
        setSimulatedEmail(data.devSimulatedEmail);
      }
      setSuccessMsg(data.message);
      setMode("verify");
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code: activationCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Code invalide.");
        return;
      }

      setSuccessMsg("Compte activé et connecté !");
      await completeAuthentication();
    } catch {
      setError("Erreur réseau lors de la vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Impossible de renvoyer le code.");
        return;
      }
      if (data.devSimulatedEmail) {
        setSimulatedEmail(data.devSimulatedEmail);
      }
      setSuccessMsg(data.message);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  const openSocialSimulator = (provider: AuthProviderType) => {
    setError(null);
    setSimModalProvider(provider);
    if (provider === "google") {
      setSimEmail("karim.benali@gmail.com");
      setSimName("Karim Benali");
    } else if (provider === "facebook") {
      setSimEmail("sophie.laurent@facebook.com");
      setSimName("Sophie Laurent");
    } else {
      setSimEmail("alex.moreau@icloud.com");
      setSimName("Alex Moreau");
    }
  };

  const handleConfirmSocialSimulation = async (
    customEmail?: string,
    customName?: string
  ) => {
    if (!simModalProvider) return;
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: simModalProvider,
          email: customEmail || simEmail,
          name: customName || simName,
          preferredCurrency: currency,
          preferredLanguage: language,
          preferredTheme: theme,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Échec de la simulation OAuth.");
        return;
      }

      setSimModalProvider(null);
      setSuccessMsg(data.message);
      await completeAuthentication();
    } catch {
      setError("Erreur réseau lors de la simulation OAuth.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Dev OAuth Simulator Modal */}
      {simModalProvider && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FlaskConical size={20} style={{ color: "#d97706" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {a.simOAuthTitle} ({simModalProvider.toUpperCase()})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSimModalProvider(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.devSimNotice}>
              <FlaskConical size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>{a.simOAuthDesc}</div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                {a.oneClickTestAccounts}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <button
                  type="button"
                  className={styles.presetAccountBtn}
                  onClick={() =>
                    handleConfirmSocialSimulation("karim.benali@gmail.com", "Karim Benali")
                  }
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Karim Benali</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      karim.benali@gmail.com
                    </div>
                  </div>
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className={styles.presetAccountBtn}
                  onClick={() =>
                    handleConfirmSocialSimulation("sophie.laurent@gmail.com", "Sophie Laurent")
                  }
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Sophie Laurent</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      sophie.laurent@gmail.com
                    </div>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className={styles.divider}>{a.orCustomSimAccount}</div>

            <div className={styles.formStack}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{a.displayNameLabel}</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className={styles.fieldInputPlain}
                  placeholder="Yasmine Kaci"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{a.socialEmailLabel}</label>
                <input
                  type="email"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className={styles.fieldInputPlain}
                  placeholder="exemple@gmail.com"
                />
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleConfirmSocialSimulation()}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.75rem" }}
              >
                {isLoading
                  ? a.simulatingAuth
                  : `${a.continueAs} ${simName || simEmail}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.authWrapper}>
        <div className={styles.authHeader}>
          <div className={styles.authIconCircle}>
            <ShieldCheck size={26} />
          </div>
          <h1 className={styles.authTitle}>
            {mode === "verify"
              ? a.verifyTitle
              : mode === "register"
              ? a.registerTitle
              : a.loginTitle}
          </h1>
          <p className={styles.authSubtitle}>
            {mode === "verify"
              ? `${a.verifySubtitle} ${pendingEmail}`
              : a.authSubtitle}
          </p>
        </div>

        {mode !== "verify" && (
          <div className={styles.tabBar}>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`${styles.tabBtn} ${mode === "login" ? styles.tabBtnActive : ""}`}
            >
              {a.loginTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`${styles.tabBtn} ${mode === "register" ? styles.tabBtnActive : ""}`}
            >
              {a.registerTab}
            </button>
          </div>
        )}

        <div className={styles.authBody}>
          {error && (
            <div className={styles.alertError}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className={styles.alertSuccess}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === "verify" ? (
            <div>
              {simulatedEmail && (
                <div className={styles.simulatedEmailCard}>
                  <div className={styles.simulatedEmailHeader}>
                    <span>
                      <Sparkles size={13} style={{ display: "inline", marginRight: 4 }} />
                      {a.simEmailHeader}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivationCode(simulatedEmail.code)}
                      style={{
                        background: "var(--brand-primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.2rem 0.55rem",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {a.fillCodeBtn}
                    </button>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    {a.toLabel} <strong>{simulatedEmail.to}</strong> — {simulatedEmail.subject}
                  </div>
                  <div>
                    {a.codeLabel}{" "}
                    <span className={styles.simulatedCodeBadge}>{simulatedEmail.code}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyCode} className={styles.formStack}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{a.activationCodeLabel}</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className={`${styles.fieldInputPlain} ${styles.codeInput}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || activationCode.length < 6}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.8rem" }}
                >
                  <KeyRound size={17} />
                  <span>{isLoading ? a.verifying : a.activateSubmit}</span>
                </button>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--brand-primary)",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <RefreshCw size={14} />
                    <span>{a.resendCode}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {a.backToLogin}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Social Login Section */}
              {oauthSimulationEnabled && (
                <div>
                  <div className={styles.devSimNotice}>
                    <FlaskConical size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{a.devModeNotice}</span>
                  </div>

                  <div className={styles.socialStack}>
                    <button
                      type="button"
                      onClick={() => openSocialSimulator("google")}
                      className={styles.socialBtn}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.8z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"
                        />
                      </svg>
                      <span>{a.continueGoogle}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openSocialSimulator("facebook")}
                      className={`${styles.socialBtn} ${styles.socialBtnFacebook}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                      </svg>
                      <span>{a.continueFacebook}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openSocialSimulator("apple")}
                      className={styles.socialBtn}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                      </svg>
                      <span>{a.continueApple}</span>
                    </button>
                  </div>

                  <div className={styles.divider}>{a.orWithEmail}</div>
                </div>
              )}

              {mode === "login" ? (
                <form onSubmit={handleLogin} className={styles.formStack}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{a.emailLabel}</label>
                    <div className={styles.inputWithIcon}>
                      <Mail size={16} className={styles.inputIcon} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@exemple.com"
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{a.passwordLabel}</label>
                    <div className={styles.inputWithIcon}>
                      <Lock size={16} className={styles.inputIcon} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "0.8rem", marginTop: "0.25rem" }}
                  >
                    {isLoading ? a.loggingIn : a.loginSubmit}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className={styles.formStack}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{a.fullNameLabel}</label>
                    <div className={styles.inputWithIcon}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nadia Mansouri"
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{a.emailActivationLabel}</label>
                    <div className={styles.inputWithIcon}>
                      <Mail size={16} className={styles.inputIcon} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@exemple.com"
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{a.phoneOptionalLabel}</label>
                    <div className={styles.inputWithIcon}>
                      <Phone size={16} className={styles.inputIcon} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{a.passwordMinLabel}</label>
                    <div className={styles.inputWithIcon}>
                      <Lock size={16} className={styles.inputIcon} />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "0.8rem", marginTop: "0.25rem" }}
                  >
                    {isLoading ? a.sendingCode : a.registerSubmit}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

