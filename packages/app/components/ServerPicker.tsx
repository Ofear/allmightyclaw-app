import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Server } from '../lib/types';

interface ServerPickerProps {
  servers: Server[];
  currentServer: Server | null;
  onSelect: (id: string) => void;
}

export function ServerPicker({ servers, currentServer, onSelect }: ServerPickerProps) {
  if (servers.length === 0) return null;

  return (
    <View style={styles.container}>
      {servers.map((server) => (
        <TouchableOpacity
          key={server.id}
          style={[styles.serverItem, server.id === currentServer?.id && styles.activeServer]}
          onPress={() => onSelect(server.id)}
        >
          <View style={styles.serverInfo}>
            <Text style={[styles.serverName, server.id === currentServer?.id && styles.activeText]}>
              {server.name}
            </Text>
            <Text style={styles.serverUrl}>{server.url}</Text>
          </View>
          {server.id === currentServer?.id && (
            <View style={styles.activeDot} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6', borderRadius: 8, overflow: 'hidden' },
  serverItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  activeServer: { backgroundColor: '#DBEAFE' },
  serverInfo: { flex: 1 },
  serverName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  activeText: { color: '#2563EB' },
  serverUrl: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' },
});
