import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState } from "../context/AuthState";
import "../Org.css";
import TherapyCenterCarousel from "../Components/TherapyCenterCarousel";
import ProgramCard from "../Components/ProgramCard";
import SessionConfirmationModal from "../Components/SessionConfirmationModal";
import {
  getCenters,
  getPagedCenters,
  getcenter_Therapies,
} from "../assets/apis";

/* Dummy fallback data */
const DUMMY_Centers = [
  { ssn: "CEN-001", name: "Physio Care Center", imageUrl: null },
  { ssn: "CEN-002", name: "Able Learning Hub", imageUrl: null },
];

const DUMMY_Therapies = [
  {
    id: 11,
    name: "Rehab for Seniors",
    centerSSN: "CEN-001",
  },
  {
    id: 12,
    name: "Child Motor Skills",
    centerSSN: "CEN-002",
  },
];

export default function TherapyCenters() {
  const [therapyCenters, setTherapyCenters] = useState(DUMMY_Centers);
  const [programs, setPrograms] = useState([]);

  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState(null);

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();
  const [{ isLoggedIn, userType }, setLocalAuth] = useState(getAuthState());
  useEffect(() => {
    const handler = () => setLocalAuth(getAuthState());
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  /* helper to extract center SSN */
  const getCenterSSN = (item) => {
    if (!item) return null;
    return item.ssn ?? item.SSN ?? item.CenterSSN ?? item.centerSSN ?? null;
  };

  /* =========================
     Load Therapy Centers
     ========================= */
  useEffect(() => {
    let mounted = true;

    const loadCenters = async () => {
      setLoadingCenters(true);

      try {
        const res = await getPagedCenters(currentPage, pageSize);
        const centers = res?.data;

        if (mounted && Array.isArray(centers) && centers.length) {
          setTherapyCenters(centers);

          // Select first center
          const firstSSN = getCenterSSN(centers[0]);
          if (firstSSN) setSelectedCenter(firstSSN);
        } else {
          setTherapyCenters([]);
          setSelectedCenter(null);
        }
      } catch (err) {
        console.error("getPagedCenters failed", err);
        setTherapyCenters([]);
        setSelectedCenter(null);
      } finally {
        if (mounted) setLoadingCenters(false);
      }
    };

    loadCenters();
    return () => (mounted = false);
  }, [currentPage]);

  /* =========================
     Load Therapies
     ========================= */

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!selectedCenter) return;

    let mounted = true;
    setLoadingPrograms(true);

    const loadTherapies = async () => {
      try {
        const res = await getcenter_Therapies(selectedCenter);

        // Only set programs if API returns data with length, otherwise show "No therapies"
        if (
          mounted &&
          res?.data &&
          Array.isArray(res.data) &&
          res.data.length
        ) {
          setPrograms(res.data);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        console.error("getcenter_Therapies failed", err);
        setPrograms([]);
      } finally {
        if (mounted) setLoadingPrograms(false);
      }
    };

    loadTherapies();
    return () => (mounted = false);
  }, [selectedCenter]);

  const selectedCenterName =
    therapyCenters.find((c) => getCenterSSN(c) === selectedCenter)?.name ?? "";

  /* =========================
     Handlers
     ========================= */
  const handleCenterSelect = (ssn) => {
    if (ssn && ssn !== selectedCenter) {
      setPrograms([]);
      setSelectedCenter(ssn);
    }
  };

  const handleBook = (program) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate("/Able-Ease#auth-form");
      setTimeout(() => {
        const authElement = document.getElementById("auth-form");
        if (authElement) {
          authElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      setSelectedTherapy(program);
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

  /* =========================
     Render
     ========================= */
  return (
    <div className="page-root">
      <h1 style={{ color: "#27865d", paddingLeft: 22 }}>Therapy Centers</h1>

      <section style={{ marginTop: 18 }}>
        <TherapyCenterCarousel
          TherapyCenters={therapyCenters}
          onSelect={handleCenterSelect}
          selectedSSN={selectedCenter}
        />
      </section>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          margin: "30px 0",
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: currentPage === 1 ? "#999" : "white",
            background:
              currentPage === 1
                ? "#e0e0e0"
                : "linear-gradient(135deg, #27865d 0%, #1e6b4a 100%)",
            border: "none",
            borderRadius: "8px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow:
              currentPage === 1 ? "none" : "0 4px 12px rgba(39, 134, 93, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(39, 134, 93, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(39, 134, 93, 0.3)";
            }
          }}
        >
          ← Previous
        </button>

        <span
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#27865d",
            padding: "10px 20px",
            background: "#f0f7f4",
            borderRadius: "8px",
            border: "2px solid #27865d",
          }}
        >
          Page {currentPage}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={therapyCenters.length < pageSize}
          style={{
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: therapyCenters.length < pageSize ? "#999" : "white",
            background:
              therapyCenters.length < pageSize
                ? "#e0e0e0"
                : "linear-gradient(135deg, #27865d 0%, #1e6b4a 100%)",
            border: "none",
            borderRadius: "8px",
            cursor:
              therapyCenters.length < pageSize ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow:
              therapyCenters.length < pageSize
                ? "none"
                : "0 4px 12px rgba(39, 134, 93, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (therapyCenters.length >= pageSize) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(39, 134, 93, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (therapyCenters.length >= pageSize) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(39, 134, 93, 0.3)";
            }
          }}
        >
          Next →
        </button>
      </div>

      <div className="container" style={{ padding: 22 }}>
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>
            Therapies at {selectedCenterName}
          </h2>

          {loadingPrograms ? (
            <div>Loading therapies...</div>
          ) : programs.length ? (
            programs.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                orgName={selectedCenterName}
                onBook={handleBook}
              />
            ))
          ) : (
            <div>No therapies for this center.</div>
          )}
        </section>
      </div>

      <SessionConfirmationModal
        isOpen={showBookModal}
        onConfirm={handleBookConfirm}
        onCancel={handleBookCancel}
        title="Confirm Session Booking"
        message={`Are you sure you want to book "${
          selectedTherapy?.name || selectedTherapy?.Name
        }"?`}
        therapy={selectedTherapy}
        isBooking={true}
      />
    </div>
  );
}
