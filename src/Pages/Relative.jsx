import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import { MedicalBox } from "../profilepagecomponents/medicalbox";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import { setAuthState } from "../context/AuthState";
import { getRelativeBySSN } from "../assets/apis";

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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setAuthState({ isLoggedIn: false, userType: null, ssn: null });
    navigate("/");
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
    setDraft({
      fullName: data.fullName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      gender: data?.gender || "",
      address: data?.address || "",
    });
    setModalError("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!draft.fullName || draft.fullName.trim().length < 2) {
      setModalError("Please enter a valid name");
      return;
    }

    try {
      setSaving(true);
      // TODO: REMOVE WHEN API IS CONNECTED - simulate save delay
      await new Promise((r) => setTimeout(r, 700));

      // TODO: UNCOMMENT AND USE REAL API WHEN CONNECTED
      // const res = await updateRelative(data.id, draft);
      // if (res?.error) throw new Error(res.error);

      setData((prev) => ({ ...prev, ...draft }));
      // Update localStorage
      const updatedData = { ...data, ...draft };
      localStorage.setItem("relativeData", JSON.stringify(updatedData));

      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      setModalError("Save failed.");
    } finally {
      setSaving(false);
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
      <Sidebar userType="relative" />

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.fullName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>

        <RelativeCard title="Relative" data={data} onEdit={openEdit} />
        <MedicalBox
          relativeSSN={data?.ssn || localStorage.getItem("ssn")}
          patientSSN={data?.patientSSN || ""}
        />
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
    </div>
  );
}
