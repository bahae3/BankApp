import { useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pendingScrollable, setPendingScrollable] = useState(false);
  const [historyScrollable, setHistoryScrollable] = useState(false);
  const pendingListRef = useRef(null);
  const historyListRef = useRef(null);

  const fetchPending = useCallback(() => {
    setLoadingPending(true);
    axiosClient
      .get("/client/deposits")
      .then((r) => setPendingDeposits(r.data))
      .catch(() => setPendingDeposits([]))
      .finally(() => setLoadingPending(false));
  }, []);

  const fetchHistory = useCallback(() => {
    setLoadingHistory(true);
    axiosClient
      .get("/client/deposits/history")
      .then((r) => setDepositHistory(r.data))
      .catch(() => setDepositHistory([]))
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    fetchPending();
    fetchHistory();
  }, [fetchPending, fetchHistory]);

  // Detect whether each list overflows (to show the fade gradient)
  const checkScrollable = (ref, setter) => {
    if (ref.current) {
      setter(ref.current.scrollHeight > ref.current.clientHeight);
    }
  };

  useEffect(() => {
    checkScrollable(pendingListRef, setPendingScrollable);
  }, [pendingDeposits]);

  useEffect(() => {
    checkScrollable(historyListRef, setHistoryScrollable);
  }, [depositHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await axiosClient.post("/client/deposit", { amount: parseFloat(amount) });
      setSuccess("Deposit request submitted! Awaiting admin approval.");
      setAmount("");
      // Refresh the pending list after submitting
      fetchPending();
    } catch (err) {
      setError(err.response?.data?.error || "Deposit request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Deposit</h1>
        <p className="page-subtitle">Request a deposit and track its status</p>
      </div>

      <div className="deposit-grid">

        {/* ── Card 1: Request form ─────────────────────────────── */}
        <div className="glass-card deposit-form-card">
          <h3 className="glass-card__title">
            <i className="pi pi-download" style={{ marginRight: "0.5rem", color: "var(--color-primary-light)" }}></i>
            Request Deposit
          </h3>

          {error   && <div className="alert alert--error"><i className="pi pi-exclamation-circle"></i> {error}</div>}
          {success && <div className="alert alert--success"><i className="pi pi-check-circle"></i> {success}</div>}

          <form onSubmit={handleSubmit} className="inner-form">
            <div className="form-field">
              <label htmlFor="deposit-amount" className="form-field__label">Amount (MAD)</label>
              <InputText
                id="deposit-amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="form-field__input"
              />
            </div>
            <Button
              id="deposit-submit"
              type="submit"
              label="Submit Deposit Request"
              icon="pi pi-download"
              className="btn btn--primary btn--full"
              loading={loading}
            />
          </form>

          <div className="alert alert--info" style={{ marginTop: "1.25rem" }}>
            <i className="pi pi-info-circle"></i>
            <p style={{ margin: 0 }}>
              Deposits are reviewed by a bank administrator. Funds will be credited once approved.
            </p>
          </div>
        </div>

        {/* ── Card 2: Pending requests ──────────────────────────── */}
        <div className="glass-card">
          <h3 className="glass-card__title">
            <i className="pi pi-clock" style={{ marginRight: "0.5rem", color: "var(--color-warning)" }}></i>
            Pending Requests
          </h3>

          {loadingPending ? (
            <div className="spinner-center"><div className="spinner" /></div>
          ) : pendingDeposits.length === 0 ? (
            <div className="deposit-empty">
              <i className="pi pi-check-circle deposit-empty__icon deposit-empty__icon--success"></i>
              <p>No pending requests.</p>
            </div>
          ) : (
            <div className={`deposit-list-wrapper ${pendingScrollable ? "is-scrollable" : ""}`}>
              <div className="deposit-list" ref={pendingListRef}>
                {pendingDeposits.map((d) => (
                  <div key={d.id} className="deposit-item deposit-item--pending">
                    <div className="deposit-item__left">
                      <i className="pi pi-clock deposit-item__icon"></i>
                      <div>
                        <p className="deposit-item__amount">{d.amount.toFixed(2)} MAD</p>
                        <p className="deposit-item__label">Awaiting approval</p>
                      </div>
                    </div>
                    <span className="badge badge--yellow">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Card 3: Deposit history ───────────────────────────── */}
        <div className="glass-card">
          <h3 className="glass-card__title">
            <i className="pi pi-history" style={{ marginRight: "0.5rem", color: "var(--color-success)" }}></i>
            Approved Deposits
          </h3>

          {loadingHistory ? (
            <div className="spinner-center"><div className="spinner" /></div>
          ) : depositHistory.length === 0 ? (
            <div className="deposit-empty">
              <i className="pi pi-inbox deposit-empty__icon"></i>
              <p>No approved deposits yet.</p>
            </div>
          ) : (
            <div className={`deposit-list-wrapper ${historyScrollable ? "is-scrollable" : ""}`}>
              <div className="deposit-list" ref={historyListRef}>
                {depositHistory.map((tx) => (
                  <div key={tx.transaction_id} className="deposit-item deposit-item--approved">
                    <div className="deposit-item__left">
                      <i className="pi pi-check-circle deposit-item__icon"></i>
                      <div>
                        <p className="deposit-item__amount amount--credit">+{tx.amount.toFixed(2)} MAD</p>
                        <p className="deposit-item__label">{tx.date}</p>
                      </div>
                    </div>
                    <span className="badge badge--green">Approved</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </ClientLayout>
  );
}
