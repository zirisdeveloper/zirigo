"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { CurrencyCode, LanguageCode, ThemeMode } from "./types";
import { useI18n } from "./i18n";
import { useAuth } from "./authContext";

const VALID_CURRENCIES: CurrencyCode[] = ["DZD", "EUR", "USD", "GBP"];

interface PreferencesContextValue {
  currency: CurrencyCode;
  language: LanguageCode;
  theme: ThemeMode;
  isDark: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (lang: LanguageCode) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  saveAllPreferences: (prefs: {
    currency?: CurrencyCode;
    language?: LanguageCode;
    theme?: ThemeMode;
  }) => Promise<boolean>;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage: setI18nLanguage } = useI18n();
  const { user } = useAuth();

  const [currency, setCurrencyState] = useState<CurrencyCode>("DZD");
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const hydratedUserIdRef = useRef<string | null>(null);

  const applyThemeDom = useCallback((nextTheme: ThemeMode) => {
    if (nextTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  // Load local preferences on mount (defaulting currency to DZD)
  useEffect(() => {
    const savedCurr = localStorage.getItem("zirigo_currency") as CurrencyCode | null;
    if (savedCurr && VALID_CURRENCIES.includes(savedCurr)) {
      setCurrencyState(savedCurr);
    } else {
      setCurrencyState("DZD");
      localStorage.setItem("zirigo_currency", "DZD");
    }

    const savedTheme = localStorage.getItem("zirigo_theme") as ThemeMode | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
      applyThemeDom(savedTheme);
    }
  }, [applyThemeDom]);

  // Synchronize DB preferences when a user signs in or loads an authenticated session
  useEffect(() => {
    if (!user) {
      hydratedUserIdRef.current = null;
      return;
    }

    if (hydratedUserIdRef.current === user.id) {
      return;
    }
    hydratedUserIdRef.current = user.id;

    if (user.preferredCurrency && VALID_CURRENCIES.includes(user.preferredCurrency)) {
      setCurrencyState(user.preferredCurrency);
      localStorage.setItem("zirigo_currency", user.preferredCurrency);
    }

    if (
      user.preferredLanguage &&
      (user.preferredLanguage === "fr" ||
        user.preferredLanguage === "en" ||
        user.preferredLanguage === "ar")
    ) {
      setI18nLanguage(user.preferredLanguage);
    }

    if (user.preferredTheme === "dark" || user.preferredTheme === "light") {
      setThemeState(user.preferredTheme);
      localStorage.setItem("zirigo_theme", user.preferredTheme);
      applyThemeDom(user.preferredTheme);
    }
  }, [user, setI18nLanguage, applyThemeDom]);

  const persistPreferencesToDb = useCallback(
    async (updates: {
      preferredCurrency?: CurrencyCode;
      preferredLanguage?: LanguageCode;
      preferredTheme?: ThemeMode;
    }): Promise<boolean> => {
      if (!user) return false;
      try {
        const res = await fetch("/api/auth/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        return res.ok;
      } catch (err) {
        console.error("Failed to persist user preferences to DB:", err);
        return false;
      }
    },
    [user]
  );

  const setCurrency = useCallback(
    (next: CurrencyCode) => {
      setCurrencyState(next);
      localStorage.setItem("zirigo_currency", next);
      persistPreferencesToDb({ preferredCurrency: next });
    },
    [persistPreferencesToDb]
  );

  const setLanguage = useCallback(
    (next: LanguageCode) => {
      setI18nLanguage(next);
      persistPreferencesToDb({ preferredLanguage: next });
    },
    [setI18nLanguage, persistPreferencesToDb]
  );

  const setTheme = useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      localStorage.setItem("zirigo_theme", next);
      applyThemeDom(next);
      persistPreferencesToDb({ preferredTheme: next });
    },
    [applyThemeDom, persistPreferencesToDb]
  );

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  const saveAllPreferences = useCallback(
    async (prefs: {
      currency?: CurrencyCode;
      language?: LanguageCode;
      theme?: ThemeMode;
    }): Promise<boolean> => {
      const nextCurr = prefs.currency ?? currency;
      const nextLang = prefs.language ?? language;
      const nextTheme = prefs.theme ?? theme;

      setCurrencyState(nextCurr);
      localStorage.setItem("zirigo_currency", nextCurr);

      setI18nLanguage(nextLang);

      setThemeState(nextTheme);
      localStorage.setItem("zirigo_theme", nextTheme);
      applyThemeDom(nextTheme);

      return persistPreferencesToDb({
        preferredCurrency: nextCurr,
        preferredLanguage: nextLang,
        preferredTheme: nextTheme,
      });
    },
    [currency, language, theme, setI18nLanguage, applyThemeDom, persistPreferencesToDb]
  );

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        language,
        theme,
        isDark: theme === "dark",
        setCurrency,
        setLanguage,
        setTheme,
        toggleTheme,
        saveAllPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return ctx;
}

