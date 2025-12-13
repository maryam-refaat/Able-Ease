import React from 'react';
import '../Org.css'; // path -> ../Org.css (Org.css lives next to OrganizationsPage.jsx)
import{ getOrganizations } from '../assets/apis';
// Simple placeholder image as data URL
const SVG_AVATAR_DATAURL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'>
      <rect width='100' height='100' rx='12' fill='%23e6f4ea'/>
      <circle cx='50' cy='36' r='18' fill='%2385c997'/>
      <rect x='20' y='62' width='60' height='20' rx='6' fill='%2385c997'/>
    </svg>`
  );

function ImgOrPlaceholder({ src, alt }) {
  return <img src={src || SVG_AVATAR_DATAURL} alt={alt || 'img'} className="img-placeholder" />;
}

/**
 * Props:
 * - organizations: array of { SSN, name, img }
 * - onSelect: (SSN) => void
 * - selectedSSN: string
 */
export default function OrgCarousel({ organizations = [], onSelect = () => {}, selectedSSN }) {
  if (!Array.isArray(organizations) || organizations.length === 0) {
    return <div style={{ padding: 20 }}>No organizations to show</div>;
  }

  return (
    <div className="org-carousel-root" role="region" aria-label="Organizations carousel">
      <div className="org-list">
        {organizations.map((org) => {
          const key = org.SSN ?? org.id ?? org.OrganizationSSN ?? org.Name;
          const name = org.name ?? org.Name ?? 'Unnamed';
          return (
            <div key={key} className="org-item">
              <button
                className="org-button"
                onClick={() => onSelect(org.SSN ?? org.OrganizationSSN ?? key)}
                aria-pressed={selectedSSN === (org.SSN ?? org.OrganizationSSN ?? key)}
              >
                <div className={`org-avatar ${selectedSSN === (org.SSN ?? org.OrganizationSSN ?? key) ? 'selected' : ''}`}>
                  <ImgOrPlaceholder src={org.img} alt={name} />
                </div>
                <div className="org-name">{name}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
