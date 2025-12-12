import React, { useState } from "react";
import "../components/signup.css";
import { useNavigate } from "react-router-dom";
import { signupRelative } from "../assets/api";

export default function RelativeSignUp() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);

    const data = {
      fullName: formData.get('fullName'),
      relationship: formData.get('relationship'),
      address: formData.get('address'),
      city: formData.get('city'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    // Validation
    if (!data.fullName || data.fullName.trim().length < 3) {
      alert("Please enter a valid full name (at least 3 characters)");
      return;
    }

    if (!data.relationship || data.relationship.trim().length < 2) {
      alert("Please enter your relationship to the patient");
      return;
    }

    if (!data.address || data.address.trim().length < 5) {
      alert("Please enter a valid address");
      return;
    }

    if (!data.city || data.city.trim().length < 2) {
      alert("Please enter a valid city");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      alert("Please enter a valid phone number (at least 10 digits)");
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

    console.log("Form Data Submitted: ", data);
    
    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      // const { value } = await signupRelative(data);
      // localStorage.setItem("relativeToken", JSON.stringify(data));
      
      navigate("/relative-profile", { state: { relativeData: data } });
    } catch (error) {
      console.error("Error during signup:", error);
      setIsError(true);
    }
    finally {
      setIsLoading(false);
    }
  }

  if(isError ) {
    return <div className="form-box"> 
      <h2>Relative Sign Up</h2>
      <p className="error-text"> An error occurred during signup. Please try again later. </p>
    </div>
  }

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h2>Relative Sign Up</h2>

      <div className="two-inputs">
        <input type="text" name="fullName" placeholder="Full Name" required />
        <input type="text" name="relationship" placeholder="Relationship to Patient" required />
      </div>

      <div className="two-inputs">
        <input type="text" name="address" placeholder="Address" required />
        <input type="text" name="city" placeholder="City" required />
      </div>

      <div className="two-inputs">
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="phone" placeholder="Phone Number" required />
      </div>

      <div className="two-inputs">
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
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
    </form>
  );
}
