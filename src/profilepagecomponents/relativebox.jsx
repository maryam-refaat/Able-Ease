import { useState, useEffect } from "react";
import { getRelatives, updateRelative } from "../assets/api";
import "../profilepagecomponents/profile.css";

export function RelativeCard({ title, data }) {

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  
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
  
  const handleSave = async () => {
    // const token = localStorage.getItem("relativeToken");
    // const updated = await updateRelative(token, form);
    setIsEditing(false);
  };

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

          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          )}
        </div>

        <div className="relative-input-grid">
          <div className="input-group">
            <label>Name</label>
            <input
              disabled={!isEditing}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Contact Info</label>
            <input
              disabled={!isEditing}
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
