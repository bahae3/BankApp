import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./Loans.css";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ amount: "", months: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLoans = () => axiosClient.get("/client/loans").then((r) => setLoans(r.data));

  useEffect(() => { fetchLoans(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await axiosClient.post("/client/loans", { amount: parseFloat(form.amount), months: parseInt(form.months) });
      setSuccess("Loan request submitted! Awaiting admin approval.");
      setForm({ amount: "", months: "" });
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.error || "Loan request failed.");
    } finally {
      setLoading(false);
    }
  };

  const monthly = form.amount && form.months
    ? (parseFloat(form.amount) / parseInt(form.months)).toFixed(2)
    : null;

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Loans</h1>
        <p className="page-subtitle">Apply for a loan or view your active loans</p>
      </div>

      <div className="grid-2">
        {/* Form */}
        <div className="glass-card">
          <h3 className="glass-card__title">Apply for a Loan</h3>
          {error && <div className="alert alert--error"><i className="pi pi-exclamation-circle"></i> {error}</div>}
          {success && <div className="alert alert--success"><i className="pi pi-check-circle"></i> {success}</div>}
          <form onSubmit={handleSubmit} className="inner-form">
            <div className="form-field">
              <label htmlFor="loan-amount" className="form-field__label">Loan Amount (MAD)</label>
              <InputText id="loan-amount" type="number" name="amount" min="1" step="0.01"
                value={form.amount} onChange={handleChange} placeholder="0.00" required className="form-field__input" />
            </div>
            <div className="form-field">
              <label htmlFor="loan-months" className="form-field__label">Term (months)</label>
              <InputText id="loan-months" type="number" name="months" min="1" max="360"
                value={form.months} onChange={handleChange} placeholder="e.g. 24" required className="form-field__input" />
            </div>
            {monthly && (
              <div className="loan-preview">
                <p>
                  Monthly repayment: <strong>{monthly} MAD</strong> × {form.months} months
                </p>
              </div>
            )}
            <Button id="loan-submit" type="submit" label="Submit Loan Request" icon="pi pi-building" className="btn btn--primary btn--full" loading={loading} />
          </form>
        </div>

        {/* Active loans */}
        <div className="glass-card">
          <h3 className="glass-card__title">Active Loans</h3>
          {loans.length === 0 ? (
            <p className="empty-state">No active loans.</p>
          ) : (
            <div className="loan-list">
              {loans.map((l) => (
                <div key={l.id} className="loan-item">
                  <div className="loan-item__header">
                    <span className="loan-item__amount">{l.amount.toFixed(2)} MAD</span>
                    <span className="badge badge--green">Active</span>
                  </div>
                  <p className="loan-item__details">
                    {l.monthly_return_amount.toFixed(2)} MAD/month × {l.term} months
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
