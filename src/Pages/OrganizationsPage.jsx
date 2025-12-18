import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState } from "../context/AuthState";
import "../Org.css";
import OrgCarousel from "../Components/OrgCarousel";
import ProgramCard from "../Components/ProgramCard";
import PositionCard from "../Components/PositionsCard";
import CaregiverCarousel from "../Components/CaregiverCarousel";
import ConfirmationModal from "../Components/ConfirmationModal";
import ContactModal from "../Components/ContactModal";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";

import {
  getOrganizations,
  getPagedOrganizations,
  getOrg_Programs,
  getOrg_CareGivers,
  getOrg_Proposals,
} from "../assets/apis";

/* Dummy fallback data */
const DUMMY_ORGANIZATIONS = [
  { ssn: "ORG-001", name: "Physio Care Center", imageUrl: null },
  { ssn: "ORG-002", name: "Able Learning Hub", imageUrl: null },
];

const DUMMY_PROGRAMS = [
  {
    id: 11,
    name: "Rehab for Seniors",
    organizationSSN: "ORG-001",
  },
  {
    id: 12,
    name: "Child Motor Skills",
    organizationSSN: "ORG-002",
  },
];

const DUMMY_POSITIONS = [
  {
    positionId: 101,
    positionName: "Physiotherapist",
    organizationSSN: "ORG-001",
  },
  {
    positionId: 102,
    positionName: "Care Assistant",
    organizationSSN: "ORG-002",
  },
];

const DUMMY_CAREGIVERS = [
  {
    id: 201,
    name: "Ahmed Salah",
    organizationSSN: "ORG-001",
  },
  {
    id: 202,
    name: "Nour Ali",
    organizationSSN: "ORG-002",
  },
];

