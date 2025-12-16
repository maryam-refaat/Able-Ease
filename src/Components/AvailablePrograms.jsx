import React, { useEffect, useState, useRef } from "react";
import {
  fetchAvailablePrograms,
  addProgram,
  updateProgram,
} from "../assets/apis.js";
import ProgramPatientsModal from "./ProgramPatientsModal";
import ProgramModal from "./ProgramModal";
import "../profilepagecomponents/organization.css";

export default function AvailablePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const progTrackRef = useRef(null);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : null);

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPrograms(programs.filter((p) => p.id !== program.id));
    } catch {
      alert("Failed to delete program");
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
                        <span>{fmtDate(p.startDate)}</span> -{" "}
                        <span>{fmtDate(p.endDate)}</span>
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
    </section>
  );
}