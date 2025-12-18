import React, { useEffect, useState, useRef } from "react";
import {
  fetchAvailablePrograms,
  addProgram,
  updateProgram,
} from "../assets/apis.js";
import ProgramPatientsModal from "./ProgramPatientsModal";
import ProgramModal from "./ProgramModal";
import "../profilepagecomponents/organization.css";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";
import { formatDate } from "../utils/dateFormatter";

export default function AvailablePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [cannotDeleteMessage, setCannotDeleteMessage] = useState({
    title: "",
    message: "",
  });
  const progTrackRef = useRef(null);
  const { alertState, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const ssn = localStorage.getItem("ssn");
        const resProg = await fetchAvailablePrograms(ssn);
        setPrograms(resProg.data || []);
        setError(false);
      } catch (err) {
        console.error("Programs API failed", err);
        setPrograms([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  const handleAddProgram = () => {
    setSelectedProgramForEdit(null);
    setIsModalOpen(true);
  };

  const handleUpdateProgram = (program) => {
    setSelectedProgramForEdit(program);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (program) => {
    if (!window.confirm(`Delete "${program.name}"?`)) return;

    setDeleteLoading(program.id);
    try {
      // First, check if the program has any patients
      const ssn = localStorage.getItem("ssn");
      const checkResponse = await fetch(
        `https://localhost:7040/api/Program/GetProgramPatients/${ssn}/${program.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (checkResponse.ok) {
        const patients = await checkResponse.json();
        if (patients && patients.length > 0) {
          setCannotDeleteMessage({
            title: "Cannot Delete Program",
            message: `The program "${program.name}" has ${
              patients.length
            } enrolled patient${
              patients.length > 1 ? "s" : ""
            }. Please remove all patients before deleting this program.`,
          });
          setShowCannotDeleteModal(true);
          setDeleteLoading(null);
          return;
        }
      }

      // If no patients, proceed with deletion
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPrograms(programs.filter((p) => p.id !== program.id));
    } catch (err) {
      console.error("Error deleting program:", err);
      showAlert("Failed to delete program", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSubmitProgram = async (formData) => {
    const ssn = localStorage.getItem("ssn");

    if (selectedProgramForEdit) {
      // Update
      await updateProgram(ssn, selectedProgramForEdit.id, formData);
      setPrograms(
        programs.map((p) =>
          p.id === selectedProgramForEdit.id
            ? {
                name: formData.get("Name"),
                price: formData.get("Price"),
                startDate: formData.get("StartDate"),
                endDate: formData.get("EndDate"),
                location: formData.get("Location"),
                status: formData.get("Status"),
              }
            : p
        )
      );
    } else {
      // Add
      const newProgramResponse = await addProgram(ssn, formData);
      const newProgram = {
        id: newProgramResponse?.id || Date.now(),
        name: formData.get("Name"),
        price: formData.get("Price"),
        startDate: formData.get("StartDate"),
        endDate: formData.get("EndDate"),
        location: formData.get("Location"),
        status: formData.get("Status") || "Active",
      };
      setPrograms([...programs, newProgram]);
    }
  };

  return (
    <section className="section-box" style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Available Programs</h3>
        <button className="action-btn add-btn" onClick={handleAddProgram}>
          <i className="fa-solid fa-plus"></i> Add Program
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading programs...
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          Error loading programs.
        </div>
      ) : (
        <div className="slider-wrapper">
          <div className="cards-wrapper">
            <button
              className="slider-btn left"
              onClick={() =>
                progTrackRef.current?.scrollBy({
                  left: -progTrackRef.current.clientWidth * 0.8,
                  behavior: "smooth",
                })
              }
            >
              ‹
            </button>
            <div ref={progTrackRef} className="cards-track">
              {programs.length === 0 ? (
                <div
                  style={{
                    padding: "40px",
                    width: "100%",
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  No programs available
                </div>
              ) : (
                programs.map((p) => (
                  <div key={p.id} className="program-card">
                    <div className="program-card-header">
                      <h4>{p.name}</h4>
                      <span className="program-status">{p.status}</span>
                    </div>
                    <div className="program-meta">
                      <div className="program-price">
                        <i className="fa-solid fa-dollar-sign"></i> ${p.price}
                      </div>
                      <div className="program-dates">
                        <span>{formatDate(p.startDate)}</span> -{" "}
                        <span>{formatDate(p.endDate)}</span>
                      </div>
                    </div>
                    <div className="program-actions">
                      <button
                        className="program-action-btn details-btn"
                        onClick={() => {
                          setSelectedProgram(p);
                          setShowPatientsModal(true);
                        }}
                      >
                        Details
                      </button>
                      <button
                        className="program-action-btn update-btn-small"
                        onClick={() => handleUpdateProgram(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="program-action-btn delete-btn-small"
                        disabled={deleteLoading === p.id}
                        onClick={() => handleDeleteProgram(p)}
                      >
                        {deleteLoading === p.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="slider-btn right"
              onClick={() =>
                progTrackRef.current?.scrollBy({
                  left: progTrackRef.current.clientWidth * 0.8,
                  behavior: "smooth",
                })
              }
            >
              ›
            </button>
          </div>
        </div>
      )}

      {showPatientsModal && selectedProgram && (
        <ProgramPatientsModal
          program={selectedProgram}
          onClose={() => setShowPatientsModal(false)}
        />
      )}

      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProgram}
        program={selectedProgramForEdit}
      />

      {/* Cannot Delete Modal */}
      {showCannotDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCannotDeleteModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "480px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#fee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e74c3c"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#2c3e50",
                }}
              >
                {cannotDeleteMessage.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#7f8c8d",
                  lineHeight: "1.6",
                }}
              >
                {cannotDeleteMessage.message}
              </p>
            </div>
            <button
              onClick={() => setShowCannotDeleteModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#2980b9")}
              onMouseLeave={(e) => (e.target.style.background = "#3498db")}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </section>
  );
}
