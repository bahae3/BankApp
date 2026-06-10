import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./Beneficiaries.css";

export default function Beneficiaries() {
  const [benefs, setBenefs] = useState([]);
  const [rib, setRib] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBenefs = () =>
    axiosClient.get("/client/beneficiaries").then((r) => setBenefs(r.data)).finally(() => setLoading(false));

  useEffect(() => { fetchBenefs(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await axiosClient.post("/client/beneficiaries", { rib });
      setSuccess("Beneficiary added successfully!");
      setRib("");
      fetchBenefs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add beneficiary.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this beneficiary?")) return;
    await axiosClient.delete(`/client/beneficiaries/${id}`);
    fetchBenefs();
  };

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Beneficiaries</h1>
        <p className="page-subtitle">Manage your trusted recipients</p>
      </div>

      <div className="grid-2">
        {/* Add form */}
        <div className="glass-card">
          <h3 className="glass-card__title">Add Beneficiary</h3>
          {error && <div className="alert alert--error"><i className="pi pi-exclamation-circle"></i> {error}</div>}
          {success && <div className="alert alert--success"><i className="pi pi-check-circle"></i> {success}</div>}
          <form onSubmit={handleAdd} className="inner-form">
            <div className="form-field">
              <label htmlFor="benef-rib" className="form-field__label">RIB (Account Number)</label>
              <InputText id="benef-rib" type="number" value={rib} onChange={(e) => setRib(e.target.value)} placeholder="16-digit RIB" required className="form-field__input" />
            </div>
            <Button id="add-benef-btn" type="submit" label="Add Beneficiary" icon="pi pi-user-plus" className="btn btn--primary" loading={submitting} />
          </form>
        </div>

        {/* List */}
        <div className="glass-card">
          <h3 className="glass-card__title">Your Beneficiaries</h3>
          {loading ? (
            <div className="spinner-center"><div className="spinner" /></div>
          ) : benefs.length === 0 ? (
            <p className="empty-state">No beneficiaries yet.</p>
          ) : (
            <div className="beneficiary-list">
              {benefs.map((b) => (
                <div key={b.id} className="beneficiary-item">
                  <div className="beneficiary-item__info">
                    <p className="beneficiary-item__name">{b.first_name} {b.last_name}</p>
                    <p className="beneficiary-item__rib">RIB: {b.rib}</p>
                  </div>
                  <Button 
                    id={`delete-benef-${b.id}`} 
                    icon="pi pi-trash" 
                    className="btn btn--danger p-button-rounded p-button-text p-button-danger" 
                    onClick={() => handleDelete(b.id)} 
                    aria-label="Remove"
                    tooltip="Remove Beneficiary"
                    tooltipOptions={{ position: 'top' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
