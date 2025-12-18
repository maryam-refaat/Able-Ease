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

  React.useEffect(() => {
    const handler = () => setLocalAuth(getAuthState());
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

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
          className="container"
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
          <div className="auth-buttons">
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
        </div>
      </header>
      <div className="green"></div>
    </>
  );
}
