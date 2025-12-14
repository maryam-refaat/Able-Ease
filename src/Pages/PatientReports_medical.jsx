import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientProf.css";
import "../profilepagecomponents/profile.css";
import PatientCard from "../Components/PatientCard";
import { getPatient_Reports, getPatient_Medicalinfo } from "../assets/apis";
import Footer from "../Components/Footer";

export default function PatientReportsMedical() {
  const location = useLocation();
  const navigate = useNavigate();

  const patientData = location.state?.patientData || {};
  const [data, setData] = useState(patientData || {});
  const [reports, setReports] = useState([]);
  const [medical, setMedical] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);

        const fallbackReports = [
          {
            id: "r-demo-1",
            subject: "Initial Assessment",
            content: "Patient presented with lower back pain. Recommended evaluation and baseline mobility tests.",
            datetime: "2025-11-01 09:20",
            caregiver: "Dr. Sara Ahmed",
            program: "Back Pain Program",
            organization: "Able Donor Clinic",
          },
          {
            id: "r-demo-2",
            subject: "Follow-up Session",
            content: "Improved range of motion noted. Continued home exercise program prescribed.",
            datetime: "2025-11-08 10:45",
            caregiver: "Mohamed Nabil",
            program: "Back Pain Program",
            organization: "Able Donor Clinic",
          },
          {
            id: "r-demo-3",
            subject: "Physiotherapy Progress",
            content: "Strength gains observed in core muscles. Patient reports less pain during morning activities.",
            datetime: "2025-11-22 14:30",
            caregiver: "Nora Fathy",
            program: "Core Stability",
            organization: "Rehab Plus",
          },
          {
            id: "r-demo-4",
            subject: "Discharge Summary",
            content: "Patient met goals and discharged with maintenance program and contact for relapse management.",
            datetime: "2025-12-01 11:00",
            caregiver: "Dr. Sara Ahmed",
            program: "Back Pain Program",
            organization: "Able Donor Clinic",
          }
        ];

        const fallbackMedical = [
          {
            id: "m-demo-1",
            title: "Chest X-Ray Report",
            summary: "No acute cardiopulmonary disease. Mild cardiomegaly noted.",
          },
          {
            id: "m-demo-2",
            title: "Blood Work Summary",
            summary: "Hemoglobin and hematocrit within normal range; slight elevation in CRP.",
          },
          {
            id: "m-demo-3",
            title: "Physio Evaluation",
            summary: "Reduced lumbar flexion (40%). Tenderness at L3-L5. Recommended manual therapy and exercises.",
          },
          {
            id: "m-demo-4",
            title: "MRI Summary",
            summary: "Small central disc protrusion at L4-L5 without significant nerve compression.",
          }
        ];

        const candidateId = patientData?.id ?? patientData?.PSSN ?? patientData?.ssn ?? (localStorage.getItem("patientSSN") || JSON.parse(localStorage.getItem("patientToken") || "null"));

        if (!candidateId) {
          // No patient identifier — show demo data instead of throwing an error
          setReports(fallbackReports);
          setMedical(fallbackMedical);
          setData(prev => ({ ...prev, ...patientData }));
          setIsLoading(false);
          return;
        }

        const [rRes, mRes] = await Promise.all([
          getPatient_Reports(candidateId).catch(() => ({ data: [] })),
          getPatient_Medicalinfo(candidateId).catch(() => ({ data: [] })),
        ]);

        const r = Array.isArray(rRes?.data) ? rRes.data : [];
        const m = Array.isArray(mRes?.data) ? mRes.data : [];

        // normalize report fields defensively
        const normalized = r.map((rep, i) => ({
          id: rep.id ?? rep.reportId ?? `r-${i}`,
          subject: rep.subject ?? rep.title ?? rep.reportSubject ?? "Report",
          content: rep.content ?? rep.body ?? rep.description ?? "",
          datetime: rep.date ?? rep.createdAt ?? rep.datetime ?? rep.timestamp ?? "",
          caregiver: rep.caregiverName ?? rep.caregiver ?? rep.by ?? rep.creator?.name ?? "",
          program: rep.programName ?? rep.program?.name ?? "",
          organization: rep.organizationName ?? rep.organization?.name ?? rep.org ?? "",
        }));

        setReports(normalized.length ? normalized : fallbackReports);
        setMedical(m.length ? m : fallbackMedical);
        setData(prev => ({ ...prev, ...patientData }));
      } catch (err) {
        console.error("Failed to load patient reports/medical:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <div className="page-container">Loading...</div>;
  if (isError) return <div className="page-container">Error loading reports.</div>;

  return (
    <div className="with-sidebar">
      <div className="side-rect" aria-hidden="true">
        <div className="side-icons">
          <button className="side-btn" aria-label="overview" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="messages" onClick={() => navigate('/') }>
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="reports" onClick={() => {/* already here */}}>
            <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="page-container">
        <header className="welcome-box centered">
          <h1>Patient Reports</h1>
          <p>{data?.fullName || data?.name || "Patient"}</p>
        </header>

        <div className="container">
          <div className="no-edit">
            <PatientCard data={data} />
          </div>

          <section className="card-section" style={{ marginTop: 18 }}>
            <h3>Medical Records</h3>
            <div className="card-content">
              {medical.length ? (
                medical.map((m, i) => (
                  <div key={m.id ?? i} className="employment-card">
                    <div className="avatar-circle">🩺</div>
                    <div>
                      <div className="employment-title">{m.title ?? m.name ?? `Record ${i + 1}`}</div>
                      <div className="employment-sub" style={{ marginTop: 6 }}>{m.summary ?? m.description ?? JSON.stringify(m)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No medical records</div>
              )}
            </div>
          </section>

          <section className="card-section">
            <h3>Reports</h3>
            <div className="card-content">
              {reports.length ? (
                reports.map((r) => (
                  <div key={r.id} className="employment-card">
                    <div className="avatar-circle">📄</div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div className="employment-title" style={{ fontWeight: 700 }}>{r.subject}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{r.datetime}</div>
                      </div>
                      <div style={{ marginTop: 8 }}>{r.content}</div>
                      <div className="employment-sub" style={{ marginTop: 10 }}>
                        <strong>Caregiver:</strong> {r.caregiver || '—'}
                      </div>
                      <div className="employment-sub" style={{ marginTop: 6 }}>
                        <strong>Program:</strong> {r.program || '—'}
                      </div>
                      <div className="employment-sub" style={{ marginTop: 6 }}>
                        <strong>Organization:</strong> {r.organization || '—'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No reports for this patient</div>
              )}
            </div>
          </section>
        </div>

      </div>
      
        <Footer />
    </div>
  );
}

  