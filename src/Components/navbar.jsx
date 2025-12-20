import { Link } from "react-router-dom";
import logo from "../assets/user.png";
import "../Pages/Landpage.css";
import React, { useEffect, useState } from "react";
import { getAuthState } from "../context/AuthState";

export default function Navbar() {
  const [{ userType }, setLocalAuth] = useState(getAuthState());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setLocalAuth(getAuthState());
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <div className="landpage">
        <div className="header">
          <Link to={"/"} className="header">
            Able-Ease
          </Link>
        </div>
        <div className="bars desktop-bars">
          <Link to="/home">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/about">Organizations</Link>
          <Link to="/about">Physiotherapy</Link>
          {userType === "admin" && (
            <Link
              to="/admin-profile"
              style={{ color: "#059669", fontWeight: 700 }}
            >
              Admin
            </Link>
          )}
          <button className="land-btn">
            <img className="logo-img" src={logo} alt="user-logo"></img>
            Join US
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <button className="hamburger-btn" onClick={toggleMobileMenu}>
          <i
            className={`fa-solid ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
          ></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown">
          <Link to="/home" onClick={closeMobileMenu}>
            <i className="fa-solid fa-home"></i> Home
          </Link>
          <Link to="/about" onClick={closeMobileMenu}>
            <i className="fa-solid fa-info-circle"></i> About Us
          </Link>
          <Link to="/about" onClick={closeMobileMenu}>
            <i className="fa-solid fa-building"></i> Organizations
          </Link>
          <Link to="/about" onClick={closeMobileMenu}>
            <i className="fa-solid fa-hospital"></i> Physiotherapy
          </Link>
          {userType === "admin" && (
            <Link
              to="/admin-profile"
              onClick={closeMobileMenu}
              style={{ color: "#059669", fontWeight: 700 }}
            >
              <i className="fa-solid fa-user-shield"></i> Admin
            </Link>
          )}
          <button className="land-btn mobile-join">
            <img className="logo-img" src={logo} alt="user-logo"></img>
            Join US
          </button>
        </div>
      )}
    </div>
  );
}
