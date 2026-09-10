import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Proxy Socket.IO through Vite so it's same-origin (no CORS, cookies work)
      "/socket.io": {
        target: "http://localhost:5000",
        changeOrigin: true,
        ws: true,          // ← upgrade HTTP → WebSocket
      },
    },
  },
});
