import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientProf.css";
import "../profilepagecomponents/profile.css";
import PatientCard from "../Components/PatientCard";

import { getPatient_Program, getPatient_Therapies, getPatient_Reports } from "../assets/apis";
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
    async function fetchData() {
      try {
        setIsLoading(true);

        // Determine patient identifier (prefer route state, fall back to localStorage token/SSN)
        const fromState = location.state?.patientData;
        const candidateId = fromState?.id ?? fromState?.PSSN ?? fromState?.patientSSN ?? fromState?.ssn ?? null;

        // If we have basic patient data from navigation state, use it as base
        let base = fromState ? { ...fromState } : {};

        // Try other common places for an identifier
        const storedToken = (() => {
          try {
            return JSON.parse(localStorage.getItem("patientToken"));
          } catch (e) {
            return null;
          }
        })();

        const storedSSN = localStorage.getItem("patientSSN") || null;

        const patientId = candidateId || storedSSN || storedToken || null;

        if (patientId) {
          // fetch related patient resources in parallel
          const [progRes, therapiesRes, reportsRes] = await Promise.all([
            getPatient_Program(patientId).catch(() => ({ data: [] })),
            getPatient_Therapies(patientId).catch(() => ({ data: [] })),
            getPatient_Reports(patientId).catch(() => ({ data: [] })),
          ]);

          const programs = Array.isArray(progRes?.data) ? progRes.data : [];
          const therapies = Array.isArray(therapiesRes?.data) ? therapiesRes.data : [];
          const reports = Array.isArray(reportsRes?.data) ? reportsRes.data : [];

          // normalize therapies -> sessions (best-effort mapping)
          const sessions = therapies.map((t, i) => ({
            id: t.id ?? t.therapyId ?? `t-${i}`,
            title: t.name ?? t.title ?? t.therapyName ?? "Therapy",
            location: t.location ?? t.centerLocation ?? t.center?.location ?? "",
            state: t.state ?? t.status ?? "scheduled",
          }));

          const merged = {
            ...base,
            programs,
            sessions,
            reports,
          };

          setData(merged);
        } else {
          // no identifier found — keep state data if any, otherwise mark as error
          if (Object.keys(base).length) setData(base);
          else setIsError(true);
        }
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
      
      fullName:data.fullName||"",
      email: data?.email || "",
      phone: data?.phone || "",
      gender: data?.gender || "",
      address: data?.address || ""
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
      <div className="side-rect" aria-hidden="true">
        <div className="side-icons">
          <button className="side-btn" aria-label="overview" onClick={() => navigate('/') }>
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="messages" onClick={() => navigate('/messages') }>
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="reports" onClick={() => navigate('/patient-reports', { state: { patientData: data } })}>
            <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="page-container">
      <header className="welcome-box centered">
        <h1>Welcome, {data?.fullName ? data.fullName.split(" ")[0] : "Patient"}</h1>
        <p>{new Date().toLocaleDateString()}</p>
      </header>

      {/* Patient card (edit button inside card) */}
      <PatientCard data={data} onEdit={openEdit} />

      {/* Program section */}
      <section className="card-section">
        <h3>Patient Program if enrolled</h3>
        <div className="card-content">
          {data.programs?.length ? (
            data.programs.map((p) => (
              <div key={p.id} className="program-card big">
                <div className="program-title">{p.name}</div>
                <div className="program-state">State: {p.state}</div>
              </div>
            ))
          ) : (
            <div className="empty-card">No enrolled program</div>
          )}
        </div>
      </section>

      {/* sessions */}
      <section className="card-section">
        <h3>Coming sessions</h3>
        <div className="card-content horizontal">
          {data.sessions?.length ? (
            data.sessions.map((s) => (
              <div key={s.id} className="session-card">
                <div className="session-title">{s.title}</div>
                <div className="session-loc">{s.location}</div>
                <div className="session-state">{s.state}</div>
              </div>
            ))
          ) : (
            <div className="empty-card">No upcoming sessions</div>
          )}
        </div>
      </section>

      {/* employment */}
      <section className="card-section">
        <h3>Employment (position and organization)</h3>
        <div className="employment-card">
          <div className="avatar-circle">👤</div>
          <div>
            <div className="employment-title">
              {data?.employment?.position || "Job description"}{" "}
              {data?.employment?.since && `since ${data.employment.since}`}
            </div>
            <div className="employment-sub">{data?.employment?.organization || "manager details"}</div>
          </div>
        </div>
      </section>

      {/* edit modal */}
      {editing && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Edit patient</h3>

            <div className="popup-input-group">
              <label>Full name</label>
              <input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
            </div>

            <div className="popup-row">
              <div className="popup-input-group">
                <label>Email</label>
                <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </div>
              <div className="popup-input-group">
                <label>Phone</label>
                <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </div>
            </div>

            <div className="popup-input-group">
              <label>Gender</label>
              <input value={draft.gender} onChange={(e) => setDraft({ ...draft, gender: e.target.value })} />
            </div>

            <div className="popup-input-group">
              <label>Address</label>
              <input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
            </div>

            {modalError && <div className="error">{modalError}</div>}

            <div className="popup-actions">
              <button className="close-btn" onClick={() => setEditing(false)}>
                Close
              </button>
              <button className="add-btn" onClick={handleSave} disabled={saving}>
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
