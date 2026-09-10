import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function SocketProvider({ children, user, role, onBalanceUpdate }) {
  const socketRef = useRef(null);                     // ← inside component (fixes HMR warning)
  const onBalanceUpdateRef = useRef(onBalanceUpdate);
  useEffect(() => { onBalanceUpdateRef.current = onBalanceUpdate; }, [onBalanceUpdate]);

  useEffect(() => {
    if (!user || role !== "client") {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    if (socketRef.current) return;

    const socket = io("http://localhost:5000", {
      transports: ["polling"],  // threading mode: Werkzeug handles HTTP, not WS upgrades
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected. ID:", socket.id, "| client_id:", user.client_id);
    });

    socket.on("balance_updated", (data) => {
      // Filter: only apply if this event is for the current user
      if (data.client_id === user.client_id && onBalanceUpdateRef.current) {
        onBalanceUpdateRef.current(data.balance);
      }
    });

    socket.on("disconnect", (reason) => {
      console.warn("[Socket] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.client_id, role]); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}
