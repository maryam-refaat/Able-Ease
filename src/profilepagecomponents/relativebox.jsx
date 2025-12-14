import { useState, useEffect } from "react";
import { getRelatives, updateRelative } from "../assets/api";
import "../profilepagecomponents/profile.css";

export function RelativeCard({ title, data, onEdit }) {

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
  });

  
  useEffect(() => {
    function loadData() {
      // If data comes from signup form, use it directly
      if (data) {
        setForm({
          name: data.fullName || "",
          contact: data.phone || "",
          email: data.email || "",
        });
        return;
      }
    }
    
    loadData();
  }, [data]);

  return (
    <div className="relative-card">
      <div className="relative-header-gradient"></div>

      <div className="relative-content">
        <div className="relative-top-row">
          <div className="relative-user">
            <img
              src="https://i.pravatar.cc/100?img=5"
              className="relative-avatar"
            />

            <div>
              <h2 className="relative-title">{title}</h2>
              <p className="relative-email">{form.email}</p>
            </div>
          </div>

          <button className="edit-btn" onClick={onEdit}>
            Edit
          </button>
        </div>

        <div className="relative-input-grid">
          <div className="input-group">
            <label>Name</label>
            <input
              disabled
              value={form.name}
              readOnly
            />
          </div>

          <div className="input-group">
            <label>Contact Info</label>
            <input
              disabled
              value={form.contact}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
