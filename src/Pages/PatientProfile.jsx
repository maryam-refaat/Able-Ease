import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientProf.css";
import "../profilepagecomponents/profile.css";
import PatientCard from "../Components/PatientCard";
import Sidebar from "../Components/Sidebar";
import { setAuthState } from "../context/AuthState";

import PatientProfileModal from "../Components/PatientProfileModal";
import {
  getPatientBySSN,
  getProgramByPatient,
  getTherapyByPatient,
  getWorkByPatient,
  deletePatientFromProgram,
  deletePatientSession,
  deletePatientWork,
} from "../assets/apis";
import Footer from "../Components/Footer";

export default function PatientProfile() {
  const location = useLocation();
  const patientData = location.state?.patientData;

  const [data, setData] = useState(patientData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("https://localhost:7040/api/Account/logout", {
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

  // Modal states for confirmations
  const [withdrawModal, setWithdrawModal] = useState({
    isOpen: false,
    program: null,
  });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    session: null,
  });
  const [resignModal, setResignModal] = useState({ isOpen: false });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Get SSN from localStorage
        const storedSSN = localStorage.getItem("ssn");

        if (!storedSSN) {
          console.log("No SSN found in localStorage");
          setIsLoading(false);
          return;
        }

        console.log(`Fetching patient data for SSN: ${storedSSN}`);

        // fetch patient core data + related resources in parallel
        const [patientRes, progRes, therapiesRes, workRes] = await Promise.all([
          getPatientBySSN(storedSSN).catch((err) => {
            console.error("getPatientBySSN error:", err);
            return { data: null };
          }),
          getProgramByPatient(storedSSN).catch((err) => {
            console.error("getProgramByPatient error:", err);
            return { data: [] };
          }),
          getTherapyByPatient(storedSSN).catch((err) => {
            console.error("getTherapyByPatient error:", err);
            return { data: [] };
          }),
          getWorkByPatient(storedSSN).catch((err) => {
            console.error("getWorkByPatient error:", err);
            return { data: [] };
          }),
        ]);

        console.log("ALL RESPONSES:", {
          patientRes,
          progRes,
          therapiesRes,
          workRes,
        });

        const patientEntity = patientRes?.data ?? null;
        const patientBase = patientEntity
          ? {
              fullName: patientEntity.name || patientEntity.fullName || "",
              phone: patientEntity.contactInfo || patientEntity.phone || "",
              email: patientEntity.email || "",
              gender: patientEntity.gender || "",
              address: patientEntity.address || "",
              birthDate:
                patientEntity.birthDate || patientEntity.birthdate || "",
              ssn: patientEntity.ssn || storedSSN,
              relativeName: patientEntity.relativeName,
              caregiverName: patientEntity.caregiverName,
              programId: patientEntity.programId,
              programName: patientEntity.programName,
              programOrganizationSSN: patientEntity.programOrganizationSSN,
              avatar: patientEntity.avatar,
            }
          : { ssn: storedSSN };

        const rawPrograms = Array.isArray(progRes?.data) ? progRes.data : [];
        const therapies = Array.isArray(therapiesRes?.data)
          ? therapiesRes.data
          : [];

        // Handle both array and single object responses for work data
        let rawWork = [];
        if (workRes?.data) {
          if (Array.isArray(workRes.data)) {
            rawWork = workRes.data;
          } else if (typeof workRes.data === "object") {
            // If it's a single object, wrap it in an array
            rawWork = [workRes.data];
          }
        }

        console.log("rawWork after normalization:", rawWork);

        // normalize programs mapping with API field names
        const programs = rawPrograms.map((p, i) => ({
          id: p.id ?? p.programId ?? `p-${i}`,
          organizationSSN: p.organizationSSN ?? "",
          name: p.name ?? "Program",
          organizationName: p.organizationName ?? "",
          startDate: p.startDate ?? "",
          endDate: p.endDate ?? "",
          status: p.status ?? "Unknown",
          price: p.price ?? 0,
          imageUrl: p.imageUrl ?? "",
          imgUrl: p.imageUrl ?? "",
          location: p.location ?? "",
        }));

        // normalize therapies -> sessions using API field names
        const sessions = therapies.map((t, i) => {
          const rawImg =
            t?.imageUrl ??
            t?.imgUrl ??
            t?.image ??
            t?.img ??
            t?.photoUrl ??
            t?.pictureUrl ??
            t?.ImageUrl ??
            t?.Image ??
            t?.imagePath ??
            t?.fileUrl ??
            t?.filePath ??
            "";

          const safeImg =
            typeof rawImg === "string" && rawImg.trim().length > 0
              ? rawImg.trim()
              : "";

          return {
            id: t.id ?? `t-${i}`,
            title: t.name ?? "Therapy",
            centerName: t.center?.name ?? "",
            location: t.center?.location ?? "",
            pricePerHour: t.pricePerHour ?? 0,
            duration: t.duration ?? 0,
            doctorname: t.doctorname ?? "",
            therapyDetails: t.therapyDetails ?? "",
            date: t.date ?? "",
            imageUrl: safeImg,
            imgUrl: safeImg,
            centerID: t.centerID ?? "",
            state: t.date ? "scheduled" : "pending",
          };
        });

        // Add dummy therapy session for review
        sessions.push({
          id: "dummy-1",
          title: "Physical Therapy - Lower Back",
          centerName: "HealthCare Rehabilitation Center",
          location: "123 Medical Plaza, City Center",
          pricePerHour: 75,
          duration: 60,
          doctorname: "Dr. Sarah Johnson",
          therapyDetails: "Focused rehabilitation for lower back pain with exercise therapy",
          date: "2025-12-20",
          imageUrl: "",
          imgUrl: "",
          centerID: "center-001",
          state: "scheduled",
        });

        // normalize employment data using API field names
        console.log("rawWork array:", rawWork);
        const employment =
          rawWork.length > 0
            ? {
                patientSSN:
                  rawWork[0].PatientSSN ?? rawWork[0].patientSSN ?? "",
                organizationSSN:
                  rawWork[0].OrganizationSSN ??
                  rawWork[0].organizationSSN ??
                  "",
                patientName:
                  rawWork[0].PatientName ?? rawWork[0].patientName ?? "",
                organizationName:
                  rawWork[0].OrganizationName ??
                  rawWork[0].organizationName ??
                  "",
                jobTitle: rawWork[0].JobTitle ?? rawWork[0].jobTitle ?? "",
                salary: rawWork[0].Salary ?? rawWork[0].salary ?? 0,
                startDate: rawWork[0].StartDate ?? rawWork[0].startDate ?? "",
              }
            : null;

        console.log("Processed employment:", employment);

        // Set data from API response
        const merged = {
          ...patientBase,
          programs: programs,
          sessions: sessions,
          employment: employment,
        };

        setData(merged);
        console.log("Patient data loaded:", merged);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openEdit = () => {
    setDraft({
      fullName: data.fullName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      gender: data?.gender || "",
      address: data?.address || "",
    });
    setModalError("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!draft.fullName || draft.fullName.trim().length < 2) {
      setModalError("Please enter a valid name");
      return;
    }

    try {
      setSaving(true);
      // TODO: call update API (e.g. updatePatient(data.id, draft))
      await new Promise((r) => setTimeout(r, 700));
      setData((prev) => ({ ...prev, ...draft }));
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      setModalError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // Handler functions for action buttons
  const handleWithdrawClick = (program) => {
    setWithdrawModal({ isOpen: true, program });
  };

  const handleWithdrawConfirm = async () => {
    setActionLoading(true);
    try {
      const program = withdrawModal.program;
      const userSSN = localStorage.getItem("ssn");

      // Call deletePatientFromProgram(programId, ssn, organizationSSN)
      await deletePatientFromProgram(
        program.id,
        userSSN,
        program.organizationSSN
      );

      console.log(`Successfully withdrew from program ${program?.id}`);
      // Remove program from state
      setData((prev) => ({
        ...prev,
        programs: prev.programs?.filter((p) => p.id !== program?.id) || [],
      }));
      setWithdrawModal({ isOpen: false, program: null });
    } catch (err) {
      console.error("Withdraw failed", err);
      alert("Failed to withdraw from program. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSessionClick = (session) => {
    setCancelModal({ isOpen: true, session });
  };

  const handleCancelSessionConfirm = async () => {
    setActionLoading(true);
    try {
      const session = cancelModal.session;

      // Call deletePatientSession(therapyId)
      await deletePatientSession(session.id);

      console.log(`Successfully cancelled session ${session?.id}`);
      // Remove session from state
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions?.filter((s) => s.id !== session?.id) || [],
      }));
      setCancelModal({ isOpen: false, session: null });
    } catch (err) {
      console.error("Cancel session failed", err);
      alert("Failed to cancel session. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResignClick = () => {
    setResignModal({ isOpen: true });
  };

  const handleResignConfirm = async () => {
    setActionLoading(true);
    try {
      const userSSN = localStorage.getItem("ssn");
      const organizationSSN = data.employment?.organizationSSN;

      if (!organizationSSN) {
        throw new Error("Organization SSN not found");
      }

      // Call deletePatientWork(ssn, organizationSSN)
      await deletePatientWork(userSSN, organizationSSN);

      console.log("Successfully resigned from employment");
      // Remove employment from state
      setData((prev) => ({ ...prev, employment: null }));
      setResignModal({ isOpen: false });
    } catch (err) {
      console.error("Resign failed", err);
      alert("Failed to resign from employment. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <div className="page-container">Loading...</div>;
  if (isError) return <div className="page-container">Error loading data.</div>;

  return (
    <>
      <div className="with-sidebar">
        <Sidebar userType="patient" />{" "}
        <div className="page-container">
          <header className="welcome-box centered">
            <h1>
              Welcome,{" "}
              {data?.fullName ? data.fullName.split(" ")[0] : "Patient"}
            </h1>
            <p>{new Date().toLocaleDateString()}</p>
          </header>

          {/* Patient card (edit button inside card) */}
          <PatientCard data={data} onEdit={openEdit} />

          {/* Program section */}
          <section className="card-section">
            <h3>Patient Programs</h3>
            <div className="profile-cards-grid">
              {data.programs?.length ? (
                data.programs.map((p, index) => {
                  const programKey = `${
                    p.id || p.programId || `program-${index}`
                  }-${index}`;
                  const programImg =
                    (typeof p.imgUrl === "string" && p.imgUrl?.trim?.()) ||
                    (typeof p.imageUrl === "string" && p.imageUrl?.trim?.()) ||
                    null;

                  return (
                    <div
                      key={`${programKey}-${index}`}
                      className="profile-program-card"
                      style={{
                        display: "flex",
                        gap: "16px",
                        position: "relative",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 className="h4" style={{ marginTop: 8 }}>
                          {p.name}
                        </h4>

                        <p
                          className="small"
                          style={{ marginTop: 6, color: "#666" }}
                        >
                          {p.organizationName && `📍 ${p.organizationName}`}
                        </p>

                        <p
                          className="small"
                          style={{ marginTop: 4, color: "#888" }}
                        >
                          {p.startDate && p.endDate && (
                            <>
                              📅 {p.startDate} to {p.endDate}
                            </>
                          )}
                        </p>

                        {p.price && (
                          <p
                            className="small"
                            style={{
                              marginTop: 6,
                              fontWeight: 700,
                              color: "#27865d",
                              fontSize: "1.05rem",
                            }}
                          >
                            💰 ${p.price}
                          </p>
                        )}

                        {p.status && (
                          <p
                            className="small"
                            style={{
                              marginTop: 6,
                              fontWeight: 600,
                              color: "#555",
                            }}
                          >
                            Status: {p.status}
                          </p>
                        )}
                      </div>

                      <button
                        className="withdraw-btn"
                        onClick={() => handleWithdrawClick(p)}
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          right: "16px",
                          padding: "8px 12px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#c82333")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#dc3545")
                        }
                      >
                        Withdraw
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-card">No enrolled program</div>
              )}
            </div>
          </section>

          {/* sessions */}
          <section className="card-section">
            <h3>Therapy Sessions</h3>
            <div className="profile-cards-grid">
              {data.sessions?.length ? (
                data.sessions.map((s, index) => {
                  const sessionKey = `${s.id || `session-${index}`}-${index}`;
                  const sessionImg =
                    (typeof s.imgUrl === "string" && s.imgUrl?.trim?.()) ||
                    (typeof s.imageUrl === "string" && s.imageUrl?.trim?.()) ||
                    null;

                  return (
                    <div
                      key={`${sessionKey}-${index}`}
                      className="profile-session-card"
                      style={{
                        display: "flex",
                        gap: "16px",
                        position: "relative",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 className="h4" style={{ marginTop: 8 }}>
                          {s.title}
                        </h4>

                        <p
                          className="small"
                          style={{ marginTop: 6, color: "#666" }}
                        >
                          {s.centerName && `🏥 ${s.centerName}`}
                        </p>

                        <p
                          className="small"
                          style={{ marginTop: 4, color: "#888" }}
                        >
                          {s.location && `📍 ${s.location}`}
                        </p>

                        {s.pricePerHour && s.duration && (
                          <p
                            className="small"
                            style={{
                              marginTop: 6,
                              fontWeight: 700,
                              color: "#2e65f3",
                              fontSize: "1.05rem",
                            }}
                          >
                            💰 ${s.pricePerHour}/hr • ⏱️ {s.duration} min
                          </p>
                        )}

                        {s.state && (
                          <p
                            className="small"
                            style={{
                              marginTop: 6,
                              fontWeight: 600,
                              color: "#555",
                            }}
                          >
                            Status: {s.state}
                          </p>
                        )}
                      </div>

                      <button
                        className="cancel-session-btn"
                        onClick={() => handleCancelSessionClick(s)}
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          right: "16px",
                          padding: "8px 12px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#c82333")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#dc3545")
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-card">No upcoming sessions</div>
              )}
            </div>
          </section>

          {/* employment */}
          <section className="card-section">
            <h3>Employment</h3>
            {data?.employment ? (
              <div className="employment-card" style={{ position: "relative" }}>
                <div className="avatar-circle">�</div>
                <div style={{ flex: 1 }}>
                  <div className="employment-title">
                    {data.employment.jobTitle} at{" "}
                    {data.employment.organizationName}
                  </div>
                  <div className="employment-sub">
                    Since{" "}
                    {data.employment.startDate
                      ? new Date(data.employment.startDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  {data.employment.salary > 0 && (
                    <div
                      className="employment-sub"
                      style={{
                        marginTop: 4,
                        color: "#27865d",
                        fontWeight: 600,
                      }}
                    >
                      💰 ${data.employment.salary}/month
                    </div>
                  )}
                </div>
                <button
                  className="resign-btn"
                  onClick={handleResignClick}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    padding: "8px 12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#c82333")}
                  onMouseLeave={(e) => (e.target.style.background = "#dc3545")}
                >
                  Resign
                </button>
              </div>
            ) : (
              <div className="empty-card">No employment information</div>
            )}
          </section>

          {editing && (
            <div className="popup-overlay">
              <div className="popup-card">
                <h3>Edit patient</h3>

                <div className="popup-input-group">
                  <label>Full name</label>
                  <input
                    value={draft.fullName}
                    onChange={(e) =>
                      setDraft({ ...draft, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="popup-row">
                  <div className="popup-input-group">
                    <label>Email</label>
                    <input
                      value={draft.email}
                      onChange={(e) =>
                        setDraft({ ...draft, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="popup-input-group">
                    <label>Phone</label>
                    <input
                      value={draft.phone}
                      onChange={(e) =>
                        setDraft({ ...draft, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="popup-input-group">
                  <label>Gender</label>
                  <input
                    value={draft.gender}
                    onChange={(e) =>
                      setDraft({ ...draft, gender: e.target.value })
                    }
                  />
                </div>

                <div className="popup-input-group">
                  <label>Address</label>
                  <input
                    value={draft.address}
                    onChange={(e) =>
                      setDraft({ ...draft, address: e.target.value })
                    }
                  />
                </div>

                {modalError && <div className="error">{modalError}</div>}

                <div className="popup-actions">
                  <button
                    className="close-btn"
                    onClick={() => setEditing(false)}
                  >
                    Close
                  </button>
                  <button
                    className="add-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Confirmation Modals */}
      <PatientProfileModal
        isOpen={withdrawModal.isOpen}
        onConfirm={handleWithdrawConfirm}
        onCancel={() => setWithdrawModal({ isOpen: false, program: null })}
        title="Withdraw from Program"
        message={`Are you sure you want to withdraw from "${
          withdrawModal.program?.name || "this program"
        }"? This action cannot be undone.`}
        confirmText="Withdraw"
        isLoading={actionLoading}
      />

      <PatientProfileModal
        isOpen={cancelModal.isOpen}
        onConfirm={handleCancelSessionConfirm}
        onCancel={() => setCancelModal({ isOpen: false, session: null })}
        title="Cancel Session"
        message={`Are you sure you want to cancel "${
          cancelModal.session?.title || "this session"
        }"? This action cannot be undone.`}
        confirmText="Cancel Session"
        isLoading={actionLoading}
      />

      <PatientProfileModal
        isOpen={resignModal.isOpen}
        onConfirm={handleResignConfirm}
        onCancel={() => setResignModal({ isOpen: false })}
        title="Resign from Employment"
        message={`Are you sure you want to resign from your position as ${
          data.employment?.jobTitle || "employee"
        } at ${
          data.employment?.organizationName || "this organization"
        }? This action cannot be undone.`}
        confirmText="Resign"
        isLoading={actionLoading}
      />
    </>
  );
}
