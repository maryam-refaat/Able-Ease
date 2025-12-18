import React, { useEffect, useState, useRef } from "react";
import {
  getFinancialAidApplications,
  getProgramById,
  addFinancialAid,
  sendContactMessage,
  addPayment,
  deleteReceivedMessage,
  AddPatientToProgram,
  getPatientBySSN,
} from "../assets/apis.js";
import "../profilepagecomponents/organization.css";

export default function FinancialAid() {
  const [faApplications, setFaApplications] = useState([]);
  const [programsData, setProgramsData] = useState({});
  const [patientsData, setPatientsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const faTrackRef = useRef(null);

  useEffect(() => {
    const track = faTrackRef.current;
    if (!track) return;

    const update = () => {
      requestAnimationFrame(() => {
        const tolerant = track.clientWidth + 20;
        const shouldCenter =
          Math.ceil(track.scrollWidth) <= Math.floor(tolerant);
        const wrapper = track.parentElement;
        if (shouldCenter) {
          wrapper?.classList.add("centered");
        } else {
          wrapper?.classList.remove("centered");
        }
      });
    };

    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(track);
    }
    window.addEventListener("resize", update);
    const tick = setTimeout(update, 50);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", update);
      clearTimeout(tick);
    };
  }, [faApplications]);

  useEffect(() => {
    let mounted = true;

    const loadFAApplications = async () => {
      try {
        setLoading(true);
        const orgSSN = localStorage.getItem("ssn");

        if (!orgSSN) {
          console.log("No organization SSN found");
          setLoading(false);
          return;
        }

        const applications = await getFinancialAidApplications(orgSSN);

        if (mounted && applications.length > 0) {
          setFaApplications(applications);

          // Fetch program data for each application
          const programPromises = applications.map(async (app) => {
            try {
              const programId = app.subject;
              const program = await getProgramById(orgSSN, programId);
              return { programId, program };
            } catch (err) {
              console.error("Error fetching program:", err);
              return { programId: app.subject, program: null };
            }
          });

          // Fetch patient data for each application
          const patientPromises = applications.map(async (app) => {
            try {
              const patientSSN = app.senderSSN;
              const patientResponse = await getPatientBySSN(patientSSN);
              const patient = patientResponse?.data;
              return { patientSSN, patient };
            } catch (err) {
              console.error("Error fetching patient:", err);
              return { patientSSN: app.senderSSN, patient: null };
            }
          });

          const [programResults, patientResults] = await Promise.all([
            Promise.all(programPromises),
            Promise.all(patientPromises),
          ]);

          const programsMap = {};
          programResults.forEach(({ programId, program }) => {
            programsMap[programId] = program;
          });

          const patientsMap = {};
          patientResults.forEach(({ patientSSN, patient }) => {
            patientsMap[patientSSN] = patient;
          });

          if (mounted) {
            setProgramsData(programsMap);
            setPatientsData(patientsMap);
          }
        } else if (mounted) {
          setFaApplications([]);
        }
      } catch (err) {
        console.error("Error loading FA applications:", err);
        if (mounted) {
          setError(true);
          setFaApplications([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFAApplications();
    return () => (mounted = false);
  }, []);

  const handleAccept = async (application) => {
    const messageId = application.messageID || application.messageId;
    if (processingIds.has(messageId)) return;

    setProcessingIds((prev) => new Set(prev).add(messageId));

    try {
      const orgSSN = localStorage.getItem("ssn");
      const patientSSN = application.senderSSN;
      const programId = application.subject;
      const reason = application.body;
      const program = programsData[programId];
      const programName = program?.name || program?.Name || "the program";

      // 1. Add Financial Aid with random national ID
      const nationalID = Math.random().toString(36).substring(2, 15);
      const faData = {
        patientSSN: patientSSN,
        organizationSSN: orgSSN,
        percentage: 100,
        nationalID: nationalID,
        reason: reason,
      };

      const addedFA = await addFinancialAid(faData);
      console.log("Added FA response:", addedFA);
      const financialAidId = addedFA?.id || addedFA?.ID;

      if (!financialAidId) {
        throw new Error("Failed to get Financial Aid ID from response");
      }

      // 2. Enroll patient in program
      await AddPatientToProgram(patientSSN, programId, orgSSN);
      console.log("Patient enrolled successfully");

      // 3. Create payment with amount = 0
      await addPayment({
        patientSSN: patientSSN,
        financialId: financialAidId,
        amount: 0,
        approvalStatus: "Approved",
      });
      console.log("Payment created successfully");

      // 4. Send acceptance message to patient (only after enrollment and payment succeed)
      await sendContactMessage({
        senderSSN: orgSSN,
        receiverSSN: patientSSN,
        subject: "Financial Aid Application",
        body: `Your financial aid for ${programName} program is accepted`,
      });

      // 5. Delete the FA application message
      await deleteReceivedMessage(orgSSN, messageId);

      // Remove from UI
      setFaApplications((prev) =>
        prev.filter((app) => (app.messageID || app.messageId) !== messageId)
      );

      alert(`Financial aid accepted for ${programName}`);
    } catch (error) {
      console.error("Error accepting FA:", error);
      alert("Failed to accept financial aid. Please try again.");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const handleReject = async (application) => {
    const messageId = application.messageID || application.messageId;
    if (processingIds.has(messageId)) return;

    setProcessingIds((prev) => new Set(prev).add(messageId));

    try {
      const orgSSN = localStorage.getItem("ssn");
      const patientSSN = application.senderSSN;
      const programId = application.subject;
      const program = programsData[programId];
      const programName = program?.name || program?.Name || "the program";

      // 1. Send rejection message to patient
      await sendContactMessage({
        senderSSN: orgSSN,
        receiverSSN: patientSSN,
        subject: "Financial Aid Response",
        body: `Your financial aid for ${programName} program is rejected`,
      });

      // 2. Delete the FA application message
      await deleteReceivedMessage(orgSSN, messageId);

      // Remove from UI
      setFaApplications((prev) =>
        prev.filter((app) => (app.messageID || app.messageId) !== messageId)
      );

      alert(`Financial aid rejected for ${programName}`);
    } catch (error) {
      console.error("Error rejecting FA:", error);
      alert("Failed to reject financial aid. Please try again.");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  return (
    <section className="section-box">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Financial Aid Applications</h3>
        <span style={{ fontSize: "14px", color: "#666" }}>
          {faApplications.length} application(s)
        </span>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading financial aid applications...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          <p>Error loading financial aid applications.</p>
        </div>
      ) : faApplications.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>No financial aid applications received.</p>
        </div>
      ) : (
        <div className="slider-wrapper">
          <button
            aria-label="previous applications"
            className="slider-btn left"
            onClick={() => {
              if (faTrackRef.current) {
                const amount = faTrackRef.current.clientWidth * 0.8;
                faTrackRef.current.scrollBy({
                  left: -amount,
                  behavior: "smooth",
                });
              }
            }}
          >
            ‹
          </button>

          <div className="cards-wrapper">
            <div ref={faTrackRef} className="cards-track" role="list">
              {faApplications.map((app) => {
                const program = programsData[app.subject];
                const programName =
                  program?.name || program?.Name || "Unknown Program";
                const price = program?.price || program?.Price || "N/A";
                const messageId = app.messageID || app.messageId;
                const isProcessing = processingIds.has(messageId);

                const patient = patientsData[app.senderSSN];
                const patientName =
                  patient?.name || patient?.Name || "Unknown Patient";
                const patientPhone =
                  patient?.contactInfo || patient?.ContactInfo || "N/A";

                return (
                  <div key={messageId} className="program-card" role="listitem">
                    <div className="program-card-header">
                      <h4>{programName}</h4>
                      <span className="program-status">Pending</span>
                    </div>

                    <div className="program-meta">
                      <div className="program-price">
                        <i className="fa-solid fa-dollar-sign"></i> ${price}
                      </div>
                    </div>

                    <div style={{ marginTop: "12px", marginBottom: "8px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#555",
                            fontWeight: "500",
                            marginBottom: "4px",
                          }}
                        >
                          <i
                            className="fa-solid fa-user"
                            style={{ marginRight: "6px" }}
                          ></i>
                          Patient:
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#777",
                            paddingLeft: "24px",
                          }}
                        >
                          {patientName}
                        </p>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#555",
                            fontWeight: "500",
                            marginBottom: "4px",
                          }}
                        >
                          <i
                            className="fa-solid fa-phone"
                            style={{ marginRight: "6px" }}
                          ></i>
                          Phone:
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#777",
                            paddingLeft: "24px",
                          }}
                        >
                          {patientPhone}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          fontWeight: "500",
                        }}
                      >
                        Reason:
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#777",
                          marginTop: "4px",
                          maxHeight: "60px",
                          overflow: "auto",
                        }}
                      >
                        {app.body}
                      </p>
                    </div>

                    <div
                      className="program-actions"
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        className="program-action-btn"
                        onClick={() => handleAccept(app)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          background: isProcessing
                            ? "#ccc"
                            : "linear-gradient(135deg, #27865d 0%, #1e6b4a 100%)",
                          color: "white",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                      >
                        <i className="fa-solid fa-check"></i>{" "}
                        {isProcessing ? "Processing..." : "Accept"}
                      </button>
                      <button
                        className="program-action-btn"
                        onClick={() => handleReject(app)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          background: isProcessing
                            ? "#ccc"
                            : "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                          color: "white",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                      >
                        <i className="fa-solid fa-times"></i>{" "}
                        {isProcessing ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            aria-label="next applications"
            className="slider-btn right"
            onClick={() => {
              if (faTrackRef.current) {
                const amount = faTrackRef.current.clientWidth * 0.8;
                faTrackRef.current.scrollBy({
                  left: amount,
                  behavior: "smooth",
                });
              }
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
