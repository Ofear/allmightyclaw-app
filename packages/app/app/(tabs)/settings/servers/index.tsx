import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useServers } from '../../../hooks/useServers';

export default function ServersSettings() {
  const { servers, currentServer, addServer, removeServer, switchServer } = useServers();
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    addServer({
      id: Date.now().toString(),
      url: newUrl.trim(),
      name: newName.trim() || newUrl.trim(),
    });
    setNewUrl('');
    setNewName('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Server', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeServer(id) },
    ]);
  };

  const renderServer = ({ item }: { item: typeof servers[0] }) => (
    <TouchableOpacity
      style={[styles.server, item.id === currentServer?.id && styles.activeServer]}
      onPress={() => switchServer(item.id)}
    >
      <View style={styles.serverInfo}>
        <Text style={styles.serverName}>{item.name}</Text>
        <Text style={styles.serverUrl}>{item.url}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servers</Text>

      {showAdd ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Server URL (e.g., http://192.168.1.50:42617)"
            value={newUrl}
            onChangeText={setNewUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Name (optional)"
            value={newName}
            onChangeText={setNewName}
          />
          <View style={styles.addButtons}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAdd(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(true)}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  server: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 12 },
  activeServer: { borderWidth: 2, borderColor: '#2563EB' },
  serverInfo: { flex: 1 },
  serverName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  serverUrl: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  deleteText: { color: '#EF4444', fontSize: 14 },
  addForm: { marginBottom: 16 },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 8 },
  addButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600' },
  addButtons: { flexDirection: 'row', gap: 8 },
  cancelButton: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
  cancelButtonText: { color: '#6B7280', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
});
