import React, { useState, useEffect } from "react";
import "./ProgramModal.css";
import { getProgramPatients } from "../assets/apis.js";
import { deletePatientFromProgram } from "../assets/apis.js";

export default function ProgramPatientsModal({ program, onClose }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(false);

        const ssn = localStorage.getItem("ssn");
        const res = await getProgramPatients(program.id, ssn);

        const patientsData =
          res?.data?.patients ||
          res?.data ||
          res?.results ||
          (Array.isArray(res) ? res : []);

        setPatients(patientsData);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(true); // ❌ API failed
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [program.id]);

  const handleDelete = async (patientId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this patient from the program?"
      )
    ) {
      setDeletingId(patientId);
      setDeleteError(null); // مسح أي رسالة خطأ قبل البدء

      try {
        const ssn = localStorage.getItem("ssn");
        const res = await deletePatientFromProgram(program.id, patientId, ssn);

        // تحقق من الرد - لو فيه رسالة نجاح
        if (res === "Patient removed from program") {
          setPatients((prev) => prev.filter((p) => p.id !== patientId));
        } else {
          // لو الرد مش متوقع اعتبره خطأ
          setDeleteError("Failed to remove patient. Please try again.");
        }
      } catch (err) {
        console.error("Error deleting patient:", err);
        setDeleteError("Failed to remove patient. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const fmtDate = (d) => {
    if (!d) return "";
    try {
      const date = new Date(d);
      return date.toLocaleDateString();
    } catch (e) {
      return d;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: "0 20px 20px" }}
      >
        <div className="modal-header">
          <h2>Patients in {program?.name || "Program"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                className="spinner"
                style={{
                  width: "48px",
                  height: "48px",
                  border: "4px solid #f0f0f0",
                  borderTop: "4px solid #4a90e2",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px",
                }}
              ></div>
              <p style={{ color: "#666", fontSize: "16px" }}>
                Loading patients...
              </p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <i
                className="fa-solid fa-exclamation-circle"
                style={{
                  fontSize: "56px",
                  color: "#e74c3c",
                  marginBottom: "20px",
                  display: "block",
                }}
              ></i>
              <p
                style={{
                  color: "#e74c3c",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "12px",
                }}
              >
                Failed to load patients
              </p>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "24px",
                }}
              >
                There was an error loading the patient list. Please try again.
              </p>
              <button
                className="modal-btn"
                onClick={() => window.location.reload()}
                style={{
                  background:
                    "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <i className="fa-solid fa-rotate-right"></i> Retry
              </button>
            </div>
          ) : patients.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
              }}
            >
              <i
                className="fa-solid fa-users"
                style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}
              ></i>
              <p>No patients enrolled in this program yet.</p>
            </div>
          ) : (
            <>
              {deleteError && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #fee 0%, #fdd 100%)",
                    border: "1px solid #e74c3c",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#c0392b",
                  }}
                >
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  <span>{deleteError}</span>
                  <button
                    onClick={() => setDeleteError(null)}
                    style={{
                      marginLeft: "auto",
                      background: "none",
                      border: "none",
                      color: "#c0392b",
                      cursor: "pointer",
                      fontSize: "18px",
                      padding: "0 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="patients-list">
                {patients.map((patient) => (
                  <div key={patient.id} className="patient-item">
                    <div className="patient-info">
                      <div className="patient-header">
                        <h4>{patient.fullName}</h4>
                        <span className="patient-age">Age: {patient.age}</span>
                      </div>
                      <div className="patient-details">
                        <div className="patient-condition">
                          <i className="fa-solid fa-notes-medical"></i>
                          <span>{patient.condition}</span>
                        </div>
                        <div className="patient-joined">
                          <i className="fa-solid fa-calendar-plus"></i>
                          <span>Contact: {patient.phone}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="delete-patient-btn"
                      onClick={() => handleDelete(patient.id)}
                      // disabled={deletingId === patient.id}
                      title="Remove patient from program"
                      style={{
                        opacity: deletingId === patient.id ? 0.6 : 1,
                        cursor:
                          deletingId === patient.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {deletingId === patient.id ? (
                        <>
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              border: "2px solid rgba(255,255,255,0.3)",
                              borderTop: "2px solid white",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                            }}
                          ></div>
                          Removing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-trash"></i> Remove
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}