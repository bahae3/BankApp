import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/client/transactions")
      .then((r) => setTxs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const typeStyle = (type) => ({
    Transfer: "badge--blue",
    Deposit:  "badge--green",
    Loan:     "badge--yellow",
    Withdraw: "badge--red",
  }[type] || "badge--blue");

  const isDebit = (type) => type === "Transfer" || type === "Withdraw";

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">All your past transactions</p>
      </div>
      <div className="glass-card">
        {loading ? (
          <div className="spinner-center">
            <div className="spinner" />
          </div>
        ) : txs.length === 0 ? (
          <p className="empty-state">No transactions yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx.transaction_id}>
                    <td>{tx.date}</td>
                    <td>
                      <span className={`badge ${typeStyle(tx.transaction_type)}`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className={isDebit(tx.transaction_type) ? "amount--debit" : "amount--credit"}>
                      {isDebit(tx.transaction_type) ? "-" : "+"}
                      {tx.amount.toFixed(2)} MAD
                    </td>
                    <td style={{ color: "var(--text-subtle)" }}>{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
