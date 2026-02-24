import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ToolCallCardProps {
  name: string;
  args?: Record<string, unknown>;
  output?: string;
  status: 'running' | 'success' | 'error';
  duration?: number;
  onPress?: () => void;
}

export function ToolCallCard({ name, args, output, status, duration, onPress }: ToolCallCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'running': return '#F59E0B';
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        {duration !== undefined && <Text style={styles.duration}>{duration}ms</Text>}
      </View>
      {args && Object.keys(args).length > 0 && (
        <View style={styles.args}>
          <Text style={styles.argsText}>{JSON.stringify(args, null, 2)}</Text>
        </View>
      )}
      {output && (
        <View style={styles.output}>
          <Text style={styles.outputText} numberOfLines={3}>{output}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  name: { fontWeight: '600', color: '#111827', flex: 1 },
  duration: { color: '#6B7280', fontSize: 12 },
  args: { backgroundColor: '#E5E7EB', padding: 8, borderRadius: 4, marginBottom: 8 },
  argsText: { fontFamily: 'monospace', fontSize: 11, color: '#374151' },
  output: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8 },
  outputText: { fontSize: 12, color: '#6B7280' },
});
