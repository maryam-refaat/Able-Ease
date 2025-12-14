import React from 'react';
import '../Org.css'; // path -> ../Org.css (Org.css lives next to OrganizationsPage.jsx)

// Simple placeholder image as data URL
const SVG_AVATAR_DATAURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMiIgZmlsbD0iI2RmZjNlOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzYiIHI9IjE4IiBmaWxsPSIjMjc4NjVkIi8+PHJlY3QgeD0iMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIHJ4PSI2IiBmaWxsPSIjMjc4NjVkIi8+PC9zdmc+";

function ImgOrPlaceholder({ src, alt }) {
  const imgSrc = (src && src.trim()) ? src : SVG_AVATAR_DATAURL;
  return <img key={imgSrc} src={imgSrc} alt={alt || 'img'} className="img-placeholder" style={{ background: 'transparent' }} />;
}

/**
 * Props:
 * - organizations: array of { SSN, name, img }
 * - onSelect: (SSN) => void
 * - selectedSSN: string
 */
export default function TherapyCenterCarousel({ TherapyCenters = [], onSelect = () => {}, selectedSSN }) {
  if (!Array.isArray(TherapyCenters) || TherapyCenters.length === 0) {
    return <div style={{ padding: 20 }}>No organizations to show</div>;
  }

  return (
    <div className="org-carousel-root" role="region" aria-label="Organizations carousel">
      <div className="org-list">
        {TherapyCenters.map((Center) => {
          const key = Center.SSN ?? Center.id ?? Center.CenterSSN ?? Center.Name;
          const name = Center.name ?? Center.Name ?? 'Unnamed';
          const img = Center.img ?? Center.image ?? Center.Image ?? Center.photo ?? Center.Photo ?? Center.logo ?? Center.Logo ?? null;
          return (
            <div key={key} className="org-item">
              <button
                className="org-button"
                onClick={() => onSelect(Center.SSN ?? Center.CenterSSN ?? key)}
                aria-pressed={selectedSSN === (Center.SSN ?? Center.CenterSSN ?? key)}
              >
                <div className={`org-avatar ${selectedSSN === (Center.SSN ?? Center.CenterSSN ?? key) ? 'selected' : ''}`}>
                  <ImgOrPlaceholder src={img} alt={name} />
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