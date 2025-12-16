import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientProf.css";
import "../profilepagecomponents/profile.css";
import PatientCard from "../Components/PatientCard";
import { getPatient_Reports, getPatient_Medicalinfo } from "../assets/apis";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import { getReportByPatient, getMedicalInfoByPatient, getPatientDisability } from "../assets/apis";

export default function PatientReportsMedical() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get patient data from navigation state or localStorage
  const getStoredPatientData = () => {
    const storedDataStr = localStorage.getItem("patientData");
    try {
      return storedDataStr ? JSON.parse(storedDataStr) : {};
    } catch (e) {
      return {};
    }
  };

  const patientData = location.state?.patientData || getStoredPatientData();
  const [data, setData] = useState(patientData || {});
  const [reports, setReports] = useState([]);
  const [medical, setMedical] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);

        const fallbackReports = [
          {
            id: "r-demo-1",
            subject: "Initial Assessment",
            content: "Patient presented with lower back pain. Recommended evaluation and baseline mobility tests.",
            date: "2025-11-01T09:20:00",
            caregiver: "Dr. Sara Ahmed",
            program: "Back Pain Program",
            organization: "Able Donor Clinic",
          },
          {
            id: "r-demo-2",
            subject: "Follow-up Session",
            content: "Improved range of motion noted. Continued home exercise program prescribed.",
            date: "2025-11-08T10:45:00",
            caregiver: "Mohamed Nabil",
            program: "Back Pain Program",
            organization: "Able Donor Clinic",
          },
          {
            id: "r-demo-3",
            subject: "Physiotherapy Progress",
            content: "Strength gains observed in core muscles. Patient reports less pain during morning activities.",
            date: "2025-11-22T14:30:00",
            caregiver: "Nora Fathy",
            program: "Core Stability",
            organization: "Rehab Plus",
          },
          {
            id: "r-demo-4",
            subject: "Discharge Summary",
            content: "Patient met goals and discharged with maintenance program and contact for relapse management.",
            date: "2025-12-01T11:00:00",
            caregiver: "Dr. Sara Ahmed",
            program: "Back Pain Program",
            organization: "Able Donor Clinic",
          }
        ];

        const fallbackDisabilities = [
          {
            id: "d-demo-1",
            disabilityName: "Mobility Impairment",
            level: "Moderate",
            notes: "Requires assistive device for walking long distances",
          },
          {
            id: "d-demo-2",
            disabilityName: "Chronic Pain Syndrome",
            level: "Severe",
            notes: "Affects daily activities, requires ongoing pain management",
          }
        ];

        const fallbackMedical = [
          {
            id: "m-demo-1",
            diagnosis: "Lower Back Pain",
            therapyDetails: "Manual therapy, stretching exercises, and core strengthening program",
            startDate: "2025-11-01T00:00:00",
            endDate: "2025-12-15T00:00:00",
            doctorName: "Dr. Sara Ahmed",
          },
          {
            id: "m-demo-2",
            diagnosis: "Chronic Joint Stiffness",
            therapyDetails: "Aquatic therapy and joint mobilization techniques",
            startDate: "2025-11-10T00:00:00",
            endDate: "2026-01-10T00:00:00",
            doctorName: "Dr. Mohamed Nabil",
          },
          {
            id: "m-demo-3",
            diagnosis: "Post-Surgery Rehabilitation",
            therapyDetails: "Progressive resistance training and balance exercises",
            startDate: "2025-10-15T00:00:00",
            endDate: "2025-12-30T00:00:00",
            doctorName: "Dr. Nora Fathy",
          }
        ];

        const storedSSN = localStorage.getItem("ssn");
        const candidateId = localStorage.getItem("ssn") || storedSSN;

        if (!candidateId && !storedSSN) {
          // No patient identifier — load from localStorage and show demo data
          const storedPatientInfo = {
            fullName: localStorage.getItem("patientName") || "Patient Name",
            email: localStorage.getItem("patientEmail") || "",
            phone: localStorage.getItem("patientPhone") || "",
            gender: localStorage.getItem("patientGender") || "",
            address: localStorage.getItem("patientAddress") || "",
            ssn: localStorage.getItem("patientSSN") || ""
          };
          setReports(fallbackReports);
          setMedical(fallbackMedical);
          setDisabilities(fallbackDisabilities);
          setData({ ...storedPatientInfo, ...patientData });
          setIsLoading(false);
          return;
        }

        const [rRes, mRes, dRes] = await Promise.all([
          getReportByPatient(storedSSN).catch(() => ({ data: [] })),
          getMedicalInfoByPatient(storedSSN).catch(() => ({ data: [] })),
          getPatientDisability(storedSSN).catch(() => ({ data: [] })),
        ]);

        const r = Array.isArray(rRes?.data) ? rRes.data : [];
        const rawMedical = Array.isArray(mRes?.data) ? mRes.data : [];
        const rawDisabilities = Array.isArray(dRes?.data) ? dRes.data : [];

        // normalize disabilities using API schema
        const normalizedDisabilities = rawDisabilities.map((dis, i) => ({
          id: dis.id ?? dis.DisabilityID ?? `d-${i}`,
          disabilityName: dis.DisabilityName ?? dis.disabilityName ?? "",
          level: dis.Level ?? dis.level ?? "",
          notes: dis.Notes ?? dis.notes ?? "",
          patientSSN: dis.PatientSSN ?? dis.patientSSN ?? "",
        }));

        // normalize medical info using API schema
        const normalizedMedical = rawMedical.map((med, i) => ({
          id: med.id ?? `m-${i}`,
          diagnosis: med.diagnosis ?? "",
          therapyDetails: med.therapyDeatils ?? med.therapyDetails ?? "",
          startDate: med.startDate ?? "",
          endDate: med.endDate ?? "",
          doctorName: med.doctorName ?? "",
          patientSSN: med.patientSSN ?? "",
          relativeSSN: med.relativeSSN ?? "",
          relativeName: med.relativeName ?? "",
          patientName: med.patientName ?? "",
        }));

        // normalize report fields using API schema
        const normalized = r.map((rep, i) => ({
          id: rep.id ?? `r-${i}`,
          subject: rep.subject ?? "Report",
          content: rep.content ?? "",
          date: rep.date ?? "",
          caregiver: rep.caregiverName ?? "",
          program: rep.programName ?? "",
          organization: rep.organizationName ?? "",
          patientSSN: rep.patientSSN ?? "",
          caregiverSSN: rep.caregiverSSN ?? "",
          programOrganizationSSN: rep.programOrganizationSSN ?? "",
          programId: rep.programId ?? 0,
        }));

        setReports(normalized.length ? normalized : fallbackReports);
        setMedical(normalizedMedical.length ? normalizedMedical : fallbackMedical);
        setDisabilities(normalizedDisabilities.length ? normalizedDisabilities : fallbackDisabilities);
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
      <Sidebar userType="patient" />

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
            <h3>Patient Disabilities</h3>
            
            <div className="card-content">
              {disabilities.length ? (
                disabilities.map((d, i) => (
                  <div key={d.id ?? i} className="employment-card">
                    <div className="avatar-circle">♿</div>
                    <div style={{ flex: 1 }}>
                      <div className="employment-title" style={{ fontWeight: 700, fontSize: '18px' }}>
                        {d.disabilityName || `Disability ${i + 1}`}
                      </div>
                      
                      <div style={{ marginTop: 8 }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: d.level?.toLowerCase() === 'severe' ? '#dc3545' : 
                                     d.level?.toLowerCase() === 'moderate' ? '#ffc107' : '#28a745',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 600
                        }}>
                          Level: {d.level || 'Not specified'}
                        </span>
                      </div>
                      
                      {d.notes && (
                        <div className="employment-sub" style={{ marginTop: 10, color: '#555', lineHeight: 1.5 }}>
                          <strong>Notes:</strong> {d.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-card">No disabilities recorded</div>
              )}
            </div>
          </section>

          <section className="card-section" style={{ marginTop: 18 }}>
            <h3>Medical Records</h3>
            
            <div className="card-content">
              {medical.length ? (
                medical.map((m, i) => (
                  <div key={m.id ?? i} className="employment-card" style={{ position: 'relative' }}>
                    <div className="avatar-circle">🩺</div>
                    <div style={{ flex: 1 }}>
                      <div className="employment-title" style={{ fontWeight: 700, fontSize: '18px' }}>
                        {m.diagnosis || `Medical Record ${i + 1}`}
                      </div>
                      <div style={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        fontSize: 13, 
                        color: '#666',
                        fontWeight: 500 
                      }}>
                        {m.startDate && m.endDate ? (
                          <>
                            {new Date(m.startDate).toLocaleDateString()} - {new Date(m.endDate).toLocaleDateString()}
                          </>
                        ) : '—'}
                      </div>
                      
                      <div className="employment-sub" style={{ marginTop: 8, color: '#555', lineHeight: 1.5 }}>
                        {m.therapyDetails || 'No therapy details available'}
                      </div>
                      
                      <div style={{ marginTop: 12 }}>
                        <div className="employment-sub">
                          <strong>Doctor:</strong> {m.doctorName || '—'}
                        </div>
                      </div>
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
                  <div key={r.id} className="employment-card" style={{ position: 'relative' }}>
                    <div className="avatar-circle">📄</div>
                    <div style={{ flex: 1 }}>
                      <div className="employment-title" style={{ fontWeight: 700, fontSize: '18px' }}>{r.subject}</div>
                      <div style={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        fontSize: 13, 
                        color: '#666',
                        fontWeight: 500 
                      }}>
                        {r.date ? new Date(r.date).toLocaleDateString() : '—'}
                      </div>
                      
                      <div className="employment-sub" style={{ marginTop: 8, color: '#555', lineHeight: 1.5 }}>
                        {r.content || 'No content available'}
                      </div>
                      
                      <div style={{ marginTop: 12, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <div className="employment-sub">
                          <strong>Program:</strong> {r.program || '—'}
                        </div>
                        <div className="employment-sub">
                          <strong>Caregiver:</strong> {r.caregiver || '—'}
                        </div>
                        <div className="employment-sub">
                          <strong>Organization:</strong> {r.organization || '—'}
                        </div>
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

  