"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login as apiLogin, register as apiRegister, getMe, googleLogin as googleLoginApi } from "@/lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "mughal_token";
const USER_KEY = "mughal_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const persistAuth = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }
  }, []);

  // Google Login Handler
  const googleLogin = async (idToken) => {
    const res = await googleLoginApi(idToken);
    const t = res.data?.token || res.token;
    const u = res.data?.user || res.user;

    if (!t) throw new Error(res.message || "Google login failed");

    persistAuth(t, u);

    // Full profile fetch karein agar available ho
    try {
      const me = await getMe(t);
      const full = me.data || me;
      setUser(full);
      localStorage.setItem(USER_KEY, JSON.stringify(full));
    } catch {
      /* Keep basic user */
    }

    return { token: t, user: u };
  };

  useEffect(() => {
    async function init() {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (!storedToken) {
          setLoading(false);
          return;
        }
        setToken(storedToken);
        const res = await getMe(storedToken);
        const u = res.data || res.user || res;
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          clearAuth();
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [clearAuth]);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    const t = res.data?.token || res.token;
    const u = res.data?.user || res.user;
    if (!t) throw new Error(res.message || "Login failed");
    persistAuth(t, u);

    try {
      const me = await getMe(t);
      const full = me.data || me;
      setUser(full);
      localStorage.setItem(USER_KEY, JSON.stringify(full));
    } catch {
      /* keep basic user */
    }
    return { token: t, user: u };
  };

  const register = async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    const t = res.data?.token || res.token;
    const u = res.data?.user || res.user;
    if (!t) throw new Error(res.message || "Registration failed");
    persistAuth(t, u);
    return { token: t, user: u };
  };

  const logout = () => {
    clearAuth();
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await getMe(token);
      const u = res.data || res;
      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch (err) {
      if (err.status === 401 || err.status === 403) clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        googleLogin, // <-- Ab ye value prop mein pass ho raha hai
        logout,
        refreshUser,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}