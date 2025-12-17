import "./AuthForm.css";
import React, { useState } from "react";
import PatientSignUp from "./patientsign";
import OrganizationSignUp from "./organizationsign";
import PhysioCenterSignUp from "./therapysign";
import RelativeSignUp from "./relativesign";
import Modal from "./loginmodal";
import CaretakerSignUp from "./caretakersign";
import { useNavigate } from "react-router-dom";
import { loginAPI, forgotPassword } from "../assets/apis";
import { setAuthState } from "../context/AuthState";
const BASE_URL = "http://localhost:5174"; // example: https://myserver.com/api

const AuthForm = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
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
      // Support payload shape variations: sometimes server returns { data: {...} }
      const payload = response?.data ?? response ?? {};
      console.debug('Login response payload:', payload);
      const token = payload.token ?? payload.Token ?? payload.accessToken ?? response.token ?? response.Token ?? null;
      const ssn = payload.ssn ?? payload.SSN ?? payload.Ssn ?? response.ssn ?? null;
      const roleRaw = ((payload.role ?? payload.Role ?? response.role ?? response.Role ?? "") + "").toLowerCase();

      if (token) localStorage.setItem("authToken", token);
      if (ssn) localStorage.setItem("ssn", ssn);

      // also extract username / email if provided by backend
      const username = payload.username ?? payload.Username ?? payload.userName ?? payload.UserName ?? payload.Email ?? payload.Email ?? null;
      const email = payload.email ?? payload.Email ?? null;
      const name = payload.name ?? payload.Name ?? null;

      // Normalize role to a consistent userType
      const userTypeMap = {
        organization: "organization",
        relative: "relative",
        caregiver: "caregiver",
        caretaker: "caretaker",
        physiotherapycenter: "therapyCenter",
        patient: "patient",
        admin: "admin",
      };
      const userType = userTypeMap[roleRaw] || null;

      // Persist unified auth state and notify listeners
      setAuthState({ isLoggedIn: true, userType, ssn, username, email, name });
      // ensure storage flags exist and notify listeners
      localStorage.setItem('auth.isLoggedIn', 'true');
      if (userType) localStorage.setItem('auth.userType', userType);
      window.dispatchEvent(new CustomEvent('auth-changed'));
      console.log('Login successful - userType:', userType, 'username:', username, 'email:', email);

      let url = "/";
      if (roleRaw === 'organization') url = "/organization-profile";
      else if (roleRaw === 'relative') url = "/relative-profile";
      else if (roleRaw === 'caregiver') url = "/caregiver-profile";
      else if (roleRaw === 'center' || roleRaw === 'physiotherapycenter') url = "/center-profile";
      else if (roleRaw === 'patient') url = "/patient-profile";
      else if (roleRaw === 'admin') url = "/admin-profile";

      navigate(url);
    } catch (error) {
      console.error("Error during login:", error);
      setIsError(true);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();

    if (!forgotEmail || !forgotEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(forgotEmail);
      alert("Password reset email sent! Please check your email inbox.");
      setForgotPasswordModal(false);
      setForgotEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Failed to send reset email. Please try again.");
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
          <a
            href="#"
            className="forgot-password"
            onClick={(e) => {
              e.preventDefault();
              setForgotPasswordModal(true);
            }}
          >
            Forgot Password
          </a>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotPasswordModal && (
        <Modal onClose={() => setForgotPasswordModal(false)}>
          <div style={{ padding: "20px" }}>
            <h3>Reset Password</h3>
            <p style={{ marginBottom: "20px", color: "#6b7280" }}>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "6px",
                  border: "1px solid #e6eef8",
                  fontSize: "14px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "1px solid #e6eef8",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#1f73ff",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* SIGNUP MODAL */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>{renderForm()}</Modal>
      )}
    </div>
  );
};

export default AuthForm;