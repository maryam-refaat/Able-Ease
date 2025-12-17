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
    const storedSSN = localStorage.getItem("ssn");
    if (storedSSN) {
      // SSN is stored as a plain string, not JSON
      setUser({ ssn: storedSSN });
      setIsLoggedIn(true);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