export default function OrganizationsPage() {
  const { alertState, showAlert, closeAlert } = useAlert();
  const [organizations, setOrganizations] = useState(DUMMY_ORGANIZATIONS);
  const [programs, setPrograms] = useState([]);
  const [positions, setPositions] = useState([]);
  const [caregivers, setCaregivers] = useState([]);

  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState(null);

  const [showBookModal, setShowBookModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();
  const [{ isLoggedIn, userType }, setLocalAuth] = useState(getAuthState());
  useEffect(() => {
    const handler = () => setLocalAuth(getAuthState());
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  /* helper to read SSN from various shapes */
  const readSSN = (o) =>
    o?.ssn ?? o?.OrganizationSSN ?? o?.organizationSSN ?? o?.id ?? null;

  /* =========================
     Load Organizations
     ========================= */
  useEffect(() => {
    let mounted = true;

    const loadOrganizations = async () => {
      setLoadingOrgs(true);

      try {
        const res = await getPagedOrganizations(currentPage, pageSize);
        const orgs = res?.data;

        if (mounted && Array.isArray(orgs) && orgs.length) {
          setOrganizations(orgs);

          // Select first org
          const firstSSN = readSSN(orgs[0]);
          if (firstSSN) setSelectedOrg(firstSSN);
        } else {
          setOrganizations([]);
          setSelectedOrg(null);
        }
      } catch (err) {
        console.error("getPagedOrganizations failed", err);
        setOrganizations([]);
        setSelectedOrg(null);
      } finally {
        if (mounted) setLoadingOrgs(false);
      }
    };

    loadOrganizations();
    return () => (mounted = false);
  }, [currentPage]);

  /* =========================
     Load Programs / Caregivers / Positions
     ========================= */

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;

    let mounted = true;
    setLoadingData(true);

    const loadData = async () => {
      try {
        const [progRes, carRes, posRes] = await Promise.allSettled([
          getOrg_Programs(selectedOrg),
          getOrg_CareGivers(selectedOrg),
          getOrg_Proposals(selectedOrg),
        ]);

        // Programs
        if (
          progRes.status === "fulfilled" &&
          Array.isArray(progRes.value?.data)
        ) {
          setPrograms(progRes.value.data);
        } else {
          setPrograms([]);
        }

        // Positions
        if (
          posRes.status === "fulfilled" &&
          Array.isArray(posRes.value?.data)
        ) {
          setPositions(posRes.value.data);
        } else {
          setPositions([]);
        }

        // Caregivers
        if (
          carRes.status === "fulfilled" &&
          Array.isArray(carRes.value?.data)
        ) {
          setCaregivers(carRes.value.data);
        } else {
          setCaregivers([]);
        }
      } catch (err) {
        console.error("Error loading data", err);
        setPrograms([]);
        setPositions([]);
        setCaregivers([]);
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    loadData();
    return () => (mounted = false);
  }, [selectedOrg]);

  const selectedOrgName =
    organizations.find((o) => readSSN(o) === selectedOrg)?.name ?? "";

  /* =========================
     Handlers
     ========================= */
  const handleOrgSelect = (ssn) => {
    if (ssn && ssn !== selectedOrg) {
      setPrograms([]);
      setPositions([]);
      setCaregivers([]);
      setSelectedOrg(ssn);
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
      // Add organizationSSN to program for booking
      setSelectedProgram({ ...program, organizationSSN: selectedOrg });
      setShowBookModal(true);
    }
  };

  const handleApply = (pos) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate("/Able-Ease#auth-form");
      setTimeout(() => {
        const authElement = document.getElementById("auth-form");
        if (authElement) {
          authElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      // Add organizationSSN to position for application
      setSelectedPosition({ ...pos, organizationSSN: selectedOrg });
      setShowApplyModal(true);
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

  const handleApplyConfirm = () => {
    // Modal handles the API call, just close modal here
    setShowApplyModal(false);
    setSelectedPosition(null);
  };

  const handleApplyCancel = () => {
    setShowApplyModal(false);
    setSelectedPosition(null);
  };

  const handleContact = (caregiver) => {
    if (!isLoggedIn) {
      navigate("/Able-Ease#auth-form");
      setTimeout(() => {
        const authElement = document.getElementById("auth-form");
        if (authElement) {
          authElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      setSelectedCaregiver(caregiver);
      setShowContactModal(true);
    }
  };

  const handleContactConfirm = async (formData) => {
    try {
      const senderSSN = localStorage.getItem("ssn");
      const receiverSSN =
        selectedCaregiver?.id ||
        selectedCaregiver?.ID ||
        selectedCaregiver?.ssn;

      const response = await fetch(
        "https://localhost:7040/api/Message/send/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            senderSSN: senderSSN,
            receiverSSN: receiverSSN,
            subject: formData.subject,
            body: formData.body,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      showAlert("Message sent successfully!", "success");
      setShowContactModal(false);
      setSelectedCaregiver(null);
    } catch (error) {
      console.error("Error sending message:", error);
      showAlert("Failed to send message. Please try again.", "error");
    }
  };

  const handleContactCancel = () => {
    setShowContactModal(false);
    setSelectedCaregiver(null);
  };

  /* =========================
     Render
     ========================= */
  return (
    <div className="page-root">
      <h1 style={{ color: "#27865d", paddingLeft: 22 }}>Organizations</h1>

      <section style={{ marginTop: 18 }}>
        <OrgCarousel
          organizations={organizations}
          onSelect={handleOrgSelect}
          selectedSSN={selectedOrg}
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
          disabled={organizations.length < pageSize}
          style={{
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: organizations.length < pageSize ? "#999" : "white",
            background:
              organizations.length < pageSize
                ? "#e0e0e0"
                : "linear-gradient(135deg, #27865d 0%, #1e6b4a 100%)",
            border: "none",
            borderRadius: "8px",
            cursor: organizations.length < pageSize ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow:
              organizations.length < pageSize
                ? "none"
                : "0 4px 12px rgba(39, 134, 93, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (organizations.length >= pageSize) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(39, 134, 93, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (organizations.length >= pageSize) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(39, 134, 93, 0.3)";
            }
          }}
        >
          Next →
        </button>
      </div>

      <div className="container-oragnizations">
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>Programs for {selectedOrgName}</h2>

          {loadingData ? (
            <div>Loading programs...</div>
          ) : programs.length ? (
            programs.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                orgName={selectedOrgName}
                onBook={handleBook}
              />
            ))
          ) : (
            <div>No programs for this organization.</div>
          )}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>Open Positions</h2>

          {loadingData ? (
            <div>Loading positions...</div>
          ) : positions.length ? (
            positions.map((pos) => (
              <PositionCard
                key={pos.positionId}
                pos={pos}
                onApply={handleApply}
              />
            ))
          ) : (
            <div>No open positions.</div>
          )}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>Care-Takers</h2>

          {loadingData ? (
            <div>Loading caregivers...</div>
          ) : caregivers.length ? (
            <CaregiverCarousel
              caregivers={caregivers}
              showCount={1}
              onContact={handleContact}
            />
          ) : (
            <div>No caregivers for this organization.</div>
          )}
        </section>
      </div>

      <ConfirmationModal
        isOpen={showBookModal}
        onConfirm={handleBookConfirm}
        onCancel={handleBookCancel}
        title="Confirm Booking"
        message={`Are you sure you want to book "${
          selectedProgram?.name || selectedProgram?.Name
        }"?\n\nYou will pay: $${
          selectedProgram?.price || selectedProgram?.Price || 0
        }`}
        program={selectedProgram}
        isBooking={true}
      />

      <ConfirmationModal
        isOpen={showApplyModal}
        onConfirm={handleApplyConfirm}
        onCancel={handleApplyCancel}
        title="Confirm Application"
        message="Confirm to Apply for this position and wait for the reply!!"
        program={selectedPosition}
        isApply={true}
      />

      <ContactModal
        isOpen={showContactModal}
        onConfirm={handleContactConfirm}
        onCancel={handleContactCancel}
        receiverName={selectedCaregiver?.name || selectedCaregiver?.Name || ""}
      />

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
}
