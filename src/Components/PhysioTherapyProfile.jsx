import "../profilepagecomponents/profile.css";
import { CenterCard } from "../profilepagecomponents/centerbox";
import Availabletherapiess from "./availabletherapies.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setAuthState } from "../context/AuthState";
import AvailabletherapiessJoined from "../Components/AvailabletherapiessJoined.jsx";
import Messages from "../Pages/Messages";
import EditCenterModal from "../Components/EditCenterModal";

export default function Physiocenterpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const organizationData = location.state?.organizationData;

  const [data, setData] = useState(organizationData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [appear, setAppear] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

        const orgSSN = localStorage.getItem("ssn");

        const response = await fetch(
          `https://localhost:7040/api/center/getcenter/${orgSSN}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orgData = await response.json();
        setData(orgData);

        // Save center data to localStorage for Messages component
        localStorage.setItem("centerData", JSON.stringify(orgData));
        if (orgData.name) {
          localStorage.setItem("centerName", orgData.name);
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    // Reload center data after successful update
    try {
      const orgSSN = localStorage.getItem("ssn");
      if (orgSSN) {
        const response = await fetch(
          `https://localhost:7040/api/center/getcenter/${orgSSN}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const orgData = await response.json();
          setData(orgData);
          localStorage.setItem("centerData", JSON.stringify(orgData));
        }
      }
    } catch (err) {
      console.error("Failed to reload center data:", err);
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
            onClick={() => setAppear(0)}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="messages"
            onClick={() => setAppear(1)}
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
          <h1>
            Welcome, {data?.name || data?.managerName || "Center Manager"}
          </h1>
          <p>Tue, 07 June 2022</p>
        </header>
        {appear !== 1 && (
          <CenterCard
            title="Physiotherapy Center"
            data={data}
            onEdit={openEdit}
          />
        )}
        {appear === 1 && <Messages showSidebar={false} showHeader={false} />}
        {appear === 0 && (
          <>
            <Availabletherapiess />
            <AvailabletherapiessJoined />
          </>
        )}
      </div>

      <EditCenterModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        centerData={data}
        onSave={handleEditSave}
      />
    </div>
  );
}
