import { useEffect, useState } from "react";

const getWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
};

export const UseSocket = () => {
  const [socket, setsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = getWsUrl();
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server:", wsUrl);
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