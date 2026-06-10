import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export default function Transfer() {
  const [benefs, setBenefs] = useState([]);
  const [form, setForm] = useState({ beneficiary_client_id: null, amount: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient.get("/client/beneficiaries").then((r) => setBenefs(r.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await axiosClient.post("/client/transfer", {
        ...form,
        amount: parseFloat(form.amount),
        beneficiary_client_id: form.beneficiary_client_id.beneficiary_id
      });
      setSuccess("Transfer completed successfully!");
      setForm({ beneficiary_client_id: null, amount: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  const benefOptionTemplate = (option) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{option.first_name} {option.last_name}</span>
        <small style={{ color: 'var(--text-muted)' }}>RIB: {option.rib}</small>
      </div>
    );
  };

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Transfer Money</h1>
        <p className="page-subtitle">Send money to your beneficiaries</p>
      </div>
      <div className="glass-card" style={{ maxWidth: "32.5rem" }}>
        {error && <div className="alert alert--error"><i className="pi pi-exclamation-circle"></i> {error}</div>}
        {success && <div className="alert alert--success"><i className="pi pi-check-circle"></i> {success}</div>}
        <form onSubmit={handleSubmit} className="inner-form">
          <div className="form-field">
            <label htmlFor="transfer-benef" className="form-field__label">Recipient</label>
            <Dropdown 
              id="transfer-benef" 
              value={form.beneficiary_client_id} 
              onChange={(e) => setForm({ ...form, beneficiary_client_id: e.value })} 
              options={benefs} 
              optionLabel="first_name" 
              placeholder="— Select beneficiary —" 
              itemTemplate={benefOptionTemplate}
              valueTemplate={(val) => val ? `${val.first_name} ${val.last_name}` : "— Select beneficiary —"}
              className="w-full" 
              required 
            />
          </div>
          <div className="form-field">
            <label htmlFor="transfer-amount" className="form-field__label">Amount (DZD)</label>
            <InputText id="transfer-amount" type="number" name="amount" min="1" step="0.01"
              value={form.amount} onChange={handleChange} placeholder="0.00" required className="form-field__input" />
          </div>
          <div className="form-field">
            <label htmlFor="transfer-desc" className="form-field__label">Description</label>
            <InputText id="transfer-desc" type="text" name="description"
              value={form.description} onChange={handleChange} placeholder="e.g. Rent payment" className="form-field__input" />
          </div>
          <Button id="transfer-submit" type="submit" label="Send Money" icon="pi pi-arrow-right" className="btn btn--primary btn--full" disabled={!form.beneficiary_client_id || loading} loading={loading} />
        </form>
        {benefs.length === 0 && <p className="card-hint" style={{ marginTop: "1rem" }}>Add beneficiaries first to enable transfers.</p>}
      </div>
    </ClientLayout>
  );
}
