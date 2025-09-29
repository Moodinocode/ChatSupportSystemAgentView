import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import useTicketStore from '../Stores/useTicketStore';


const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const { onTicketRecieve } = useTicketStore();

  useEffect(() => {
    const client = new Client({
      brokerURL: import.meta.env.VITE_API_SOCKURL+'?token='+ sessionStorage.getItem("token"),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'ngrok-skip-browser-warning': 'true',
      },
      onConnect: () => {
        setConnected(true);
        console.log("WebSocket connected");

        // Listen for new tickets
        client.subscribe(`/user/queue/ticket`, (message) => {
          const body = JSON.parse("socket "+message.body);
          onTicketRecieve(body);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [onTicketRecieve]);

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
      console.log("WebSocket disconnected manually");
    }
  };

  return (
    <WebSocketContext.Provider value={{ connected, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
