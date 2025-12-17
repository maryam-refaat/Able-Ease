import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { signupTherapy } from "../assets/apis";

export default function OrganizationSignUp() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = React.useRef(null);

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
    const password = formDataObj.get("password");
    const confirmPassword = formDataObj.get("confirmPassword");
    const image = formDataObj.get("image");

    // Validation
    if (!name || name.trim().length < 3) {
      alert("Please enter a valid therapy center name (at least 3 characters)");
      return;
    }

    if (!address || address.trim().length < 5) {
      alert("Please enter a valid address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!contactInfo || !phoneRegex.test(contactInfo)) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append("Name", name);
      submitFormData.append("Address", address);
      submitFormData.append("ContactInfo", contactInfo);
      submitFormData.append("Email", email);
      submitFormData.append("Password", password);
      submitFormData.append("ConfirmPassword", confirmPassword);
      submitFormData.append("Role", "Center");
      if (image && image.size > 0) {
        submitFormData.append("Image", image);
      }

      const response = await signupTherapy(submitFormData);
      console.log("Signup response:", response);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
          ✓ Your therapy center account has been created successfully.
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
      <h2>Therapy Center Sign Up</h2>

      <div className="two-inputs">
        <input type="text" name="name" placeholder="Center Name" required />
      </div>
      <div className="two-inputs">
        <input type="text" name="address" placeholder="Address" required />
      </div>

      <div className="two-inputs">
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="text"
          name="contactInfo"
          placeholder="Phone Number"
          required
        />
      </div>

      <div className="two-inputs">
        <input
          type="file"
          name="image"
          placeholder="Center Image"
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

      <button disabled={!agree} className="primary-btn" type="submit">
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
