import React from "react";

export default function PatientsBox({ patients = [], onAddReport }) {
  const hasPatients = Array.isArray(patients) && patients.length > 0;

  return (
    <section className="patients-box">
      <h2>Patients</h2>

      <div className="patients-list">
        {!hasPatients ? (
          <div className="patient-item" aria-live="polite">
            <div className="patient-name">Have no patients yet</div>
          </div>
        ) : (
          patients.map((p, idx) => (
            <div key={p.id ?? idx} className="patient-item">
              <div className="patient-name">{p.name}</div>
              <button
                className="patient-add-btn"
                onClick={() => onAddReport?.(p)}
                type="button"
              >
                Add report
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
