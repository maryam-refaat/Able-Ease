import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ userType = "patient" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Determine profile route based on user type
  const getProfileRoute = () => {
    switch (userType) {
      case "relative":
        return "/relative-profile";
      case "organization":
        return "/organization-profile";
      case "therapyCenter":
        return "/therapy-center-profile";
      case "patient":
      default:
        return "/patient-profile";
    }
  };
  
  const profileRoute = getProfileRoute();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="side-rect" aria-hidden="true">
      <div className="side-icons">
        <button 
          className="side-btn" 
          aria-label="home" 
          onClick={() => navigate("/Home")}
        >
          <i className="fa-solid fa-house" aria-hidden="true"></i>
        </button>

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
        
        <button 
          className="side-btn" 
          aria-label="logout" 
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
