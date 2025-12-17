import "../profilepagecomponents/profile.css";
import { CenterCard } from "../profilepagecomponents/centerbox";
import Availabletherapiess from "./availabletherapies.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { setAuthState } from "../context/AuthState";

export default function Physiocenterpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const organizationData = location.state?.organizationData;

  const [data, setData] = useState(organizationData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setAuthState({ isLoggedIn: false, userType: null, ssn: null });
    navigate("/");
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
      <Sidebar userType="therapyCenter" />

      <div className="page-container">
        <header className="welcome-box">
          <h1>
            Welcome, {data?.name || data?.managerName || "Center Manager"}
          </h1>
          <p>Tue, 07 June 2022</p>
        </header>
        <CenterCard title="Physiotherapy Center" data={data} />
        <Availabletherapiess />
      </div>
    </div>
  );
}
