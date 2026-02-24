import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChatMessage } from '../lib/types';

const QUEUE_KEY = 'allmightyclaw_message_queue';

interface QueuedMessage {
  id: string;
  content: string;
  timestamp: number;
  retryCount: number;
}

export function useOfflineQueue(isConnected: boolean, sendMessage: (message: string) => void) {
  const [pendingMessages, setPendingMessages] = useState<QueuedMessage[]>([]);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const stored = await AsyncStorage.getItem(QUEUE_KEY);
        if (stored) {
          setPendingMessages(JSON.parse(stored));
        }
      } catch {
        // Ignore
      }
    };
    loadQueue();
  }, []);

  const saveQueue = useCallback(async (messages: QueuedMessage[]) => {
    try {
      if (messages.length === 0) {
        await AsyncStorage.removeItem(QUEUE_KEY);
      } else {
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(messages));
      }
    } catch {
      // Ignore
    }
  }, []);

  const queueMessage = useCallback(async (content: string) => {
    const message: QueuedMessage = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      retryCount: 0,
    };

    if (isConnected) {
      sendMessage(content);
    } else {
      const updated = [...pendingMessages, message];
      setPendingMessages(updated);
      await saveQueue(updated);
    }
  }, [isConnected, sendMessage, pendingMessages, saveQueue]);

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || pendingMessages.length === 0 || !isConnected) {
      return;
    }

    isProcessingRef.current = true;

    const messagesToSend = [...pendingMessages];
    setPendingMessages([]);
    await saveQueue([]);

    for (const message of messagesToSend) {
      sendMessage(message.content);
    }

    isProcessingRef.current = false;
  }, [isConnected, pendingMessages, saveQueue, sendMessage]);

  useEffect(() => {
    if (isConnected && pendingMessages.length > 0) {
      processQueue();
    }
  }, [isConnected, pendingMessages.length, processQueue]);

  return {
    pendingMessages,
    queueMessage,
    hasPending: pendingMessages.length > 0,
  };
}
