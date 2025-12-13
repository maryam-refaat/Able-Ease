import React, { useEffect, useState } from "react";
import { getCenters } from "../assets/api";
import "../index.css";
import{getPhysicenters} from "../assets/apis";

export default function PhysiotherapySection() {
  const [centers, setCenters] = useState([]);

  const fallback = [
    {
      id: "C-01",
      centerName: "Physio Care Cairo",
      physicalTherapies: ["Hydrotherapy", "Manual Therapy"],
      location: "Cairo, Egypt",
    },
    {
      id: "C-02",
      centerName: "Rehab Plus",
      physicalTherapies: ["Exercise Therapy"],
      location: "Giza, Egypt",
    },
  ];

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getCenters();
        if (!mounted) return;
        setCenters(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!mounted) return;
        console.warn("getCenters failed — falling back", err);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            Physiotherapy Centers
          </h3>

          <button className="btn" style={{ padding: "6px 12px" }}>
            View More
          </button>
        </div>

        {/* Grid of centers */}
        <div className="org-grid" style={{ marginTop: "20px" }}>
          {centers.map((c) => (
            <div key={c.id} className="org-card">
              
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
                Image
              </div>

              <h4 className="h4">{c.centerName}</h4>

              <p className="small" style={{ marginTop: "6px" }}>
                {Array.isArray(c.physicalTherapies)
                  ? c.physicalTherapies.join(", ")
                  : ""}
              </p>

              <p className="small" style={{ marginTop: "10px", color: "#888" }}>
                {c.location}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
