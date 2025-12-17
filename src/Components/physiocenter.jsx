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
          <h2 style={{ color: "white", margin: 0, marginLeft: "50px" }}>
            Connect to nearby physiotherapy centers
          </h2>
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
              <div key={`center-${c.id}`} className="center-card">
                {c.image || c.imageUrl ? (
                  <img src={c.image || c.imageUrl} alt={c.name} />
                ) : (
                  <div
                    style={{
                      width: "99%",
                      height: "150px",
                      background: "#e5e7eb",
                      borderRadius: "20px 20px 20px 20px",
                      display: "block",
                      margin: "12px auto 18px auto",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                      textAlign: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      color: "#777",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      Image
                    </div>
                  </div>
                )}

                <h3>{c.name}</h3>

                <p style={{ marginTop: "6px" }}>📍 {c.location}</p>

                {c.contactInfo && (
                  <p style={{ marginTop: "4px", fontSize: "14px" }}>
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
