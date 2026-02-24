import { save, get, remove, clear, getAllKeys, saveSecure, getSecure, deleteSecure } from '../lib/storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');
const SecureStore = require('expo-secure-store');

describe('Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AsyncStorage operations', () => {
    describe('save', () => {
      it('should save value to AsyncStorage', async () => {
        await save('test-key', 'test-value');

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
      });
    });

    describe('get', () => {
      it('should get value from AsyncStorage', async () => {
        AsyncStorage.getItem.mockResolvedValue('stored-value');

        const result = await get('test-key');

        expect(result).toBe('stored-value');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      });

      it('should return null for missing key', async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        const result = await get('missing-key');

        expect(result).toBeNull();
      });
    });

    describe('remove', () => {
      it('should remove key from AsyncStorage', async () => {
        await remove('test-key');

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      });
    });

    describe('clear', () => {
      it('should clear all AsyncStorage', async () => {
        await clear();

        expect(AsyncStorage.clear).toHaveBeenCalled();
      });
    });

    describe('getAllKeys', () => {
      it('should get all keys from AsyncStorage', async () => {
        AsyncStorage.getAllKeys.mockResolvedValue(['key1', 'key2']);

        const result = await getAllKeys();

        expect(result).toEqual(['key1', 'key2']);
      });
    });
  });

  describe('SecureStore operations', () => {
    describe('saveSecure', () => {
      it('should save value to SecureStore', async () => {
        await saveSecure('secure-key', 'secure-value');

        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('secure-key', 'secure-value');
      });
    });

    describe('getSecure', () => {
      it('should get value from SecureStore', async () => {
        SecureStore.getItemAsync.mockResolvedValue('secure-value');

        const result = await getSecure('secure-key');

        expect(result).toBe('secure-value');
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('secure-key');
      });

      it('should return null for missing key', async () => {
        SecureStore.getItemAsync.mockResolvedValue(null);

        const result = await getSecure('missing-key');

        expect(result).toBeNull();
      });
    });

    describe('deleteSecure', () => {
      it('should delete key from SecureStore', async () => {
        await deleteSecure('secure-key');

        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('secure-key');
      });
    });
  });
});
