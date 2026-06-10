import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
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
      <div className="auth-card auth-card--wide">
        <div className="auth-logo">
          <i className="pi pi-building-columns logo-icon"></i>
          <h1>BankApp</h1>
        </div>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Start banking smarter today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          <div className="form-group">
            <label htmlFor="signup-fname">First Name</label>
            <input id="signup-fname" type="text" name="first_name" placeholder="John"
              value={form.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="signup-lname">Last Name</label>
            <input id="signup-lname" type="text" name="last_name" placeholder="Doe"
              value={form.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="signup-phone">Phone</label>
            <input id="signup-phone" type="tel" name="phone" placeholder="+213..."
              value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group form-group--full">
            <label htmlFor="signup-address">Address</label>
            <input id="signup-address" type="text" name="address" placeholder="123 Main St"
              value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group">
              {["Man", "Woman"].map((g) => (
                <label key={g} className="radio-label">
                  <input type="radio" name="gender" value={g}
                    checked={form.gender === g} onChange={handleChange} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <button id="signup-submit" type="submit" className="auth-btn form-group--full" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
