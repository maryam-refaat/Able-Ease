import React from "react";
import "../Org.css";

// placeholder avatar (same style system as carousel)
const SVG_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMiIgZmlsbD0iI2RmZjNlOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzYiIHI9IjE4IiBmaWxsPSIjMjc4NjVkIi8+PHJlY3QgeD0iMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIHJ4PSI2IiBmaWxsPSIjMjc4NjVkIi8+PC9zdmc+";

function ImgOrPlaceholder({ src, alt }) {
  const imgSrc = (src && src.trim()) ? src : SVG_AVATAR;
  return <img key={imgSrc} src={imgSrc} alt={alt || "program"} className="program-img" style={{ background: 'transparent' }} />;
}

export default function ProgramCard({ program, orgName, onBook = () => {} }) {
  if (!program) return null;

  // Normalize possible API shapes
  const title = program.name ?? program.Name ?? program.title ?? "Program";
  const img = program.img ?? program.image ?? program.Image ?? null;
  const start = program.startDate ?? program.StartDate ?? program.start ?? program.start_date ?? "";
  const end = program.endDate ?? program.EndDate ?? program.end ?? program.end_date ?? "";
  const price = program.price ?? program.Price ?? program.cost ?? program.Cost ?? null;

  return (
    <div className="programs-card">
      <div className="program-img-wrapper">
        <ImgOrPlaceholder src={img} alt={title} />
      </div>

      <div className="program-content">
        <div className="program-header">
          <h3 className="program-title">{title}</h3>
          <span className="program-org">{orgName}</span>
        </div>

        <p className="program-desc">
          {start || end ? `${start || ""} → ${end || ""}` : "Dates not available"}
        </p>

        <div className="program-footer">
          <span className="program-price">{price != null ? `$${price}` : "Price"}</span>
          <button className="program-book-btn" onClick={() => onBook(program)}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
