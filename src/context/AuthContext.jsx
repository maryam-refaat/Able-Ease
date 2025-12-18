import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user and auth flags from localStorage on mount
  useEffect(() => {
    const storedSSN = localStorage.getItem("ssn");
    const storedLoggedIn = localStorage.getItem("auth.isLoggedIn") === "true";
    const storedUserType = localStorage.getItem("auth.userType") || null;
    const storedUsername = localStorage.getItem("auth.username") || null;
    const storedEmail = localStorage.getItem("auth.email") || null;
    const storedName = localStorage.getItem("auth.name") || null;
    if (storedSSN || storedUsername || storedEmail) {
      // include role/type if present
      setUser({ ssn: storedSSN, role: storedUserType, username: storedUsername, email: storedEmail, name: storedName });
      setIsLoggedIn(storedLoggedIn);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Store SSN as a plain string, not JSON
    localStorage.setItem("ssn", userData.ssn);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("ssn");
    localStorage.removeItem("authToken");
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    userType: user?.role || user?.type || null, // patient, relative, organization, therapyCenter
  };

  // Keep AuthContext in sync with manual auth changes (setAuthState)
  useEffect(() => {
    const handler = () => {
      const storedSSN = localStorage.getItem("ssn");
      const storedLoggedIn = localStorage.getItem("auth.isLoggedIn") === "true";
      const storedUserType = localStorage.getItem("auth.userType") || null;
      const storedUsername = localStorage.getItem("auth.username") || null;
      const storedEmail = localStorage.getItem("auth.email") || null;
      const storedName = localStorage.getItem("auth.name") || null;
      setIsLoggedIn(storedLoggedIn);
      setUser(storedSSN || storedUsername || storedEmail ? { ssn: storedSSN, role: storedUserType, username: storedUsername, email: storedEmail, name: storedName } : null);
    };
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};