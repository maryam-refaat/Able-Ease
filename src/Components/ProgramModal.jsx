import React, { useState, useEffect } from "react";
import "./ProgramModal.css";

export default function ProgramModal({
  isOpen,
  onClose,
  onSubmit,
  program = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    startDate: "",
    endDate: "",
    location: "",
    status: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.Name || program.name || "",
        price: program.Price || program.price || "",
        startDate: program.StartDate || program.startDate || "",
        endDate: program.EndDate || program.endDate || "",
        location: program.Location || program.location || "",
        status: program.Status || program.status || "",
        image: null,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        startDate: "",
        endDate: "",
        location: "",
        status: "",
        image: null,
      });
    }
    setError(null);
    setLoading(false);
  }, [program, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("Name", formData.name);
      payload.append("StartDate", formData.startDate);
      payload.append("EndDate", formData.endDate);
      payload.append("Location", formData.location || "");
      payload.append("Status", formData.status || "");
      payload.append("Price", parseFloat(formData.price));
      if (formData.image) payload.append("Image", formData.image);

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save program. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{program ? "Update Program" : "Add New Program"}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
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

        <form onSubmit={handleSubmit} className="program-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Program Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter program name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <input
                type="text"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {program ? "Updating..." : "Adding..."}
                </>
              ) : program ? (
                "Update Program"
              ) : (
                "Add Program"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}