import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import AvailablePrograms from "../Components/AvailablePrograms";
import FinancialAid from "../Components/FinancialAidOrg";
import CareGiverBox from "../Components/CareGiverbox";
import AvailableLocationsBox from "../Components/AvailablePositions";
import JobApplications from "../Components/JobApplications";
import Messages from "./Messages";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthState } from "../context/AuthState";
import { useEffect, useState } from "react";
import OrgAssesments from "../Pages/OrgAssesments";
import EditOrganizationModal from "../Components/EditOrganizationModal";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";
import { formatDate } from "../utils/dateFormatter";

export default function Organizationpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const organizationData = location.state?.organizationData;

  const [appear, setAppear] = useState(0);

  const [data, setData] = useState(organizationData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [patientWorkers, setPatientWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const { alertState, showAlert, closeAlert } = useAlert();

  const handleLogout = async () => {
    try {
      const { BASE_URL } = await import("../assets/apis.js");
      await fetch(`${BASE_URL}/Account/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      localStorage.clear();
      setAuthState({ isLoggedIn: false, userType: null, ssn: null });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.clear();
      setAuthState({ isLoggedIn: false, userType: null, ssn: null });
      navigate("/");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const orgSSN = localStorage.getItem("ssn");
        const authToken = localStorage.getItem("authToken");

        console.log("=== Organization Page Load ===");
        console.log("SSN from localStorage:", orgSSN);
        console.log("AuthToken from localStorage:", authToken);
        console.log("All localStorage keys:", Object.keys(localStorage));

        // Redirect to login if no SSN found
        if (!orgSSN) {
          console.error(
            "❌ No organization SSN found in localStorage - redirecting to login"
          );
          setIsLoading(false);
          navigate("/");
          return;
        }

        console.log("✅ SSN found, fetching organization data...");
        const { BASE_URL } = await import("../assets/apis.js");
        const response = await fetch(
          `${BASE_URL}/organizations/getorganization/${orgSSN}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orgData = await response.json();
        setData(orgData);

        // Save organization data to localStorage for Messages component
        localStorage.setItem("organizationData", JSON.stringify(orgData));
        if (orgData.name) {
          localStorage.setItem("organizationName", orgData.name);
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    // Reload organization data after successful update
    try {
      const orgSSN = localStorage.getItem("ssn");
      if (orgSSN) {
        const { BASE_URL } = await import("../assets/apis.js");
        const response = await fetch(
          `${BASE_URL}/organizations/getorganization/${orgSSN}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const orgData = await response.json();
          setData(orgData);
          localStorage.setItem("organizationData", JSON.stringify(orgData));
        }
      }
    } catch (err) {
      console.error("Failed to reload organization data:", err);
    }
  };

  const fetchPatientWorkers = async () => {
    try {
      setLoadingWorkers(true);
      const orgSSN = localStorage.getItem("ssn");
      const { BASE_URL } = await import("../assets/apis.js");
      const response = await fetch(
        `${BASE_URL}/PatientWork/organization/${orgSSN}/patients`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.ok) {
        const workers = await response.json();
        setPatientWorkers(Array.isArray(workers) ? workers : []);
      }
    } catch (err) {
      console.error("Failed to fetch patient workers:", err);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleRemoveWorker = async (patientSSN) => {
    if (
      !confirm("Are you sure you want to remove this patient from employment?")
    ) {
      return;
    }

    try {
      const orgSSN = localStorage.getItem("ssn");
      const { BASE_URL } = await import("../assets/apis.js");
      const response = await fetch(
        `${BASE_URL}/PatientWork/Delete/${patientSSN}/${orgSSN}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        showAlert("Patient removed from employment successfully", "success");
        fetchPatientWorkers(); // Refresh the list
      } else {
        showAlert("Failed to remove patient from employment", "error");
      }
    } catch (err) {
      console.error("Error removing patient:", err);
      showAlert("An error occurred while removing the patient", "error");
    }
  };

  useEffect(() => {
    if (appear === 1) {
      fetchPatientWorkers();
    }
  }, [appear]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="with-sidebar">
      <div className="side-rect">
        <div className="side-icons">
          <button
            className="side-btn"
            aria-label="available locations"
            onClick={() => setAppear(2)}
          >
            <i className="fa-solid fa-users" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="messages"
            onClick={() => setAppear(3)}
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="reports"
            onClick={() => setAppear(1)}
          >
            <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="assessments"
            onClick={() => setAppear(4)}
          >
            <i className="fa-solid fa-clipboard-check" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="profile"
            onClick={() => setAppear(0)}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="logout"
            onClick={handleLogout}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.name || data?.managerName || "Amanda"}</h1>
          <p>{formatDate(new Date())}</p>
        </header>
        {appear !== 3 && (
          <RelativeCard title="Organization" data={data} onEdit={openEdit} />
        )}

        {appear === 2 && <AvailableLocationsBox />}
        {appear === 1 && (
          <>
            <CareGiverBox />

            {/* Patient Workers Section */}
            <section className="section-box" style={{ marginTop: "24px" }}>
              <h2
                className="section-title"
                style={{
                  marginBottom: "16px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Employed Patients
              </h2>
              {loadingWorkers ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  Loading employees...
                </div>
              ) : patientWorkers.length > 0 ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  {patientWorkers.map((worker) => (
                    <div
                      key={worker.patientSSN}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          {worker.patientName || "Unknown Patient"}
                        </h3>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "14px",
                            color: "#7f8c8d",
                          }}
                        >
                          <strong>Position:</strong> {worker.jobTitle || "N/A"}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "14px",
                            color: "#27ae60",
                          }}
                        >
                          <strong>Salary:</strong> ${worker.salary || 0}/month
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "13px",
                            color: "#95a5a6",
                          }}
                        >
                          <strong>Start Date:</strong>{" "}
                          {formatDate(worker.startDate) || "N/A"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveWorker(worker.patientSSN)}
                        style={{
                          padding: "8px 16px",
                          background: "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#c0392b")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#e74c3c")
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    padding: "32px",
                    textAlign: "center",
                    color: "#6c757d",
                  }}
                >
                  No employed patients at this organization
                </div>
              )}
            </section>
          </>
        )}
        {appear === 3 && <Messages showSidebar={false} showHeader={false} />}
        {appear === 4 && <OrgAssesments />}
        {appear === 0 && (
          <>
            <AvailablePrograms />

            <FinancialAid />
            <JobApplications />
          </>
        )}
      </div>

      {/* Edit Organization Modal */}
      <EditOrganizationModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        organizationData={data}
        onSave={handleEditSave}
      />

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
