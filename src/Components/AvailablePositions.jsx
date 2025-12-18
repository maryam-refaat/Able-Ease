import React, { useEffect, useState, useRef } from "react";
import PositionModal from "./PositionModal";
import "../profilepagecomponents/organization.css";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

const baseApiUrl = "https://ableeaseapi.runasp.net"; // Example base URL

export default function AvailableLocationsBox() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPositionForEdit, setSelectedPositionForEdit] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const trackRef = useRef(null);
  const { alertState, showAlert, closeAlert } = useAlert();

  // --- API helpers (URLs to be provided by you) ---
  const getAuth = () => ({
    token: localStorage.getItem("authToken"),
    ssn: localStorage.getItem("ssn"),
  });

  const withAuthHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // Read positions
  const fetchPositionsApi = async () => {
    const { token, ssn } = getAuth();
    // TODO: replace with your GET URL
    const url = `${baseApiUrl}/message/sent/${ssn}/job-proposals`;
    const res = await fetch(url, {
      method: "GET",
      headers: withAuthHeaders(token),
    });
    if (!res.ok) throw new Error(`Fetch positions failed: ${res.status}`);
    const json = await res.json();
    // Support various response shapes: {data: [...]}, {data: {data: [...]}}, {array: [...]}, or direct array
    const array = Array.isArray(json?.data?.data)
      ? json.data.data
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.array)
      ? json.array
      : Array.isArray(json)
      ? json
      : null;
    if (!array)
      throw new Error("Unexpected API response format: no array found");
    return array;
  };

  // Create position
  const createPosition = async (payload) => {
    const { token, ssn } = getAuth();
    // Build request with senderSSN (required by API)
    // Handle both subject/body and name/requirements field names
    const requestPayload = {
      senderSSN: ssn,
      subject: payload.subject || payload.name || "",
      body: payload.body || payload.requirements || "",
    };
    const url = `${baseApiUrl}/message/send/job-proposal`;
    console.log("📤 Creating position with payload:", requestPayload);
    const res = await fetch(url, {
      method: "POST",
      headers: withAuthHeaders(token),
      body: JSON.stringify(requestPayload),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Create position failed:", res.status, errorText);
      throw new Error(`Create position failed: ${res.status}`);
    }
    return res.json();
  };

  // Update position

  // TODO: replace with your PUT/PATCH URL

  // Delete position
  const deletePosition = async (id) => {
    const { token, ssn } = getAuth();
    // TODO: replace with your DELETE URL
    const url = `${baseApiUrl}/message/sent/${ssn}/delete/job-proposal/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: withAuthHeaders(token),
    });
    if (!res.ok) throw new Error(`Delete position failed: ${res.status}`);
    return true;
  };

  // Fetch positions on component mount
  useEffect(() => {
    const fetchPositions = async () => {
      console.log("🔄 Starting to fetch positions...");
      setLoading(true);
      setError(false);
      try {
        const dataArray = await fetchPositionsApi();
        console.log("✅ Positions array:", dataArray);

        // Map the API response to the format expected by the component
        const mappedPositions = dataArray.map((item) => ({
          id: item.messageId,
          subject: item.subject,
          body: item.body,
        }));
        console.log("📋 Mapped positions:", mappedPositions);
        setPositions(mappedPositions);
      } catch (err) {
        console.error("💥 Error fetching positions:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  // Position CRUD handlers
  const handleAddPosition = () => {
    setSelectedPositionForEdit(false);
    setIsModalOpen(true);
  };

  const handleUpdatePosition = (position) => {
    setSelectedPositionForEdit(position);
    setIsModalOpen(true);
  };

  const handleDeletePosition = async (position) => {
    if (
      window.confirm(`Are you sure you want to delete "${position.subject}"?`)
    ) {
      setDeleteLoading(position.id);
      try {
        await deletePosition(position.id);

        // After successful deletion, update the local state
        setPositions(positions.filter((p) => p.id !== position.id));
      } catch (err) {
        showAlert("Failed to delete position. Please try again.", "error");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleSubmitPosition = async (formData) => {
    if (selectedPositionForEdit) {
      // Update existing position
      try {
        const updated = await updatePosition(
          selectedPositionForEdit.id,
          formData
        );
        const updatedItem = updated?.data ?? updated;
        const updatedMapped = {
          id:
            updatedItem.messageId ??
            updatedItem.id ??
            selectedPositionForEdit.id,
          subject: updatedItem.subject ?? formData.subject,
          body: updatedItem.body ?? formData.body,
        };

        // Update local state
        setPositions(
          positions.map((p) =>
            p.id === selectedPositionForEdit.id ? { ...p, ...updatedMapped } : p
          )
        );
      } catch (err) {
        showAlert("Failed to update position. Please try again.", "error");
        return;
      }
    } else {
      // Add new position
      try {
        const created = await createPosition(formData);
        const createdItem = created?.data ?? created;
        const newPosition = {
          id: createdItem.messageId ?? createdItem.id ?? Date.now(),
          subject: createdItem.subject ?? formData.subject,
          body: createdItem.body ?? formData.body,
        };
        setPositions([...positions, newPosition]);
      } catch (err) {
        showAlert("Failed to add position. Please try again.", "error");
        return;
      }
    }
  };

  return (
    <section className="section-box" style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Available Positions</h3>

        <button
          className="action-btn add-btn"
          onClick={handleAddPosition}
          title="Add Position"
        >
          <i className="fa-solid fa-plus"></i> Add Position
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading positions...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          <p>Error loading positions. Check console for details.</p>
          <p style={{ fontSize: "12px", marginTop: "8px" }}>
            Your session may have expired. Try logging in again.
          </p>
        </div>
      ) : (
        <div className="slider-wrapper">
          <div className="cards-wrapper">
            <button
              aria-label="previous positions"
              className="slider-btn left"
              onClick={() => {
                if (trackRef.current) {
                  const amount = trackRef.current.clientWidth * 0.8;
                  trackRef.current.scrollBy({
                    left: -amount,
                    behavior: "smooth",
                  });
                }
              }}
            >
              ‹
            </button>

            <div ref={trackRef} className="cards-track" role="list">
              {positions.map((pos) => (
                <div key={pos.id} className="program-card" role="listitem">
                  <div className="program-card-header">
                    <h4>{pos.subject}</h4>
                  </div>

                  <div className="program-meta">
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: "500",
                        lineHeight: "1.6",
                      }}
                    >
                      <strong
                        style={{
                          color: "#1e293b",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Requirements:
                      </strong>
                      {pos.body}
                    </div>
                  </div>

                  <div className="program-actions">
                    <button
                      className="program-action-btn delete-btn-small"
                      onClick={() => handleDeletePosition(pos)}
                      title="Delete Position"
                      disabled={deleteLoading === pos.id}
                    >
                      {deleteLoading === pos.id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-trash"></i>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              aria-label="next positions"
              className="slider-btn right"
              onClick={() => {
                if (trackRef.current) {
                  const amount = trackRef.current.clientWidth * 0.8;
                  trackRef.current.scrollBy({
                    left: amount,
                    behavior: "smooth",
                  });
                }
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      <PositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmitPosition={handleSubmitPosition}
        position={selectedPositionForEdit}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </section>
  );
}
