import React, { useEffect, useState, useRef } from "react";
import CareGiverModal from "./CareGiverModal";
import AssignPatientModal from "./AssignPatientModal";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";
import "../profilepagecomponents/organization.css";

export default function CareGiverBox() {
  const dummyCareGivers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Physical Therapy",
      experience: "8 years",
      contactInfo: "+1 (555) 123-4567",
      availability: "Available",
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Occupational Therapy",
      experience: "5 years",
      contactInfo: "+1 (555) 234-5678",
      availability: "Busy",
    },
    {
      id: 3,
      name: "Emily Davis",
      specialty: "Speech Therapy",
      experience: "10 years",
      contactInfo: "+1 (555) 345-6789",
      availability: "Available",
    },
    {
      id: 4,
      name: "James Wilson",
      specialty: "Physical Therapy",
      experience: "6 years",
      contactInfo: "+1 (555) 456-7890",
      availability: "Available",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      specialty: "Rehabilitation",
      experience: "12 years",
      contactInfo: "+1 (555) 567-8901",
      availability: "Busy",
    },
    {
      id: 6,
      name: "David Martinez",
      specialty: "Sports Therapy",
      experience: "7 years",
      contactInfo: "+1 (555) 678-9012",
      availability: "Available",
    },
  ];

  const [careGivers, setCareGivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareGiverForEdit, setSelectedCareGiverForEdit] =
    useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedCareGiverForAssign, setSelectedCareGiverForAssign] =
    useState(null);
  const trackRef = useRef(null);
  const { alertState, showAlert, closeAlert } = useAlert();

  const baseApiUrl = "https://localhost:7040/api";
  const getAuth = () => ({
    token: localStorage.getItem("authToken"),
    organizationSSN: localStorage.getItem("ssn"),
  });

  const withAuthHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const getAvailabilityColor = (availability) => {
    return availability === "Available" ? "#10b981" : "#f59e0b";
  };

  // CareGiver CRUD handlers
  const handleAddCareGiver = () => {
    setSelectedCareGiverForEdit(false);
    setIsModalOpen(true);
  };

  const handleUpdateCareGiver = (careGiver) => {
    // console.log(careGiver);
    setSelectedCareGiverForEdit(careGiver);
    setIsModalOpen(true);
  };

  // Assignment handlers
  const openAssignModal = (careGiver) => {
    setSelectedCareGiverForAssign(careGiver);
    setIsAssignOpen(true);
  };

  const handleUnassignAllPatients = async (careGiver) => {
    if (
      window.confirm(
        `⚠️ Warning: Are you sure you want to unassign ALL patients from "${careGiver.name}"?\n\nThis action will remove all patient assignments for this caregiver.`
      )
    ) {
      setDeleteLoading(careGiver.id);
      try {
        const { token } = getAuth();
        const caregiverSSN = careGiver.ssn || careGiver.SSN || careGiver.id;
        const url = `${baseApiUrl}/Caregiver/${caregiverSSN}/UnassignAllPatients`;

        const res = await fetch(url, {
          method: "DELETE",
          headers: withAuthHeaders(token),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Unassign failed: ${res.status}`);
        }

        // Update local state to reflect availability change
        setCareGivers(
          careGivers.map((cg) =>
            cg.id === careGiver.id ? { ...cg, availability: "Available" } : cg
          )
        );
        showAlert("All patients unassigned successfully.", "success");
      } catch (err) {
        showAlert(`Failed to unassign patients: ${err.message}`, "error");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleSubmitCareGiver = async (formData) => {
    // Dummy promise to simulate API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure (90% success rate)
        Math.random() > 0.1
          ? resolve()
          : reject(new Error("Save operation failed"));
      }, 1500);
    });

    if (selectedCareGiverForEdit) {
      // Update existing caregiver
      // const token = JSON.parse(localStorage.getItem("authToken"));
      // await updateCareGiver(selectedCareGiverForEdit.id, token, formData);

      // Update local state
      setCareGivers(
        careGivers.map((cg) =>
          cg.id === selectedCareGiverForEdit.id ? { ...cg, ...formData } : cg
        )
      );
    } else {
      // Add new caregiver
      // const token = JSON.parse(localStorage.getItem("authToken"));
      // const newCareGiver = await createCareGiver(token, formData);

      // Add to local state with temporary ID
      const newCareGiver = { ...formData, id: Date.now() };
      setCareGivers([...careGivers, newCareGiver]);
    }
  };

  // Fetch caregivers from backend
  useEffect(() => {
    const loadCaregivers = async () => {
      setLoading(true);
      setError(false);
      try {
        const { token, organizationSSN } = getAuth();
        const url = `${baseApiUrl}/Caregiver/GetCaregiversByOrganization/${organizationSSN}`;
        const res = await fetch(url, {
          method: "GET",
          headers: withAuthHeaders(token),
        });
        if (!res.ok)
          throw new Error(`Failed to load caregivers: ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const mapped = arr.map((cg) => ({
          id: cg.ssn || cg.SSN || cg.id,
          ssn: cg.ssn || cg.SSN || cg.id,
          name: cg.name || "Unknown",
          specialty: cg.specialty || cg.reports?.[0]?.subject || "",
          experience: cg.experience ? `${cg.experience} years` : "",
          contactInfo: cg.contactInfo || cg.address || "",
          availability: (cg.totalPatients ?? 0) > 0 ? "Busy" : "Available",
        }));
        setCareGivers(mapped);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadCaregivers();
  }, []);

  return (
    <section className="section-box" style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Care Givers</h3>

        <button
          className="action-btn add-btn"
          onClick={handleAddCareGiver}
          title="Add Care Giver"
        >
          <i className="fa-solid fa-user-plus"></i> Add Care Giver
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading care givers...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          <p>Error loading care givers.</p>
        </div>
      ) : (
        <div className="slider-wrapper">
          <div className="cards-wrapper">
            <button
              aria-label="previous care givers"
              className="slider-btn left"
              onClick={() => {
                if (trackRef.current) {
                  const amount = trackRef.current.clientWidth * 0.8;
                  trackRef.current.scrollBy({
                    left: -amount,
                    behavior: "smooth",
                  });
                }
              }}
            >
              ‹
            </button>

            <div ref={trackRef} className="cards-track" role="list">
              {careGivers.map((cg) => (
                <div key={cg.id} className="program-card" role="listitem">
                  <div className="program-card-header">
                    <h4>{cg.name}</h4>
                    <span
                      className="program-status"
                      style={{
                        background: `${getAvailabilityColor(
                          cg.availability
                        )}20`,
                        color: getAvailabilityColor(cg.availability),
                      }}
                    >
                      {cg.availability}
                    </span>
                  </div>

                  <div className="program-meta">
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#3b82f6",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      <i
                        className="fa-solid fa-stethoscope"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {cg.specialty}
                    </div>

                    <div className="program-dates">
                      <div className="date-item">
                        <i className="fa-solid fa-clock"></i>
                        <span>{cg.experience} experience</span>
                      </div>
                      <div className="date-item">
                        <i className="fa-solid fa-phone"></i>
                        <span>{cg.contactInfo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="program-actions">
                    <button
                      className="program-action-btn update-btn-small"
                      onClick={() => openAssignModal(cg)}
                      title="Assign to Patient"
                    >
                      assign
                    </button>
                    <button
                      className="program-action-btn delete-btn-small"
                      onClick={() => handleUnassignAllPatients(cg)}
                      title="Unassign All Patients"
                      disabled={deleteLoading === cg.id}
                    >
                      {deleteLoading === cg.id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        "unassign"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              aria-label="next care givers"
              className="slider-btn right"
              onClick={() => {
                if (trackRef.current) {
                  const amount = trackRef.current.clientWidth * 0.8;
                  trackRef.current.scrollBy({
                    left: amount,
                    behavior: "smooth",
                  });
                }
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      <CareGiverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmitCareGiver={handleSubmitCareGiver}
        careGiver={selectedCareGiverForEdit}
      />

      <AssignPatientModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        caregiver={selectedCareGiverForAssign}
      />

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
