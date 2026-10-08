import { useEffect, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

export const UseSocket = () => {
  const [socket, setsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket server:", WS_URL);
      setsocket(ws);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setsocket(null);
    };

    ws.onerror = (err) => {
      console.error("WebSocket connection error:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};