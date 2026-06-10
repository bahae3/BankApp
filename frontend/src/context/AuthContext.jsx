import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if there's a valid session based on role marker in localStorage
  // The actual JWT token is handled via HttpOnly cookies
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      axiosClient
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          setRole(res.data.role);
        })
        .catch(() => {
          localStorage.removeItem("role");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginClient = async (email, password) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    localStorage.setItem("role", "client");
    const me = await axiosClient.get("/auth/me");
    setUser(me.data.user);
    setRole("client");
  };

  const loginAdmin = async (email, password) => {
    const res = await axiosClient.post("/auth/admin/login", { email, password });
    localStorage.setItem("role", "admin");
    const me = await axiosClient.get("/auth/me");
    setUser(me.data.user);
    setRole("admin");
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    }
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginClient, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
