import React, { useEffect, useState, useRef } from "react";
import { getPrograms } from "../assets/apis";
import "../index.css";
import programimg from "../assets/unsplash_VOUicg8Ejus.png";
export default function Programfind() {
  const dummyPrograms = [
    {
      id: 1,
      name: "Physio Care Center",
      image: programimg,
      Price: "100$",
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
    {
      id: 2,
      name: "Physio Care Center",
      image: programimg,
      Price: "100$",
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
    {
      id: 3,
      name: "Physio Care Center",
      image: programimg,
      Price: "100$",
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
    {
      id: 4,
      name: "Physio Care Center",
      image: programimg,
      Price: "100$",
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
    {
      id: 5,
      name: "Physio Care Center",
      image: programimg,
      Price: "100$",
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
    {
      id: 6,
      name: "Physio Care Center",
      image: programimg,
      Price: "100$",
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
  ];

  const [programs, setprograms] = useState(dummyPrograms);
  const [loading, setloading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 260;
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
        const res = await getPrograms();
        if (m && res.data?.length) setprograms(res.data);
      } catch (err) {
        console.log("Centers API not ready — placeholders showing");
      } finally {
        if (m) setloading(false);
      }
    };
    load();
    return () => (m = false);
  }, []);

  return (
    <section className="centers-strip">
      <div className="Program_finds">
        <div className="section-title">
          <h2 style={{ color: "#198751", margin: 0, marginLeft: "120px" }}>
            Find Programs &gt; &gt; &gt;
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
            <i className=" arrow fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="slider-container" style={{ marginTop: 18 }}>
          <button
            className="slider-arrow left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="centers-row" ref={scrollRef} aria-live="polite">
            {programs.map((c) => (
              <div key={c.id} className="center-card">
                <img
                  src={c.imageUrl || ""}
                  alt={c.name}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <h3 style={{ marginTop: 10 }}>{c.name}</h3>
                <p style={{ color: "#6b7280" }}>${c.price}</p>
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
