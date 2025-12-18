import "../profilepagecomponents/profile.css";
import { RelativeCard } from "../profilepagecomponents/relativebox";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PatientsBox from "../Components/PatientsBoxCaregiver";
import Sidebar from "../Components/Sidebar";
import EditCaregiverModal from "../Components/EditCaregiverModal";

export default function CaregiverProfile() {
  const location = useLocation();
  const caregiverData = location.state?.caregiverData;

  const [data, setData] = useState(caregiverData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const caregiverSSN = localStorage.getItem("ssn");

        if (!caregiverSSN) {
          throw new Error("Missing caregiver SSN in localStorage");
        }

        const response = await fetch(
          `https://ableeaseapi.runasp.net/caregiver/getcaregiver/${caregiverSSN}?includeDetails=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed: ${response.status}`);
        }

        const json = await response.json();
        const caregiverData = json?.data || json || {};
        setData(caregiverData);

        // Save to localStorage
        localStorage.setItem("caregiverData", JSON.stringify(caregiverData));
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
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
    // Reload caregiver data after successful update
    try {
      const caregiverSSN = localStorage.getItem("ssn");
      if (caregiverSSN) {
        const response = await fetch(
          `https://ableeaseapi.runasp.net/caregiver/getcaregiver/${caregiverSSN}?includeDetails=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const json = await response.json();
          const caregiverData = json?.data || json || {};
          setData(caregiverData);
          localStorage.setItem("caregiverData", JSON.stringify(caregiverData));
        }
      }
    } catch (err) {
      console.error("Failed to reload caregiver data:", err);
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
      <Sidebar userType="caretaker" />

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.fullName || data?.name || "Caregiver"}</h1>
          <p>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        <RelativeCard
          title="Caregiver"
          data={data}
          disableFetch={true}
          onEdit={openEdit}
        />
        <PatientsBox
          patients={data?.patients}
          programId={data?.programId}
          programOrganizationSSN={data?.programOrganizationSSN}
          caregiverSSN={data?.ssn}
        />
      </div>

      {/* Edit Caregiver Modal */}
      <EditCaregiverModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        caregiverData={data}
        onSave={handleEditSave}
      />
    </div>
  );
}
