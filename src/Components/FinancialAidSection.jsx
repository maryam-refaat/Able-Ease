import React, { useEffect, useState } from "react";
import { getFinancialAids } from "../assets/api";
import "../index.css";

export default function FinancialAidSection() {
  const [aids, setAids] = useState([]);

  const fallback = [
    {
      id: "F-01",
      title: "Monthly Support",
      summary: "Small monthly financial grant",
      howToApply: "Contact center",
    },
    {
      id: "F-02",
      title: "One-time Aid",
      summary: "Emergency support",
      howToApply: "Submit form",
    },
  ];


  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getFinancialAids();
        if (!mounted) return;
        setAids(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!mounted) return;
        console.warn("getFinancialAids failed — falling back", err);
        setAids(fallback);
      }
    }

    load();
    return () => (mounted = false);
  }, []);


  return (
    <section className="container">
      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="section-title" style={{ margin: 0 }}>Check Available Financial Aids</h3>

        <a
          href="#"
          style={{
            fontSize: "14px",
            color: "#2876d3",
            textDecoration: "underline",
            marginTop: "5px",
          }}
        >
          How to Apply
        </a>
      </div>
          
      {/* Grid of aid cards */}
      <div className="org-grid" style={{ marginTop: "20px" }}>
        {aids.map((a) => (
          <div key={a.id} className="org-card">
            <h4 className="h4">{a.title}</h4>

            <p className="small" style={{ marginTop: "8px" }}>
              {a.summary}
            </p>
  
            <p className="small" style={{ marginTop: "12px" }}>
              <strong>How to apply:</strong> {a.howToApply}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
