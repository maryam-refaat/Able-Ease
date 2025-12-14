import './AuthForm.css'; 
import React, { useState } from 'react';
import PatientSignUp from './patientsign';
import OrganizationSignUp from './organizationsign';
import PhysioCenterSignUp from './therapysign';
import RelativeSignUp from './relativesign';
import Modal from "./modal";
import CaretakerSignUp from './caretakersign';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loginType, setLoginType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const renderForm = () => {
    switch (type) {
      case "patient": return <PatientSignUp />;
      case "caretaker": return <CaretakerSignUp/>;
      case "relative": return <RelativeSignUp />;
      case "organization": return <OrganizationSignUp />;
      case "physio": return <PhysioCenterSignUp />;
      default: return null;
    }
  };

  const openSignup = (value) => {
    setType(value);
    setOpenModal(true);
  };

  async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);

    const data = {
      loginType: loginType,
      username: formData.get('username'),
      password: formData.get('password')
    };

    // Validation
    if (!loginType) {
      alert("Please select a login type");
      return;
    }

    if (!data.username || data.username.trim().length < 3) {
      alert("Please enter a valid username");
      return;
    }

    if (!data.password || data.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    console.log("Login Data Submitted: ", data);
    
    try {
      setIsLoading(true);

      // TODO: REMOVE WHEN API IS CONNECTED - simulate login delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: UNCOMMENT AND USE REAL API WHEN CONNECTED
      // const response = await loginAPI(data);
      // localStorage.setItem("authToken", response.token);
      // localStorage.setItem("patientSSN", response.user.ssn);
      // localStorage.setItem("userSSN", response.user.ssn);
      // localStorage.setItem("patientName", response.user.fullName);
      // localStorage.setItem("patientData", JSON.stringify(response.user));
      
      // TODO: REMOVE WHEN API IS CONNECTED - Store demo patient data (HANDLED BY API)
      if (loginType === "patient") {
        localStorage.setItem("patientSSN", "demo-patient-ssn-123"); // HANDLED BY API
        localStorage.setItem("userSSN", "demo-patient-ssn-123"); // HANDLED BY API
        localStorage.setItem("patientName", data.username); // HANDLED BY API
      }
      
      // Navigate based on login type
      switch(loginType) {
        case "patient":
          navigate("/patient-profile");
          break;
        case "relative":
          navigate("/relative-profile");
          break;
        case "caretaker":
          navigate("/caretaker-profile");
          break;
        case "organization":
          navigate("/organization-profile");
          break;
        case "physio":
          navigate("/physio-profile");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsError(true);
      alert("Login failed. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        <select
          aria-label="Select Type"
          onChange={(e) => openSignup(e.target.value)}
        >
          <option value="">Join as:</option>
          <option value="patient">Patient</option>
          <option value="relative">Relative</option>
          <option value="caretaker">Care Taker</option>
          <option value="organization">Organization</option>
          <option value="physio">Physiotherapy Center</option>
        </select>
      </div>

      {/* LOGIN BOX */}
      <div className="login-box">
        <h3>Already registered?</h3>
        <form onSubmit={handleLogin}>
          <select 
            aria-label="Select Login Type"
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
            required
          >
            <option value="">Login as:</option>
            <option value="patient">Patient</option>
            <option value="relative">Relative</option>
            <option value="caretaker">Care Taker</option>
            <option value="organization">Organization</option>
            <option value="physio">Physiotherapy Center</option>
          </select>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <a href="#" className="forgot-password">Forgot Password</a>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* POPUP */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          {renderForm()}
        </Modal>
      )}
    </div>
  );
};

export default AuthForm;
