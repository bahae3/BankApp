import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import AdminLayout from "../adminLayout/AdminLayout";
import { Button } from "primereact/button";

export default function DepositsAdmin() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () =>
    axiosClient.get("/admin/deposits").then((r) => setDeposits(r.data)).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handle = async (id, action) => {
    await axiosClient.post(`/admin/deposits/${id}/${action}`);
    fetch();
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Pending Deposits</h1>
        <p className="admin-page-subtitle">{deposits.length} pending requests</p>
      </div>
      <div className="admin-table-wrap">
        {loading ? (
          <div className="spinner-center">
            <div className="spinner spinner--admin" />
          </div>
        ) : deposits.length === 0 ? (
          <p className="empty-state">
            <i className="pi pi-check-circle" style={{ fontSize: "2rem", color: "var(--color-success)", marginBottom: "var(--space-3)", display: "block" }}></i>
            No pending deposits.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Amount (DZD)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.client.first_name} {d.client.last_name}</td>
                    <td>{d.client.email}</td>
                    <td className="amount--credit">{d.amount.toFixed(2)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        <Button 
                          id={`accept-deposit-${d.id}`} 
                          icon="pi pi-check" 
                          label="Accept" 
                          className="btn btn--success p-button-sm" 
                          onClick={() => handle(d.id, "accept")} 
                        />
                        <Button 
                          id={`reject-deposit-${d.id}`} 
                          icon="pi pi-times" 
                          label="Reject" 
                          className="btn btn--danger p-button-sm" 
                          onClick={() => handle(d.id, "reject")} 
                        />
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
