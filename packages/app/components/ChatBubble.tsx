import { View, Text, StyleSheet } from 'react-native';
import type { ChatMessage } from '../lib/types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <Text style={isUser ? styles.userText : styles.assistantText}>{message.content}</Text>
      <Text style={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  userContainer: { alignSelf: 'flex-end', backgroundColor: '#2563EB' },
  assistantContainer: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6' },
  userText: { color: '#fff', fontSize: 14 },
  assistantText: { color: '#111827', fontSize: 14 },
  timestamp: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
});
