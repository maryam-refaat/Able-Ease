import React, { useState } from "react";
import "../components/signup.css";

export default function PhysioCenterSignUp() {
  const [agree, setAgree] = useState(false);

  return (
    <form className="form-box">
      <h2>Physiotherapy Center Sign Up</h2>

      <div className="two-inputs">
        <input type="text" placeholder="Center Name" />
        <input type="text" placeholder="License Number" />
      </div>
      <div className="two-inputs">
      <input type="text" placeholder="Location" />
      </div>

      <div className="two-inputs">
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Phone Number" />
      </div>

      <div className="two-inputs">
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
        />
        Accept platform policy
      </label>

      <button disabled={!agree} className="primary-btn">
        Sign Up
      </button>
    </form>
  );
}
