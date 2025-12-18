import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminExists, registerUser } from "../assets/apis";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function AdminSetup() {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    confirm: "",
    phone: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await adminExists();
      if (!mounted) return;
      setExists(Boolean(res?.exists));
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const submit = async () => {
    if (!form.username || !form.email || !form.password)
      return showAlert("username, email and password required", "error");
    if (form.password !== form.confirm)
      return showAlert("Passwords do not match", "error");

    try {
      const payload = {
        Name: form.name,
        Role: "Admin",
        Username: form.username,
        Email: form.email,
        Password: form.password,
        ConfirmPassword: form.confirm,
        PhoneNumber: form.phone,
      };
      const res = await registerUser(payload);
      showAlert("Admin account created. You can now log in.", "success");
      setMessage("Admin account created. You can now log in.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      console.error("Admin setup failed", err);
      const errorMsg = err.message || err;
      showAlert("Admin setup failed: " + errorMsg, "error");
      setMessage("Admin setup failed: " + errorMsg);
    }
  };

  if (loading) return <div>Checking system ...</div>;

  if (exists)
    return (
      <div className="page-container">
        <h2>Admin setup not available</h2>
        <p>
          An administrator account already exists. If you are the admin, please{" "}
          <Link to="/login">log in</Link>.
        </p>
      </div>
    );

  return (
    <div className="page-container">
      <h2>Initial Admin Setup</h2>
      <p>
        Create the first admin account for this installation. This action is
        allowed only once.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          placeholder="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          placeholder="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="confirm"
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <button
          className="btn"
          onClick={submit}
          style={{ background: "#059669", color: "white" }}
        >
          Create Admin
        </button>
      </div>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </div>
  );
}
