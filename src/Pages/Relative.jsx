import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import { MedicalBox } from "../profilepagecomponents/medicalbox";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Messages from "./Messages";
import { setAuthState } from "../context/AuthState";
import { getRelativeBySSN } from "../assets/apis";
import EditRelativeModal from "../Components/EditRelativeModal";

export default function Relative() {
  const location = useLocation();
  const relativeData = location.state?.relativeData;

  const [data, setData] = useState(relativeData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("https://localhost:7040/api/Account/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      localStorage.clear();
      setAuthState({ isLoggedIn: false, userType: null, ssn: null });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.clear();
      setAuthState({ isLoggedIn: false, userType: null, ssn: null });
      navigate("/");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Get SSN from localStorage
        const relativeSSN = localStorage.getItem("ssn");

        if (relativeSSN) {
          // Fetch data from API
          const relativeData = await getRelativeBySSN(relativeSSN);
          setData(relativeData);
        } else {
          // Fallback to stored data if no SSN
          const storedDataStr = localStorage.getItem("relativeData");
          try {
            const storedData = storedDataStr ? JSON.parse(storedDataStr) : null;
            if (storedData) {
              setData(storedData);
            }
          } catch (e) {
            console.error("Failed to parse stored relative data", e);
          }
        }
      } catch (error) {
        console.error("Error fetching relative data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [relativeData]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const openEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    // Reload relative data after successful update
    try {
      const relativeSSN = localStorage.getItem("ssn");
      if (relativeSSN) {
        const relativeData = await getRelativeBySSN(relativeSSN);
        setData(relativeData);
      }
    } catch (err) {
      console.error("Failed to reload relative data:", err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="with-sidebar">
      <div className="side-rect">
        <div className="side-icons">
          <button
            className="side-btn"
            aria-label="profile"
            onClick={() => setShowMessages(false)}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>

          <button
            className="side-btn"
            aria-label="messages"
            onClick={() => setShowMessages(true)}
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>

          <button
            className="side-btn"
            aria-label="logout"
            onClick={handleLogout}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.fullName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>

        {showMessages ? (
          <Messages showSidebar={false} showHeader={false} />
        ) : (
          <>
            <RelativeCard title="Relative" data={data} onEdit={openEdit} />
            <MedicalBox
              relativeSSN={data?.ssn || localStorage.getItem("ssn")}
              patientSSN={data?.patientSSN || ""}
            />
          </>
        )}

        <Footer />
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditing(false)}>
              ✕
            </button>
            <h2>Edit Information</h2>

            {modalError && <div className="modal-error">{modalError}</div>}

            <div className="modal-field">
              <label>Full Name</label>
              <input
                value={draft.fullName}
                onChange={(e) =>
                  setDraft({ ...draft, fullName: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="modal-field">
              <label>Email</label>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>

            <div className="modal-field">
              <label>Phone</label>
              <input
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="Enter phone"
              />
            </div>

            <div className="modal-field">
              <label>Gender</label>
              <select
                value={draft.gender}
                onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="modal-field">
              <label>Address</label>
              <textarea
                value={draft.address}
                onChange={(e) =>
                  setDraft({ ...draft, address: e.target.value })
                }
                placeholder="Enter address"
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Relative Modal */}
      <EditRelativeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        relativeData={data}
        onSave={handleEditSave}
      />
    </div>
  );
}
