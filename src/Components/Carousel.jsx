import React, { useEffect, useRef, useState } from "react";
import { getPrograms } from '../assets/apis';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import FAApplicationModal from "./FAApplicationModal";
import "../index.css";

export default function Carousel() {
  const [items, setItems] = useState([]);
  const listRef = useRef(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showFAModal, setShowFAModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const fallback = [
    { id: 1, organizationSSN: "ORG-001", name: "Physical Therapy Program", organizationName: "Able Care Center", startDate: "2025-12-20", endDate: "2026-03-20", price: 150, location: "Cairo", imageUrl: null },
    { id: 2, organizationSSN: "ORG-002", name: "Rehabilitation Program", organizationName: "Wellness Hub", startDate: "2026-01-05", endDate: "2026-04-05", price: 180, location: "Giza", imageUrl: null },
    { id: 3, organizationSSN: "ORG-003", name: "Mobility Enhancement", organizationName: "Care Plus", startDate: "2026-01-15", endDate: "2026-05-15", price: 200, location: "Alexandria", imageUrl: null },
    { id: 4, organizationSSN: "ORG-004", name: "Sports Injury Recovery", organizationName: "Hope Centre", startDate: "2026-01-10", endDate: "2026-04-10", price: 200, location: "Cairo", imageUrl: null },
    { id: 5, organizationSSN: "ORG-005", name: "Senior Fitness Program", organizationName: "Golden Care", startDate: "2025-12-25", endDate: "2026-03-25", price: 120, location: "Mansoura", imageUrl: null }
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

  const navigate = useNavigate();
  const { isLoggedIn, userType } = useAuth();

  const handleBook = (program) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate('/Able-Ease#auth-form');
      setTimeout(() => {
        const authElement = document.getElementById('auth-form');
        if (authElement) {
          authElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setSelectedProgram(program);
      setShowBookModal(true);
    }
  };

  const handleApplyFA = (program) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate('/Able-Ease#auth-form');
      setTimeout(() => {
        const authElement = document.getElementById('auth-form');
        if (authElement) {
          authElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setSelectedProgram(program);
      setShowFAModal(true);
    }
  };

  const handleBookConfirm = () => {
    // Modal handles the API call, just close modal here
    setShowBookModal(false);
    setSelectedProgram(null);
  };

  const handleBookCancel = () => {
    setShowBookModal(false);
    setSelectedProgram(null);
  };

  const handleFASubmit = (reason) => {
    const programName = selectedProgram?.name || selectedProgram?.centerName || selectedProgram?.Name || selectedProgram?.title || "Program";
    console.log(`Applied for FA: ${programName}, Reason: ${reason}`);
    alert(`Financial Aid application submitted for: ${programName}\n\nYour reason: ${reason}`);
    setShowFAModal(false);
    setSelectedProgram(null);
  };

  const handleFACancel = () => {
    setShowFAModal(false);
    setSelectedProgram(null);
  };

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
        <h3 className="section-title" style={{ margin: 0 }}>Don't miss coming programs &gt;&gt;</h3>
      </div>

      <div className="carousel" aria-roledescription="carousel">
        <div ref={listRef} className="carousel-list" role="list">
          {items.map((it, idx) => (
            <div className="carousel-item" key={it.organizationSSN ?? it.id ?? it.centerName ?? idx} role="listitem">
              <div className="media" aria-hidden="true">
                <div className="media-placeholder">Image</div>
              </div>

              <h4 className="h4" style={{ marginTop: 8 }}>
                {it.name || it.centerName || it.Name || it.title}
              </h4>

              <p className="small" style={{ marginTop: 6, color: "#666" }}>
                {it.organizationName && `📍 ${it.organizationName}`}
              </p>

              <p className="small" style={{ marginTop: 4, color: "#888" }}>
                {it.location || it.type || (it.physicalTherapies && it.physicalTherapies.join(", "))}
              </p>

              {(it.price || it.Price) && (
                <p className="small" style={{ marginTop: 6, fontWeight: 700, color: "#27865d", fontSize: "1.05rem" }}>
                  💰 ${it.price || it.Price}
                </p>
              )}

              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                <button 
                  className="btn" 
                  onClick={() => handleBook(it)}
                  style={{ padding: "8px 16px", fontSize: "0.9rem" }}
                >
                  Book Now
                </button>
                <button 
                  className="btn" 
                  onClick={() => handleApplyFA(it)}
                  style={{ background: "#f0f0f0", color: "#333", border: "1px solid #ddd", padding: "8px 16px", fontSize: "0.9rem" }}
                >
                  Apply for FA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showBookModal}
        onConfirm={handleBookConfirm}
        onCancel={handleBookCancel}
        title="Confirm Booking"
        message={
          `Are you sure you want to book "${selectedProgram?.name || selectedProgram?.centerName || selectedProgram?.Name || selectedProgram?.title}"?${(selectedProgram?.price || selectedProgram?.Price) ? `\n\nPrice: $${selectedProgram?.price || selectedProgram?.Price}` : ''}`
        }
        program={selectedProgram}
        isBooking={true}
      />

      <FAApplicationModal
        isOpen={showFAModal}
        onSubmit={handleFASubmit}
        onCancel={handleFACancel}
        program={selectedProgram}
      />
    </div>
  );
}
