import React from "react";
import "../Pages/PatientProf.css";
import { useState,useEffect } from "react";

export default function PatientCard({ title = "Patient", data = {}, onEdit }) {
  const [form, setForm] = useState({
    fullName: "",
    contact: "",
    email: "",
    gender: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        fullName: data.fullName || "",
        contact: data.phone || "",
        email: data.email || "",
        gender: data.gender || "",
        address: data.address || "",
      });
    }
  }, [data]);

  return (
    <div className="patient-card">
      <div className="patient-card__header" />

      <div className="patient-card__content">
        <div className="patient-card__top">
          <div className="patient-card__left" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={data.avatar || "/profile-placeholder.png"}
              alt="avatar"
              className="patient-card__avatar"
            />
            <div className="patient-card__meta">
              <div className="patient-card__title">{title}</div>
              <div className="patient-card__email">{form.email}</div>
            </div>
          </div>

          <div className="patient-card__actions">
            <button className="patient-card__edit" onClick={onEdit}>
              Edit
            </button>
          </div>
        </div>

        <div className="patient-card__grid">
          <div className="patient-card__field">
            <label>Full Name</label>
            <input type="text" value={form.fullName} disabled />
          </div>

          <div className="patient-card__field">
            <label>Contact Info</label>
            <input type="text" value={form.contact} disabled />
          </div>

          <div className="patient-card__field">
            <label>Gender</label>
            <div className="patient-card__select-wrap">
              <select value={form.gender} disabled>
                <option>{form.gender || "—"}</option>
              </select>
              <span className="patient-card__arrow">▾</span>
            </div>
          </div>

          <div className="patient-card__field">
            <label>Address</label>
            <input value={form.address} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
