import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import AvailablePrograms from "../Components/AvailablePrograms";
import FinancialAid from "../Components/FinancialAidOrg";
import CareGiverBox from "../Components/CareGiverbox";
import AvailableLocationsBox from "../Components/AvailablePositions";
import JobApplications from "../Components/JobApplications";
import Messages from "./Messages";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthState } from "../context/AuthState";
import { useEffect, useState } from "react";
import OrgAssesments from "../Pages/OrgAssesments";

export default function Organizationpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const organizationData = location.state?.organizationData;

  const [appear, setAppear] = useState(0);

  const [data, setData] = useState(organizationData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
        const authToken = localStorage.getItem("authToken");

        console.log("=== Organization Page Load ===");
        console.log("SSN from localStorage:", orgSSN);
        console.log("AuthToken from localStorage:", authToken);
        console.log("All localStorage keys:", Object.keys(localStorage));

        // Redirect to login if no SSN found
        if (!orgSSN) {
          console.error(
            "❌ No organization SSN found in localStorage - redirecting to login"
          );
          setIsLoading(false);
          navigate("/");
          return;
        }

        console.log("✅ SSN found, fetching organization data...");
        const response = await fetch(
          `https://localhost:7040/api/organizations/getorganization/${orgSSN}`,
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

        // Save organization data to localStorage for Messages component
        localStorage.setItem("organizationData", JSON.stringify(orgData));
        if (orgData.name) {
          localStorage.setItem("organizationName", orgData.name);
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
            aria-label="available locations"
            onClick={() => setAppear(2)}
          >
            <i className="fa-solid fa-users" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="messages"
            onClick={() => setAppear(3)}
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="reports"
            onClick={() => setAppear(1)}
          >
            <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="assessments"
            onClick={() => setAppear(4)}
          >
            <i className="fa-solid fa-clipboard-check" aria-hidden="true"></i>
          </button>
          <button
            className="side-btn"
            aria-label="profile"
            onClick={() => setAppear(0)}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
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
          <h1>Welcome, {data?.name || data?.managerName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>
        {appear !== 3 && <RelativeCard title="Organization" data={data} />}

        {appear === 2 && <AvailableLocationsBox />}
        {appear === 1 && <CareGiverBox />}
        {appear === 3 && <Messages showSidebar={false} showHeader={false} />}
        {appear === 4 && <OrgAssesments />}
        {appear === 0 && (
          <>
            <AvailablePrograms />

            <FinancialAid />
            <JobApplications />
          </>
        )}
      </div>
    </div>
  );
}
