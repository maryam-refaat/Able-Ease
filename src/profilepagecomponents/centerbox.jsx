import { useState, useEffect } from "react";
import "./profile.css";

export function CenterCard({ title, data, disableFetch = false, onEdit }) {
  const [form, setForm] = useState({
    name: "",
    contactInfo: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        contactInfo: data.contactInfo || "",
        address: data.location || data.address || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    // Deprecated - use modal instead
    setIsEditing(false);
  };

  if (loading) {
    return <div className="relative-card">Loading...</div>;
  }

  if (isError) {
    return <div className="relative-card">Error loading data.</div>;
  }

  return (
    <div className="relative-card">
      <div className="relative-header-gradient"></div>

      <div className="relative-content">
        <div className="relative-top-row">
          <div className="relative-user">
            <div>
              <h2 className="relative-title">{title || "Center"}</h2>
              <p className="relative-email">{form.contactInfo || "N/A"}</p>
            </div>
          </div>

          <div>
            {onEdit ? (
              <button onClick={onEdit} className="edit-btn">
                Edit
              </button>
            ) : isEditing ? (
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="relative-input-grid">
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={form.name} disabled />
          </div>

          <div className="input-group">
            <label>Contact Info</label>
            <input type="text" value={form.contactInfo} disabled />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input type="text" value={form.address} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
