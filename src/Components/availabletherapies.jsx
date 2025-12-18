/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import {
  fetchAvailabletherapies,
  addtherapy,
  updatetherapy,
  deleteTherapy,
} from "../assets/apis.js";
import AvailableTherapyModal from "./AvailableTherapyModal";
import "../profilepagecomponents/organization.css";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function Availabletherapiess() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const progTrackRef = useRef(null);
  const { alertState, showAlert, closeAlert } = useAlert();

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const ID = localStorage.getItem("ssn");
        const resProg = await fetchAvailabletherapies(ID);
        console.log("Fetched therapies response:", resProg);

        // Ensure we always set an array
        const therapiesData = resProg?.data || resProg || [];
        const therapiesArray = Array.isArray(therapiesData)
          ? therapiesData
          : [];

        console.log("Therapies array:", therapiesArray);
        setPrograms(therapiesArray);
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
    const therapyName = program.Name || program.name || "this therapy";
    if (!window.confirm(`Are you sure you want to delete "${therapyName}"?`))
      return;

    const therapyId = program.id || program.Id;
    if (!therapyId) {
      showAlert("Cannot delete therapy: ID not found", "error");
      return;
    }

    setDeleteLoading(therapyId);
    try {
      await deleteTherapy(therapyId);
      // Remove from local state
      setPrograms(programs.filter((p) => (p.id || p.Id) !== therapyId));
      showAlert("Therapy deleted successfully", "success");
    } catch (error) {
      console.error("Delete therapy error:", error);
      showAlert("Failed to delete therapy. Please try again.", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSubmitProgram = async (formData) => {
    const centerId = localStorage.getItem("ssn");

    try {
      if (selectedProgramForEdit) {
        // Update - add the therapy ID to FormData
        formData.append(
          "Id",
          selectedProgramForEdit.id || selectedProgramForEdit.Id
        );

        const response = await updatetherapy(formData);
        console.log("Update response:", response);

        showAlert("Therapy updated successfully", "success");
      } else {
        // Add - set CenterID from localStorage
        formData.set("CenterID", centerId);

        const response = await addtherapy(formData);
        console.log("Add response:", response);

        showAlert("Therapy added successfully", "success");
      }

      // Refresh the therapies list
      const resProg = await fetchAvailabletherapies(centerId);
      const therapiesData = resProg?.data || resProg || [];
      const therapiesArray = Array.isArray(therapiesData) ? therapiesData : [];
      setPrograms(therapiesArray);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving therapy:", error);
      showAlert("Failed to save therapy. Please try again.", "error");
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
        <h3>Available therapies</h3>
        <button className="action-btn add-btn" onClick={handleAddProgram}>
          <i className="fa-solid fa-plus"></i> Add therapy
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
              {!Array.isArray(programs) || programs.length === 0 ? (
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
                programs.map((p, index) => (
                  <div
                    key={p.id || p.Id || `program-${index}`}
                    className="program-card"
                  >
                    <div className="program-card-header">
                      <h4>{p.Name || p.name || "Therapy"}</h4>
                      <span className="program-status">
                        {p.Date || p.date || "Available"}
                      </span>
                    </div>
                    <div className="program-meta">
                      <div className="program-price">
                        <i className="fa-solid fa-dollar-sign"></i> $
                        {p.PricePerHour || p.pricePerHour || p.price || 0}/hr
                      </div>
                      <div className="program-dates">
                        {p.duration && <span>Duration: {p.duration}</span>}
                        {p.Doctorname && (
                          <span style={{ marginLeft: "8px" }}>
                            Dr. {p.Doctorname}
                          </span>
                        )}
                      </div>
                    </div>
                    {p.therapyDetails && (
                      <div
                        className="program-description"
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        {p.therapyDetails}
                      </div>
                    )}
                    <div className="program-actions">
                      <button
                        className="program-action-btn update-btn-small"
                        onClick={() => handleUpdateProgram(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="program-action-btn delete-btn-small"
                        disabled={deleteLoading === (p.id || p.Id)}
                        onClick={() => handleDeleteProgram(p)}
                      >
                        {deleteLoading === (p.id || p.Id) ? "..." : "Delete"}
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

      <AvailableTherapyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProgram}
        program={selectedProgramForEdit}
      />

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
