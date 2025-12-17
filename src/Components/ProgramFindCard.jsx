import React from "react";
import "../index.css";

const SVG_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMiIgZmlsbD0iI2RmZjNlOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzYiIHI9IjE4IiBmaWxsPSIjMjc4NjVkIi8+PHJlY3QgeD0iMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIHJ4PSI2IiBmaWxsPSIjMjc4NjVkIi8+PC9zdmc+";

function ImgOrPlaceholder({ src, alt }) {
  const imgSrc = (src && src.trim()) ? src : SVG_AVATAR;
  return <img key={imgSrc} src={imgSrc} alt={alt || "program"} style={{ 
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px 12px 0 0",
    background: 'transparent' 
  }} />;
}

export default function ProgramFindCard({ program, onBook = () => {} }) {
  if (!program) return null;

  const title = program.name ?? program.centerName ?? program.Name ?? program.title ?? "Program";
  const img = program.imgUrl ?? program.imageUrl ?? program.ImgUrl ?? program.ImageUrl ?? program.img ?? program.image ?? program.Image ?? null;
  const start = program.startDate ?? program.StartDate ?? program.start ?? program.start_date ?? program.S_date ?? "";
  const end = program.endDate ?? program.EndDate ?? program.end ?? program.end_date ?? program.E_date ?? "";
  const price = program.price ?? program.Price ?? program.cost ?? program.Cost ?? null;
  const orgName = program.organizationName ?? program.OrganizationName ?? "";

  return (
    <div className="program-find-card">
      <ImgOrPlaceholder src={img} alt={title} />

      <div style={{ padding: "16px" }}>
        <h3 style={{ 
          margin: "0 0 8px 0",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#1f2937",
          lineHeight: "1.3"
        }}>
          {title}
        </h3>

        {orgName && (
          <p style={{ 
            margin: "0 0 12px 0",
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: "500"
          }}>
            📍 {orgName}
          </p>
        )}

        {(start || end) && (
          <p style={{ 
            margin: "0 0 12px 0",
            fontSize: "0.85rem",
            color: "#9ca3af"
          }}>
            {start || ""} {start && end && "→"} {end || ""}
          </p>
        )}

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px"
        }}>
          <span style={{ 
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#27865d"
          }}>
            {price != null ? `$${price}` : "Price N/A"}
          </span>
          
          <button 
            onClick={() => onBook(program)}
            style={{
              background: "#27865d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "#1f6b4a"}
            onMouseLeave={(e) => e.target.style.background = "#27865d"}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
