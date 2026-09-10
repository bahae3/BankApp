import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import "../../Auth.css";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      <button 
        onClick={toggleTheme} 
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', boxShadow: 'var(--shadow-card-sm)' }}
      >
        <i className={`pi ${theme === 'dark' ? 'pi-sun' : 'pi-moon'}`}></i>
      </button>
      <div className="auth-card">
        <div className="auth-logo">
          <i className="pi pi-lock auth-logo__icon"></i>
          <h1 className="auth-logo__name">Admin Portal</h1>
        </div>
        <h2 className="auth-heading">Secure Access</h2>
        <p className="auth-subtitle">Authorized personnel only</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="admin-email" className="auth-field__label">Admin Email</label>
            <input id="admin-email" type="email" name="email" placeholder="Email Address"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="admin-password" className="auth-field__label">Password</label>
            <input id="admin-password" type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button id="admin-login-submit" type="submit" className="auth-submit auth-submit--admin" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Access Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
