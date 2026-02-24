import { useState, useEffect, useCallback, useRef } from 'react';
import { wsClient, WebSocketClient } from '../lib/ws';
import type { WsMessage } from '../lib/types';

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: string) => void;
  lastMessage: WsMessage | null;
  error: Error | null;
}

export function useWebSocket(url: string | null, token: string | null): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    if (!url || !token) return;

    clientRef.current = new WebSocketClient();
    
    const unsubMessage = clientRef.current.onMessage((message) => {
      setLastMessage(message);
    });
    
    const unsubError = clientRef.current.onError((err) => {
      setError(err);
    });
    
    const unsubClose = clientRef.current.onClose(() => {
      setIsConnected(false);
    });

    clientRef.current.connect(url, token);
    setIsConnected(true);

    return () => {
      unsubMessage();
      unsubError();
      unsubClose();
      clientRef.current?.disconnect();
    };
  }, [url, token]);

  const sendMessage = useCallback((message: string) => {
    clientRef.current?.send(message);
  }, []);

  return {
    isConnected,
    sendMessage,
    lastMessage,
    error,
  };
}
