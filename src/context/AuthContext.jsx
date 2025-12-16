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

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("ssn");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("ssn");
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("ssn", JSON.stringify(userData.ssn));
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
