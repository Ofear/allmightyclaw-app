import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useServers } from '../../../../hooks/useServers';
import { useTheme } from '../../../../context/ThemeContext';
import { useHaptics } from '../../../../hooks/useHaptics';
import { LoadingSkeleton } from '../../../../components';

export default function ServersSettings() {
  const { servers, currentServer, loading, addServer, removeServer, switchServer } = useServers();
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    haptics.medium();
    addServer({
      id: Date.now().toString(),
      url: newUrl.trim(),
      name: newName.trim() || newUrl.trim(),
    });
    setNewUrl('');
    setNewName('');
    setShowAdd(false);
    haptics.success();
  };

  const handleDelete = (id: string) => {
    haptics.medium();
    Alert.alert('Delete Server', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        removeServer(id);
        haptics.success();
      }},
    ]);
  };

  const handleSwitch = (id: string) => {
    haptics.light();
    switchServer(id);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    server: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8, marginBottom: 12 },
    activeServer: { borderWidth: 2, borderColor: theme.colors.primary },
    serverInfo: { flex: 1 },
    serverName: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    serverUrl: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
    deleteText: { color: theme.colors.error, fontSize: 14 },
    addForm: { marginBottom: 16 },
    input: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, marginBottom: 8, color: theme.colors.text },
    addButton: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: '#fff', fontWeight: '600' },
    addButtons: { flexDirection: 'row', gap: 8 },
    cancelButton: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
    cancelButtonText: { color: theme.colors.textSecondary, fontWeight: '600' },
    empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 },
  });

  const renderServer = ({ item }: { item: typeof servers[0] }) => (
    <TouchableOpacity
      style={[styles.server, item.id === currentServer?.id && styles.activeServer]}
      onPress={() => handleSwitch(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name} server${item.id === currentServer?.id ? ', active' : ''}`}
    >
      <View style={styles.serverInfo}>
        <Text style={styles.serverName}>{item.name}</Text>
        <Text style={styles.serverUrl}>{item.url}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} accessibilityRole="button" accessibilityLabel="Delete server">
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Servers</Text>
        <LoadingSkeleton type="list" count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel="Servers settings">
      <Text style={styles.title} accessibilityRole="header">Servers</Text>

      {showAdd ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Server URL (e.g., http://192.168.1.50:42617)"
            placeholderTextColor={theme.colors.textSecondary}
            value={newUrl}
            onChangeText={setNewUrl}
            accessibilityLabel="Server URL"
          />
          <TextInput
            style={styles.input}
            placeholder="Name (optional)"
            placeholderTextColor={theme.colors.textSecondary}
            value={newName}
            onChangeText={setNewName}
            accessibilityLabel="Server name"
          />
          <View style={styles.addButtons}>
            <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={handleAdd} accessibilityRole="button" accessibilityLabel="Add server">
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAdd(false)} accessibilityRole="button" accessibilityLabel="Cancel">
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            haptics.light();
            setShowAdd(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Add server"
        >
          <Text style={styles.addButtonText}>+ Add Server</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={servers}
        renderItem={renderServer}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No servers configured</Text>}
      />
    </View>
  );
}
