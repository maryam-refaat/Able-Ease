import React from "react";
import "../index.css";

export default function Hero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="container hero-inner" style={{ textAlign: "center" }}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
