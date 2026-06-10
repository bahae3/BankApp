import { useAuth } from "../../../context/AuthContext";
import ClientLayout from "../../../components/ClientLayout";
import "./Balance.css";

export default function Balance() {
  const { user } = useAuth();

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Balance</h1>
        <p className="page-subtitle">Your current account balance</p>
      </div>
      <div className="balance-cards">
        <div className="glass-card balance-card balance-card--primary">
          <p className="balance-card__label">Available Balance</p>
          <p className="balance-card__value">
            {user?.balance?.toFixed(2)} <span className="balance-card__currency">DZD</span>
          </p>
        </div>
        <div className="glass-card balance-card balance-card--secondary">
          <p className="balance-card__label">Account RIB</p>
          <p className="balance-card__value">{user?.rib}</p>
        </div>
      </div>
    </ClientLayout>
  );
}
