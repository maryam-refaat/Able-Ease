// src/pages/PatientSignUp.jsx
import React, { useState } from "react";
import "../Components/signup.css";
import { useNavigate } from "react-router-dom";
import { setAuthState } from "../context/AuthState";
import { signupPatient } from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function PatientSignUp() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = React.useRef(null);
  const { alertState, showAlert, closeAlert } = useAlert();

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    setAgree(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("fullName")?.trim(),
      address: formData.get("address")?.trim(),
      email: formData.get("email")?.trim(),
      birthDate: formData.get("birthDate"), // yyyy-mm-dd from <input type="date">
      contactInfo: formData.get("phone")?.trim(),
      type: "Patient",
      gender: formData.get("gender")?.trim(),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Basic validation
    if (!data.name || data.name.split(" ").filter(Boolean).length < 2) {
      showAlert("Please enter your full name (first and last name).", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    if (!data.address || data.address.length < 3) {
      showAlert("Please enter a valid address.", "error");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/; // allow international formatting, min 7 chars
    if (!data.contactInfo || !phoneRegex.test(data.contactInfo)) {
      showAlert("Please enter a valid phone number", "error");
      return;
    }

    if (!data.birthDate) {
      showAlert("Please select your birth date", "error");
      return;
    }

    // age check (optional) — ensures date is reasonable and age <= 120
    const birth = new Date(data.birthDate);
    if (isNaN(birth.getTime())) {
      showAlert("Invalid birth date", "error");
      return;
    }
    const age =
      new Date().getFullYear() -
      birth.getFullYear() -
      (new Date().getMonth() < birth.getMonth() ||
      (new Date().getMonth() === birth.getMonth() &&
        new Date().getDate() < birth.getDate())
        ? 1
        : 0);
    if (age < 0 || age > 120) {
      showAlert("Please enter a realistic birth date", "error");
      return;
    }

    if (!data.gender) {
      showAlert("Please select your gender", "error");
      return;
    }

    if (!data.password || data.password.length < 6) {
      showAlert("Password must be at least 6 characters long", "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    if (!agree) {
      showAlert("Please accept the privacy & policy terms", "error");
      return;
    }

    console.log("Patient sign-up payload:", data);

    setIsLoading(true);

    try {
      // Try to call the signup API
      const response = await signupPatient(data);
      console.log("API signup response:", response);

      // TODO: WHEN API IS CONNECTED, USE THIS LINE INSTEAD:
      // const userData = {
      //   role: "patient",
      //   ssn: response.data.ssn,
      //   name: response.data.name,
      //   email: response.data.email,
      //   // ... other data from API response
      // };
      // localStorage.setItem("userSSN", response.data.ssn);
      // login(userData);
    } catch (err) {
      console.error("Signup API error:", err);
      console.log("API not available - using demo storage for testing");
    }

    // TODO: REMOVE BELOW (Demo storage for testing) ==================
    // This allows signup to work even when API is not connected
    // const userData = {
    //   role: "patient",
    //   name: data.name,
    //   email: data.email,
    //   contactInfo: data.contactInfo,
    //   gender: data.gender,
    //   address: data.address,
    //   birthDate: data.birthDate,
    //   ssn: "demo-patient-ssn-123"
    // };

    // localStorage.setItem("userSSN", "demo-patient-ssn-123");
    // localStorage.setItem("patientName", data.name);
    // localStorage.setItem("patientEmail", data.email);
    // localStorage.setItem("patientPhone", data.contactInfo);
    // localStorage.setItem("patientGender", data.gender);
    // localStorage.setItem("patientAddress", data.address);
    // localStorage.setItem("patientBirthDate", data.birthDate);

    // login(userData);
    // TODO: END OF DEMO STORAGE ==========================================

    setIsLoading(false);
    setIsSuccess(true);
  }

  if (isError) {
    return (
      <div className="form-box">
        <h2>Patient Sign Up</h2>
        <p className="error-text">
          An error occurred during signup. Please try again later.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="form-box">
        <h2>Registration Successful!</h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#28a745",
            fontSize: "16px",
          }}
        >
          ✓ Your patient account has been created successfully.
        </p>
        <p
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "15px",
          }}
        >
          Please login with your credentials to access your account.
        </p>
        <button
          className="primary-btn"
          onClick={() => {
            setIsSuccess(false);
            if (formRef.current) formRef.current.reset();
          }}
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <>
      <form className="form-box" onSubmit={handleSubmit} ref={formRef}>
        <h2>Patient Sign Up</h2>

        <div className="two-inputs">
          <input type="text" name="fullName" placeholder="Full Name" required />
          <input type="text" name="address" placeholder="Address" required />
        </div>

        <div className="two-inputs">
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="phone" placeholder="Phone Number" required />
        </div>

        <div className="two-inputs">
          <input
            type="date"
            name="birthDate"
            placeholder="Birth Date"
            required
          />
          <select name="gender" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="two-inputs">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree((v) => !v)}
          />
          <span>Accept privacy & policy terms</span>
        </label>

        <button
          disabled={!agree || isLoading}
          className="primary-btn"
          type="submit"
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </>
  );
}
