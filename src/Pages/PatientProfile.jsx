import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PatientProf.css";
import PatientCard from "../Components/PatientCard";

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

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // const token = JSON.parse(localStorage.getItem("patientToken"));
        // const fetchedData = await getPatientById(token); // replace when ready
        // setData(fetchedData);
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
  );
}
