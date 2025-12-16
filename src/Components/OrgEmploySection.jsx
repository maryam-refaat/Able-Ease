import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import "../index.css";
import { getEmployments } from "../assets/apis";

export default function OrgEmploySection() {
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const listRef = useRef(null);

  const navigate = useNavigate();
  const { isLoggedIn, userType } = useAuth();

  const fallback = [
    {
      positionId: 101,
      positionName: "Physiotherapist",
      requirements: "BSc physiotherapy; 2+ years",
      OrganizationSSN: "ORG-001",
      OrgName: "Able Donor"
    },
    {
      positionId: 102,
      positionName: "Assistant Therapist",
      requirements: "High school diploma",
      OrganizationSSN: "ORG-001",
      OrgName: "Able Donor"
    },{
      positionId: 101,
      positionName: "Physiotherapist",
      requirements: "BSc physiotherapy; 2+ years",
      OrganizationSSN: "ORG-001",
      OrgName: "Able Donor"
    }, {
      positionId: 102,
      positionName: "Assistant Therapist",
      requirements: "High school diploma",
      OrganizationSSN: "ORG-001",
      OrgName: "Able Donor"
    }
  ];

  const handleApply = (position) => {
    if (!isLoggedIn || userType !== "patient") {
      navigate('/Able-Ease#auth-form');
      setTimeout(() => {
        const authElement = document.getElementById('auth-form');
        if (authElement) {
          authElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setSelectedPosition(position);
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    // Modal handles the API call, just close modal here
    setShowModal(false);
    setSelectedPosition(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedPosition(null);
  };

 useEffect(() => {
  let mounted = true;

  async function load() {
    try {
      const res = await getEmployments();
      if (!mounted) return;

      const data = Array.isArray(res.data) ? res.data : [];

      // If data is empty, use fallback
      setPositions(data.length ? data : fallback);
      
    } catch (err) {
      if (!mounted) return;
      console.warn("getEmployments failed — using fallback", err);
      setPositions(fallback);
    }
  }

  load();
  return () => { mounted = false };
}, []);


        // If no positions found, fallback
      
  return (
    <section id="org">
      <div className="container">
        <h3 className="section-title">
          Find Organizations Ready to Employ &gt;
        </h3>

        <div className="carousel" aria-roledescription="carousel">
          <div ref={listRef} className="carousel-list" role="list">
            {positions.map((p) => (
              <div key={p.positionId} className="carousel-item" role="listitem">
                <h4 className="h4">{p.positionName}</h4>

                <p className="small" style={{ marginTop: "6px" }}>
                  <strong>Organization:</strong> {p.OrgName}
                </p>

                <p className="small" style={{ marginTop: "6px" }}>
                  <strong>Requirements:</strong> {p.requirements}
                </p>

                <div style={{ marginTop: "14px", textAlign: "right" }}>
                  <button className="btn" onClick={() => handleApply(p)}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirm Application"
        message="Confirm to Apply for this position and wait for the reply!!"
        program={selectedPosition}
        isApply={true}
      />
    </section>
  );
}
