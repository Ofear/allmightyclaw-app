import { WebSocketClient } from '../lib/ws';

describe('WebSocketClient', () => {
  let client: WebSocketClient;
  let mockWebSocket: any;
  let originalWebSocket: any;

  beforeEach(() => {
    originalWebSocket = (global as any).WebSocket;
    
    mockWebSocket = {
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      readyState: 0,
      OPEN: 1,
      CLOSED: 3,
      send: jest.fn(),
      close: jest.fn(),
    };

    (global as any).WebSocket = jest.fn(() => mockWebSocket) as any;
    (global as any).WebSocket.OPEN = 1;
    (global as any).WebSocket.CLOSED = 3;
    (global as any).WebSocket.CONNECTING = 0;

    client = new WebSocketClient();
    jest.useFakeTimers();
  });

  afterEach(() => {
    client.disconnect();
    jest.useRealTimers();
    jest.clearAllMocks();
    (global as any).WebSocket = originalWebSocket;
  });

  describe('connect', () => {
    it('should establish connection with token', () => {
      client.connect('http://localhost:42617', 'test-token');

      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:42617/ws/chat?token=test-token');
    });

    it('should handle http to ws conversion', () => {
      client.connect('https://localhost:42617', 'test-token');

      expect(WebSocket).toHaveBeenCalledWith('wss://localhost:42617/ws/chat?token=test-token');
    });

    it('should reset reconnect attempts on connect', () => {
      client.connect('http://localhost:42617', 'test-token');
      
      mockWebSocket.readyState = 1;
      mockWebSocket.onopen();
      mockWebSocket.readyState = 3;
      mockWebSocket.onclose();
      
      jest.advanceTimersByTime(1000);
      expect(WebSocket).toHaveBeenCalledTimes(2);
    });
  });

  describe('onMessage', () => {
    it('should call message handlers on message', () => {
      const handler = jest.fn();
      client.onMessage(handler);
      client.connect('http://localhost:42617', 'test-token');

      mockWebSocket.onmessage({ data: JSON.stringify({ type: 'chunk', content: 'Hello' }) });

      expect(handler).toHaveBeenCalledWith({ type: 'chunk', content: 'Hello' });
    });

    it('should support multiple handlers', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      client.onMessage(handler1);
      client.onMessage(handler2);
      client.connect('http://localhost:42617', 'test-token');

      mockWebSocket.onmessage({ data: JSON.stringify({ type: 'done' }) });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const handler = jest.fn();
      const unsubscribe = client.onMessage(handler);
      client.connect('http://localhost:42617', 'test-token');

      unsubscribe();
      mockWebSocket.onmessage({ data: JSON.stringify({ type: 'done' }) });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('onError', () => {
    it('should call error handlers on error', () => {
      const handler = jest.fn();
      client.onError(handler);
      client.connect('http://localhost:42617', 'test-token');

      mockWebSocket.onerror({});

      expect(handler).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('onClose', () => {
    it('should call close handlers on close', () => {
      const handler = jest.fn();
      client.onClose(handler);
      client.connect('http://localhost:42617', 'test-token');

      mockWebSocket.onclose();

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('reconnection', () => {
    it('should attempt reconnection after close', () => {
      client.connect('http://localhost:42617', 'test-token');
      
      mockWebSocket.readyState = 1;
      mockWebSocket.onopen();
      mockWebSocket.readyState = 3;
      mockWebSocket.onclose();

      jest.advanceTimersByTime(1000);

      expect(WebSocket).toHaveBeenCalledTimes(2);
    });

    it('should use exponential backoff', () => {
      client.connect('http://localhost:42617', 'test-token');
      
      mockWebSocket.readyState = 1;
      mockWebSocket.onopen();
      
      for (let i = 0; i < 3; i++) {
        mockWebSocket.readyState = 3;
        mockWebSocket.onclose();
        jest.advanceTimersByTime(1000 * Math.pow(2, i));
      }

      expect(WebSocket).toHaveBeenCalledTimes(4);
    });

    it('should not reconnect after intentional disconnect', () => {
      client.connect('http://localhost:42617', 'test-token');
      
      mockWebSocket.readyState = 1;
      mockWebSocket.onopen();
      client.disconnect();
      mockWebSocket.readyState = 3;
      mockWebSocket.onclose();

      jest.advanceTimersByTime(30000);

      expect(WebSocket).toHaveBeenCalledTimes(1);
    });

    it('should stop after max reconnect attempts', () => {
      const errorHandler = jest.fn();
      client.onError(errorHandler);
      client.connect('http://localhost:42617', 'test-token');

      for (let i = 0; i < 12; i++) {
        mockWebSocket.readyState = 3;
        mockWebSocket.onclose();
        jest.advanceTimersByTime(30000);
      }

      expect(errorHandler).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Max reconnection attempts reached',
      }));
    });
  });

  describe('send', () => {
    it('should send message when connected', () => {
      client.connect('http://localhost:42617', 'test-token');
      mockWebSocket.readyState = 1;

      client.send('Hello');

      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'message', content: 'Hello' }));
    });

    it('should not send when not connected', () => {
      client.connect('http://localhost:42617', 'test-token');
      mockWebSocket.readyState = 3;
      
      client.send('Hello');

      expect(mockWebSocket.send).not.toHaveBeenCalled();
    });
  });

  describe('isConnected', () => {
    it('should return true when connected', () => {
      client.connect('http://localhost:42617', 'test-token');
      mockWebSocket.readyState = 1;

      expect(client.isConnected).toBe(true);
    });

    it('should return false when not connected', () => {
      client.connect('http://localhost:42617', 'test-token');
      mockWebSocket.readyState = 3;

      expect(client.isConnected).toBe(false);
    });
  });
});
