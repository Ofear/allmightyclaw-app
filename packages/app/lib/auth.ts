import * as SecureStore from 'expo-secure-store';
import { pair, checkHealth, logout as apiLogout } from './api';

export async function pairWithServer(serverUrl: string, pairingCode: string): Promise<void> {
  const isHealthy = await checkHealth(serverUrl);
  if (!isHealthy) {
    throw new Error('Server is not reachable');
  }
  
  await pair(serverUrl, pairingCode);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await SecureStore.getItemAsync('auth_token');
  return !!token;
}

export async function logout(): Promise<void> {
  await apiLogout();
}
