import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { getServerUrl, getToken } from '../../lib/api';
import { useTheme } from '../../context/ThemeContext';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { useHaptics } from '../../hooks/useHaptics';
import type { WsMessage, ChatMessage } from '../../lib/types';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { theme } = useTheme();
  const haptics = useHaptics();

  useEffect(() => {
    getServerUrl().then(setServerUrl).catch(() => {});
    getToken().then(setToken).catch(() => {});
  }, []);

  const { isConnected, sendMessage: wsSendMessage, lastMessage } = useWebSocket(serverUrl, token);
  const { pendingMessages, queueMessage, hasPending } = useOfflineQueue(isConnected, wsSendMessage);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'chunk') {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: last.content + (lastMessage.content || '') }];
          }
          return [...prev, { id: Date.now().toString(), role: 'assistant', content: lastMessage.content || '', timestamp: Date.now() }];
        });
      } else if (lastMessage.type === 'done') {
        haptics.success();
      } else if (lastMessage.type === 'error') {
        haptics.error();
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `Error: ${lastMessage.message}`, timestamp: Date.now() }]);
      }
    }
  }, [lastMessage, haptics]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    haptics.light();
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    await queueMessage(input);
    setInput('');
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 12, color: theme.colors.textSecondary },
    pendingBadge: { backgroundColor: theme.colors.warning, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    pendingText: { fontSize: 10, color: '#fff' },
    messages: { flex: 1, padding: 16 },
    message: { padding: 12, borderRadius: 8, marginBottom: 8, maxWidth: '85%' },
    userMessage: { alignSelf: 'flex-end', backgroundColor: theme.colors.primary },
    assistantMessage: { alignSelf: 'flex-start', backgroundColor: theme.colors.surface },
    userText: { color: '#fff' },
    placeholder: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 },
    inputContainer: { padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border },
    input: { backgroundColor: theme.colors.surface, borderRadius: 8, padding: 12, color: theme.colors.text },
    sendButton: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
    sendButtonText: { color: '#fff', fontWeight: '600' },
  });

  return (
    <View style={styles.container} accessibilityLabel="Chat screen">
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? theme.colors.success : theme.colors.error }]} />
          <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
          {hasPending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>{pendingMessages.length} pending</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages}>
        {messages.map(msg => (
          <View 
            key={msg.id} 
            style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.assistantMessage]}
            accessibilityLabel={msg.role === 'user' ? `You: ${msg.content}` : `Assistant: ${msg.content}`}
          >
            {msg.role === 'user' ? (
              <Text style={styles.userText}>{msg.content}</Text>
            ) : (
              <MarkdownRenderer content={msg.content} />
            )}
          </View>
        ))}
        {!isConnected && messages.length === 0 && (
          <Text style={styles.placeholder}>Connecting to server...</Text>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={handleSend}
          accessibilityLabel="Message input"
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
