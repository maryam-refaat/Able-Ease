import React from "react";
import PropTypes from "prop-types";
import ProgramCard from "./ProgramCard";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";
import "../Org.css";

export default function ProgramList({ programs }) {
  const { alertState, showAlert, closeAlert } = useAlert();

  if (!programs || programs.length === 0)
    return (
      <div className="ae-container ae-section">
        <h2 className="ae-section-title">Programs</h2>
        <div>No programs available.</div>
      </div>
    );

  return (
    <>
      <div className="ae-container ae-section">
        <h2 className="ae-section-title">Programs</h2>
        <div className="ae-programs-list">
          {programs.map((p) => (
            <ProgramCard
              key={p.Id}
              program={p}
              onBook={(prg) => showAlert(`Booked: ${prg.Name}`, "success")}
            />
          ))}
        </div>
      </div>
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </>
  );
}
ProgramList.propTypes = { programs: PropTypes.array };
