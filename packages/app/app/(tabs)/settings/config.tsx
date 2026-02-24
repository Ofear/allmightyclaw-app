import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useConfig } from '../../../hooks/useApi';
import { updateConfig } from '../../../lib/api';

export default function ConfigSettings() {
  const { data: config, loading, error, refetch } = useConfig();
  const [editing, setEditing] = useState(false);
  const [configText, setConfigText] = useState('');

  useEffect(() => {
    if (config) {
      setConfigText(JSON.stringify(config, null, 2));
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig(configText);
      setEditing(false);
      refetch();
      Alert.alert('Success', 'Configuration updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update configuration');
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load configuration</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuration</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editing ? handleSave() : setEditing(true)}
        >
          <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : editing ? (
        <TextInput
          style={styles.configInput}
          value={configText}
          onChangeText={setConfigText}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : (
        <View style={styles.configDisplay}>
          <Text style={styles.configText}>{configText}</Text>
        </View>
      )}

      {editing && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => {
          setEditing(false);
          setConfigText(JSON.stringify(config, null, 2));
        }}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  editButton: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  editButtonText: { color: '#fff', fontWeight: '600' },
  configDisplay: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8 },
  configText: { fontFamily: 'monospace', fontSize: 12, color: '#111827' },
  configInput: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, fontFamily: 'monospace', fontSize: 12, minHeight: 300, textAlignVertical: 'top' },
  error: { color: '#EF4444', textAlign: 'center', marginTop: 40 },
  cancelButton: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  cancelButtonText: { color: '#6B7280', fontWeight: '600' },
});
