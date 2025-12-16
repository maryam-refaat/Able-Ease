import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PatientsBox from "../Components/PatientsBoxCaregiver";
import Sidebar from "../Components/Sidebar";

export default function CaregiverProfile() {
  const location = useLocation();
  const caregiverData = location.state?.caregiverData;

  const [data, setData] = useState(caregiverData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const caregiverSSN = localStorage.getItem("ssn");

        if (!caregiverSSN) {
          throw new Error("Missing caregiver SSN in localStorage");
        }

        const response = await fetch(
          `https://localhost:7040/api/caregiver/getcaregiver/${caregiverSSN}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Failed: ${response.status}`);
        }

        const json = await response.json();
        setData(json?.data || json || {});
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
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
      <Sidebar userType="caretaker" />

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.fullName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>

        <RelativeCard title="Caregiver" data={data} disableFetch={true} />
        <PatientsBox
          patients={data?.patients}
          onAddReport={(p) => console.log("Add report for", p)}
        />
      </div>
    </div>
  );
}
