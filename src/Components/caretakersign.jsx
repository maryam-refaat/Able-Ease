import React, { useState } from "react";
import "../Components/signup.css";

export default function CaretakerSignUp() {
  const [agree, setAgree] = useState(false);

  return (
    <form className="form-box">
      <h2>Caretaker Sign Up</h2>

      <div className="two-inputs">
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="Email" />
      </div>

      <div className="two-inputs">
        <input type="text" placeholder="Address" />
        <input type="text" placeholder="Phone Number" />
      </div>

      <div className="two-inputs">
        <input type="password" placeholder="Password" />
        <input type="text" placeholder="Organization SSN" />
      </div>

      <div className="two-inputs">
        <input type="password" placeholder="Confirm Password" />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
        />
        <span>Accept privacy & policy terms</span>
      </label>

      <button disabled={!agree} className="primary-btn">
        Sign Up
      </button>
    </form>
  );
}
