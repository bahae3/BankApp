import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Auth.css";

export default function Login() {
  const { loginClient } = useAuth();
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
      await loginClient(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <button 
        onClick={toggleTheme} 
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', boxShadow: 'var(--shadow-card-sm)' }}
      >
        <i className={`pi ${theme === 'dark' ? 'pi-sun' : 'pi-moon'}`}></i>
      </button>
      <div className="auth-card">
        <div className="auth-logo">
          <i className="pi pi-building-columns auth-logo__icon"></i>
          <h1 className="auth-logo__name">BankApp</h1>
        </div>
        <h2 className="auth-heading">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-field__label">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password" className="auth-field__label">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button id="login-submit" type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <p><Link to="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Admin portal <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>arrow_forward</span></Link></p>
        </div>
      </div>
    </div>
  );
}
