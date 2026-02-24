import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { SSEEvent } from '../lib/types';

interface EventFeedProps {
  events: SSEEvent[];
  maxItems?: number;
}

export function EventFeed({ events, maxItems = 50 }: EventFeedProps) {
  const displayEvents = events.slice(0, maxItems);

  const getEventColor = (type: SSEEvent['type']) => {
    switch (type) {
      case 'llm_request': return '#2563EB';
      case 'tool_call': return '#F59E0B';
      case 'agent_start': return '#10B981';
      case 'agent_end': return '#059669';
      case 'error': return '#EF4444';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderEvent = ({ item }: { item: SSEEvent }) => (
    <View style={styles.event}>
      <View style={[styles.dot, { backgroundColor: getEventColor(item.type) }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.type, { color: getEventColor(item.type) }]}>{item.type}</Text>
          <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={styles.data} numberOfLines={2}>{JSON.stringify(item.data)}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={displayEvents}
      renderItem={renderEvent}
      keyExtractor={(item, index) => `${item.timestamp}-${index}`}
      ListEmptyComponent={<Text style={styles.empty}>No events</Text>}
    />
  );
}

const styles = StyleSheet.create({
  event: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12, marginTop: 6 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  type: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  time: { fontSize: 11, color: '#6B7280' },
  data: { fontSize: 12, color: '#374151', fontFamily: 'monospace' },
  empty: { textAlign: 'center', color: '#6B7280', padding: 20 },
});
