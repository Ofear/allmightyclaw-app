import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSSE } from '../../hooks/useSSE';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { ErrorDisplay } from '../../components';

export default function ActivityScreen() {
  const { events, isConnected, clearEvents, error } = useSSE();
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleRefresh = () => {
    haptics.light();
    clearEvents();
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'llm_request': return theme.colors.primary;
      case 'tool_call': return theme.colors.warning;
      case 'agent_start': return theme.colors.success;
      case 'agent_end': return theme.colors.success;
      case 'error': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: '#fff', fontSize: 12 },
    event: { padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    eventBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
    eventType: { color: '#fff', fontSize: 12, fontWeight: '600' },
    eventTime: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: 4 },
    eventData: { color: theme.colors.text, fontSize: 14 },
    empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 },
  });

  const renderEvent = ({ item }: { item: typeof events[0] }) => (
    <View style={styles.event} accessibilityLabel={`${item.type} event at ${formatTime(item.timestamp)}`}>
      <View style={[styles.eventBadge, { backgroundColor: getEventColor(item.type) }]}>
        <Text style={styles.eventType}>{item.type}</Text>
      </View>
      <Text style={styles.eventTime}>{formatTime(item.timestamp)}</Text>
      <Text style={styles.eventData}>{JSON.stringify(item.data)}</Text>
    </View>
  );

  return (
    <View style={styles.container} accessibilityLabel="Activity screen">
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Activity</Text>
        <View style={[styles.statusBadge, { backgroundColor: isConnected ? theme.colors.success : theme.colors.error }]}>
          <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
        </View>
      </View>

      {error && <ErrorDisplay message={`Connection error: ${error.message}`} />}

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
        ListEmptyComponent={<Text style={styles.empty}>No events yet</Text>}
      />
    </View>
  );
}
