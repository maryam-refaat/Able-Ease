import React, { useEffect, useMemo, useState } from "react";
import "./ProgramModal.css";
import { BASE_URL } from "../assets/apis";

const baseApiUrl = BASE_URL;

export default function AssignPatientModal({ isOpen, onClose, caregiver }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedSSNs, setSelectedSSNs] = useState([]);

  const auth = useMemo(
    () => ({
      token: localStorage.getItem("authToken"),
      orgSsn: localStorage.getItem("ssn"),
    }),
    []
  );

  // TODO: Replace these with your API URLs
  const fetchPatientsUrl = useMemo(() => {
    // Example placeholder – provide final URL
    return `${baseApiUrl}/patients/organization/${auth.orgSsn}/with-usernames`;
  }, []);

  const assignPatientUrl = (cg) => {
    // Swagger shows: POST /api/Caregiver/AssignPatients/{caregiverSSN}/assign-patients
    const caregiverSSN = cg?.ssn ?? cg?.SSN ?? cg?.id ?? cg?.caregiverId;
    return `${baseApiUrl}/Caregiver/AssignPatients/${caregiverSSN}/assign-patients`;
  };

  const withHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    // Do not set Content-Type when using FormData; browser will set boundary
  });

  // Load patients when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const loadPatients = async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await fetch(fetchPatientsUrl, {
          method: "GET",
          headers: withHeaders(auth.token),
        });
        if (!res.ok) throw new Error(`Failed to load patients: ${res.status}`);
        const json = await res.json();
        // Accept shapes: {data:[...]}, {data:{data:[...]}}, direct array
        const arr = Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        const mapped = arr
          .filter(Boolean)
          .map((p) => ({
            ssn: p.ssn || p.SSN || p.patientSSN || p.id,
            username: p.username || p.userName || p.name,
          }))
          .filter((x) => x.ssn && x.username);
        if (!cancelled) {
          setPatients(mapped);
          setSelectedSSNs([]);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Could not load patients");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPatients();
    return () => {
      cancelled = true;
    };
  }, [isOpen, auth.token, fetchPatientsUrl]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const url = assignPatientUrl(caregiver);
      const form = new FormData();
      // Swagger indicates body is multipart/form-data with array PatientSSNs
      selectedSSNs.forEach((ssn) => form.append("PatientSSNs", ssn));
      const res = await fetch(url, {
        method: "POST",
        headers: withHeaders(auth.token),
        body: form,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Assign failed: ${res.status}`);
      }
      setSuccess("Patient assigned successfully.");
    } catch (e) {
      setError(e.message || "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Assign Patient</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={submitting}
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div
            className="success-message"
            style={{ color: "#16a34a", marginBottom: 12 }}
          >
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="program-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: "1 1 100%" }}>
              <label htmlFor="patientSelect">Select Patients</label>
              <select
                id="patientSelect"
                name="patientSSNs"
                multiple
                value={selectedSSNs}
                onChange={(e) =>
                  setSelectedSSNs(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                disabled={loading || submitting}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                }}
              >
                {loading ? (
                  <option>Loading...</option>
                ) : patients.length === 0 ? (
                  <option value="">No patients found</option>
                ) : (
                  patients.map((p) => (
                    <option key={p.ssn} value={p.ssn}>
                      {p.username}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || loading || selectedSSNs.length === 0}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
