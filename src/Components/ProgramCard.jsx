import React from "react";
import "../Org.css";

// placeholder avatar (same style system as carousel)
const SVG_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'>
      <rect width='100' height='100' rx='12' fill='%23e6f4ea'/>
      <circle cx='50' cy='36' r='18' fill='%2385c997'/>
      <rect x='20' y='62' width='60' height='20' rx='6' fill='%2385c997'/>
    </svg>
`);

function ImgOrPlaceholder({ src, alt }) {
  return <img src={src || SVG_AVATAR} alt={alt || "program"} className="program-img" />;
}

export default function ProgramCard({ program, orgName, onBook = () => {} }) {
  if (!program) return null;

  return (
    <div className="program-card">
      <div className="program-img-wrapper">
        <ImgOrPlaceholder src={program.img} alt={program.name} />
      </div>

      <div className="program-content">
        <div className="program-header">
          <h3 className="program-title">{program.name}</h3>
          <span className="program-org">{orgName}</span>
        </div>

        <p className="program-desc">
          {program.startDate} → {program.endDate}
        </p>

        <div className="program-footer">
          <span className="program-price">{program.price ? `$${program.price}` : "Price"}</span>
          <button className="program-book-btn" onClick={() => onBook(program)}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
