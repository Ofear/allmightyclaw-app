import AsyncStorage from '@react-native-async-storage/async-storage';
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
  await AsyncStorage.setItem(key, value);
}

export async function get(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function clear(): Promise<void> {
  await AsyncStorage.clear();
}

export async function getAllKeys(): Promise<readonly string[]> {
  return AsyncStorage.getAllKeys();
}
