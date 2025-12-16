import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState } from "../context/AuthState";
import "../Org.css";
import TherapyCenterCarousel from "../Components/TherapyCenterCarousel";
import ProgramCard from "../Components/ProgramCard";
import SessionConfirmationModal from "../Components/SessionConfirmationModal";
import { getCenters, getcenter_Therapies } from "../assets/apis";

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
        const res = await getCenters();
        const centers = res?.data;

        if (mounted && Array.isArray(centers) && centers.length) {
          setTherapyCenters(centers);

          // Select first center
          const firstSSN = getCenterSSN(centers[0]);
          if (firstSSN) setSelectedCenter(firstSSN);
        } else {
          setTherapyCenters(DUMMY_Centers);
          setSelectedCenter(getCenterSSN(DUMMY_Centers[0]));
        }
      } catch (err) {
        console.error("getCenters failed", err);
        setTherapyCenters(DUMMY_Centers);
        setSelectedCenter(getCenterSSN(DUMMY_Centers[0]));
      } finally {
        if (mounted) setLoadingCenters(false);
      }
    };

    loadCenters();
    return () => (mounted = false);
  }, []);

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
        setPrograms(DUMMY_Therapies);
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
