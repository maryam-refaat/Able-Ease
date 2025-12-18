import React, { useState, useEffect } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { signupCaregiver } from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function CaretakerSignUp() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const formRef = React.useRef(null);

  const baseApiUrl = "https://localhost:7040/api";

  // Fetch organizations with usernames
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoadingOrgs(true);
      try {
        const url = `${baseApiUrl}/Organizations/GetAllOrganizationsUsernames`;
        const res = await fetch(url, { method: "GET" });
        if (!res.ok)
          throw new Error(`Failed to load organizations: ${res.status}`);
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
          .map((o) => ({
            ssn: o.ssn || o.SSN || o.id,
            username: o.username || o.userName || o.name || "Unknown",
          }))
          .filter((x) => x.ssn && x.username);

        setOrganizations(mapped);
      } catch (e) {
        console.error("Failed to load organizations:", e);
      } finally {
        setLoadingOrgs(false);
      }
    };
    fetchOrganizations();
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

    const formDataObj = new FormData(e.target);

    const name = formDataObj.get("name");
    const address = formDataObj.get("address");
    const contactInfo = formDataObj.get("contactInfo");
    const email = formDataObj.get("email");
    const gender = formDataObj.get("gender");
    const birthDate = formDataObj.get("birthDate");
    const organizationSSN = formDataObj.get("organizationSSN");
    const experience = formDataObj.get("experience");
    const password = formDataObj.get("password");
    const confirmPassword = formDataObj.get("confirmPassword");
    const image = formDataObj.get("image");

    // Validation
    if (!name || name.trim().length < 3) {
      showAlert("Please enter a valid name (at least 3 characters)", "error");
      return;
    }

    if (!address || address.trim().length < 5) {
      showAlert("Please enter a valid address", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!contactInfo || !phoneRegex.test(contactInfo)) {
      showAlert("Please enter a valid phone number", "error");
      return;
    }

    if (!gender) {
      showAlert("Please select your gender", "error");
      return;
    }

    if (!birthDate) {
      showAlert("Please enter your birth date", "error");
      return;
    }

    if (!organizationSSN) {
      showAlert("Please select an organization", "error");
      return;
    }

    if (!experience || experience.trim().length < 3) {
      showAlert("Please enter your experience", "error");
      return;
    }

    if (!password || password.length < 6) {
      showAlert("Password must be at least 6 characters long", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append("Name", name);
      submitFormData.append("Address", address);
      submitFormData.append("ContactInfo", contactInfo);
      submitFormData.append("Email", email);
      submitFormData.append("Gender", gender);
      submitFormData.append("BirthDate", birthDate);
      submitFormData.append("OrganizationSSN", organizationSSN);
      submitFormData.append("Experience", experience);
      submitFormData.append("Role", "Caregiver");
      submitFormData.append("Password", password);
      submitFormData.append("ConfirmPassword", confirmPassword);
      if (image && image.size > 0) {
        submitFormData.append("Image", image);
      }

      const response = await signupCaregiver(submitFormData);
      console.log("Signup response:", response);
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
        <h2>Caregiver Sign Up</h2>
        <p className="error-text">
          An error occurred during signup. Please try again later.
        </p>
        <button className="primary-btn" onClick={() => setIsError(false)}>
          Try Again
        </button>
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
          ✓ Your caregiver account has been created successfully.
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
      <h2>Caregiver Sign Up</h2>

      <div className="two-inputs">
        <input type="text" name="name" placeholder="Full Name" required />
        <input type="email" name="email" placeholder="Email" required />
      </div>

      <div className="two-inputs">
        <input type="text" name="address" placeholder="Address" required />
        <input
          type="text"
          name="contactInfo"
          placeholder="Phone Number"
          required
        />
      </div>

      <div className="two-inputs">
        <select name="gender" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="date" name="birthDate" placeholder="Birth Date" required />
      </div>

      <div className="two-inputs">
        <select name="organizationSSN" required disabled={loadingOrgs}>
          <option value="">
            {loadingOrgs ? "Loading organizations..." : "Select Organization"}
          </option>
          {organizations.map((org) => (
            <option key={org.ssn} value={org.ssn}>
              {org.username}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g., 5 years)"
          required
        />
      </div>

      <div className="two-inputs">
        <input
          type="file"
          name="image"
          placeholder="Profile Image"
          accept="image/*"
        />
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
          onChange={() => setAgree(!agree)}
        />
        I accept all service terms
      </label>

      <button
        disabled={!agree || loadingOrgs}
        className="primary-btn"
        type="submit"
      >
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
