import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../assets/apis";
import "./Landpage.css";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";
import { Outlet } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get token and email from URL query parameters
    // searchParams.get() automatically decodes URL-encoded values
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    // No need to decode again - searchParams.get() already does it
    setToken(tokenParam);
    setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email, token, newPassword);
      showAlert(
        "Password reset successful! You can now login with your new password.",
        "success"
      );
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        "Failed to reset password. The link may have expired. Please request a new one."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error && (!token || !email)) {
    return (
      <>
       <Outlet/>
      <div
       
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          background: "#f9fafb",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#dc3545", marginBottom: "20px" }}>
            Invalid Link
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>{error}</p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              background: "#1f73ff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go to Login
          </button>
        </div>
      </div></>
    );
  }

  return (
    <><Outlet />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          maxWidth: "450px",
          width: "100%",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#1f2937" }}>
          Reset Your Password
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "30px", fontSize: "14px" }}>
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #e6eef8",
                fontSize: "14px",
                background: "#f3f4f6",
                color: "#6b7280",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #e6eef8",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #e6eef8",
                fontSize: "14px",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                background: "#fef2f2",
                color: "#dc3545",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: isLoading ? "#9ca3af" : "#1f73ff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
              marginBottom: "15px",
            }}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: "#6b7280",
              border: "1px solid #e6eef8",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back to Login
          </button>
        </form>
      </div>

      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </div></>
  );
}
