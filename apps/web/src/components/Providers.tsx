"use client";

import React, { ReactNode } from "react";
import { I18nProvider } from "../lib/i18n";
import { AuthProvider } from "../lib/authContext";
import { PreferencesProvider } from "../lib/preferencesContext";
import { DisplaySettingsProvider } from "../lib/displaySettingsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <PreferencesProvider>
          <DisplaySettingsProvider>{children}</DisplaySettingsProvider>
        </PreferencesProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
