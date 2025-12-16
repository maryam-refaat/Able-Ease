import React from "react";
import "../Org.css";

/**
 * Props:
 * - pos: { positionId, positionName, requirements, OrganizationSSN, ... }
 * - onApply: (pos) => void
 */
export default function PositionCard({ pos, onApply = () => {} }) {
  if (!pos) return null;

  // support multiple naming conventions (API vs fallback)
  const id = pos.position ?? pos.id ?? pos.positionId;
  const title = pos.subject ?? pos.role ?? pos.title ?? "Unnamed position";
  const req =
    pos.body ??
    pos.requirement ??
    pos.description ??
    "No requirements provided";
  const org = pos.senderSSN ?? pos.organizationSSN ?? pos.orgSSN ?? "";

  return (
    <div className="position-card" role="article" aria-labelledby={`pos-${id}`}>
      <div className="position-left">
        <div className="position-icon" aria-hidden>
          {/* briefcase/job icon */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="8"
              width="18"
              height="12"
              rx="2"
              stroke="#27865d"
              strokeWidth="1.5"
              fill="#dff3e8"
            />
            <path
              d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              stroke="#27865d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M3 13h18"
              stroke="#27865d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="13" r="1.5" fill="#27865d" />
          </svg>
        </div>
      </div>

      <div className="position-body">
        <div className="position-top">
          <h4 id={`pos-${id}`} className="position-title">
            {title}
          </h4>
          {org ? <div className="position-org">Org: {org}</div> : null}
        </div>

        <p className="position-req">{req}</p>

        <div className="position-actions">
          <button className="btn-apply" onClick={() => onApply(pos)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
