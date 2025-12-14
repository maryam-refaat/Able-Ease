import "../profilepagecomponents/profile.css";
import  {RelativeCard}  from "../profilepagecomponents/relativebox";
import ProgramsFA from "../profilepagecomponents/organizationbox";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Organizationpage() {

  const location = useLocation();
  const organizationData = location.state?.organizationData;

  const [data, setData] = useState(organizationData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
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

  if(isLoading) {
    return <div>Loading...</div>;
  }

  if(isError) {
    return <div>Error loading data.</div>;
  }

  return (
  <div className="with-sidebar">
      <div className="side-rect" aria-hidden="true">
        <div className="side-icons">
          <button className="side-btn" aria-label="overview">
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="messages">
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="reports">
            <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.organizationName || data?.managerName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>

        <RelativeCard title="Organization" data={data} />
        <ProgramsFA/>
      </div>
    </div>
  );
}

