import React, { useEffect, useState } from "react";
import { getCenters } from "../assets/apis";
import "../index.css";

export default function PhysiotherapySection() {
  const [centers, setCenters] = useState([]);

  const fallback = [
    {
      ssn: "CEN-001",
      name: "Physio Care Cairo",
      location: "Cairo, Egypt",
      imageUrl: null,
      contactInfo: "01234567890",
      physicalTherapies: [],
    },
    {
      ssn: "CEN-002",
      name: "Rehab Plus",
      location: "Giza, Egypt",
      imageUrl: null,
      contactInfo: "01234567891",
      physicalTherapies: [],
    },
  ];

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getCenters();
        if (!mounted) return;

        // API returns array directly in res.data
        const centersData = res?.data;

        // Check if we got valid data from API
        if (Array.isArray(centersData) && centersData.length > 0) {
          setCenters(centersData);
          console.log("Centers loaded from API:", centersData);
        } else {
          // If API returns empty array or invalid data, use fallback
          console.warn(
            "getCenters returned empty/invalid data — using fallback"
          );
          setCenters(fallback);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("getCenters failed — falling back", err);
        setCenters(fallback);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  return (
    <section id="physio">
      <div className="container">
        {/* Title row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 className="section-title2" style={{ margin: 0 }}>
            Physiotherapy Centers
          </h3>

          <button className="btn" style={{ padding: "6px 12px" }}>
            View More
          </button>
        </div>

        {/* Grid of centers */}
        <div className="org-grid" style={{ marginTop: "20px" }}>
          {centers.map((c) => (
            <div key={c.ssn || c.id} className="org-card">
              {/* Placeholder image box */}
              <div
                style={{
                  height: "130px",
                  background: "#e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#777",
                }}
              >
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  "Image"
                )}
              </div>

              <h4 className="h4">{c.name}</h4>

              <p className="small" style={{ marginTop: "6px", color: "#666" }}>
                📍 {c.location}
              </p>

              {c.contactInfo && (
                <p
                  className="small"
                  style={{ marginTop: "4px", color: "#888" }}
                >
                  📞 {c.contactInfo}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
