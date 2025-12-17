import { useState, useEffect } from "react";
import "./profile.css";

export function CenterCard({ title, data, onEdit, disableFetch = false }) {
  const [form, setForm] = useState({
    name: "",
    contactInfo: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        contactInfo: data.contactInfo || "",
        address: data.location || data.address || "",
      });
    }
  }, [data]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    if (data) {
      setForm({
        name: data.name || "",
        contactInfo: data.contactInfo || "",
        address: data.address || "",
      });
    }
  };

  const handleSave = async () => {
    // Handle save logic here or call parent callback
    setIsEditing(false);
  };

  if (loading) {
    return <div className="relative-card">Loading...</div>;
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
            {isEditing ? (
              <>
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="edit-btn"
                  style={{ marginLeft: "8px" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEdit} className="edit-btn">
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="relative-input-grid">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="input-group">
            <label>Contact Info</label>
            <input
              type="text"
              value={form.contactInfo}
              onChange={(e) =>
                setForm({ ...form, contactInfo: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
