import React from "react";
import "../index.css";

export default function Footer() {
  return (
    <footer>
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          padding: "80px",
         
          fontSize: "14px",
          color: "#555",
        }}
      >
        {/* Column 1 */}
        <div style={{ flex: "1 1 200px" }}>
          <strong>Able-Ease</strong>
          <p>Cairo, Egypt</p>
          <p>support@able-ease.org</p>
        </div>

        {/* Column 2 */}
        <div style={{ flex: "1 1 200px" }}>
          <p><strong>Services</strong></p>
          <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "8px" }}>
            <li>Tour Guide</li>
            <li>Booking</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div style={{ flex: "1 1 200px" }}>
          <p><strong>Subscribe</strong></p>

          <div style={{ display: "flex", marginTop: "10px" }}>
            <input
              placeholder="Enter your email"
              style={{
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: "6px 0 0 6px",
                flex: "1",
              }}
            />

            <button
              style={{
                padding: "6px 12px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "0 6px 6px 0",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
