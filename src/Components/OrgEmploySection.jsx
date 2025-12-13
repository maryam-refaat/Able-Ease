import React, { useEffect, useState } from "react";
import "../index.css";
import { getEmployments } from "../assets/apis";

export default function OrgEmploySection() {
  const [positions, setPositions] = useState([]);

  const fallback = [
    {
      positionId: 101,
      positionName: "Physiotherapist",
      requirements: "BSc physiotherapy; 2+ years",
      OrganizationSSN: "ORG-001",
      OrgName: "Able Donor"
    },
    {
      positionId: 102,
      positionName: "Assistant Therapist",
      requirements: "High school diploma",
      OrganizationSSN: "ORG-001",
      OrgName: "Able Donor"
    }
  ];

 useEffect(() => {
  let mounted = true;

  async function load() {
    try {
      const res = await getEmployments();
      if (!mounted) return;

      const data = Array.isArray(res.data) ? res.data : [];

      // If data is empty, use fallback
      setPositions(data.length ? data : fallback);
      
    } catch (err) {
      if (!mounted) return;
      console.warn("getEmployments failed — using fallback", err);
      setPositions(fallback);
    }
  }

  load();
  return () => { mounted = false };
}, []);


        // If no positions found, fallback
      
  return (
    <section id="org">
      <div className="container">

        {/* Title */}
        <h3 className="section-title">
          Find Organizations Ready to Employ &gt;
        </h3>

        {/* Grid */}
        <div className="org-grid">
          {positions.map((p) => (
            <div key={p.positionId} className="org-card">

              <h4 className="h4">{p.positionName}</h4>

              <p className="small" style={{ marginTop: "6px" }}>
                <strong>Organization:</strong> {p.OrgName}
              </p>

              <p className="small" style={{ marginTop: "6px" }}>
                <strong>Requirements:</strong> {p.requirements}
              </p>

              <div style={{ marginTop: "14px", textAlign: "right" }}>
                <button className="btn">Apply</button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
