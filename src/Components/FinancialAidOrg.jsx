import React, { useEffect, useState, useRef } from "react";
import { fetchFinancialAid } from "../assets/apis.js";
import "../profilepagecomponents/organization.css";

export default function FinancialAid() {
  const dummyFinancialAids = [
    {
      id: 1,
      sessionName: "Financial Aid Session A",
      location: "Online",
      price: "$100",
    },
    {
      id: 2,
      sessionName: "Financial Aid Session B",
      location: "New York Center",
      price: "$100",
    },
  ];

  const [finAid, setFinAid] = useState(dummyFinancialAids);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const faTrackRef = useRef(null);

  useEffect(() => {
    const track = faTrackRef.current;
    if (!track) return;

    const update = () => {
      requestAnimationFrame(() => {
        const tolerant = track.clientWidth + 20;
        const shouldCenter =
          Math.ceil(track.scrollWidth) <= Math.floor(tolerant);
        const wrapper = track.parentElement;
        if (shouldCenter) {
          wrapper?.classList.add("centered");
        } else {
          wrapper?.classList.remove("centered");
        }
      });
    };

    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(track);
    }
    window.addEventListener("resize", update);
    const tick = setTimeout(update, 50);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", update);
      clearTimeout(tick);
    };
  }, [finAid]);

  useEffect(() => {
    let mounted = true;

    const loadFinAid = async () => {
      try {
        setLoading(true);
        //   const resFA = await fetchFinancialAid();
        if (mounted && resFA.data?.length) {
          setFinAid(resFA.data);
        }
      } catch (err) {
        console.log("Financial Aid API not ready — using dummy data");
        if (mounted) {
          setError(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFinAid();
    return () => (mounted = false);
  }, []);

  return (
    <section className="section-box">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>FAS - if available</h3>
        <button
          style={{
            background: "#d8ecfb",
            borderRadius: "20px",
            border: "none",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          View More
          <i className="arrow fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading financial aid...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          <p>Error loading financial aid.</p>
        </div>
      ) : (
        <div className="slider-wrapper">
          <button
            aria-label="previous financial aids"
            className="slider-btn left"
            onClick={() => {
              if (faTrackRef.current) {
                const amount = faTrackRef.current.clientWidth * 0.8;
                faTrackRef.current.scrollBy({
                  left: -amount,
                  behavior: "smooth",
                });
              }
            }}
          >
            ‹
          </button>

          <div className="cards-wrapper">
            <div ref={faTrackRef} className="cards-track" role="list">
              {finAid.map((fa) => (
                <div key={fa.id} className="program-card" role="listitem">
                  <div className="program-card-header">
                    <h4>{fa.sessionName}</h4>
                    <span className="program-status">Available</span>
                  </div>

                  <div className="program-meta">
                    <div className="program-price">
                      <i className="fa-solid fa-dollar-sign"></i> {fa.price}
                    </div>
                    <div className="program-dates">
                      <div className="date-item">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{fa.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="program-actions">
                    <button
                      className="program-action-btn details-btn"
                      title="View Details"
                    >
                      <i className="fa-solid fa-eye"></i> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            aria-label="next financial aids"
            className="slider-btn right"
            onClick={() => {
              if (faTrackRef.current) {
                const amount = faTrackRef.current.clientWidth * 0.8;
                faTrackRef.current.scrollBy({
                  left: amount,
                  behavior: "smooth",
                });
              }
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}