import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthState } from "../context/AuthState";

export default function Sidebar({
  userType = "patient",
  hideHomeIcon = false,
}) {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Determine profile route based on user type
  const getProfileRoute = () => {
    switch (userType) {
      case "relative":
        return "/relative-profile";
      case "organization":
        return "/organization-profile";
      case "admin":
        return "/admin-profile";
      case "therapyCenter":
        return "/center-profile";
      case "caretaker":
        return "/caregiver-profile";
      case "patient":
      default:
        return "/patient-profile";
    }
  };

  const profileRoute = getProfileRoute();

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      const { BASE_URL } = await import("../assets/apis.js");
      await fetch(`${BASE_URL}/Account/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Only clear localStorage after successful logout API call
      localStorage.clear();
      // Set auth state to logged out
      setAuthState({ isLoggedIn: false, userType: null, ssn: null });
      // Navigate to home
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // Still clear and logout on error
      localStorage.clear();
      setAuthState({ isLoggedIn: false, userType: null, ssn: null });
      navigate("/");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="side-rect desktop-sidebar" aria-hidden="true">
        <div className="side-icons">
          {!hideHomeIcon && userType !== "caretaker" && (
            <button
              className="side-btn"
              aria-label="home"
              onClick={() => navigate("/Home")}
            >
              <i className="fa-solid fa-house" aria-hidden="true"></i>
            </button>
          )}

          <button
            className="side-btn"
            aria-label="overview"
            onClick={() => navigate(profileRoute)}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>

          <button
            className="side-btn"
            aria-label="messages"
            onClick={() => navigate("/messages")}
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>

          {userType === "patient" && (
            <button
              className="side-btn"
              aria-label="reports"
              onClick={() => navigate("/patient-reports")}
            >
              <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
            </button>
          )}

          {userType === "organization" && (
            <button
              className="side-btn"
              aria-label="assessments"
              onClick={() => navigate("/organization-assessments")}
            >
              <i className="fa-solid fa-clipboard-check" aria-hidden="true"></i>
            </button>
          )}

          <button
            className="side-btn"
            aria-label="logout"
            onClick={handleLogout}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button className="mobile-sidebar-toggle" onClick={toggleMobileSidebar}>
        <i
          className={`fa-solid ${isMobileSidebarOpen ? "fa-times" : "fa-bars"}`}
        ></i>
      </button>

      {/* Mobile Sidebar Menu */}
      <div
        className={`mobile-sidebar-menu ${isMobileSidebarOpen ? "open" : ""}`}
      >
        {!hideHomeIcon && userType !== "caretaker" && (
          <button
            className="mobile-side-btn"
            onClick={() => {
              navigate("/Home");
              closeMobileSidebar();
            }}
          >
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </button>
        )}

        <button
          className="mobile-side-btn"
          onClick={() => {
            navigate(profileRoute);
            closeMobileSidebar();
          }}
        >
          <i className="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>

        <button
          className="mobile-side-btn"
          onClick={() => {
            navigate("/messages");
            closeMobileSidebar();
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
          <span>Messages</span>
        </button>

        {userType === "patient" && (
          <button
            className="mobile-side-btn"
            onClick={() => {
              navigate("/patient-reports");
              closeMobileSidebar();
            }}
          >
            <i className="fa-solid fa-clipboard-list"></i>
            <span>Reports</span>
          </button>
        )}

        {userType === "organization" && (
          <button
            className="mobile-side-btn"
            onClick={() => {
              navigate("/organization-assessments");
              closeMobileSidebar();
            }}
          >
            <i className="fa-solid fa-clipboard-check"></i>
            <span>Assessments</span>
          </button>
        )}

        <button
          className="mobile-side-btn logout-btn"
          onClick={() => {
            handleLogout();
            closeMobileSidebar();
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>

      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar}></div>
      )}
    </>
  );
}
