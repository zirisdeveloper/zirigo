"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { UserAccount } from "./types";

interface AuthContextValue {
  user: UserAccount | null;
  isLoading: boolean;
  oauthSimulationEnabled: boolean;
  unreadNotificationsCount: number;
  refreshSession: () => Promise<UserAccount | null>;
  refreshNotifications: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oauthSimulationEnabled, setOauthSimulationEnabled] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/espace-perso/notifications");
      if (res.ok) {
        const data = await res.json();
        setUnreadNotificationsCount(data.unreadCount || 0);
      } else {
        setUnreadNotificationsCount(0);
      }
    } catch {
      setUnreadNotificationsCount(0);
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<UserAccount | null> => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
        setOauthSimulationEnabled(data.oauthSimulationEnabled ?? true);
        if (data.user) {
          refreshNotifications();
        } else {
          setUnreadNotificationsCount(0);
        }
        return data.user || null;
      }
    } catch (err) {
      console.error("Failed to fetch session:", err);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [refreshNotifications]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUnreadNotificationsCount(0);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        oauthSimulationEnabled,
        unreadNotificationsCount,
        refreshSession,
        refreshNotifications,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

