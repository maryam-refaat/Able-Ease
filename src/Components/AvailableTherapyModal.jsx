import React, { useState, useEffect } from "react";
import "./ProgramModal.css";

export default function AvailableTherapyModal({
  isOpen,
  onClose,
  onSubmit,
  program = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    pricePerHour: "",
    doctorName: "",
    therapyDetails: "",
    date: "",
    centerId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.Name || program.name || "",
        duration: program.duration || "",
        pricePerHour: program.PricePerHour || program.price || "",
        doctorName: program.Doctorname || "",
        therapyDetails: program.therapyDetails || "",
        date: program.Date || "",
        centerId: program.CenterID || program.CenterID || "",
        image: null,
      });
    } else {
      setFormData({
        name: "",
        duration: "",
        pricePerHour: "",
        doctorName: "",
        therapyDetails: "",
        date: "",
        centerId: "",
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
      payload.append("duration", formData.duration);
      payload.append("PricePerHour", formData.pricePerHour);
      payload.append("Doctorname", formData.doctorName);
      payload.append("therapyDetails", formData.therapyDetails);
      payload.append("Date", formData.date);
      payload.append("CenterID", formData.centerId);
      if (formData.image) payload.append("Image", formData.image);

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save therapy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{program ? "Update Therapy" : "Add New Therapy"}</h2>
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
              <label htmlFor="name">Therapy Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter therapy name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pricePerHour">Price Per Hour ($)</label>
              <input
                type="number"
                id="pricePerHour"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 6 weeks"
              />
            </div>
            <div className="form-group">
              <label htmlFor="doctorName">Doctor Name</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="therapyDetails">Details</label>
              <textarea
                id="therapyDetails"
                name="therapyDetails"
                value={formData.therapyDetails}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date / Status</label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="centerId">Center ID</label>
              <input
                type="text"
                id="centerId"
                name="centerId"
                value={formData.centerId}
                onChange={handleChange}
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
                "Update Therapy"
              ) : (
                "Add Therapy"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
