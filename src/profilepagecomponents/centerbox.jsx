import { useState, useEffect } from "react";
import "./profile.css";

export function CenterCard({ title, data, disableFetch = false }) {
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
    // make sure that the data changed
    if (
      form.name === data.name &&
      form.contactInfo === data.contactInfo &&
      form.address === (data.location || data.address)
    ) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      const orgSSN = localStorage.getItem("ssn");

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append("Name", form.name);
      formData.append("Location", form.address);
      formData.append("ContactInfo", form.contactInfo);
      // Image can be added later if needed: formData.append("Image", imageFile);

      const response = await fetch(
        `https://localhost:7040/api/center/updatecenter/${orgSSN}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Center data updated successfully.");
    } catch (error) {
      console.error("Error updating center:", error);
      setIsError(true);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
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
            {isEditing ? (
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
