import React, { useEffect, useState, useRef } from "react";
import { getPhysicenters } from "../assets/api";
import "../index.css";

import bg from "../assets/89317a691ebd3da8f3477755ea64dd5e1ed1c1c7.png";
export default function Physicenterfind() {
  const dummyCenters = [
    { id: 1, name: "Physio Care Center", location: "New York", image: "" },
    { id: 2, name: "Physio Care Center", location: "Los Angeles", image: "" },
    { id: 3, name: "Physio Care Center", location: "Chicago", image: "" },
    { id: 4, name: "Physio Care Center", location: "Miami", image: "" },
    { id: 5, name: "Physio Care Center", location: "Boston", image: "" },
    { id: 6, name: "Physio Care Center", location: "Seattle", image: "" },
  ];

  const [centers, setCenters] = useState(dummyCenters);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 260; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    let m = true;

    const load = async () => {
      try {
        const res = await getPhysicenters();
        if (m && res.data?.length) setCenters(res.data);
      } catch (err) {
        console.log("Centers API not ready — using dummy data");
      } finally {
        if (m) setLoading(false);
      }
    };

    load();
    return () => (m = false);
  }, []);

  return (
    <section
      className="centers-strip"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#198751", // light green
      }}
    >
      <div className="Program_finds">
        <div className="section-title">
          <h2 style={{ color: "white", margin: 0, marginLeft: "120px" }}>
            connect to nearby <br />
            physiotherapy centers
          </h2>
          <button
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "8px 12px",
              marginRight: "110px",
            }}
          >
            View More
            <i className="arrow fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="slider-container">
          <button
            className="slider-arrow left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="centers-row" ref={scrollRef} aria-live="polite">
            {centers.map((c) => (
              <div key={`center-${c.id}`} className="org-card" style={{ minWidth: "280px", maxWidth: "280px" }}>
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
                  {c.image || c.imageUrl ? (
                    <img
                      src={c.image || c.imageUrl}
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

          <button
            className="slider-arrow right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
