import React from "react";
import OrgAssessmentsSection from "../Components/OrgAssessmentsSection";
import "../Components/OrgAssessmentsSection.css";

export default function OrgAssesments() {
  return (
    <div className="org-assesments-page">
      <h1
        style={{ textAlign: "center", color: "#198751", margin: "32px 0 24px" }}
      >
        Organization Program Assessments
      </h1>
      <OrgAssessmentsSection />
    </div>
  );
}
