import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAll_Therapies } from "../assets/apis";
import SessionConfirmationModal from "../Components/SessionConfirmationModal";
import "../Org.css";
import "./AllTherapies.css";

/* Dummy therapies for fallback */
const DUMMY_THERAPIES = [
  {
    id: 1,
    name: "Physical Therapy",
    centerName: "Sunrise Rehab Center",
    pricePerHour: 80,
    duration: "60 min",
    location: "Cairo",
    date: "2025-12-20",
    time: "10:00 AM",
    imageUrl: null,
  },
  {
    id: 2,
    name: "Occupational Therapy",
    centerName: "Hope Wellness Center",
    pricePerHour: 90,
    duration: "45 min",
    location: "Alexandria",
    date: "2025-12-22",
    time: "2:00 PM",
    imageUrl: null,
  },
  {
    id: 3,
    name: "Speech Therapy",
    centerName: "Able Care Hub",
    pricePerHour: 75,
    duration: "50 min",
    location: "Giza",
    date: "2025-12-25",
    time: "9:00 AM",
    imageUrl: null,
  },
  {
    id: 4,
    name: "Hydrotherapy",
    centerName: "Aqua Rehab Center",
    pricePerHour: 100,
    duration: "60 min",
    location: "Cairo",
    date: "2025-12-28",
    time: "11:00 AM",
    imageUrl: null,
  },
  {
    id: 5,
    name: "Manual Therapy",
    centerName: "Physio Plus Center",
    pricePerHour: 85,
    duration: "45 min",
    location: "Alexandria",
    date: "2026-01-02",
    time: "3:00 PM",
    imageUrl: null,
  },
  {
    id: 6,
    name: "Pediatric Therapy",
    centerName: "Kids Care Center",
    pricePerHour: 95,
    duration: "60 min",
    location: "Cairo",
    date: "2026-01-05",
    time: "10:30 AM",
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
      alt={alt || "therapy"}
      className="program-img"
    />
  );
}

export default function AllTherapies() {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  const navigate = useNavigate();
  const { isLoggedIn, userType } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadTherapies = async () => {
      setLoading(true);

      try {
        const res = await getAll_Therapies();
        const therapyData = res?.data;

        if (mounted && Array.isArray(therapyData)) {
          setTherapies(therapyData);
        } else {
          setTherapies(DUMMY_THERAPIES);
        }
      } catch (err) {
        console.error("getAll_Therapies failed", err);
        setTherapies(DUMMY_THERAPIES);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTherapies();
    return () => (mounted = false);
  }, []);

  const handleBook = (therapy) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate('/Able-Ease#auth-form');
      setTimeout(() => {
        const authElement = document.getElementById('auth-form');
        if (authElement) {
          authElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setSelectedTherapy(therapy);
      setShowBookModal(true);
    }
  };

  const handleBookConfirm = () => {
    // Modal handles the API call, just close modal here
    setShowBookModal(false);
    setSelectedTherapy(null);
  };

  const handleBookCancel = () => {
    setShowBookModal(false);
    setSelectedTherapy(null);
  };

  return (
    <div className="all-therapies-page">
      <div className="all-therapies-container">
        <h1 className="all-therapies-title">All Therapies</h1>

        {loading ? (
          <div className="all-therapies-loading">Loading therapies...</div>
        ) : therapies.length ? (
          <div className="all-therapies-grid">
            {therapies.map((therapy) => {
              const name = therapy.name ?? therapy.Name ?? "Therapy";
              const centerName =
                therapy?.center?.name ??
                therapy?.CenterName ??
                therapy?.centername ??
                "Center";
              const pricePerHour =
                therapy.pricePerHour ??
                therapy.PricePerHour ??
                therapy.price ??
                null;
              const duration = therapy.duration ?? therapy.Duration ?? "";
              const location = therapy.location ?? therapy.Location ?? "";
              const date = therapy.date ?? therapy.Date ?? "";
              const time = therapy.time ?? therapy.Time ?? "";
              const img =
                therapy.imageUrl ?? therapy.img ?? therapy.image ?? null;

              return (
                <div key={therapy.id} className="programs-card">
                  <div className="program-img-wrapper">
                    <ImgOrPlaceholder src={img} alt={name} />
                  </div>

                  <div className="program-content">
                    <div className="program-header">
                      <h3 className="program-title">{name}</h3>
                      <span className="program-org">{centerName}</span>
                    </div>

                    <p className="program-desc">
                      {duration && `⏱️ ${duration}`}
                      {(date || time) && ` | 📅 ${date || ""} ${time || ""}`}
                      {location && ` | 📍 ${location}`}
                    </p>

                    <div className="program-footer">
                      <span className="program-price">
                        {pricePerHour != null ? `$${pricePerHour}/hr` : "Price"}
                      </span>
                      <div className="program-buttons">
                        <button
                          className="program-book-btn"
                          onClick={() => handleBook(therapy)}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="all-therapies-empty">No therapies available.</div>
        )}
      </div>

      <SessionConfirmationModal
        isOpen={showBookModal}
        onConfirm={handleBookConfirm}
        onCancel={handleBookCancel}
        title="Confirm Session Booking"
        message={`Are you sure you want to book "${selectedTherapy?.name || selectedTherapy?.Name}"?${(selectedTherapy?.pricePerHour || selectedTherapy?.PricePerHour) ? `\n\nPrice: $${selectedTherapy?.pricePerHour || selectedTherapy?.PricePerHour}/hr` : ''}`}
        therapy={selectedTherapy}
        isBooking={true}
      />
    </div>
  );
}