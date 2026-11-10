"use client";

import React, { ReactNode } from "react";
import { I18nProvider } from "../lib/i18n";
import { AuthProvider } from "../lib/authContext";
import { PreferencesProvider } from "../lib/preferencesContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <PreferencesProvider>{children}</PreferencesProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
