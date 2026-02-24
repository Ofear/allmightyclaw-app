import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSSE } from '../hooks/useSSE';

export default function ActivityScreen() {
  const { events, isConnected, clearEvents, error } = useSSE();

  const getEventColor = (type: string) => {
    switch (type) {
      case 'llm_request': return '#2563EB';
      case 'tool_call': return '#F59E0B';
      case 'agent_start': return '#10B981';
      case 'agent_end': return '#10B981';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderEvent = ({ item }: { item: typeof events[0] }) => (
    <View style={styles.event}>
      <View style={[styles.eventBadge, { backgroundColor: getEventColor(item.type) }]}>
        <Text style={styles.eventType}>{item.type}</Text>
      </View>
      <Text style={styles.eventTime}>{formatTime(item.timestamp)}</Text>
      <Text style={styles.eventData}>{JSON.stringify(item.data)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <View style={[styles.statusBadge, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Connection error: {error.message}</Text>
        </View>
      )}

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        refreshControl={<RefreshControl refreshing={false} onRefresh={clearEvents} />}
        ListEmptyComponent={<Text style={styles.empty}>No events yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12 },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#EF4444' },
  event: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  eventBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
  eventType: { color: '#fff', fontSize: 12, fontWeight: '600' },
  eventTime: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
  eventData: { color: '#111827', fontSize: 14 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
});
