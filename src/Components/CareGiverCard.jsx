import React from 'react';
import '../Org.css';

// same small svg placeholder used elsewhere
const SVG_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'>
    <rect width='100' height='100' rx='12' fill='%23e6f4ea'/>
    <circle cx='50' cy='36' r='18' fill='%2385c997'/>
    <rect x='20' y='62' width='60' height='20' rx='6' fill='%2385c997'/>
  </svg>`);

function Img({ src, alt }) {
  return <img src={src || SVG_AVATAR} alt={alt || 'caregiver'} className="caregiver-img" />;
}

/**
 * Props:
 * - care: object { id, name, img, experience, age, Gender, OrganizationSSN }
 * - onContact: function(care) optional
 */
export default function CaregiverCard({ care, onContact = () => {} }) {
  if (!care) return null;

  const id = care.id ?? care.ID ?? care.caregiverId ?? '';
  const name = care.name ?? care.Name ?? 'Unnamed';
  const img = care.img ?? care.image ?? null;
  const experience = care.experience ?? care.Experience ?? care.years ?? '—';
  const age = care.age ?? care.Age ?? (care.BirthDate ? (new Date().getFullYear() - new Date(care.BirthDate).getFullYear()) : '—');
  const gender = care.Gender ?? care.gender ?? '';

  return (
    <div className="caregiver-card" role="article" aria-labelledby={`care-${id}`}>
      <div className="caregiver-left">
        <div className="caregiver-thumb">
          <Img src={img} alt={name} />
        </div>
      </div>

      <div className="caregiver-body">
        <div className="caregiver-top">
          <h4 id={`care-${id}`} className="caregiver-name">{name}</h4>
          <div className="caregiver-meta">{gender ? `${gender}` : ''}{age ? ` • ${age}` : ''}</div>
        </div>

        <div className="caregiver-exp">Experience: <strong>{experience}</strong></div>

        <div className="caregiver-actions">
          <button className="btn-contact" onClick={() => onContact(care)}>Contact</button>
        </div>
      </div>
    </div>
  );
}
