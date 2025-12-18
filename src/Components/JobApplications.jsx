import React, { useEffect, useState, useRef } from "react";
import "../profilepagecomponents/organization.css";
import {
  getReceivedJobApplications,
  addPatientWork,
  sendMssg,
  deleteReceivedMessage,
  deleteSentMessage,
} from "../assets/apis.js";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";
import { formatDate } from "../utils/dateFormatter";

export default function JobApplications() {
  const { alertState, showAlert, closeAlert } = useAlert();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [acceptModal, setAcceptModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    patientSSN: "",
    organizationSSN: "",
    jobTitle: "",
    salary: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [rejectFormData, setRejectFormData] = useState({
    subject: "",
    body: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const trackRef = useRef(null);

  const organizationSSN = localStorage.getItem("ssn");

  useEffect(() => {
    const track = trackRef.current;
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
  }, [applications]);

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      if (!organizationSSN) {
        console.error("No organization SSN found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getReceivedJobApplications(organizationSSN);
        console.log("Job applications received:", response);

        if (mounted && response.data?.length) {
          setApplications(response.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Failed to fetch job applications:", err);
        if (mounted) {
          setError(true);
          setApplications([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();
    return () => (mounted = false);
  }, [organizationSSN]);

  const handleAcceptClick = (application) => {
    setSelectedApplication(application);
    setFormData({
      patientSSN: application.senderSSN || application.SenderSSN || "",
      organizationSSN: organizationSSN,
      jobTitle: "",
      salary: "",
      startDate: new Date().toISOString().split("T")[0],
    });
    setAcceptModal(true);
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setRejectFormData({
      subject: "Job Application Rejection",
      body: "",
    });
    setRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const senderSSN =
        selectedApplication.senderSSN || selectedApplication.SenderSSN;

      const payload = {
        senderSSN: organizationSSN,
        receiverSSN: senderSSN,
        subject: rejectFormData.subject,
        body: rejectFormData.body,
      };

      console.log("Sending rejection message:", payload);
      await sendMssg(payload);

      // Delete message for both sender and receiver
      const messageId =
        selectedApplication.messageId || selectedApplication.MessageId;

      await Promise.all([
        deleteReceivedMessage(organizationSSN, messageId),
        deleteSentMessage(senderSSN, messageId),
      ]);

      // Remove rejected application from list
      setApplications((prev) =>
        prev.filter((app) => (app.messageId || app.MessageId) !== messageId)
      );

      setRejectModal(false);
      setSelectedApplication(null);
      setRejectFormData({ subject: "", body: "" });

      showAlert("Rejection message sent successfully!", "success");
    } catch (err) {
      console.error("Failed to send rejection message:", err);
      showAlert("Failed to send rejection message. Please try again.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAcceptSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        patientSSN: formData.patientSSN,
        organizationSSN: formData.organizationSSN,
        jobTitle: formData.jobTitle,
        salary: parseInt(formData.salary),
        startDate: formData.startDate,
      };

      console.log("Adding patient work:", payload);
      await addPatientWork(payload);

      // Delete message for both sender and receiver
      const messageId =
        selectedApplication.messageId || selectedApplication.MessageId;
      const senderSSN =
        selectedApplication.senderSSN || selectedApplication.SenderSSN;

      await Promise.all([
        deleteReceivedMessage(organizationSSN, messageId),
        deleteSentMessage(senderSSN, messageId),
      ]);

      // Remove accepted application from list
      setApplications((prev) =>
        prev.filter((app) => (app.messageId || app.MessageId) !== messageId)
      );

      setAcceptModal(false);
      setSelectedApplication(null);
      setFormData({
        patientSSN: "",
        organizationSSN: "",
        jobTitle: "",
        salary: "",
        startDate: new Date().toISOString().split("T")[0],
      });

      showAlert("Application accepted and job added successfully!", "success");
    } catch (err) {
      console.error("Failed to accept application:", err);
      showAlert("Failed to accept application. Please try again.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-box">
        <h3>Job Applications</h3>
        <div className="loading">Loading applications...</div>
      </section>
    );
  }

  return (
    <section className="section-box">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Job Applications Received</h3>
        <span style={{ fontSize: "14px", color: "#666" }}>
          {applications.length} application
          {applications.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div style={{ color: "red", padding: "10px" }}>
          Failed to load applications
        </div>
      )}

      {!error && applications.length === 0 && (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No job applications received
        </div>
      )}

      {!error && applications.length > 0 && (
        <div className="track-wrapper">
          <div className="track-container" ref={trackRef}>
            {applications.map((app, index) => {
              const messageId = app.messageId || app.MessageId || index;
              const senderName = app.senderName || app.SenderName || "Unknown";
              const body = app.body || app.Body || "";
              const subject = app.subject || app.Subject || "Job Application";
              const sentDate =
                app.sentDate || app.SentDate || new Date().toISOString();

              return (
                <div
                  key={messageId}
                  className="card"
                  style={{
                    minWidth: "280px",
                    padding: "16px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        marginBottom: "4px",
                      }}
                    >
                      {senderName}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      {subject}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        marginBottom: "8px",
                      }}
                    >
                      {formatDate(sentDate)}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#444",
                        lineHeight: "1.5",
                        maxHeight: "60px",
                        overflow: "hidden",
                      }}
                    >
                      {body}
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                  >
                    <button
                      onClick={() => handleAcceptClick(app)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#218838")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#28a745")
                      }
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectClick(app)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#c82333")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#dc3545")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {acceptModal && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>Accept Job Application</h3>
              <button
                type="button"
                onClick={() => {
                  setAcceptModal(false);
                  setSelectedApplication(null);
                  setFormData({
                    patientSSN: "",
                    organizationSSN: "",
                    jobTitle: "",
                    salary: "",
                    startDate: new Date().toISOString().split("T")[0],
                  });
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                  padding: "0",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) => (e.target.style.color = "#666")}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAcceptSubmit}>
              <input type="hidden" value={formData.patientSSN} />
              <input type="hidden" value={formData.organizationSSN} />

              <div className="popup-input-group">
                <label>Applicant</label>
                <input
                  type="text"
                  value={
                    selectedApplication?.senderName ||
                    selectedApplication?.SenderName ||
                    ""
                  }
                  disabled
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#f5f5f5",
                  }}
                />
              </div>

              <div className="popup-input-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  placeholder="e.g. Physical Therapist Assistant"
                />
              </div>

              <div className="popup-input-group">
                <label>Salary *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  placeholder="Monthly salary amount"
                />
              </div>

              <div className="popup-input-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div className="popup-actions">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => {
                    setAcceptModal(false);
                    setSelectedApplication(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="add-btn"
                  disabled={formLoading}
                  style={{
                    background: "#28a745",
                    opacity: formLoading ? 0.6 : 1,
                  }}
                >
                  {formLoading ? "Adding..." : "Accept & Add Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>Reject Job Application</h3>
              <button
                type="button"
                onClick={() => {
                  setRejectModal(false);
                  setSelectedApplication(null);
                  setRejectFormData({ subject: "", body: "" });
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                  padding: "0",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) => (e.target.style.color = "#666")}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="popup-input-group">
                <label>Applicant</label>
                <input
                  type="text"
                  value={
                    selectedApplication?.senderName ||
                    selectedApplication?.SenderName ||
                    ""
                  }
                  disabled
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#f5f5f5",
                  }}
                />
              </div>

              <div className="popup-input-group">
                <label>Subject *</label>
                <input
                  type="text"
                  required
                  value={rejectFormData.subject}
                  onChange={(e) =>
                    setRejectFormData({
                      ...rejectFormData,
                      subject: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  placeholder="Message subject"
                />
              </div>

              <div className="popup-input-group">
                <label>Message *</label>
                <textarea
                  required
                  value={rejectFormData.body}
                  onChange={(e) =>
                    setRejectFormData({
                      ...rejectFormData,
                      body: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    minHeight: "120px",
                    resize: "vertical",
                  }}
                  placeholder="Explain why the application was rejected..."
                />
              </div>

              <div className="popup-actions">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => {
                    setRejectModal(false);
                    setSelectedApplication(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="add-btn"
                  disabled={formLoading}
                  style={{
                    background: "#dc3545",
                    opacity: formLoading ? 0.6 : 1,
                  }}
                >
                  {formLoading ? "Sending..." : "Send Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </section>
  );
}
