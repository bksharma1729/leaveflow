import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const boot = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setToken("");
        setAuthToken("");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [token]);

  const saveSession = useCallback((payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("token", payload.token);
    setAuthToken(payload.token);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setError("");
      const { data } = await api.post("/auth/login", { email, password });
      saveSession(data);
      return data.user;
    },
    [saveSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      setError("");
      const { data } = await api.post("/auth/register", { name, email, password });
      saveSession(data);
      return data.user;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setAuthToken("");
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, error, setError, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, token, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
