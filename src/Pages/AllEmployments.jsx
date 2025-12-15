import React, { useState, useEffect } from "react";
import { getAll_Employments } from "../assets/apis";
import "../Org.css";
import "./Allemps.css";

/* Dummy employments for fallback */
const DUMMY_EMPLOYMENTS = [
  {
    id: 1,
    position: "Physical Therapist",
    organizationName: "Sunrise Rehab Center",
    requirements: "Bachelor's degree in Physical Therapy, 2+ years experience, CPR certified",
    imageUrl: null,
  },
  {
    id: 2,
    position: "Occupational Therapist",
    organizationName: "Hope Wellness Center",
    requirements: "Master's degree in OT, state license required, pediatric experience preferred",
    imageUrl: null,
  },
  {
    id: 3,
    position: "Speech Therapist",
    organizationName: "Able Care Hub",
    requirements: "CCC-SLP certification, experience with children and adults, bilingual a plus",
    imageUrl: null,
  },
  {
    id: 4,
    position: "Rehabilitation Aide",
    organizationName: "Physio Plus Center",
    requirements: "High school diploma, patient care experience, strong communication skills",
    imageUrl: null,
  },
  {
    id: 5,
    position: "Registered Nurse",
    organizationName: "Care First Hospital",
    requirements: "BSN degree, active RN license, 1+ year clinical experience",
    imageUrl: null,
  },
  {
    id: 6,
    position: "Medical Social Worker",
    organizationName: "Community Health Services",
    requirements: "MSW degree, LCSW license, healthcare experience required",
    imageUrl: null,
  },
];

export default function AllEmployments() {
  const [employments, setEmployments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);

  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    let mounted = true;

    const loadEmployments = async () => {
      setLoading(true);

      try {
        const res = await getAll_Employments();
        const empData = res?.data;

        if (mounted && Array.isArray(empData)) {
          setEmployments(empData);
        } else {
          setEmployments(DUMMY_EMPLOYMENTS);
        }
      } catch (err) {
        console.error("getAll_Employments failed", err);
        setEmployments(DUMMY_EMPLOYMENTS);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadEmployments();
    return () => (mounted = false);
  }, []);

  const handleApply = (employment) => {
    setSelectedEmployment(employment);
    setShowModal(true);
  };

  const handleConfirm = () => {
    const positionName = selectedEmployment?.subject ?? selectedEmployment?.Subject ?? selectedEmployment?.position ?? selectedEmployment?.Position ?? "Position";
    console.log(`Applied for: ${positionName}`);
    setShowModal(false);
    setSelectedEmployment(null);
    alert("Your application has been submitted successfully!");
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedEmployment(null);
  };

  return (
    <div className="all-employments-page">
      <div className="all-employments-container">
        <h1 className="all-employments-title">All Positions</h1>

        {loading ? (
          <div className="all-employments-loading">Loading positions...</div>
        ) : employments.length ? (
          <div className="all-employments-grid">
            {employments.map((employment) => {
              const subject = employment.subject ?? employment.Subject ?? employment.position ?? employment.Position ?? "Position";
              const senderName =
                employment.senderName ??
                employment.SenderName ??
                employment.organizationName ??
                employment.OrganizationName ??
                employment.organization ??
                "Organization";
              const body = employment.body ?? employment.Body ?? employment.requirements ?? employment.Requirements ?? "No requirements listed";
              const img = employment.imageUrl ?? employment.img ?? employment.image ?? null;

              return (
                <div key={employment.id} className="position-card">
                  <div className="position-left">
                    <div className="position-icon">
                      💼
                    </div>
                  </div>

                  <div className="position-body">
                    <div className="position-top">
                      <h3 className="position-title">{subject}</h3>
                      <span className="position-org">{senderName}</span>
                    </div>

                    <p className="position-req">{body}</p>

                    <div className="position-actions">
                      <button
                        className="btn-apply"
                        onClick={() => handleApply(employment)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="all-employments-empty">No positions available.</div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Application</h2>
            <p className="modal-message">
              By confirming, your information will be sent to the organization and we will get back to you soon.
            </p>
            <div className="modal-actions">
              <button className="modal-btn modal-confirm" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="modal-btn modal-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
