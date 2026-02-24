import { getServerUrl, getToken, buildUrl } from './api';
import type { SSEEvent } from './types';

type EventHandler = (event: SSEEvent) => void;
type ErrorHandler = (error: Error) => void;

export class SSEClient {
  private eventSource: EventSource | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private baseReconnectDelay: number = 1000;
  private maxReconnectDelay: number = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private eventHandlers: Set<EventHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private isIntentionallyClosed: boolean = false;

  async connect(): Promise<void> {
    const serverUrl = await getServerUrl();
    const token = await getToken();
    this.isIntentionallyClosed = false;
    this.reconnectAttempts = 0;
    this.doConnect(serverUrl, token);
  }

  private async doConnect(serverUrl: string, token: string): Promise<void> {
    const url = `${buildUrl('/api/events', serverUrl)}?token=${encodeURIComponent(token)}`;
    
    try {
      this.eventSource = new EventSource(url);
      
      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
      };
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          this.eventHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Failed to parse SSE event:', error);
        }
      };
      
      this.eventSource.onerror = () => {
        const error = new Error('SSE connection error');
        this.errorHandlers.forEach(handler => handler(error));
        
        if (!this.isIntentionallyClosed) {
          this.scheduleReconnect(serverUrl, token);
        }
      };
    } catch (error) {
      this.errorHandlers.forEach(handler => handler(error as Error));
      this.scheduleReconnect(serverUrl, token);
    }
  }

  private scheduleReconnect(serverUrl: string, token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      const error = new Error('Max SSE reconnection attempts reached');
      this.errorHandlers.forEach(handler => handler(error));
      return;
    }

    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    
    this.reconnectAttempts++;
    
    this.reconnectTimer = setTimeout(() => {
      this.doConnect(serverUrl, token);
    }, delay);
  }

  onEvent(handler: EventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.eventSource?.close();
    this.eventSource = null;
  }

  get isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

export const sseClient = new SSEClient();
