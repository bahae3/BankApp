import { useEffect, useState, useRef } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./Transfer.css";

export default function Transfer() {
  const [benefs, setBenefs] = useState([]);
  const [form, setForm] = useState({ beneficiary_client_id: null, amount: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axiosClient.get("/client/beneficiaries").then((r) => setBenefs(r.data));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectBenef = (benef) => {
    setForm({ ...form, beneficiary_client_id: benef });
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await axiosClient.post("/client/transfer", {
        ...form,
        amount: parseFloat(form.amount),
        beneficiary_client_id: form.beneficiary_client_id.beneficiary_id,
      });
      setSuccess("Transfer completed successfully!");
      setForm({ beneficiary_client_id: null, amount: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  const selected = form.beneficiary_client_id;

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Transfer Money</h1>
        <p className="page-subtitle">Send money to your beneficiaries</p>
      </div>

      <div className="glass-card" style={{ maxWidth: "32.5rem" }}>
        {error   && <div className="alert alert--error"><i className="pi pi-exclamation-circle"></i> {error}</div>}
        {success && <div className="alert alert--success"><i className="pi pi-check-circle"></i> {success}</div>}

        <form onSubmit={handleSubmit} className="inner-form">

          {/* ── Custom Recipient Dropdown ───────────────────────── */}
          <div className="form-field">
            <label className="form-field__label">Recipient</label>

            <div className="benef-dropdown" ref={dropdownRef}>
              {/* Trigger button */}
              <button
                id="transfer-benef"
                type="button"
                className={`benef-dropdown__trigger ${dropdownOpen ? "benef-dropdown__trigger--open" : ""} ${!selected ? "benef-dropdown__trigger--placeholder" : ""}`}
                onClick={() => setDropdownOpen((o) => !o)}
                disabled={benefs.length === 0}
              >
                {selected ? (
                  <span className="benef-dropdown__selected">
                    <span className="benef-dropdown__avatar">
                      {selected.first_name?.[0]}{selected.last_name?.[0]}
                    </span>
                    <span className="benef-dropdown__info">
                      <span className="benef-dropdown__name">{selected.first_name} {selected.last_name}</span>
                      <span className="benef-dropdown__rib">RIB: {selected.rib}</span>
                    </span>
                  </span>
                ) : (
                  <span>{benefs.length === 0 ? "No beneficiaries added yet" : "— Select a recipient —"}</span>
                )}
                <i className={`pi ${dropdownOpen ? "pi-chevron-up" : "pi-chevron-down"} benef-dropdown__chevron`}></i>
              </button>

              {/* Options panel */}
              {dropdownOpen && benefs.length > 0 && (
                <div className="benef-dropdown__panel">
                  {benefs.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`benef-dropdown__option ${selected?.id === b.id ? "benef-dropdown__option--active" : ""}`}
                      onClick={() => handleSelectBenef(b)}
                    >
                      <span className="benef-dropdown__avatar benef-dropdown__avatar--sm">
                        {b.first_name?.[0]}{b.last_name?.[0]}
                      </span>
                      <span className="benef-dropdown__info">
                        <span className="benef-dropdown__name">{b.first_name} {b.last_name}</span>
                        <span className="benef-dropdown__rib">RIB: {b.rib}</span>
                      </span>
                      {selected?.id === b.id && <i className="pi pi-check benef-dropdown__check"></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {benefs.length === 0 && (
              <p className="form-hint">
                <i className="pi pi-info-circle"></i> Go to <strong>Beneficiaries</strong> to add recipients first.
              </p>
            )}
          </div>

          {/* ── Amount ─────────────────────────────────────────── */}
          <div className="form-field">
            <label htmlFor="transfer-amount" className="form-field__label">Amount (MAD)</label>
            <InputText
              id="transfer-amount"
              type="number"
              name="amount"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="form-field__input"
            />
          </div>

          {/* ── Description ─────────────────────────────────────── */}
          <div className="form-field">
            <label htmlFor="transfer-desc" className="form-field__label">Description</label>
            <InputText
              id="transfer-desc"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Rent payment"
              className="form-field__input"
            />
          </div>

          <Button
            id="transfer-submit"
            type="submit"
            label="Send Money"
            icon="pi pi-arrow-right"
            className="btn btn--primary btn--full"
            disabled={!form.beneficiary_client_id || loading}
            loading={loading}
          />
        </form>
      </div>
    </ClientLayout>
  );
}
