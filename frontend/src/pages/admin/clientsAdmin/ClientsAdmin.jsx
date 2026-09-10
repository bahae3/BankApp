import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import AdminLayout from "../adminLayout/AdminLayout";
import { Button } from "primereact/button";

export default function ClientsAdmin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = () =>
    axiosClient.get("/admin/clients").then((r) => setClients(r.data)).finally(() => setLoading(false));

  useEffect(() => { fetchClients(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    await axiosClient.delete(`/admin/clients/${id}`);
    fetchClients();
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Clients</h1>
        <p className="admin-page-subtitle">{clients.length} registered clients</p>
      </div>
      <div className="admin-table-wrap">
        {loading ? (
          <div className="spinner-center">
            <div className="spinner spinner--admin" />
          </div>
        ) : clients.length === 0 ? (
          <p className="empty-state">No clients found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Balance (MAD)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.client_id}>
                    <td>#{c.client_id}</td>
                    <td style={{ fontWeight: 500 }}>{c.first_name} {c.last_name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td className="amount--credit">{c.balance.toFixed(2)}</td>
                    <td>
                      <Button 
                        id={`delete-client-${c.client_id}`}
                        icon="pi pi-trash" 
                        label="Delete" 
                        className="btn btn--danger p-button-sm" 
                        onClick={() => handleDelete(c.client_id, `${c.first_name} ${c.last_name}`)} 
                      />
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
