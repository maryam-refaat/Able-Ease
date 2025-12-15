import React, { useState, useEffect } from "react";
import { getAll_Programs } from "../assets/apis";
import "../Org.css";
import "./Allprog.css";

/* Dummy programs for fallback */
const DUMMY_PROGRAMS = [
  {
    id: 1,
    name: "Rehab for Seniors",
    organizationName: "Physio Care Center",
    startDate: "2025-12-01",
    endDate: "2026-03-01",
    price: 150,
    location: "Cairo",
    imageUrl: null,
  },
  {
    id: 2,
    name: "Child Motor Skills Development",
    organizationName: "Able Learning Hub",
    startDate: "2025-11-15",
    endDate: "2026-01-15",
    price: 100,
    location: "Alexandria",
    imageUrl: null,
  },
  {
    id: 3,
    name: "Balance & Gait Training",
    organizationName: "Sunrise Rehab",
    startDate: "2025-10-01",
    endDate: "2025-12-01",
    price: 130,
    location: "Giza",
    imageUrl: null,
  },
  {
    id: 4,
    name: "Sports Injury Recovery",
    organizationName: "Hope Centre",
    startDate: "2026-01-10",
    endDate: "2026-04-10",
    price: 200,
    location: "Cairo",
    imageUrl: null,
  },
  {
    id: 5,
    name: "Elderly Care Program",
    organizationName: "Physio Care Center",
    startDate: "2025-12-20",
    endDate: "2026-02-20",
    price: 120,
    location: "Cairo",
    imageUrl: null,
  },
  {
    id: 6,
    name: "Autism Support Program",
    organizationName: "Able Learning Hub",
    startDate: "2026-01-01",
    endDate: "2026-06-01",
    price: 250,
    location: "Alexandria",
    imageUrl: null,
  },
];

// Placeholder SVG
const SVG_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMiIgZmlsbD0iI2RmZjNlOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzYiIHI9IjE4IiBmaWxsPSIjMjc4NjVkIi8+PHJlY3QgeD0iMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIHJ4PSI2IiBmaWxsPSIjMjc4NjVkIi8+PC9zdmc+";

function ImgOrPlaceholder({ src, alt }) {
  const imgSrc = src && src.trim() ? src : SVG_PLACEHOLDER;
  return (
    <img
      key={imgSrc}
      src={imgSrc}
      alt={alt || "program"}
      className="program-img"
    />
  );
}

export default function AllProgram() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPrograms = async () => {
      setLoading(true);

      try {
        const res = await getAll_Programs();
        const progs = res?.data;

        if (mounted && Array.isArray(progs)) {
          setPrograms(progs);
        } else {
          setPrograms(DUMMY_PROGRAMS);
        }
      } catch (err) {
        console.error("getAll_Programs failed", err);
        setPrograms(DUMMY_PROGRAMS);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPrograms();
    return () => (mounted = false);
  }, []);

  const handleBook = (program) => {
    alert(`Book: ${program.name}`);
  };

  const handleApplyFA = (program) => {
    alert(`Apply for Financial Aid: ${program.name}`);
  };

  return (
    <div className="all-programs-page">
      <div className="all-programs-container">
        <h1 className="all-programs-title">All Programs</h1>

        {loading ? (
          <div className="all-programs-loading">Loading programs...</div>
        ) : programs.length ? (
          <div className="all-programs-grid">
            {programs.map((program) => {
              const name = program.name ?? program.Name ?? "Program";
              const orgName =
                program.organizationName ??
                program.OrganizationName ??
                "Organization";
              const startDate = program.startDate ?? program.StartDate ?? "";
              const endDate = program.endDate ?? program.EndDate ?? "";
              const price = program.price ?? program.Price ?? null;
              const location = program.location ?? program.Location ?? "";
              const img =
                program.imageUrl ?? program.img ?? program.image ?? null;

              return (
                <div key={program.id} className="programs-card">
                  <div className="program-img-wrapper">
                    <ImgOrPlaceholder src={img} alt={name} />
                  </div>

                  <div className="program-content">
                    <div className="program-header">
                      <h3 className="program-title">{name}</h3>
                      <span className="program-org">{orgName}</span>
                    </div>

                    <p className="program-desc">
                      {startDate || endDate
                        ? `📅 ${startDate || ""} → ${endDate || ""}`
                        : "Dates not available"}
                      {location && ` | 📍 ${location}`}
                    </p>

                    <div className="program-footer">
                      <span className="program-price">
                        {price != null ? `$${price}` : "Price"}
                      </span>
                      <div className="program-buttons">
                        <button
                          className="program-book-btn"
                          onClick={() => handleBook(program)}
                        >
                          Book
                        </button>
                        <button
                          className="program-fa-btn"
                          onClick={() => handleApplyFA(program)}
                        >
                          Apply for FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="all-programs-empty">No programs available.</div>
        )}
      </div>
    </div>
  );
}