import { useState, useEffect, useCallback } from 'react';
import { get, save, remove } from '../lib/storage';
import type { Server } from '../lib/types';

const SERVERS_KEY = 'allmightyclaw_servers';

export function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServers = async () => {
      try {
        const stored = await get(SERVERS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Server[];
          setServers(parsed);
          if (parsed.length > 0) {
            setCurrentServer(parsed[0]);
          }
        }
      } catch {
        setServers([]);
      } finally {
        setLoading(false);
      }
    };
    loadServers();
  }, []);

  const addServer = useCallback(async (server: Server) => {
    const updated = [...servers, server];
    setServers(updated);
    await save(SERVERS_KEY, JSON.stringify(updated));
    if (!currentServer) {
      setCurrentServer(server);
    }
  }, [servers, currentServer]);

  const removeServer = useCallback(async (id: string) => {
    const updated = servers.filter(s => s.id !== id);
    setServers(updated);
    await save(SERVERS_KEY, JSON.stringify(updated));
    if (currentServer?.id === id) {
      setCurrentServer(updated[0] || null);
    }
  }, [servers, currentServer]);

  const switchServer = useCallback((id: string) => {
    const server = servers.find(s => s.id === id);
    if (server) {
      setCurrentServer(server);
    }
  }, [servers]);

  const updateServer = useCallback(async (id: string, updates: Partial<Server>) => {
    const updated = servers.map(s => s.id === id ? { ...s, ...updates } : s);
    setServers(updated);
    await save(SERVERS_KEY, JSON.stringify(updated));
  }, [servers]);

  return {
    servers,
    currentServer,
    loading,
    addServer,
    removeServer,
    switchServer,
    updateServer,
  };
}
