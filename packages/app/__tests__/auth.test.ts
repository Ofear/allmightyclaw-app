import { pairWithServer, isAuthenticated, logout } from '../lib/auth';
import * as api from '../lib/api';

jest.mock('../lib/api');
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const SecureStore = require('expo-secure-store');
const mockApi = api as jest.Mocked<typeof api>;

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pairWithServer', () => {
    it('should pair successfully with healthy server', async () => {
      mockApi.checkHealth.mockResolvedValue(true);
      mockApi.pair.mockResolvedValue({ paired: true, token: 'test-token' });

      await pairWithServer('http://localhost:42617', '12345678');

      expect(mockApi.checkHealth).toHaveBeenCalledWith('http://localhost:42617');
      expect(mockApi.pair).toHaveBeenCalledWith('http://localhost:42617', '12345678');
    });

    it('should throw when server is not reachable', async () => {
      mockApi.checkHealth.mockResolvedValue(false);

      await expect(pairWithServer('http://localhost:42617', '12345678')).rejects.toThrow('Server is not reachable');
      expect(mockApi.pair).not.toHaveBeenCalled();
    });

    it('should propagate pairing errors', async () => {
      mockApi.checkHealth.mockResolvedValue(true);
      mockApi.pair.mockRejectedValue(new Error('Invalid pairing code'));

      await expect(pairWithServer('http://localhost:42617', 'invalid')).rejects.toThrow('Invalid pairing code');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      SecureStore.getItemAsync.mockResolvedValue('test-token');

      const result = await isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when no token', async () => {
      SecureStore.getItemAsync.mockResolvedValue(null);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should call API logout', async () => {
      await logout();

      expect(mockApi.logout).toHaveBeenCalled();
    });
  });
});
