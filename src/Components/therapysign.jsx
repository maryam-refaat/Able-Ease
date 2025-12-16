import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";

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
    
    const formData = new FormData(e.target);

    const data = {
      organizationName: formData.get('organizationName'),
      managerName: formData.get('managerName'),
      address: formData.get('address'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      type: 'organization'
    };

    // Validation
    if (!data.organizationName || data.organizationName.trim().length < 3) {
      alert("Please enter a valid organization name (at least 3 characters)");
      return;
    }

    if (!data.managerName || data.managerName.trim().length < 3) {
      alert("Please enter a valid manager name (at least 3 characters)");
      return;
    }

    if (!data.address || data.address.trim().length < 5) {
      alert("Please enter a valid address");
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

      // TODO: Replace with actual API call
      // const { value } = await signup(data);

      
      setIsSuccess(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setIsError(true);
    }
    finally {
      setIsLoading(false);
    }
  }

  if(isError) {
    return <div className="form-box"> 
      <h2>Organization Sign Up</h2>
      <p className="error-text">An error occurred during signup. Please try again later.</p>
    </div>
  }

  if(isSuccess) {
    return <div className="form-box"> 
      <h2>Registration Successful!</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#28a745', fontSize: '16px' }}>
        ✓ Your organization account has been created successfully.
      </p>
      <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '15px' }}>
        Please login with your credentials to access your account.
      </p>
      <button 
        className="primary-btn" 
        onClick={handleCloseSuccess}
      >
        OK
      </button>
    </div>
  }

  return (
    <form className="form-box" onSubmit={handleSubmit} ref={formRef}>
      <h2>Organization Sign Up</h2>

      <div className="two-inputs">
        <input type="text" name="organizationName" placeholder="Organization Name" required />
        <input type="text" name="managerName" placeholder="Manager Name" required />
      </div>
      <div className="two-inputs">
        <input type="text" name="address" placeholder="Address" required />
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
        I accept all service terms
      </label>

      <button disabled={!agree} className="primary-btn" type="submit">
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}