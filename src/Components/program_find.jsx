import React, { useEffect, useState, useRef } from "react";
import { getPrograms } from "../assets/apis";
import "./program_find.css";
import programimg from "../assets/unsplash_VOUicg8Ejus.png";
import { useNavigate } from "react-router-dom";
export default function Programfind() {
  const navigate = useNavigate();
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

  const handleCardClick = () => {
    const authSection = document.getElementById("auth-form");
    if (authSection) {
      authSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <section className="program-section">
      <div className="program-container">
        <div className="program-header">
          <h2 className="program-title2">Discover Our Programs</h2>
          <button
            className="program-view-btn"
            onClick={() => navigate("/all-programs")}
          >
            View All
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="program-slider">
          <button
            className="program-arrow left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="program-cards" ref={scrollRef} aria-live="polite">
            {programs.map((c) => (
              <div
                key={c.id}
                className="program-card2"
                onClick={handleCardClick}
              >
                <img src={c.imageUrl || c.image || programimg} alt={c.name} />
                <div className="program-badge">Featured</div>
                <h3>{c.name}</h3>
                <p>${c.price || c.Price}</p>
              </div>
            ))}
          </div>

          <button
            className="program-arrow right"
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
