import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import ClientLayout from "../../../components/ClientLayout";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">{greeting}, {user?.first_name} <span className="material-symbols-outlined" style={{ verticalAlign: 'bottom', fontSize: 'inherit' }}>waving_hand</span></h1>
        <p className="page-subtitle">Here's an overview of your account</p>
      </div>

      <div className="grid-auto dashboard-cards">
        {[
          { icon: "pi-wallet", label: "Current Balance", value: `${user?.balance?.toFixed(2)} MAD`, borderClass: "border-purple" },
          { icon: "pi-credit-card", label: "RIB", value: user?.rib, borderClass: "border-blue" },
          { icon: "pi-envelope", label: "Email", value: user?.email, borderClass: "border-green" },
          { icon: "pi-phone", label: "Phone", value: user?.phone, borderClass: "border-yellow" },
        ].map((card) => (
          <div key={card.label} className={`glass-card dashboard-card ${card.borderClass}`}>
            <i className={`pi ${card.icon} dashboard-card__icon`}></i>
            <p className="dashboard-card__label">{card.label}</p>
            <p className="dashboard-card__value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <h3 className="glass-card__title">Quick Actions</h3>
        <div className="quick-actions">
          {[
            { label: "Transfer Money", href: "/transfer", icon: "pi-arrow-right-arrow-left" },
            { label: "Request Deposit", href: "/deposit", icon: "pi-download" },
            { label: "Apply for Loan", href: "/loans", icon: "pi-building" },
            { label: "View Transactions", href: "/transactions", icon: "pi-list" },
          ].map((a) => (
            <Link key={a.label} to={a.href} className="btn btn--ghost">
              <i className={`pi ${a.icon}`}></i> {a.label}
            </Link>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
