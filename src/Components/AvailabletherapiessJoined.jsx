/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { fetchAvailabletherapiesJoined } from "../assets/apis";
import "../profilepagecomponents/organization.css";

export default function AvailabletherapiessJoined() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const progTrackRef = useRef(null);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const ID = localStorage.getItem("ssn");

        if (!ID) {
          console.error("No SSN found in localStorage");
          setPrograms([]);
          setError(true);
          setLoading(false);
          return;
        }

        const resProg = await fetchAvailabletherapiesJoined(ID);
        console.log("Fetched joined therapies response:", resProg);

        // Ensure we always set an array
        const therapiesData = resProg?.data || resProg || [];
        const therapiesArray = Array.isArray(therapiesData)
          ? therapiesData
          : [];

        console.log("Joined therapies array:", therapiesArray);
        setPrograms(therapiesArray);
        setError(false);
      } catch (err) {
        console.error("Programs API failed", err);
        setPrograms([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  return (
    <section className="section-box" style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Available therapies Joined</h3>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading programs...
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          Error loading programs.
        </div>
      ) : (
        <div className="slider-wrapper">
          <div className="cards-wrapper">
            <button
              className="slider-btn left"
              onClick={() =>
                progTrackRef.current?.scrollBy({
                  left: -progTrackRef.current.clientWidth * 0.8,
                  behavior: "smooth",
                })
              }
            >
              ‹
            </button>
            <div ref={progTrackRef} className="cards-track">
              {!Array.isArray(programs) || programs.length === 0 ? (
                <div
                  style={{
                    padding: "40px",
                    width: "100%",
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  No programs available
                </div>
              ) : (
                programs.map((p, index) => (
                  <div
                    key={p.id || p.Id || `program-${index}`}
                    className="program-card"
                  >
                    <div className="program-card-header">
                      <h4>{p.Name || p.name || "Therapy"}</h4>
                      <span className="program-status">
                        {p.Date || p.date || "Joined"}
                      </span>
                    </div>
                    <div className="program-meta">
                      <div className="program-price">
                        <i className="fa-solid fa-dollar-sign"></i> $
                        {p.PricePerHour || p.pricePerHour || p.price || 0}/hr
                      </div>
                      <div className="program-dates">
                        {p.duration && <span>Duration: {p.duration}</span>}
                        {p.Doctorname && (
                          <span style={{ marginLeft: "8px" }}>
                            Dr. {p.Doctorname}
                          </span>
                        )}
                      </div>
                    </div>
                    {p.therapyDetails && (
                      <div
                        className="program-description"
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        {p.therapyDetails}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <button
              className="slider-btn right"
              onClick={() =>
                progTrackRef.current?.scrollBy({
                  left: progTrackRef.current.clientWidth * 0.8,
                  behavior: "smooth",
                })
              }
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
