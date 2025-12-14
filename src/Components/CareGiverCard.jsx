import React from 'react';
import '../Org.css';

// same small svg placeholder used elsewhere
const SVG_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMiIgZmlsbD0iI2RmZjNlOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzYiIHI9IjE4IiBmaWxsPSIjMjc4NjVkIi8+PHJlY3QgeD0iMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIHJ4PSI2IiBmaWxsPSIjMjc4NjVkIi8+PC9zdmc+";

function Img({ src, alt }) {
  const imgSrc = (src && src.trim()) ? src : SVG_AVATAR;
  return <img key={imgSrc} src={imgSrc} alt={alt || 'caregiver'} className="caregiver-img" style={{ background: 'transparent' }} />;
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
  const img = care.imageUrl ?? care.img ?? care.image ?? care.photo ?? care.avatar ?? null;
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
