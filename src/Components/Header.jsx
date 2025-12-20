import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthState } from "../context/AuthState";
import "../index.css";
import HomePage from "../assets/HomePage.png";

export default function Header({ onJoin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [{ isLoggedIn, userType }, setLocalAuth] = React.useState(
    getAuthState()
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
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

  const handleAuthClick = () => {
    navigate("/Able-Ease#auth-form");
    setTimeout(() => {
      const authElement = document.getElementById("auth-form");
      if (authElement) {
        authElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleProfileClick = () => {
    switch (userType) {
      case "relative":
        navigate("/relative-profile");
        break;
      case "organization":
        navigate("/organization-profile");
        break;
      case "therapyCenter":
        navigate("/therapy-center-profile");
        break;
      case "patient":
      default:
        navigate("/patient-profile");
        break;
    }
  };

  // No need to disable landing page link anymore

  return (
    <>
      <header>
        <div
          className="container header-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side: Logo + Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <nav>
              <div className="logo">
                <Link to="/Able-Ease">Able-Ease</Link>
              </div>
            </nav>

            <nav
              className="desktop-nav"
              style={{
                display: "flex",
                gap: "15px",
                paddingLeft: "90px",
                paddingTop: "10px",
              }}
            >
              <div className="nav-item-with-image">
                <Link to="/Home">Home</Link>
                <div className="hover-image-preview">
                  <img src={HomePage} alt="Home Preview" />
                </div>
              </div>
              <Link to="/about">About us</Link>
              <Link to="/organizations">Organizations</Link>
              <Link to="/therapy-centers">Therapy-Centers</Link>
              <Link to="/insights">Insights</Link>
            </nav>
          </div>

          {/* Right side: Auth buttons */}
          <div className="auth-buttons desktop-auth">
            {isLoggedIn ? (
              <button
                className="profile-btn"
                onClick={handleProfileClick}
                title="Profile"
              >
                <i className="fa-solid fa-user"></i>
              </button>
            ) : (
              <>
                <button onClick={handleAuthClick}>Log in</button>
                <button onClick={handleAuthClick}>Join Us</button>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button className="hamburger-menu" onClick={toggleMobileMenu}>
            <i
              className={`fa-solid ${
                isMobileMenuOpen ? "fa-times" : "fa-bars"
              }`}
            ></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <nav className="mobile-nav">
            <Link to="/Home" onClick={closeMobileMenu}>
              <i className="fa-solid fa-home"></i> Home
            </Link>
            <Link to="/about" onClick={closeMobileMenu}>
              <i className="fa-solid fa-info-circle"></i> About us
            </Link>
            <Link to="/organizations" onClick={closeMobileMenu}>
              <i className="fa-solid fa-building"></i> Organizations
            </Link>
            <Link to="/therapy-centers" onClick={closeMobileMenu}>
              <i className="fa-solid fa-hospital"></i> Therapy-Centers
            </Link>
            <Link to="/insights" onClick={closeMobileMenu}>
              <i className="fa-solid fa-lightbulb"></i> Insights
            </Link>
          </nav>
          <div className="mobile-auth">
            {isLoggedIn ? (
              <button
                className="profile-btn"
                onClick={() => {
                  handleProfileClick();
                  closeMobileMenu();
                }}
                title="Profile"
              >
                <i className="fa-solid fa-user"></i> Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleAuthClick();
                    closeMobileMenu();
                  }}
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleAuthClick();
                    closeMobileMenu();
                  }}
                >
                  Join Us
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="green"></div>
    </>
  );
}
