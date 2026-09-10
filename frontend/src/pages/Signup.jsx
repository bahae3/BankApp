import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useTheme } from "../context/ThemeContext";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    first_name: "", last_name: "", gender: "Man",
    email: "", password: "", phone: "", address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosClient.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed.");
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
      <div className="auth-card auth-card--wide">
        <div className="auth-logo">
          <i className="pi pi-building-columns auth-logo__icon"></i>
          <h1 className="auth-logo__name">BankApp</h1>
        </div>
        <h2 className="auth-heading">Create your account</h2>
        <p className="auth-subtitle">Start banking smarter today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          <div className="auth-field">
            <label htmlFor="signup-fname" className="auth-field__label">First Name</label>
            <input id="signup-fname" type="text" name="first_name" placeholder="First Name"
              value={form.first_name} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-lname" className="auth-field__label">Last Name</label>
            <input id="signup-lname" type="text" name="last_name" placeholder="Last Name"
              value={form.last_name} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-field__label">Email</label>
            <input id="signup-email" type="email" name="email" placeholder="email@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-phone" className="auth-field__label">Phone</label>
            <input id="signup-phone" type="tel" name="phone" placeholder="+212..."
              value={form.phone} onChange={handleChange} required />
          </div>
          <div className="auth-field col-span-2">
            <label htmlFor="signup-address" className="auth-field__label">Address</label>
            <input id="signup-address" type="text" name="address" placeholder="Address"
              value={form.address} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password" className="auth-field__label">Password</label>
            <input id="signup-password" type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label className="auth-field__label">Gender</label>
            <div className="radio-group">
              {["Man", "Woman"].map((g) => (
                <label key={g} className="radio-group__option">
                  <input type="radio" name="gender" value={g}
                    checked={form.gender === g} onChange={handleChange} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <button id="signup-submit" type="submit" className="auth-submit col-span-2" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Create Account"}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
