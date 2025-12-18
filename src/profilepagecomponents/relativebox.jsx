import { useState, useEffect } from "react";
import { getRelatives, updateRelative } from "../assets/apis.js";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";
import "./profile.css";

export function RelativeCard({ title, data, disableFetch = false, onEdit }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    gender: "",
    birthDate: "",
    patientSSN: "",
    patientName: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alertState, showAlert, closeAlert } = useAlert();

  const baseApiUrl = "https://localhost:7040/api";

  useEffect(() => {
    const loadRelativeData = async () => {
      if (disableFetch) {
        // Populate from provided data only and skip API calls
        if (data) {
          setForm({
            name: data.name || "",
            contact: data.contactInfo || "",
            email: data.email || "",
            address: data.address || "",
            gender: data.gender || "",
            birthDate: data.birthDate || "",
            patientSSN: data.patientSSN || "",
            patientName: data.patientName || "",
          });
        }
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const ssn = getSSNFromToken(token) || localStorage.getItem("ssn");

        if (!ssn) {
          console.warn("No SSN found in localStorage");
          return;
        }

        const url = `${baseApiUrl}/Relative/GetRelative/${ssn}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Failed to load relative: ${res.status}`);
        const json = await res.json();

        // Handle response - could be wrapped in data or direct object
        const relativeData = json?.data || json;

        setForm({
          name: relativeData.name || "",
          contact: relativeData.contactInfo || "",
          email: relativeData.email || "",
          address: relativeData.address || "",
          gender: relativeData.gender || "",
          birthDate: relativeData.birthDate || "",
          patientSSN: relativeData.patientSSN || "",
          patientName: relativeData.patientName || "",
        });
      } catch (e) {
        console.error("Failed to load relative data:", e);
        // Fallback to provided data if fetch fails
        if (data) {
          setForm({
            name: data.name || "",
            contact: data.contactInfo || "",
            email: data.email || "",
            address: data.address || "",
            gender: data.gender || "",
            birthDate: data.birthDate || "",
            patientSSN: data.patientSSN || "",
            patientName: data.patientName || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadRelativeData();
  }, [data]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const ssn = localStorage.getItem("ssn");

      // Prepare update payload matching API expectations
      const payload = {
        name: form.name,
        contactInfo: form.contact,
        email: form.email,
        address: form.address,
        gender: form.gender,
        birthDate: form.birthDate,
        patientSSN: form.patientSSN,
      };

      const url = `${baseApiUrl}/Relative/UpdateRelative/${ssn}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Update failed: ${res.status}`);
      }

      setIsEditing(false);
      showAlert("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update relative:", error);
      showAlert(`Failed to update profile: ${error.message}`, "error");
    }
  };

  return (
    <div className="relative-card">
      <div className="relative-header-gradient"></div>

      <div className="relative-content">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
        ) : (
          <>
            <div className="relative-top-row">
              <div className="relative-user">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="avatar"
                    className="relative-avatar"
                  />
                ) : null}

                <div>
                  <h2 className="relative-title">{title}</h2>
                  <p className="relative-email">{form.email}</p>
                </div>
              </div>

              {onEdit && (
                <button className="edit-btn" onClick={onEdit}>
                  Edit
                </button>
              )}
            </div>

            <div className="relative-input-grid">
              <div className="input-group">
                <label>Name</label>
                <input disabled value={form.name} />
              </div>

              <div className="input-group">
                <label>Contact Info</label>
                <input disabled value={form.contact} />
              </div>

              <div className="input-group">
                <label>Address</label>
                <input disabled value={form.address} />
              </div>

              {title !== "Organization" && title !== "Caregiver" && (
                <>
                  <div className="input-group">
                    <label>Gender</label>
                    <input disabled value={form.gender} />
                  </div>

                  <div className="input-group">
                    <label>Patient Name</label>
                    <input disabled value={form.patientName} />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </div>
  );
}
