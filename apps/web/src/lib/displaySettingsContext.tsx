"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { DisplaySettings } from "./types";
import { DEFAULT_DISPLAY_SETTINGS } from "./displaySettingsDefaults";

interface DisplaySettingsContextValue {
  displaySettings: DisplaySettings;
  refreshDisplaySettings: () => Promise<void>;
}

const DisplaySettingsContext = createContext<DisplaySettingsContextValue | undefined>(undefined);

export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(
    DEFAULT_DISPLAY_SETTINGS
  );

  const refreshDisplaySettings = useCallback(async () => {
    try {
      const res = await fetch("/api/display-settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.showAdsSection === "boolean") {
          setDisplaySettings({
            ...DEFAULT_DISPLAY_SETTINGS,
            ...data,
          });
        }
      }
    } catch {
      // retain current / default settings
    }
  }, []);

  useEffect(() => {
    refreshDisplaySettings();
  }, [refreshDisplaySettings]);

  return (
    <DisplaySettingsContext.Provider value={{ displaySettings, refreshDisplaySettings }}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

export function useDisplaySettings() {
  const ctx = useContext(DisplaySettingsContext);
  if (!ctx) {
    return {
      displaySettings: DEFAULT_DISPLAY_SETTINGS,
      refreshDisplaySettings: async () => {},
    };
  }
  return ctx;
}

