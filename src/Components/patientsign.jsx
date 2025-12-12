// src/pages/PatientSignUp.jsx
import React, { useState } from "react";
import "../Components/signup.css";
import { useNavigate } from "react-router-dom";
// import { signupPatient } from "../assets/api"; // uncomment when API exists

export default function PatientSignUp() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);

    const formData = new FormData(e.target);
   

    const data = {
      
      fullName:formData.get("fullName")?.trim() ,
      address: formData.get("address")?.trim(),

      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      birthDate: formData.get("birthDate"), // yyyy-mm-dd from <input type="date">
      gender: formData.get("gender")?.trim(),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Basic validation
     if (!data.fullName || data.fullName.split(" ").filter(Boolean).length < 2) {
  alert("Please enter your full name (first and last name).");
  return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!data.address || data.address.length < 3) {
      alert("Please enter a valid address.");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/; // allow international formatting, min 7 chars
    if (!data.phone || !phoneRegex.test(data.phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!data.birthDate) {
      alert("Please select your birth date");
      return;
    }

    // age check (optional) — ensures date is reasonable and age <= 120
    const birth = new Date(data.birthDate);
    if (isNaN(birth.getTime())) {
      alert("Invalid birth date");
      return;
    }
    const age = new Date().getFullYear() - birth.getFullYear() -
      (new Date().getMonth() < birth.getMonth() ||
       (new Date().getMonth() === birth.getMonth() && new Date().getDate() < birth.getDate()) ? 1 : 0);
    if (age < 0 || age > 120) {
      alert("Please enter a realistic birth date");
      return;
    }

    if (!data.gender || data.gender.length < 1) {
      alert("Please enter your gender");
      return;
    }

    if (!data.password || data.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agree) {
      alert("Please accept the privacy & policy terms");
      return;
    }

    console.log("Patient sign-up payload:", data);

    try {
      setIsLoading(true);

      // simulate call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Example: call real API (uncomment and adapt)
      // const res = await signupPatient(data);
      // if (res?.error) throw new Error(res.error);

      // On success, navigate to profile or show success message.
      // Pass the created patient data (or token) via state if desired.
      navigate("/patient-profile", { state: { patientData: data } });
    } catch (err) {
      console.error("Signup error:", err);
      setIsError(true);
      alert("An error occurred while signing up. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <form className="form-box" onSubmit={handleSubmit}>
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
        <input type="date" name="birthDate" placeholder="Birth Date" required />
        <input type="text" name="gender" placeholder="Gender" required />
      </div>

      <div className="two-inputs">
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree((v) => !v)}
        />
        <span>Accept privacy & policy terms</span>
      </label>

      <button disabled={!agree || isLoading} className="primary-btn" type="submit">
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
