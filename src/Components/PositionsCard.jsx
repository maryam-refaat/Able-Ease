import React from 'react';
import '../Org.css';

/**
 * Props:
 * - pos: { positionId, positionName, requirements, OrganizationSSN, ... }
 * - onApply: (pos) => void
 */
export default function PositionCard({ pos, onApply = () => {} }) {
  if (!pos) return null;

  // support multiple naming conventions (API vs fallback)
  const id = pos.positionId ?? pos.id ?? pos.positionId;
  const title = pos.positionName ?? pos.role ?? pos.title ?? 'Unnamed position';
  const req = pos.requirements ?? pos.requirement ?? pos.description ?? 'No requirements provided';
  const org = pos.OrganizationSSN ?? pos.organizationSSN ?? pos.orgSSN ?? '';

  return (
    <div className="position-card" role="article" aria-labelledby={`pos-${id}`}>
      <div className="position-left">
        <div className="position-icon" aria-hidden>
          {/* simple icon as SVG */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#168a48" strokeWidth="1.5" fill="#e6f7ee"/>
            <path d="M7 9h10M7 13h6" stroke="#168a48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="position-body">
        <div className="position-top">
          <h4 id={`pos-${id}`} className="position-title">{title}</h4>
          {org ? <div className="position-org">Org: {org}</div> : null}
        </div>

        <p className="position-req">{req}</p>

        <div className="position-actions">
          <button className="btn-apply" onClick={() => onApply(pos)}>Apply</button>
        </div>
      </div>
    </div>
  );
}
