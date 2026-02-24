import { useState, useEffect, useCallback } from 'react';
import { get, save, remove } from '../lib/storage';
import type { Server } from '../lib/types';

const SERVERS_KEY = 'allmightyclaw_servers';

export function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);

  useEffect(() => {
    const stored = get(SERVERS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Server[];
        setServers(parsed);
        if (parsed.length > 0) {
          setCurrentServer(parsed[0]);
        }
      } catch {
        setServers([]);
      }
    }
  }, []);

  const addServer = useCallback((server: Server) => {
    setServers(prev => {
      const updated = [...prev, server];
      save(SERVERS_KEY, JSON.stringify(updated));
      return updated;
    });
    if (!currentServer) {
      setCurrentServer(server);
    }
  }, [currentServer]);

  const removeServer = useCallback((id: string) => {
    setServers(prev => {
      const updated = prev.filter(s => s.id !== id);
      save(SERVERS_KEY, JSON.stringify(updated));
      return updated;
    });
    if (currentServer?.id === id) {
      setServers(prev => prev[0] || null);
    }
  }, [currentServer]);

  const switchServer = useCallback((id: string) => {
    const server = servers.find(s => s.id === id);
    if (server) {
      setCurrentServer(server);
    }
  }, [servers]);

  const updateServer = useCallback((id: string, updates: Partial<Server>) => {
    setServers(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      save(SERVERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    servers,
    currentServer,
    addServer,
    removeServer,
    switchServer,
    updateServer,
  };
}
