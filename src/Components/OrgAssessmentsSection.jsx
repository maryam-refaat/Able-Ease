import React, { useState, useEffect } from "react";
import "./OrgAssessmentsSection.css";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function OrgAssessmentsSection() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    patientSSN: "",
    assessmentProgramOrganizationSSN: "",
    assessmentProgramId: "",
    assessmentId: "",
    grade: 0,
    assessmentDate: "",
    title: "Not Evaluated",
  });

  const organizationSSN = localStorage.getItem("ssn");
  const { alertState, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7040/api/Program/OrganizationPrograms/${organizationSSN}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch programs");

      const programsData = await response.json();
      const programsList = Array.isArray(programsData) ? programsData : [];

      // Fetch patients for each program
      const programsWithPatients = await Promise.all(
        programsList.map(async (program) => {
          try {
            // First, fetch the assessment for this program
            let programAssessment = null;
            try {
              const assessmentProgramResponse = await fetch(
                `https://localhost:7040/api/Assessment/GetAssessmentsByProgram/${organizationSSN}/${program.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "authToken"
                    )}`,
                  },
                }
              );

              if (assessmentProgramResponse.ok) {
                const assessmentProgramData =
                  await assessmentProgramResponse.json();
                programAssessment =
                  Array.isArray(assessmentProgramData) &&
                  assessmentProgramData.length > 0
                    ? assessmentProgramData[0]
                    : null;
              }
            } catch (error) {
              console.error("Error fetching program assessment:", error);
            }

            const patientsResponse = await fetch(
              `https://localhost:7040/api/Program/GetProgramPatients/${organizationSSN}/${program.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );

            if (patientsResponse.ok) {
              const patientsData = await patientsResponse.json();
              const patientsList = Array.isArray(patientsData)
                ? patientsData
                : [];

              // Fetch assessments for each patient and auto-create if null
              const patientsWithAssessments = await Promise.all(
                patientsList.map(async (patient) => {
                  try {
                    // First, try to get the assessment patient data using the specific endpoint
                    const assessmentResponse = await fetch(
                      `https://localhost:7040/api/Assessment/GetAssessmentPatientById/${
                        patient.id
                      }/${organizationSSN}/${program.id}/${
                        programAssessment?.id || 0
                      }`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                          )}`,
                        },
                      }
                    );

                    if (assessmentResponse.ok) {
                      const assessmentData = await assessmentResponse.json();

                      // Convert to camelCase
                      const camelCaseAssessment = {
                        patientSSN:
                          assessmentData.patientSSN ||
                          assessmentData.PatientSSN,
                        assessmentProgramOrganizationSSN:
                          assessmentData.assessmentProgramOrganizationSSN ||
                          assessmentData.AssessmentProgramOrganizationSSN,
                        assessmentProgramId:
                          assessmentData.assessmentProgramId ||
                          assessmentData.AssessmentProgramID,
                        assessmentId:
                          assessmentData.assessmentId ||
                          assessmentData.AssessmentId,
                        grade:
                          assessmentData.grade !== undefined
                            ? assessmentData.grade
                            : assessmentData.Grade !== undefined
                            ? assessmentData.Grade
                            : 0,
                        assessmentDate:
                          assessmentData.assessmentDate ||
                          assessmentData.AssessmentDate,
                        title: programAssessment?.title || "undefined",
                      };

                      return {
                        ...patient,
                        assessment: camelCaseAssessment,
                      };
                    } else {
                      // If assessment doesn't exist (404), create one automatically
                      const payload = {
                        patientSSN: patient.id,
                        assessmentProgramOrganizationSSN: organizationSSN,
                        assessmentProgramId: program.id,
                        assessmentId: programAssessment?.id || 0,
                        grade: 0,
                        assessmentDate: new Date().toISOString(),
                      };

                      const addResponse = await fetch(
                        "https://localhost:7040/api/Assessment/AddAssessmentPatient",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                              "authToken"
                            )}`,
                          },
                          body: JSON.stringify(payload),
                        }
                      );

                      if (addResponse.ok) {
                        const createdData = await addResponse.json();

                        // Convert to camelCase
                        const camelCaseCreated = {
                          patientSSN:
                            createdData.patientSSN || createdData.PatientSSN,
                          assessmentProgramOrganizationSSN:
                            createdData.assessmentProgramOrganizationSSN ||
                            createdData.AssessmentProgramOrganizationSSN,
                          assessmentProgramId:
                            createdData.assessmentProgramId ||
                            createdData.AssessmentProgramID,
                          assessmentId:
                            createdData.assessmentId ||
                            createdData.AssessmentId,
                          grade:
                            createdData.grade !== undefined
                              ? createdData.grade
                              : createdData.Grade !== undefined
                              ? createdData.Grade
                              : 0,
                          assessmentDate:
                            createdData.assessmentDate ||
                            createdData.AssessmentDate,
                          title: programAssessment?.title || "undefined",
                        };

                        return {
                          ...patient,
                          assessment: camelCaseCreated,
                        };
                      }

                      // If creation failed, return with default values
                      return {
                        ...patient,
                        assessment: {
                          grade: 0,
                          assessmentDate: new Date().toISOString(),
                          title: programAssessment?.title || "undefined",
                          assessmentId: programAssessment?.id || 0,
                        },
                      };
                    }
                  } catch (error) {
                    console.error("Error fetching assessment:", error);
                  }
                  return { ...patient, assessment: null };
                })
              );

              return {
                ...program,
                assessmentTitle: programAssessment?.title || "undefined",
                assessmentId: programAssessment?.id || 0,
                patients: patientsWithAssessments,
              };
            }
          } catch (error) {
            console.error("Error fetching patients:", error);
          }
          return { ...program, patients: [] };
        })
      );

      setPrograms(programsWithPatients);
    } catch (error) {
      console.error("Error fetching programs:", error);
      showAlert("Failed to fetch programs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = (patient, programId) => {
    const assessment = patient.assessment || {};
    const program = programs.find((p) => p.id === programId);
    setSelectedPatient(patient);
    setUpdateForm({
      patientSSN: patient.id,
      assessmentProgramOrganizationSSN: organizationSSN,
      assessmentProgramId: programId,
      assessmentId: program?.assessmentId || assessment.assessmentId || 0,
      grade: assessment.grade || 0,
      assessmentDate: assessment.assessmentDate
        ? new Date(assessment.assessmentDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });
    setShowUpdateModal(true);
  };

  const handleUpdateAssessment = async () => {
    try {
      const payload = {
        grade: parseInt(updateForm.grade),
        assessmentDate: updateForm.assessmentDate,
      };

      const response = await fetch(
        `https://localhost:7040/api/Assessment/UpdateAssessmentPatient/${updateForm.patientSSN}/${updateForm.assessmentProgramOrganizationSSN}/${updateForm.assessmentProgramId}/${updateForm.assessmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update assessment");

      showAlert("Assessment updated successfully!", "success");
      setShowUpdateModal(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error updating assessment:", error);
      showAlert("Failed to update assessment", "error");
    }
  };

  const handleDeleteAssessment = async (programId, assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7040/api/Assessment/DeleteAssessment/${organizationSSN}/${programId}/${assessmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete assessment");

      showAlert("Assessment deleted successfully!", "success");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      showAlert("Failed to delete assessment", "error");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="org-assessments-section">
      {programs.map((program) => (
        <div key={program.id} className="assessment-program-block">
          {/* Program Header */}
          <div className="assessment-program-header">
            <h2 className="assessment-program-title">{program.name}</h2>
          </div>

          {/* Assessment Name Row */}
          <div className="assessment-name-row">
            <div className="assessment-name">
              <strong>Assessment:</strong>{" "}
              {program.assessmentTitle || "undefined"}
            </div>
          </div>

          {/* List of patient assessments */}
          <div className="assessment-patients-list">
            {program.patients && program.patients.length > 0 ? (
              program.patients.map((patient) => (
                <div key={patient.id} className="assessment-patient-block">
                  <div className="assessment-patient-name">
                    {patient.fullName || patient.name}
                  </div>

                  <div className="assessment-patient-text">
                    {patient.assessment?.title || "undefined"}
                  </div>

                  <div className="assessment-patient-grade">
                    <strong>Grade:</strong> {patient.assessment?.grade || 0}
                  </div>

                  <button
                    className="btn-update"
                    onClick={() => handleUpdateClick(patient, program.id)}
                  >
                    Update
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-card">No patients in this program</div>
            )}
          </div>
        </div>
      ))}

      {showUpdateModal && (
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
            <h3>Update Assessment</h3>

            {/* Hidden inputs for IDs */}
            <input type="hidden" value={updateForm.patientSSN} />
            <input
              type="hidden"
              value={updateForm.assessmentProgramOrganizationSSN}
            />
            <input type="hidden" value={updateForm.assessmentProgramId} />
            <input type="hidden" value={updateForm.assessmentId} />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Grade (0-100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={updateForm.grade}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, grade: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Assessment Date *
              </label>
              <input
                type="datetime-local"
                value={updateForm.assessmentDate?.slice(0, 16) || ""}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    assessmentDate: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
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
                onClick={() => setShowUpdateModal(false)}
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
                onClick={handleUpdateAssessment}
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </div>
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
    </div>
  );
}
