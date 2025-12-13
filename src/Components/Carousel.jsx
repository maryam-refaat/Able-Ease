import React, { useEffect, useRef, useState } from "react";
import { getPrograms } from "../assets/apis";
import "../index.css";

export default function Carousel() {
  const [items, setItems] = useState([]);
  const listRef = useRef(null);

  const fallback = [
    { id: "C-01", centerName: "Physio Care Cairo", physicalTherapies: ["Hydrotherapy", "Manual Therapy"], location: "Cairo, Egypt" },
    { id: "C-02", centerName: "Rehab Plus", physicalTherapies: ["Exercise Therapy"], location: "Giza, Egypt" },
    { id: "C-03", centerName: "Rehab Plus 2", physicalTherapies: ["Exercise Therapy"], location: "Giza, Egypt" },
    { id: "C-04", centerName: "Physio Care Maadi", physicalTherapies: ["Hydrotherapy"], location: "Cairo, Egypt" },
    { id: "C-05", centerName: "Physio Care Heliopolis", physicalTherapies: ["Manual Therapy"], location: "Cairo, Egypt" }
  ];

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getPrograms();
        if (!mounted) return;
        // support axios result shape (res.data) or direct array
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setItems(data.length ? data : fallback);
      } catch (err) {
        if (!mounted) return;
        console.warn("getPrograms failed — using fallback data", err);
        setItems(fallback);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // scroll helpers
  const scrollByWidth = (direction = 1) => {
    const el = listRef.current;
    if (!el) return;
    const containerWidth = el.clientWidth;
    const scrollAmount = Math.max(containerWidth * 0.8, 280); // scroll almost one card width
    el.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };

  const handlePrev = () => scrollByWidth(-1);
  const handleNext = () => scrollByWidth(1);

  // keyboard support
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="carousel-wrapper container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 className="section-title" style={{ margin: 0 }}>Don’t miss coming programs &gt;&gt;</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="carousel-arrow" onClick={handlePrev} aria-label="Previous">‹</button>
          <button type="button" className="carousel-arrow" onClick={handleNext} aria-label="Next">›</button>
        </div>
      </div>

      <div className="carousel" aria-roledescription="carousel">
        <div ref={listRef} className="carousel-list" role="list">
          {items.map((it, idx) => (
            <div className="carousel-item" key={it.id ?? it.centerName ?? idx} role="listitem">
              <div className="media" aria-hidden="true">
                {/* replace with <img src={it.image} alt={it.centerName} /> when available */}
                <div className="media-placeholder">Image</div>
              </div>

              <h4 className="h4" style={{ marginTop: 8 }}>
                {it.centerName || it.Name || it.title}
              </h4>

              <p className="small" style={{ marginTop: 6 }}>
                {it.location || it.type || (it.physicalTherapies && it.physicalTherapies.join(", "))}
              </p>

              <div style={{ marginTop: 12 }}>
                <button className="btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
