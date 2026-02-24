import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useWebSocket } from '../hooks/useWebSocket';
import { getServerUrl, getToken } from '../lib/api';
import type { WsMessage, ChatMessage } from '../lib/types';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getServerUrl().then(setServerUrl).catch(() => {});
    getToken().then(setToken).catch(() => {});
  }, []);

  const { isConnected, sendMessage, lastMessage } = useWebSocket(serverUrl, token);

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
        // Full response complete
      } else if (lastMessage.type === 'error') {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `Error: ${lastMessage.message}`, timestamp: Date.now() }]);
      }
    }
  }, [lastMessage]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    sendMessage(input);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} style={styles.messages}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
            <Text style={msg.role === 'user' ? styles.userText : styles.assistantText}>{msg.content}</Text>
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
          onSubmitEditing={handleSend}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messages: { flex: 1, padding: 16 },
  message: { padding: 12, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#2563EB' },
  assistantMessage: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6' },
  userText: { color: '#fff' },
  assistantText: { color: '#111827' },
  placeholder: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  inputContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12 },
});
