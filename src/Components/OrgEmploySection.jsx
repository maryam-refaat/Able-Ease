import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState } from "../context/AuthState";
import ConfirmationModal from "./ConfirmationModal";
import "../index.css";
import { getAll_Employments } from "../assets/apis";

export default function OrgEmploySection() {
  const [employments, setEmployments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const listRef = useRef(null);

  const navigate = useNavigate();
  const [{ isLoggedIn, userType }, setLocalAuth] = useState(getAuthState());
  useEffect(() => {
    const handler = () => setLocalAuth(getAuthState());
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  const DUMMY_EMPLOYMENTS = [
    {
      id: 1,
      position: "Physical Therapist",
      organizationName: "Sunrise Rehab Center",
      organizationSSN: "ORG-001",
      requirements:
        "Bachelor's degree in Physical Therapy, 2+ years experience, CPR certified",
      imageUrl: null,
    },
    {
      id: 2,
      position: "Occupational Therapist",
      organizationName: "Hope Wellness Center",
      organizationSSN: "ORG-002",
      requirements:
        "Master's degree in OT, state license required, pediatric experience preferred",
      imageUrl: null,
    },
    {
      id: 3,
      position: "Speech Therapist",
      organizationName: "Able Care Hub",
      organizationSSN: "ORG-003",
      requirements:
        "CCC-SLP certification, experience with children and adults, bilingual a plus",
      imageUrl: null,
    },
    {
      id: 4,
      position: "Rehabilitation Aide",
      organizationName: "Physio Plus Center",
      organizationSSN: "ORG-004",
      requirements:
        "High school diploma, patient care experience, strong communication skills",
      imageUrl: null,
    },
  ];

  const handleApply = (employment) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate("/Able-Ease#auth-form");
      setTimeout(() => {
        const authElement = document.getElementById("auth-form");
        if (authElement) {
          authElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      setSelectedEmployment(employment);
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    // Modal handles the API call, just close modal here
    setShowModal(false);
    setSelectedEmployment(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedEmployment(null);
  };

  useEffect(() => {
    let mounted = true;

    const loadEmployments = async () => {
      try {
        const res = await getAll_Employments();
        const empData = res?.data.data;

        if (mounted && Array.isArray(empData)) {
          setEmployments(empData);
        } else {
          setEmployments(DUMMY_EMPLOYMENTS);
        }
      } catch (err) {
        console.error("getAll_Employments failed", err);
        setEmployments(DUMMY_EMPLOYMENTS);
      }
    };

    loadEmployments();
    return () => (mounted = false);
  }, []);

  return (
    <section id="org">
      <div className="container">
        <h3 className="section-title">
          Find Organizations Ready to Employ &gt;
        </h3>

        <div className="carousel" aria-roledescription="carousel">
          <div ref={listRef} className="carousel-list" role="list">
            {employments.map((employment) => {
              const subject =
                employment.subject ??
                employment.Subject ??
                employment.position ??
                employment.Position ??
                "Position";
              const senderName =
                employment.senderName ??
                employment.SenderName ??
                employment.organizationName ??
                employment.OrganizationName ??
                employment.organization ??
                "Organization";
              const body =
                employment.body ??
                employment.Body ??
                employment.requirements ??
                employment.Requirements ??
                "No requirements listed";

              return (
                <div
                  key={employment.id ?? employment.positionId}
                  className="carousel-item"
                  role="listitem"
                >
                  <h4 className="h4">{subject}</h4>

                  <p className="small" style={{ marginTop: "6px" }}>
                    <strong>Organization:</strong> {senderName}
                  </p>

                  <p className="small" style={{ marginTop: "6px" }}>
                    <strong>Requirements:</strong> {body}
                  </p>

                  <div style={{ marginTop: "14px", textAlign: "right" }}>
                    <button
                      className="btn"
                      onClick={() => handleApply(employment)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirm Application"
        message="Confirm to Apply for this position and wait for the reply!!"
        program={selectedEmployment}
        isApply={true}
      />
    </section>
  );
}