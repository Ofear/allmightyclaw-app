import * as SecureStore from 'expo-secure-store';
import type { Server, PairingResponse, SystemStatus, Tool, MemoryEntry, CostSummary, CronJob, Config, HealthCheck, ChatCompletionResponse, ChatCompletionRequest } from './types';

const DEFAULT_PORT = 42617;

export async function getServerUrl(): Promise<string> {
  const url = await SecureStore.getItemAsync('server_url');
  if (!url) throw new Error('No server configured');
  return url;
}

export async function getToken(): Promise<string> {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) throw new Error('Not authenticated');
  return token;
}

export function buildUrl(path: string, serverUrl?: string): string {
  const base = serverUrl || '';
  const cleanBase = base.replace(/\/$/, '');
  return `${cleanBase}${path}`;
}

export async function pair(serverUrl: string, pairingCode: string): Promise<PairingResponse> {
  const response = await fetch(buildUrl('/pair', serverUrl), {
    method: 'POST',
    headers: {
      'X-Pairing-Code': pairingCode,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Pairing failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  const data = await response.json();
  await SecureStore.setItemAsync('server_url', serverUrl);
  await SecureStore.setItemAsync('auth_token', data.token);
  return data;
}

export async function checkHealth(serverUrl: string): Promise<boolean> {
  try {
    const response = await fetch(buildUrl('/health', serverUrl));
    return response.ok;
  } catch {
    return false;
  }
}

async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const serverUrl = await getServerUrl();
  const token = await getToken();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  
  const response = await fetch(buildUrl(path, serverUrl), {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    await SecureStore.deleteItemAsync('auth_token');
    throw new Error('Session expired');
  }
  
  return response;
}

export async function getStatus(): Promise<SystemStatus> {
  const response = await authenticatedFetch('/api/status');
  if (!response.ok) throw new Error('Failed to fetch status');
  return response.json();
}

export async function getTools(): Promise<Tool[]> {
  const response = await authenticatedFetch('/api/tools');
  if (!response.ok) throw new Error('Failed to fetch tools');
  return response.json();
}

export async function getMemory(query?: string, category?: string): Promise<MemoryEntry[]> {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (category) params.set('category', category);
  
  const path = `/api/memory${params.toString() ? '?' + params.toString() : ''}`;
  const response = await authenticatedFetch(path);
  if (!response.ok) throw new Error('Failed to fetch memory');
  return response.json();
}

export async function addMemory(content: string, category: string): Promise<MemoryEntry> {
  const response = await authenticatedFetch('/api/memory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, category }),
  });
  if (!response.ok) throw new Error('Failed to add memory');
  return response.json();
}

export async function getCost(): Promise<CostSummary> {
  const response = await authenticatedFetch('/api/cost');
  if (!response.ok) throw new Error('Failed to fetch cost');
  return response.json();
}

export async function getCronJobs(): Promise<CronJob[]> {
  const response = await authenticatedFetch('/api/cron');
  if (!response.ok) throw new Error('Failed to fetch cron jobs');
  return response.json();
}

export async function addCronJob(expression: string, command: string): Promise<CronJob> {
  const response = await authenticatedFetch('/api/cron', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression, command }),
  });
  if (!response.ok) throw new Error('Failed to add cron job');
  return response.json();
}

export async function deleteCronJob(id: string): Promise<void> {
  const response = await authenticatedFetch(`/api/cron/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete cron job');
}

export async function getConfig(): Promise<Config> {
  const response = await authenticatedFetch('/api/config');
  if (!response.ok) throw new Error('Failed to fetch config');
  return response.json();
}

export async function updateConfig(config: string): Promise<void> {
  const response = await authenticatedFetch('/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/plain' },
    body: config,
  });
  if (!response.ok) throw new Error('Failed to update config');
}

export async function getHealth(): Promise<HealthCheck> {
  const response = await authenticatedFetch('/api/health');
  if (!response.ok) throw new Error('Failed to fetch health');
  return response.json();
}

export async function runDoctor(): Promise<Record<string, unknown>> {
  const response = await authenticatedFetch('/api/doctor', {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to run diagnostics');
  return response.json();
}

export async function chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const response = await authenticatedFetch('/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Chat completion failed');
  return response.json();
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('auth_token');
  await SecureStore.deleteItemAsync('server_url');
}
