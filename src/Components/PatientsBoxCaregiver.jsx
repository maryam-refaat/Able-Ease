import React, { useState, useEffect } from "react";
import { getPatient_Reports } from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function PatientsBox({
  patients = [],
  programId,
  programOrganizationSSN,
  caregiverSSN,
}) {
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [reports, setReports] = useState({});
  const [loadingReports, setLoadingReports] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reportForm, setReportForm] = useState({ subject: "", content: "" });
  const [patientPrograms, setPatientPrograms] = useState({});
  const [programNames, setProgramNames] = useState({});
  const { alertState, showAlert, closeAlert } = useAlert();

  const hasPatients = Array.isArray(patients) && patients.length > 0;

  // Fetch program names for all patients on load
  useEffect(() => {
    if (hasPatients) {
      patients.forEach((patient) => {
        if (patient.ssn && !programNames[patient.ssn]) {
          fetchPatientData(patient.ssn);
        }
      });
    }
  }, [patients]);

  const fetchPatientData = async (patientSSN) => {
    try {
      const response = await fetch(
        `https://localhost:7040/api/Patients/GetProgramByPatientSSN/${patientSSN}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const program = await response.json();

      // Set program name
      setProgramNames((prev) => ({
        ...prev,
        [patientSSN]: program.name,
      }));

      return {
        programId: program.id,
        programOrganizationSSN: program.organizationSSN,
      };
    } catch (error) {
      console.error("Error fetching patient program:", error);
      return null;
    }
  };

  const fetchReports = async (patientSSN) => {
    setLoadingReports((prev) => ({ ...prev, [patientSSN]: true }));
    try {
      // Fetch patient's program data
      let programData = patientPrograms[patientSSN];
      if (!programData) {
        programData = await fetchPatientData(patientSSN);
        if (programData) {
          setPatientPrograms((prev) => ({
            ...prev,
            [patientSSN]: programData,
          }));
        }
      }

      const response = await getPatient_Reports(patientSSN);
      const allReports = response?.data || [];

      // Filter reports by patient's programId and organizationSSN
      const filteredReports = programData
        ? allReports.filter(
            (report) =>
              report.patientSSN === patientSSN &&
              report.programId === programData.programId &&
              report.programOrganizationSSN ===
                programData.programOrganizationSSN
          )
        : [];

      setReports((prev) => ({ ...prev, [patientSSN]: filteredReports }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports((prev) => ({ ...prev, [patientSSN]: [] }));
    } finally {
      setLoadingReports((prev) => ({ ...prev, [patientSSN]: false }));
    }
  };

  const togglePatient = async (patient) => {
    if (expandedPatient === patient.ssn) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patient.ssn);
      if (!reports[patient.ssn]) {
        await fetchReports(patient.ssn);
      }
    }
  };

  const handleAddReport = (patient) => {
    setSelectedPatient(patient);
    setShowAddModal(true);
    setReportForm({ subject: "", content: "" });
  };

  const submitReport = async () => {
    if (!reportForm.subject || !reportForm.content) {
      showAlert("Please fill in both subject and content", "error");
      return;
    }

    if (reportForm.subject.trim().length < 5) {
      showAlert("Subject must be at least 5 characters long", "error");
      return;
    }

    if (reportForm.content.trim().length < 10) {
      showAlert("Content must be at least 10 characters long", "error");
      return;
    }

    try {
      // Get patient's program data
      let programData = patientPrograms[selectedPatient.ssn];
      if (!programData) {
        programData = await fetchPatientData(selectedPatient.ssn);
        if (programData) {
          setPatientPrograms((prev) => ({
            ...prev,
            [selectedPatient.ssn]: programData,
          }));
        }
      }

      if (!programData) {
        showAlert("Failed to get patient's program information", "error");
        return;
      }

      const payload = {
        subject: reportForm.subject,
        content: reportForm.content,
        patientSSN: selectedPatient.ssn,
        programOrganizationSSN: programData.programOrganizationSSN,
        programId: programData.programId,
      };

      console.log("Sending report payload:", payload);

      const response = await fetch(
        "https://localhost:7040/api/Report/AddReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showAlert("Report added successfully!", "success");
      setShowAddModal(false);
      setReportForm({ subject: "", content: "" });

      // Refresh reports for this patient
      await fetchReports(selectedPatient.ssn);
    } catch (error) {
      console.error("Error adding report:", error);
      showAlert("Failed to add report. Please try again.", "error");
    }
  };

  const deleteReport = async (reportId, patientSSN) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7040/api/Report/DeleteReport/${reportId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showAlert("Report deleted successfully!", "success");

      // Refresh reports for this patient
      await fetchReports(patientSSN);
    } catch (error) {
      console.error("Error deleting report:", error);
      showAlert("Failed to delete report. Please try again.", "error");
    }
  };

  return (
    <section className="patients-box">
      <h2>Patients</h2>

      <div className="patients-list">
        {!hasPatients ? (
          <div className="patient-item" aria-live="polite">
            <div className="patient-name">Have no patients yet</div>
          </div>
        ) : (
          patients.map((p, idx) => (
            <div
              key={p.ssn ?? idx}
              className="patient-card"
              style={{
                marginBottom: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{p.name || p.fullName}</h4>
                  <p
                    style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}
                  >
                    {programNames[p.ssn] || p.programName || "Program"}
                  </p>
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <button
                    className="patient-add-btn"
                    onClick={() => handleAddReport(p)}
                    type="button"
                    style={{
                      padding: "8px 16px",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => togglePatient(p)}
                    type="button"
                    style={{
                      padding: "8px 12px",
                      background: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    {expandedPatient === p.ssn ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {expandedPatient === p.ssn && (
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <h5 style={{ margin: "0 0 12px 0" }}>Reports</h5>
                  {loadingReports[p.ssn] ? (
                    <p>Loading reports...</p>
                  ) : !reports[p.ssn] || reports[p.ssn].length === 0 ? (
                    <p style={{ color: "#999" }}>No reports for this program</p>
                  ) : (
                    <div>
                      {reports[p.ssn].map((report, ridx) => (
                        <div
                          key={report.id || ridx}
                          style={{
                            background: "#f9f9f9",
                            padding: "12px",
                            marginBottom: "8px",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <strong>{report.subject}</strong>
                            <p
                              style={{ margin: "4px 0 0 0", fontSize: "14px" }}
                            >
                              {report.content}
                            </p>
                            <small style={{ color: "#666" }}>
                              {report.date
                                ? new Date(report.date).toLocaleDateString()
                                : ""}
                            </small>
                          </div>
                          <button
                            onClick={() => deleteReport(report.id, p.ssn)}
                            style={{
                              padding: "6px 12px",
                              background: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              marginLeft: "8px",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h3>Add Report for {selectedPatient?.name}</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Subject *
              </label>
              <input
                type="text"
                value={reportForm.subject}
                onChange={(e) =>
                  setReportForm({ ...reportForm, subject: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
                placeholder="Report subject"
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Content *
              </label>
              <textarea
                value={reportForm.content}
                onChange={(e) =>
                  setReportForm({ ...reportForm, content: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  minHeight: "120px",
                }}
                placeholder="Report content"
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                style={{
                  padding: "8px 16px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </section>
  );
}
