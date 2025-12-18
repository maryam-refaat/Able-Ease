import React, { useState, useEffect } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { signupRelative } from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function RelativeSignUp() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const formRef = React.useRef(null);

  const baseApiUrl = "https://ableeaseapi.runasp.net/api";

  // Fetch patients with usernames
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const url = `${baseApiUrl}/patients/GetAllPatientsUsernamesRealtive`;
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`Failed to load patients: ${res.status}`);
        const json = await res.json();

        const arr = Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const mapped = arr
          .filter(Boolean)
          .map((p) => ({
            patientSSN: p.patientSSN || p.ssn || p.SSN || p.id,
            username: p.username || p.userName || "Unknown",
          }))
          .filter((x) => x.patientSSN && x.username);

        setPatients(mapped);
      } catch (e) {
        console.error("Failed to load patients:", e);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    setAgree(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("fullName"),
      patientSSN: formData.get("relationship"),
      address: formData.get("address"),
      email: formData.get("email"),
      contactInfo: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      gender: formData.get("gender"),
      birthDate: formData.get("birthDate"),
    };

    // Validation
    if (!data.name || data.name.trim().length < 3) {
      showAlert(
        "Please enter a valid full name (at least 3 characters)",
        "error"
      );
      return;
    }

    if (!data.patientSSN || data.patientSSN.trim().length < 2) {
      showAlert("Please enter your relationship to the patient", "error");
      return;
    }

    if (!data.address || data.address.trim().length < 5) {
      showAlert("Please enter a valid address", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!data.contactInfo || !phoneRegex.test(data.contactInfo)) {
      showAlert(
        "Please enter a valid phone number (at least 10 digits)",
        "error"
      );
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

    console.log("Form Data Submitted: ", data);

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await signupRelative(data);
      // localStorage.setItem("relativeToken", JSON.stringify(data));

      setIsSuccess(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isError) {
    return (
      <div className="form-box">
        <h2>Relative Sign Up</h2>
        <p className="error-text">
          {" "}
          An error occurred during signup. Please try again later.{" "}
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
          ✓ Your relative account has been created successfully.
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
        <button className="primary-btn" onClick={handleCloseSuccess}>
          OK
        </button>
      </div>
    );
  }

  return (
    <form className="form-box" onSubmit={handleSubmit} ref={formRef}>
      <h2>Relative Sign Up</h2>

      <div className="two-inputs">
        <input type="text" name="fullName" placeholder="Full Name" required />
        <select name="relationship" required>
          <option value="" disabled selected>
            {loadingPatients ? "Loading patients..." : "Select Patient"}
          </option>
          {patients.map((patient) => (
            <option key={patient.patientSSN} value={patient.patientSSN}>
              {patient.username}
            </option>
          ))}
        </select>
      </div>

      <div className="two-inputs">
        <input type="text" name="address" placeholder="Address" required />
        <select name="gender" required>
          <option value="" disabled selected>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="two-inputs">
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="phone" placeholder="Phone Number" required />
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
      <div className="two-inputs">
        <input type="date" name="birthDate" placeholder="Birth Date" required />
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
        />
        I agree to the privacy policy and terms
      </label>

      <button disabled={!agree} className="primary-btn" type="submit">
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </form>
  );
}
