import { useState, useEffect, useCallback, useRef } from 'react';
import { sseClient, SSEClient } from '../lib/sse';
import type { SSEEvent } from '../lib/types';

interface UseSSEReturn {
  isConnected: boolean;
  events: SSEEvent[];
  error: Error | null;
  clearEvents: () => void;
}

export function useSSE(): UseSSEReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    clientRef.current = new SSEClient();
    
    const unsubEvent = clientRef.current.onEvent((event) => {
      setEvents(prev => [event, ...prev].slice(0, 100));
    });
    
    const unsubError = clientRef.current.onError((err) => {
      setError(err);
    });

    clientRef.current.connect().then(() => {
      setIsConnected(true);
    }).catch((err) => {
      setError(err);
    });

    return () => {
      unsubEvent();
      unsubError();
      clientRef.current?.disconnect();
    };
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    isConnected,
    events,
    error,
    clearEvents,
  };
}
