import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTools } from '../../hooks/useApi';
import { useTheme } from '../../context/ThemeContext';
import { LoadingSkeleton, ErrorDisplay } from '../../components';
import { useHaptics } from '../../hooks/useHaptics';

export default function ToolsScreen() {
  const { data: tools, loading, error, refetch } = useTools();
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleRefresh = () => {
    haptics.light();
    refetch();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    tool: { padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8, marginBottom: 12 },
    toolHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    toolName: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    statusText: { color: '#fff', fontSize: 12 },
    toolDescription: { color: theme.colors.textSecondary, fontSize: 14 },
    empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 },
  });

  const renderTool = ({ item }: { item: typeof tools extends (infer T)[] | null ? T : never }) => (
    <View style={styles.tool} accessibilityLabel={`${item.name} tool, ${item.enabled ? 'enabled' : 'disabled'}`}>
      <View style={styles.toolHeader}>
        <Text style={styles.toolName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.enabled ? theme.colors.success : theme.colors.textSecondary }]}>
          <Text style={styles.statusText}>{item.enabled ? 'Enabled' : 'Disabled'}</Text>
        </View>
      </View>
      <Text style={styles.toolDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container} accessibilityLabel="Tools screen">
      <Text style={styles.title} accessibilityRole="header">Tools</Text>
      
      {error && <ErrorDisplay message="Failed to load tools" onRetry={handleRefresh} />}

      {loading && !tools ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <FlatList
          data={tools || []}
          renderItem={renderTool}
          keyExtractor={(item) => item.name}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
          ListEmptyComponent={!loading ? <Text style={styles.empty}>No tools registered</Text> : null}
        />
      )}
    </View>
  );
}
