"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserProfile, loginUser, registerUser } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  // ADDED: SetUser definition to allow manual state updates
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Session expired or invalid");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: any) => {
    const res = await loginUser(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    router.push("/learn");
  };

  const register = async (data: any) => {
    const res = await registerUser(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    router.push("/learn");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    // UPDATED: Added setUser to the value object
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};