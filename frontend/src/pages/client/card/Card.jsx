import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import ClientLayout from "../../../components/ClientLayout";
import "./Card.css";

export default function Card() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    axiosClient.get("/client/card").then((r) => setCard(r.data)).finally(() => setLoading(false));
  }, []);

  const formatCardNumber = (n) => n?.toString().replace(/(\d{4})(?=\d)/g, "$1 ") || "•••• •••• •••• ••••";

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">My Card</h1>
        <p className="page-subtitle">Your virtual bank card</p>
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : !card ? (
        <p className="empty-state">No card found.</p>
      ) : (
        <div className="card-container">
          <div
            className={`virtual-card ${flipped ? "virtual-card--flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="virtual-card__front">
              <div className="virtual-card__header">
                <span className="virtual-card__brand">BankApp</span>
                <i className="pi pi-credit-card virtual-card__chip"></i>
              </div>
              <div>
                <p className="virtual-card__number">
                  {formatCardNumber(card.number)}
                </p>
                <p className="virtual-card__expiry">Expires {card.expiration_date}</p>
              </div>
            </div>
            
            <div className="virtual-card__back">
              <div className="virtual-card__cvc-box">
                <p className="virtual-card__cvc-label">CVC</p>
                <p className="virtual-card__cvc-value">{card.cvc_code}</p>
              </div>
              <p className="virtual-card__back-hint">Click to flip back</p>
            </div>
          </div>
          <p className="card-hint">Click the card to reveal the CVC code.</p>
        </div>
      )}
    </ClientLayout>
  );
}
