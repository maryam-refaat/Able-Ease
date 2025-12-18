import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientProf.css";
import "../profilepagecomponents/profile.css";
import PatientCard from "../Components/PatientCard";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";
import {
  getPatient_Reports,
  getPatient_Medicalinfo,
  getAllDisabilities,
  addPatientDisability,
} from "../assets/apis";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import {
  getReportByPatient,
  getMedicalInfoByPatient,
  getPatientDisability,
} from "../assets/apis";

export default function PatientReportsMedical() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();

  // Get patient data from navigation state or localStorage
  const getStoredPatientData = () => {
    const storedDataStr = localStorage.getItem("patientData");
    try {
      return storedDataStr ? JSON.parse(storedDataStr) : {};
    } catch (e) {
      return {};
    }
  };

  const patientData = location.state?.patientData || getStoredPatientData();
  const [data, setData] = useState(patientData || {});
  const [reports, setReports] = useState([]);
  const [medical, setMedical] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Add disability modal state
  const [addDisabilityModal, setAddDisabilityModal] = useState(false);
  const [allDisabilities, setAllDisabilities] = useState([]);
  const [disabilityFormData, setDisabilityFormData] = useState({
    patientSSN: "",
    disabilityID: "",
    disabilityName: "",
    level: "",
    notes: "",
  });
  const [disabilityFormLoading, setDisabilityFormLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);

        const storedSSN = localStorage.getItem("ssn");

        if (!storedSSN) {
          console.log("No patient SSN found");
          setIsLoading(false);
          return;
        }

        const [rRes, mRes, dRes] = await Promise.all([
          getPatient_Reports(storedSSN).catch((err) => {
            console.error("getPatient_Reports error:", err);
            return { data: [] };
          }),
          getPatient_Medicalinfo(storedSSN).catch((err) => {
            console.error("getPatient_Medicalinfo error:", err);
            return { data: [] };
          }),
          getPatientDisability(storedSSN).catch((err) => {
            console.error("getPatientDisability error:", err);
            return { data: [] };
          }),
        ]);

        console.log("API Responses:", { rRes, mRes, dRes });

        const r = Array.isArray(rRes?.data) ? rRes.data : [];
        const rawMedical = Array.isArray(mRes?.data) ? mRes.data : [];
        const rawDisabilities = Array.isArray(dRes?.data) ? dRes.data : [];

        // Fetch assessments
        try {
          const assessmentRes = await fetch(
            `https://localhost:7040/api/Assessment/GetAssessmentPatientsByPatient/${storedSSN}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (assessmentRes.ok) {
            const assessmentData = await assessmentRes.json();
            const rawAssessments = Array.isArray(assessmentData)
              ? assessmentData
              : [];

            // Fetch program names for each assessment
            const assessmentsWithPrograms = await Promise.all(
              rawAssessments.map(async (assessment) => {
                try {
                  const programRes = await fetch(
                    `https://localhost:7040/api/Program/ProgramByID/${assessment.assessmentProgramOrganizationSSN}/${assessment.assessmentProgramId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "authToken"
                        )}`,
                      },
                    }
                  );

                  if (programRes.ok) {
                    const programData = await programRes.json();
                    return {
                      ...assessment,
                      programName: programData.name || "Unknown Program",
                    };
                  }
                } catch (error) {
                  console.error("Error fetching program:", error);
                }
                return { ...assessment, programName: "Unknown Program" };
              })
            );

            setAssessments(assessmentsWithPrograms);
          }
        } catch (error) {
          console.error("Error fetching assessments:", error);
          setAssessments([]);
        }

        // normalize disabilities using API schema
        const normalizedDisabilities = rawDisabilities.map((dis, i) => ({
          id: dis.id ?? dis.DisabilityID ?? `d-${i}`,
          disabilityName: dis.DisabilityName ?? dis.disabilityName ?? "",
          level: dis.Level ?? dis.level ?? "",
          notes: dis.Notes ?? dis.notes ?? "",
          patientSSN: dis.PatientSSN ?? dis.patientSSN ?? "",
        }));

        // normalize medical info using API schema
        const normalizedMedical = rawMedical.map((med, i) => ({
          id: med.id ?? `m-${i}`,
          diagnosis: med.diagnosis ?? "",
          therapyDetails: med.therapyDeatils ?? med.therapyDetails ?? "",
          startDate: med.startDate ?? "",
          endDate: med.endDate ?? "",
          doctorName: med.doctorName ?? "",
          patientSSN: med.patientSSN ?? "",
          relativeSSN: med.relativeSSN ?? "",
          relativeName: med.relativeName ?? "",
          patientName: med.patientName ?? "",
        }));

        // normalize report fields using API schema
        const normalized = r.map((rep, i) => ({
          id: rep.id ?? `r-${i}`,
          subject: rep.subject ?? "Report",
          content: rep.content ?? "",
          date: rep.date ?? "",
          caregiver: rep.caregiverName ?? "",
          program: rep.programName ?? "",
          organization: rep.organizationName ?? "",
          patientSSN: rep.patientSSN ?? "",
          caregiverSSN: rep.caregiverSSN ?? "",
          programOrganizationSSN: rep.programOrganizationSSN ?? "",
          programId: rep.programId ?? 0,
        }));

        setReports(normalized);
        setMedical(normalizedMedical);
        setDisabilities(normalizedDisabilities);
        setData((prev) => ({ ...prev, ...patientData }));
      } catch (err) {
        console.error("Failed to load patient reports/medical:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for opening add disability modal
  const handleAddDisabilityClick = async () => {
    try {
      // Fetch all available disabilities
      const response = await getAllDisabilities();
      console.log("getAllDisabilities response:", response);

      const disabilitiesList = response?.data || [];
      console.log("Disabilities list:", disabilitiesList);

      setAllDisabilities(disabilitiesList);

      // Set patient SSN in form
      const userSSN = localStorage.getItem("ssn");
      setDisabilityFormData({
        patientSSN: userSSN || data.ssn || "",
        disabilityID: "",
        disabilityName: "",
        level: "",
        notes: "",
      });

      setAddDisabilityModal(true);
    } catch (err) {
      console.error("Failed to fetch disabilities:", err);
      showAlert("Failed to load disabilities. Please try again.", "error");
    }
  };

  // Handler for disability form submission
  const handleAddDisabilitySubmit = async (e) => {
    e.preventDefault();
    setDisabilityFormLoading(true);

    try {
      console.log("Submitting disability data:", disabilityFormData);
      await addPatientDisability(disabilityFormData);

      // Refresh disabilities list
      const patientId = localStorage.getItem("ssn") || data.ssn;
      const disabilitiesRes = await getPatientDisability(patientId);
      const rawDisabilities = Array.isArray(disabilitiesRes?.data)
        ? disabilitiesRes.data
        : [];

      // normalize disabilities using API schema
      const normalizedDisabilities = rawDisabilities.map((dis, i) => ({
        id: dis.id ?? dis.DisabilityID ?? `d-${i}`,
        disabilityName: dis.DisabilityName ?? dis.disabilityName ?? "",
        level: dis.Level ?? dis.level ?? "",
        notes: dis.Notes ?? dis.notes ?? "",
        patientSSN: dis.PatientSSN ?? dis.patientSSN ?? "",
      }));

      setDisabilities(normalizedDisabilities);
      setAddDisabilityModal(false);
      showAlert("Disability added successfully!", "success");
    } catch (err) {
      console.error("Failed to add disability:", err);
      showAlert("Failed to add disability. Please try again.", "error");
    } finally {
      setDisabilityFormLoading(false);
    }
  };

  if (isLoading) return <div className="page-container">Loading...</div>;
  if (isError)
    return <div className="page-container">Error loading reports.</div>;

  return (
    <div className="with-sidebar">
      <Sidebar userType="patient" />

      <div className="page-container">
        <header className="welcome-box centered">
          <h1>Patient Reports</h1>
          <p>{data?.fullName || data?.name || "Patient"}</p>
        </header>

        <div className="container">
          <section className="card-section" style={{ marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>Patient Disabilities</h3>
              <button
                className="add-btn"
                onClick={handleAddDisabilityClick}
                style={{
                  padding: "8px 16px",
                  background: "#27865d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#1f6b49")}
                onMouseLeave={(e) => (e.target.style.background = "#27865d")}
              >
                Add
              </button>
            </div>

            <div className="card-content">
              {disabilities.length ? (
                disabilities.map((d, i) => (
                  <div key={d.id ?? i} className="employment-card">
                    <div className="avatar-circle">♿</div>
                    <div style={{ flex: 1 }}>
                      <div
                        className="employment-title"
                        style={{ fontWeight: 700, fontSize: "18px" }}
                      >
                        {d.disabilityName || `Disability ${i + 1}`}
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            background:
                              d.level?.toLowerCase() === "severe"
                                ? "#dc3545"
                                : d.level?.toLowerCase() === "moderate"
                                ? "#ffc107"
                                : "#28a745",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Level: {d.level || "Not specified"}
                        </span>
                      </div>

                      {d.notes && (
                        <div
                          className="employment-sub"
                          style={{
                            marginTop: 10,
                            color: "#555",
                            lineHeight: 1.5,
                          }}
                        >
                          <strong>Notes:</strong> {d.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No disabilities available</div>
              )}
            </div>
          </section>

          <section className="card-section" style={{ marginTop: 18 }}>
            <h3>Medical Records</h3>

            <div className="card-content">
              {medical.length ? (
                medical.map((m, i) => (
                  <div
                    key={m.id ?? i}
                    className="employment-card"
                    style={{ position: "relative" }}
                  >
                    <div className="avatar-circle">🩺</div>
                    <div style={{ flex: 1 }}>
                      <div
                        className="employment-title"
                        style={{ fontWeight: 700, fontSize: "18px" }}
                      >
                        {m.diagnosis || `Medical Record ${i + 1}`}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontSize: 13,
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {m.startDate && m.endDate ? (
                          <>
                            {new Date(m.startDate).toLocaleDateString()} -{" "}
                            {new Date(m.endDate).toLocaleDateString()}
                          </>
                        ) : (
                          "—"
                        )}
                      </div>

                      <div
                        className="employment-sub"
                        style={{ marginTop: 8, color: "#555", lineHeight: 1.5 }}
                      >
                        {m.therapyDetails || "No therapy details available"}
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <div className="employment-sub">
                          <strong>Doctor:</strong> {m.doctorName || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No medical info available</div>
              )}
            </div>
          </section>

          <section className="card-section" style={{ marginTop: 18 }}>
            <h3>Assessments</h3>
            <div className="card-content">
              {assessments.length ? (
                assessments.map((assessment, i) => (
                  <div
                    key={assessment.assessmentId ?? i}
                    className="employment-card"
                    style={{ position: "relative" }}
                  >
                    <div className="avatar-circle">📊</div>
                    <div style={{ flex: 1 }}>
                      <div
                        className="employment-title"
                        style={{ fontWeight: 700, fontSize: "18px" }}
                      >
                        {assessment.programName}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontSize: 13,
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {assessment.assessmentDate
                          ? new Date(
                              assessment.assessmentDate
                            ).toLocaleDateString()
                          : "—"}
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 16px",
                            background:
                              assessment.grade >= 80
                                ? "#28a745"
                                : assessment.grade >= 60
                                ? "#ffc107"
                                : "#dc3545",
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "16px",
                            fontWeight: 700,
                          }}
                        >
                          Grade: {assessment.grade ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No assessments available</div>
              )}
            </div>
          </section>

          <section className="card-section">
            <h3>Reports</h3>
            <div className="card-content">
              {reports.length ? (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="employment-card"
                    style={{ position: "relative" }}
                  >
                    <div className="avatar-circle">📄</div>
                    <div style={{ flex: 1 }}>
                      <div
                        className="employment-title"
                        style={{ fontWeight: 700, fontSize: "18px" }}
                      >
                        {r.subject}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontSize: 13,
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                      </div>

                      <div
                        className="employment-sub"
                        style={{ marginTop: 8, color: "#555", lineHeight: 1.5 }}
                      >
                        {r.content || "No content available"}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          gap: 20,
                          flexWrap: "wrap",
                        }}
                      >
                        <div className="employment-sub">
                          <strong>Program:</strong> {r.program || "—"}
                        </div>
                        <div className="employment-sub">
                          <strong>Caregiver:</strong> {r.caregiver || "—"}
                        </div>
                        <div className="employment-sub">
                          <strong>Organization:</strong> {r.organization || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No reports available</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />

      {/* Add Disability Modal */}
      {addDisabilityModal && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Add Disability</h3>
            <form onSubmit={handleAddDisabilitySubmit}>
              <input type="hidden" value={disabilityFormData.patientSSN} />

              <div className="popup-input-group">
                <label>Disability *</label>
                <select
                  required
                  value={disabilityFormData.disabilityID}
                  onChange={(e) => {
                    const selectedDisability = allDisabilities.find(
                      (d) => d.ssn === e.target.value
                    );
                    setDisabilityFormData({
                      ...disabilityFormData,
                      disabilityID: e.target.value,
                      disabilityName: selectedDisability?.name || "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select a disability</option>
                  {allDisabilities.map((disability, idx) => (
                    <option key={disability.ssn || idx} value={disability.ssn}>
                      {disability.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="popup-input-group">
                <label>Level *</label>
                <select
                  required
                  value={disabilityFormData.level}
                  onChange={(e) =>
                    setDisabilityFormData({
                      ...disabilityFormData,
                      level: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select level</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>

              <div className="popup-input-group">
                <label>Notes</label>
                <textarea
                  value={disabilityFormData.notes}
                  onChange={(e) =>
                    setDisabilityFormData({
                      ...disabilityFormData,
                      notes: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                  placeholder="Additional notes about the disability..."
                />
              </div>

              <div className="popup-actions">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setAddDisabilityModal(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="add-btn"
                  disabled={disabilityFormLoading}
                >
                  {disabilityFormLoading ? "Adding..." : "Add Disability"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </div>
  );
}
