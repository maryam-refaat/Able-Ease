import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientProf.css";
import "../profilepagecomponents/profile.css";
import PatientCard from "../Components/PatientCard";
import Sidebar from "../Components/Sidebar";
import {
  getProgramByPatient,
  getTherapyByPatient,
  getWorkByPatient,
  getPatient_Reports,
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

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Determine patient identifier (prefer route state, fall back to localStorage token/SSN)
        const fromState = location.state?.patientData;
        const candidateId =
          fromState?.id ??
          fromState?.PSSN ??
          fromState?.patientSSN ??
          fromState?.ssn ??
          null;

        // If we have basic patient data from navigation state, use it as base
        let base = fromState ? { ...fromState } : {};

        // Try other common places for an identifier
        const storedToken = (() => {
          try {
            return JSON.parse(localStorage.getItem("authToken"));
          } catch (e) {
            return null;
          }
        })();

        const storedSSN = localStorage.getItem("ssn") || null;

        const patientId = candidateId || storedSSN || storedToken || null;

        if (patientId) {
          // fetch related patient resources in parallel
          const [progRes, therapiesRes, reportsRes, workRes] = await Promise.all([
            getProgramByPatient(storedSSN).catch(() => ({ data: [] })),
            getTherapyByPatient(storedSSN).catch(() => ({ data: [] })),
            getPatient_Reports(storedSSN).catch(() => ({ data: [] })),
            getWorkByPatient(storedSSN).catch(() => ({ data: [] })),
          ]);

          const rawPrograms = Array.isArray(progRes?.data) ? progRes.data : [];
          const therapies = Array.isArray(therapiesRes?.data)
            ? therapiesRes.data
            : [];
          const reports = Array.isArray(reportsRes?.data)
            ? reportsRes.data
            : [];
          const rawWork = Array.isArray(workRes?.data) ? workRes.data : [];

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
            location: p.location ?? ""
          }));

          // normalize therapies -> sessions using API field names
          const sessions = therapies.map((t, i) => ({
            id: t.id ?? `t-${i}`,
            title: t.name ?? "Therapy",
            centerName: t.center?.name ?? "",
            location: t.center?.location ?? "",
            pricePerHour: t.pricePerHour ?? 0,
            duration: t.duration ?? 0,
            doctorname: t.doctorname ?? "",
            therapyDetails: t.therapyDetails ?? "",
            date: t.date ?? "",
            imageUrl: t.imageUrl ?? "",
            imgUrl: t.imageUrl ?? "",
            centerID: t.centerID ?? "",
            state: t.date ? "scheduled" : "pending",
          }));

          // normalize employment data using API field names
          const employment = rawWork.length > 0 ? {
            patientSSN: rawWork[0].PatientSSN ?? rawWork[0].patientSSN ?? "",
            organizationSSN: rawWork[0].OrganizationSSN ?? rawWork[0].organizationSSN ?? "",
            patientName: rawWork[0].PatientName ?? rawWork[0].patientName ?? "",
            organizationName: rawWork[0].OrganizationName ?? rawWork[0].organizationName ?? "",
            jobTitle: rawWork[0].JobTitle ?? rawWork[0].jobTitle ?? "",
            salary: rawWork[0].Salary ?? rawWork[0].salary ?? 0,
            startDate: rawWork[0].StartDate ?? rawWork[0].startDate ?? "",
          } : null;

          const merged = {
            ...base,
            programs,
            sessions,
            reports,
            employment,
          };

          setData(merged);
        } else {
          // no identifier found — keep state data if any, otherwise use stored localStorage data
          if (Object.keys(base).length) {
            setData(base);
          } else {
            // Try to get stored patient data from localStorage
            const storedDataStr = localStorage.getItem("patientData");
            let storedData = null;
            try {
              storedData = storedDataStr ? JSON.parse(storedDataStr) : null;
            } catch (e) {
              console.error("Failed to parse stored patient data", e);
            }

            // Set structure with stored data or demo data
            const patientInfo = {
              fullName:
                localStorage.getItem("patientName") ||
                storedData?.fullName ||
                "John Smith",
              email:
                localStorage.getItem("patientEmail") ||
                storedData?.email ||
                "john.smith@example.com",
              phone:
                localStorage.getItem("patientPhone") ||
                storedData?.phone ||
                "+1 555 123 4567",
              gender:
                localStorage.getItem("patientGender") ||
                storedData?.gender ||
                "Male",
              address:
                localStorage.getItem("patientAddress") ||
                storedData?.address ||
                "123 Main Street, Cairo, Egypt",
              birthDate:
                localStorage.getItem("patientBirthDate") ||
                storedData?.birthDate ||
                "1990-05-15",
              ssn: localStorage.getItem("patientSSN") || storedData?.ssn || "demo-patient-123",
              programs: [
                {
                  id: 1,
                  name: "Physical Therapy Program",
                  organizationName: "Able Care Center",
                  startDate: "2025-12-20",
                  endDate: "2026-03-20",
                  status: "Active",
                  price: 150
                }
                
              ],
              sessions: [
                {
                  id: 1,
                  title: "Physiotherapy Session - Week 1",
                  centerName: "Able Care Center",
                  location: "Cairo",
                  pricePerHour: 50,
                  duration: 60,
                  state: "completed"
                },
                {
                  id: 2,
                  title: "Physiotherapy Session - Week 2",
                  centerName: "Able Care Center",
                  location: "Cairo",
                  pricePerHour: 50,
                  duration: 60,
                  state: "scheduled"
                },
                {
                  id: 3,
                  title: "Aquatic Therapy",
                  centerName: "Wellness Hub",
                  location: "Giza",
                  pricePerHour: 40,
                  duration: 90,
                  state: "scheduled"
                },
                {
                  id: 4,
                  title: "Occupational Therapy",
                  centerName: "Care Plus",
                  location: "Alexandria",
                  pricePerHour: 60,
                  duration: 45,
                  state: "completed"
                }
              ],
              reports: [
                {
                  id: 1,
                  title: "Initial Assessment Report",
                  date: "2025-11-01",
                  type: "Assessment"
                },
                {
                  id: 2,
                  title: "Progress Report - Month 1",
                  date: "2025-12-01",
                  type: "Progress"
                },
                {
                  id: 3,
                  title: "Mid-Program Evaluation",
                  date: "2025-12-15",
                  type: "Evaluation"
                }
              ],
              employment: {
                patientSSN: "demo-patient-123",
                organizationSSN: "ORG-001",
                patientName: "John Smith",
                organizationName: "Able Care Center",
                jobTitle: "Physical Therapist Assistant",
                salary: 3500,
                startDate: "2024-06-01"
              },
            };
            setData(patientInfo);
          }
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        // Try to get stored patient data from localStorage
        const storedDataStr = localStorage.getItem("patientData");
        let storedData = null;
        try {
          storedData = storedDataStr ? JSON.parse(storedDataStr) : null;
        } catch (e) {
          console.error("Failed to parse stored patient data", e);
        }

        // Set data with stored values instead of error
        const patientInfo = {
          fullName:
            localStorage.getItem("patientName") ||
            storedData?.fullName ||
            "John Smith",
          email:
            localStorage.getItem("patientEmail") ||
            storedData?.email ||
            "john.smith@example.com",
          phone:
            localStorage.getItem("patientPhone") ||
            storedData?.phone ||
            "+1 555 123 4567",
          gender:
            localStorage.getItem("patientGender") ||
            storedData?.gender ||
            "Male",
          address:
            localStorage.getItem("patientAddress") ||
            storedData?.address ||
            "123 Main Street, Cairo, Egypt",
          birthDate:
            localStorage.getItem("patientBirthDate") ||
            storedData?.birthDate ||
            "1990-05-15",
          ssn: localStorage.getItem("patientSSN") || storedData?.ssn || "demo-patient-123",
          programs: [
            {
              id: 1,
              name: "Physical Therapy Program",
              organizationName: "Able Care Center",
              startDate: "2025-12-20",
              endDate: "2026-03-20",
              status: "Active",
              price: 150
            },
            {
              id: 2,
              name: "Rehabilitation Program",
              organizationName: "Wellness Hub",
              startDate: "2026-01-05",
              endDate: "2026-04-05",
              status: "Active",
              price: 180
            },
            {
              id: 3,
              name: "Mobility Enhancement",
              organizationName: "Care Plus",
              startDate: "2025-11-01",
              endDate: "2025-12-15",
              status: "Completed",
              price: 200
            }
          ],
          sessions: [
            {
              id: 1,
              title: "Physiotherapy Session - Week 1",
              centerName: "Able Care Center",
              location: "Cairo",
              pricePerHour: 50,
              duration: 60,
              state: "completed"
            },
            {
              id: 2,
              title: "Physiotherapy Session - Week 2",
              centerName: "Able Care Center",
              location: "Cairo",
              pricePerHour: 50,
              duration: 60,
              state: "scheduled"
            },
            {
              id: 3,
              title: "Aquatic Therapy",
              centerName: "Wellness Hub",
              location: "Giza",
              pricePerHour: 40,
              duration: 90,
              state: "scheduled"
            },
            {
              id: 4,
              title: "Occupational Therapy",
              centerName: "Care Plus",
              location: "Alexandria",
              pricePerHour: 60,
              duration: 45,
              state: "completed"
            }
          ],
          reports: [
            {
              id: 1,
              title: "Initial Assessment Report",
              date: "2025-11-01",
              type: "Assessment"
            },
            {
              id: 2,
              title: "Progress Report - Month 1",
              date: "2025-12-01",
              type: "Progress"
            },
            {
              id: 3,
              title: "Mid-Program Evaluation",
              date: "2025-12-15",
              type: "Evaluation"
            }
          ],
          employment: {
            patientSSN: "demo-patient-123",
            organizationSSN: "ORG-001",
            patientName: "John Smith",
            organizationName: "Able Care Center",
            jobTitle: "Physical Therapist Assistant",
            salary: 3500,
            startDate: "2024-06-01"
          },
        };
        setData(patientInfo);
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
                data.programs.map((p) => (
                  <div key={p.id} className="profile-program-card" style={{ display: "flex", gap: "16px", position: "relative" }}>
                    <div style={{ flex: 1 }}>
                      <div className="media" aria-hidden="true">
                        {p.imgUrl || p.imageUrl ? (
                          <img
                            src={p.imgUrl || p.imageUrl}
                            alt={p.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="media-placeholder">Image</div>
                        )}
                      </div>

                      <h4 className="h4" style={{ marginTop: 8 }}>
                        {p.name}
                      </h4>

                      <p className="small" style={{ marginTop: 6, color: "#666" }}>
                        {p.organizationName && `📍 ${p.organizationName}`}
                      </p>

                      <p className="small" style={{ marginTop: 4, color: "#888" }}>
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
                      onClick={() => console.log(`Withdraw from program ${p.id}`)}
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
                      onMouseEnter={(e) => e.target.style.background = "#c82333"}
                      onMouseLeave={(e) => e.target.style.background = "#dc3545"}
                    >
                      Withdraw
                    </button>
                  </div>
                ))
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
                data.sessions.map((s) => (
                  <div key={s.id} className="profile-session-card" style={{ display: "flex", gap: "16px", position: "relative" }}>
                    <div style={{ flex: 1 }}>
                      <div className="media" aria-hidden="true">
                        {s.imgUrl || s.imageUrl ? (
                          <img
                            src={s.imgUrl || s.imageUrl}
                            alt={s.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="media-placeholder">Image</div>
                        )}
                      </div>

                      <h4 className="h4" style={{ marginTop: 8 }}>
                        {s.title}
                      </h4>

                      <p className="small" style={{ marginTop: 6, color: "#666" }}>
                        {s.centerName && `🏥 ${s.centerName}`}
                      </p>

                      <p className="small" style={{ marginTop: 4, color: "#888" }}>
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
                      onClick={() => console.log(`Cancel session ${s.id}`)}
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
                      onMouseEnter={(e) => e.target.style.background = "#c82333"}
                      onMouseLeave={(e) => e.target.style.background = "#dc3545"}
                    >
                      Cancel
                    </button>
                  </div>
                ))
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
                    {data.employment.jobTitle} at {data.employment.organizationName}
                  </div>
                  <div className="employment-sub">
                    Since {data.employment.startDate ? new Date(data.employment.startDate).toLocaleDateString() : "N/A"}
                  </div>
                  {data.employment.salary > 0 && (
                    <div className="employment-sub" style={{ marginTop: 4, color: "#27865d", fontWeight: 600 }}>
                      💰 ${data.employment.salary}/month
                    </div>
                  )}
                </div>
                <button
                  className="resign-btn"
                  onClick={() => console.log(`Resign from employment`)}
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
                  onMouseEnter={(e) => e.target.style.background = "#c82333"}
                  onMouseLeave={(e) => e.target.style.background = "#dc3545"}
                >
                  Resign
                </button>
              </div>
            ) : (
              <div className="empty-card">No employment information</div>
            )}
          </section>

          {/* edit modal */}
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
    </>
  );
}
