import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import AdminLayout from "../adminLayout/AdminLayout";
import { Button } from "primereact/button";

export default function LoanRequestsAdmin() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () =>
    axiosClient.get("/admin/loans").then((r) => setLoans(r.data)).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handle = async (id, action) => {
    await axiosClient.post(`/admin/loans/${id}/${action}`);
    fetch();
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Loan Requests</h1>
        <p className="admin-page-subtitle">{loans.length} total requests</p>
      </div>
      <div className="admin-table-wrap">
        {loading ? (
          <div className="spinner-center">
            <div className="spinner spinner--admin" />
          </div>
        ) : loans.length === 0 ? (
          <p className="empty-state">
            <i className="pi pi-check-circle" style={{ fontSize: "2rem", color: "var(--color-success)", marginBottom: "var(--space-3)", display: "block" }}></i>
            No loan requests.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount (DZD)</th>
                  <th>Term</th>
                  <th>Monthly</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 500 }}>{l.client.first_name} {l.client.last_name}</td>
                    <td style={{ fontWeight: 600, color: "var(--color-warning)" }}>{l.amount.toFixed(2)}</td>
                    <td>{l.term} months</td>
                    <td>{l.monthly_return_amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${l.accepted ? "badge--green" : "badge--yellow"}`}>
                        {l.accepted ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        {!l.accepted && (
                          <>
                            <Button 
                              id={`accept-loan-${l.id}`} 
                              icon="pi pi-check" 
                              label="Accept" 
                              className="btn btn--success p-button-sm" 
                              onClick={() => handle(l.id, "accept")} 
                            />
                            <Button 
                              id={`reject-loan-${l.id}`} 
                              icon="pi pi-times" 
                              label="Reject" 
                              className="btn btn--danger p-button-sm" 
                              onClick={() => handle(l.id, "reject")} 
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
