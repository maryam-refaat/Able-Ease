import React, { useEffect, useState } from "react";
import { getOrganizations } from "../assets/api";
import "../index.css";

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
        const res = await getOrganizations(); // if API returns positions inside organizations
        if (!mounted) return;

        let data = Array.isArray(res.data) ? res.data : [];

        // Extract positions if API returns nested structures
        let extracted = [];

        data.forEach(org => {
          if (Array.isArray(org.positions)) {
            org.positions.forEach(p => {
              extracted.push({
                positionId: p.positionId,
                positionName: p.positionName,
                requirements: p.requirements,
                OrgName: org.Name ?? org.OrgName ?? "Unknown Org",
                OrganizationSSN: org.OrganizationSSN ?? org.SSN
              });
            });
          }
        });

        // If no positions found, fallback
        if (!extracted.length) extracted = fallback;

        setPositions(extracted);
      } catch (err) {
        if (!mounted) return;
        console.warn("getOrganizations failed — using fallback", err);
        setPositions(fallback);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

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
