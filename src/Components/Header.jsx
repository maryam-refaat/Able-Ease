import React from "react";
import { Link } from "react-router-dom";   // ← ADD THIS
import "../index.css";

export default function Header({ onJoin }) {
  return (
    <>
    <header>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Left side: Logo + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
           <nav>
            <div className="logo">
           <Link  to="/Able-Ease">Able-Ease</Link>
            </div>
            </nav>  

          <nav style={{ display: "flex", gap: "15px",paddingLeft:"90px",paddingTop:"10px" }}>
           
              <Link to="/Home">Home</Link>
              <Link to="/about">About us</Link>
              <Link to="/organizations">Organizations</Link>
              <Link to="/therapy-centers">Physiotherapy</Link>
          </nav>
        </div>
        
        {/* Right side: Auth buttons */}
        <div className="auth-buttons">
          <button>Log in</button>
          <button onClick={onJoin}>Join Us</button>
        </div>

      </div>
      
    </header>
    <div className="green"></div>
    </>
  );
}
