import { Link } from "react-router-dom";
import AdminLayout from "../adminLayout/AdminLayout";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Admin Dashboard</h1>
        <p className="admin-page-subtitle">Manage clients, deposits, and loan requests</p>
      </div>
      <div className="admin-dashboard-cards">
        {[
          { icon: "pi-users", label: "Manage Clients", desc: "View and delete client accounts", href: "/admin/clients", colorClass: "border-blue" },
          { icon: "pi-download", label: "Pending Deposits", desc: "Approve or reject deposit requests", href: "/admin/deposits", colorClass: "border-green" },
          { icon: "pi-building", label: "Loan Requests", desc: "Review and action loan applications", href: "/admin/loans", colorClass: "border-yellow" },
        ].map((card) => (
          <Link key={card.label} to={card.href} className={`admin-dashboard-card ${card.colorClass}`}>
            <i className={`pi ${card.icon} admin-dashboard-card__icon`}></i>
            <p className="admin-dashboard-card__label">{card.label}</p>
            <p className="admin-dashboard-card__desc">{card.desc}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
