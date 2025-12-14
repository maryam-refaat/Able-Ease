import "../profilepagecomponents/profile.css";
import  {RelativeCard}  from "../profilepagecomponents/relativebox";
import  {MedicalBox}  from "../profilepagecomponents/medicalbox";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Components/Footer";

export default function Relative() {

  const location = useLocation();
  const relativeData = location.state?.relativeData;

  const [data, setData] = useState(relativeData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // const token = JSON.parse(localStorage.getItem("relativeToken"));
        // const fetchedData = await getUserInfo(token);
        // setData(fetchedData);
      } catch (error) {
        console.error("Error fetching relative data:", error);
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
          <button className="side-btn" aria-label="overview" onClick={() => navigate('/') }>
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="messages" onClick={() => navigate('/') }>
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
          <button className="side-btn" aria-label="reports" onClick={() => navigate('/patient-reports', { state: { patientData: data } })}>
            <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="page-container">
        <header className="welcome-box">
          <h1>Welcome, {data?.fullName || "Amanda"}</h1>
          <p>Tue, 07 June 2022</p>
        </header>

        <RelativeCard title= "Relative" data={data} />
        <MedicalBox />
        <Footer />
      </div>
    </div>
  );
}

