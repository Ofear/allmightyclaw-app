import { pair, checkHealth, getStatus, getTools, getMemory, addMemory, getCost, getCronJobs, addCronJob, deleteCronJob, getConfig, updateConfig, getHealth, logout, buildUrl } from '../lib/api';

global.fetch = jest.fn();

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const SecureStore = require('expo-secure-store');

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SecureStore.getItemAsync.mockImplementation(async (key: string) => {
      if (key === 'server_url') return 'http://localhost:42617';
      if (key === 'auth_token') return 'test-token';
      return null;
    });
  });

  describe('buildUrl', () => {
    it('should build URL correctly with base', () => {
      expect(buildUrl('/api/status', 'http://localhost:42617')).toBe('http://localhost:42617/api/status');
    });

    it('should handle trailing slash in base', () => {
      expect(buildUrl('/api/status', 'http://localhost:42617/')).toBe('http://localhost:42617/api/status');
    });

    it('should handle empty base', () => {
      expect(buildUrl('/api/status')).toBe('/api/status');
    });
  });

  describe('checkHealth', () => {
    it('should return true for healthy server', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);
      const result = await checkHealth('http://localhost:42617');
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:42617/health');
    });

    it('should return false for unhealthy server', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false } as Response);
      const result = await checkHealth('http://localhost:42617');
      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await checkHealth('http://localhost:42617');
      expect(result).toBe(false);
    });
  });

  describe('pair', () => {
    it('should pair successfully and store credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ paired: true, token: 'new-token' }),
      } as Response);

      const result = await pair('http://localhost:42617', '12345678');

      expect(result).toEqual({ paired: true, token: 'new-token' });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_url', 'http://localhost:42617');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'new-token');
    });

    it('should throw on pairing failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid code' }),
      } as Response);

      await expect(pair('http://localhost:42617', 'invalid')).rejects.toThrow('Invalid code');
    });
  });

  describe('getStatus', () => {
    it('should fetch status with authentication', async () => {
      const mockStatus = { provider: 'openai', model: 'gpt-4', uptime: 3600, channels: ['whatsapp'], health: 'healthy' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      } as Response);

      const result = await getStatus();

      expect(result).toEqual(mockStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:42617/api/status',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should clear token on 401', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 } as Response);

      await expect(getStatus()).rejects.toThrow();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('getTools', () => {
    it('should fetch tools list', async () => {
      const mockTools = [
        { name: 'bash', description: 'Run shell commands', enabled: true },
        { name: 'read', description: 'Read files', enabled: true },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTools,
      } as Response);

      const result = await getTools();
      expect(result).toEqual(mockTools);
    });
  });

  describe('getMemory', () => {
    it('should fetch memory without filters', async () => {
      const mockMemory = [{ id: '1', content: 'Test', category: 'core', timestamp: 123 }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMemory,
      } as Response);

      const result = await getMemory();
      expect(result).toEqual(mockMemory);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:42617/api/memory',
        expect.any(Object)
      );
    });

    it('should fetch memory with query and category', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await getMemory('test query', 'core');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:42617/api/memory?query=test+query&category=core',
        expect.any(Object)
      );
    });
  });

  describe('addMemory', () => {
    it('should add memory entry', async () => {
      const mockEntry = { id: '2', content: 'New memory', category: 'daily', timestamp: 456 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntry,
      } as Response);

      const result = await addMemory('New memory', 'daily');

      expect(result).toEqual(mockEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:42617/api/memory',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ content: 'New memory', category: 'daily' }),
        })
      );
    });
  });

  describe('getCronJobs', () => {
    it('should fetch cron jobs', async () => {
      const mockJobs = [{ id: '1', expression: '0 9 * * *', command: 'backup', nextRun: 123, enabled: true }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobs,
      } as Response);

      const result = await getCronJobs();
      expect(result).toEqual(mockJobs);
    });
  });

  describe('addCronJob', () => {
    it('should add cron job', async () => {
      const mockJob = { id: '2', expression: '0 0 * * *', command: 'cleanup', nextRun: 789, enabled: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockJob,
      } as Response);

      const result = await addCronJob('0 0 * * *', 'cleanup');

      expect(result).toEqual(mockJob);
    });
  });

  describe('deleteCronJob', () => {
    it('should delete cron job', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      await deleteCronJob('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:42617/api/cron/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('logout', () => {
    it('should clear stored credentials', async () => {
      await logout();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('server_url');
    });
  });
});
