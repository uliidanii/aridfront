import React, { createContext, useContext, useState, useEffect } from "react";
import createWebSocketClient from "../services/WebSocketClient";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [webSocketClient, setWebSocketClient] = useState(null);

  useEffect(() => {
    const client = createWebSocketClient();
    setWebSocketClient(client);

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocketClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
