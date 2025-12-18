import React, { useState, useEffect } from 'react';
import './ProgramModal.css';

export default function CareGiverModal({ isOpen, onClose, handleSubmitCareGiver, careGiver = false }) {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    contactInfo: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form when editing existing caregiver
  useEffect(() => {
    if (careGiver) {
      setFormData({
        name: careGiver.name || '',
        specialty: careGiver.specialty || '',
        experience: careGiver.experience || '',
        contactInfo: careGiver.contactInfo || '',
      });
    } else {
      // Reset form for new caregiver
      setFormData({
        name: '',
        specialty: '',
        experience: '',
        contactInfo: '',
      });
    }
    // Reset error when modal opens/closes
    setError(null);
    setLoading(false);
  }, [careGiver, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Call the API through onSubmit
      await handleSubmitCareGiver(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save care giver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{careGiver ? 'Update Care Giver' : 'Add New Care Giver'}</h2>
          <button className="modal-close-btn" onClick={onClose} disabled={loading}>&times;</button>
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
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Specialty *</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="e.g., Physical Therapy"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience">Experience *</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactInfo">Contact Info *</label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {careGiver ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                careGiver ? 'Update Care Giver' : 'Add Care Giver'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}