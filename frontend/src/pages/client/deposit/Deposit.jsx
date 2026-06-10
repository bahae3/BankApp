import { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await axiosClient.post("/client/deposit", { amount: parseFloat(amount) });
      setSuccess("Deposit request submitted! Awaiting admin approval.");
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.error || "Deposit request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Request Deposit</h1>
        <p className="page-subtitle">Submit a deposit request for admin approval</p>
      </div>
      <div className="glass-card" style={{ maxWidth: "27.5rem" }}>
        {error && <div className="alert alert--error"><i className="pi pi-exclamation-circle"></i> {error}</div>}
        {success && <div className="alert alert--success"><i className="pi pi-check-circle"></i> {success}</div>}
        <form onSubmit={handleSubmit} className="inner-form">
          <div className="form-field">
            <label htmlFor="deposit-amount" className="form-field__label">Amount (DZD)</label>
            <InputText id="deposit-amount" type="number" min="1" step="0.01" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required className="form-field__input" />
          </div>
          <Button id="deposit-submit" type="submit" label="Submit Deposit Request" icon="pi pi-download" className="btn btn--primary btn--full" loading={loading} />
        </form>
        <div className="alert alert--info" style={{ marginTop: "1.25rem" }}>
          <i className="pi pi-info-circle"></i>
          <p style={{ margin: 0 }}>Deposits are reviewed and approved by a bank administrator. Funds will be credited to your balance once approved.</p>
        </div>
      </div>
    </ClientLayout>
  );
}
