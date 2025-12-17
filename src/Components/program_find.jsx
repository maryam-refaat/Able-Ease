import React, { useEffect, useState, useRef } from "react";
import { getPrograms } from "../assets/apis";
import "../index.css";
import programimg from "../assets/unsplash_VOUicg8Ejus.png";
import ProgramFindCard from "./ProgramFindCard";
import "./ProgramFindCard.css";
export default function Programfind() {
  const dummyPrograms = [
    {
      id: 1,
      name: "Physical Therapy Program",
      organizationName: "Able Care Center",
      location: "Cairo, Egypt",
      image: programimg,
      price: 150,
      S_date: "2025-12-04",
      E_date: "2025-01-04",
    },
    {
      id: 2,
      name: "Rehabilitation Program",
      organizationName: "Wellness Hub",
      location: "Giza, Egypt",
      image: programimg,
      price: 180,
      S_date: "2026-01-05",
      E_date: "2026-04-05",
    },
    {
      id: 3,
      name: "Mobility Enhancement",
      organizationName: "Care Plus",
      location: "Alexandria, Egypt",
      image: programimg,
      price: 200,
      S_date: "2026-01-15",
      E_date: "2026-05-15",
    },
    {
      id: 4,
      name: "Sports Injury Recovery",
      organizationName: "Hope Centre",
      location: "Mansoura, Egypt",
      image: programimg,
      price: 220,
      S_date: "2026-01-10",
      E_date: "2026-04-10",
    },
    {
      id: 5,
      name: "Senior Fitness Program",
      organizationName: "Golden Care",
      location: "Tanta, Egypt",
      image: programimg,
      price: 120,
      S_date: "2025-12-25",
      E_date: "2026-03-25",
    },
    {
      id: 6,
      name: "Pediatric Therapy",
      organizationName: "Kids First Center",
      location: "Ismailia, Egypt",
      image: programimg,
      price: 160,
      S_date: "2026-02-01",
      E_date: "2026-05-01",
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
          <h2 className="glowing-title" style={{ color: "white", margin: 0, paddingLeft: "50px" }}>
            Find Programs &gt; &gt; &gt;
          </h2>
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
              <ProgramFindCard 
                key={c.id} 
                program={c}
                onBook={() => console.log('Book:', c.name)}
              />
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
