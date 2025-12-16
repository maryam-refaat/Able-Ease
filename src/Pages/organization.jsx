import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import AvailablePrograms from "../Components/AvailablePrograms";
import FinancialAid from "../Components/FinancialAidOrg";
import CareGiverBox from "../Components/CareGiverbox";
import AvailableLocationsBox from "../Components/AvailablePositions";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Organizationpage() {
  const location = useLocation();
  const organizationData = location.state?.organizationData;

  const [appear, setAppear] = useState(0);

  const [data, setData] = useState(organizationData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const orgSSN = localStorage.getItem("ssn");

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
        // const token = JSON.parse(localStorage.getItem("organizationToken"));
        // const fetchedData = await getUserInfo(token);
        // setData(fetchedData);
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
      <div className="side-rect" aria-hidden="true">
        <div className="side-icons">
          <button
            className="side-btn"
            aria-label="available locations"
            onClick={() => setAppear(2)}
          >
            <i className="fa-solid fa-users" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="messages">
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
            aria-label="profile"
            onClick={() => setAppear(0)}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.name || data?.managerName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>
        <RelativeCard title="Organization" data={data} />

        {appear === 2 && <AvailableLocationsBox />}
        {appear === 1 && <CareGiverBox />}
        {appear === 0 && (
          <>
            <AvailablePrograms />
            <FinancialAid />
          </>
        )}
      </div>
    </div>
  );
}