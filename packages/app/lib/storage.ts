import * as SecureStore from 'expo-secure-store';

export async function saveSecure(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecure(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecure(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

export async function save(key: string, value: string): Promise<void> {
  localStorage.setItem(key, value);
}

export function get(key: string): string | null {
  return localStorage.getItem(key);
}

export function remove(key: string): void {
  localStorage.removeItem(key);
}
