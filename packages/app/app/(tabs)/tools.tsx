import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTools } from '../hooks/useApi';

export default function ToolsScreen() {
  const { data: tools, loading, error, refetch } = useTools();

  const renderTool = ({ item }: { item: typeof tools extends (infer T)[] | null ? T : never }) => (
    <View style={styles.tool}>
      <View style={styles.toolHeader}>
        <Text style={styles.toolName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.enabled ? '#10B981' : '#6B7280' }]}>
          <Text style={styles.statusText}>{item.enabled ? 'Enabled' : 'Disabled'}</Text>
        </View>
      </View>
      <Text style={styles.toolDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load tools</Text>
        </View>
      )}

      <FlatList
        data={tools || []}
        renderItem={renderTool}
        keyExtractor={(item) => item.name}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No tools registered</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#EF4444' },
  tool: { padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 12 },
  toolHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  toolName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 12 },
  toolDescription: { color: '#6B7280', fontSize: 14 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
});
