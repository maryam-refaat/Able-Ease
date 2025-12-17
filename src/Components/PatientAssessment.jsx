import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import PatientCard from "../Components/PatientCard";
import "./PatientProf.css";

const BASE_URL = "https://localhost:7040/api";

export default function PatientAssessment() {
  const location = useLocation();

  const getStoredPatientData = () => {
    const storedDataStr = localStorage.getItem("patientData");
    try {
      return storedDataStr ? JSON.parse(storedDataStr) : {};
    } catch (err) {
      console.warn("Failed to parse stored patientData:", err);
      return {};
    }
  };

  const patientData = location.state?.patientData || getStoredPatientData();
  const [data, setData] = useState(patientData || {});
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setIsLoading(true);

        const ssn = localStorage.getItem("ssn") || data.ssn || data.SSN;
        if (!ssn) {
          console.warn("No patient SSN found for assessments");
          setIsLoading(false);
          return;
        }

        // Fetch assessments for patient
        const aRes = await fetch(
          `${BASE_URL}/Assessment/GetAssessmentPatientsByPatient/${ssn}`
        );

        if (!aRes.ok) {
          console.warn("Assessment API returned", aRes.status);
          setAssessments([]);
          setIsLoading(false);
          return;
        }

        const text = await aRes.text();
        if (!text) {
          setAssessments([]);
          setIsLoading(false);
          return;
        }

        const raw = JSON.parse(text);
        const rawAssess = Array.isArray(raw)
          ? raw
          : raw?.data || raw?.results || [];

        // Build unique keys to fetch program details only once per program
        const programKeys = Array.from(
          new Set(
            rawAssess
              .map(
                (it) =>
                  `${it.assessmentProgramOrganizationSSN}::${it.assessmentProgramId}`
              )
              .filter(Boolean)
          )
        );

        // Fetch program details in parallel
        const programFetches = programKeys.map(async (key) => {
          const [orgSsn, progId] = key.split("::");
          try {
            const res = await fetch(
              `${BASE_URL}/Program/ProgramByID/${orgSsn}/${progId}`
            );
            if (!res.ok) return { key, data: null };
            const pText = await res.text();
            if (!pText) return { key, data: null };
            const p = JSON.parse(pText);
            // API may return program object or wrapper
            const program = p?.data || p?.results || p || null;
            // If array, pick first
            const progObj = Array.isArray(program) ? program[0] : program;
            return { key, data: progObj };
          } catch (err) {
            console.error("Program fetch error", err);
            return { key, data: null };
          }
        });

        const progResults = await Promise.all(programFetches);
        const progMap = {};
        progResults.forEach((p) => {
          progMap[p.key] = p.data;
        });

        // Normalize assessments with program name, grade, date
        const normalized = rawAssess.map((it, idx) => {
          const key = `${it.assessmentProgramOrganizationSSN}::${it.assessmentProgramId}`;
          const prog = progMap[key];
          return {
            id: it.assessmentId ?? `a-${idx}`,
            programName:
              prog?.name ||
              prog?.programName ||
              it.programName ||
              "Unknown Program",
            grade: it.grade ?? it.assessmentGrade ?? "-",
            date: it.assessmentDate || it.date || it.createdAt || null,
          };
        });

        setAssessments(normalized);
        setData((prev) => ({ ...prev, ...patientData }));
      } catch (err) {
        console.error("Failed to load assessments:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return <div className="page-container">Loading assessments...</div>;
  if (isError)
    return <div className="page-container">Error loading assessments.</div>;

  return (
    <div className="with-sidebar">
      <Sidebar userType="patient" />

      <div className="page-container">
        <header className="welcome-box centered">
          <h1>Patient Assessments</h1>
          <p>{data?.fullName || data?.name || "Patient"}</p>
        </header>

        <div className="container">
          <div className="no-edit">
            <PatientCard data={data} />
          </div>

          <section className="card-section" style={{ marginTop: 18 }}>
            <h3>Assessments</h3>

            <div className="card-content">
              {assessments.length ? (
                assessments.map((a) => (
                  <div
                    key={a.id}
                    className="employment-card"
                    style={{ position: "relative" }}
                  >
                    <div className="avatar-circle">📊</div>
                    <div style={{ flex: 1 }}>
                      <div
                        className="employment-title"
                        style={{ fontWeight: 700, fontSize: "18px" }}
                      >
                        {a.programName}
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontSize: 13,
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {a.date ? new Date(a.date).toLocaleDateString() : "—"}
                      </div>

                      <div
                        className="employment-sub"
                        style={{ marginTop: 8, color: "#555", lineHeight: 1.5 }}
                      >
                        <strong>Grade:</strong>
                        <span
                          style={{
                            marginLeft: 8,
                            padding: "4px 10px",
                            background: "#27865d",
                            color: "white",
                            borderRadius: 12,
                            fontWeight: 700,
                          }}
                        >
                          {a.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No assessments available</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
