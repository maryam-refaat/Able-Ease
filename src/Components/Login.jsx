import "./AuthForm.css";
import React, { useState } from "react";
import PatientSignUp from "./patientsign";
import OrganizationSignUp from "./organizationsign";
import PhysioCenterSignUp from "./therapysign";
import RelativeSignUp from "./relativesign";
import Modal from "./loginmodal";
import CaretakerSignUp from "./caretakersign";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../assets/apis";
const BASE_URL = "http://localhost:5174"; // example: https://myserver.com/api

const AuthForm = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const renderForm = () => {
    switch (type) {
      case "patient":
        return <PatientSignUp />;
      case "caretaker":
        return <CaretakerSignUp />;
      case "relative":
        return <RelativeSignUp />;
      case "organization":
        return <OrganizationSignUp />;
      case "physio":
        return <PhysioCenterSignUp />;
      default:
        return null;
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
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validation
    if (!data.email || data.email.trim().length < 3) {
      alert("Please enter a valid email");
      return;
    }

    if (!data.password || data.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    console.log("Login Data Submitted: ", data);

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Replace with actual login API call
      const response = await loginAPI(data);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("ssn", response.ssn);

      let url = "";

      if (response.role == "Organization") {
        url = "/organization-profile";
      } else if (response.role == "Relative") {
        url = "/relative-profile";
      }

      navigate(url);
    } catch (error) {
      console.error("Error during login:", error);
      setIsError(true);
      alert("Login failed. Please try again.");
    } finally {
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
          <input type="text" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <a href="#" className="forgot-password">
            Forgot Password
          </a>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* POPUP */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>{renderForm()}</Modal>
      )}
    </div>
  );
};

export default AuthForm;