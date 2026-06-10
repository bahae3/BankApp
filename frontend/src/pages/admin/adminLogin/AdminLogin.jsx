import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "../../auth.css";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(form.email, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper auth-wrapper--admin">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="pi pi-lock logo-icon"></i>
          <h1>Admin Portal</h1>
        </div>
        <h2>Secure Access</h2>
        <p className="auth-subtitle">Authorized personnel only</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input id="admin-email" type="email" name="email" placeholder="admin@bankapp.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button id="admin-login-submit" type="submit" className="auth-btn" disabled={loading}
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
            {loading ? <span className="btn-spinner" /> : "Access Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
