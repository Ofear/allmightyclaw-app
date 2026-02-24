import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useConfig } from '../../../hooks/useApi';
import { updateConfig } from '../../../lib/api';
import { useTheme } from '../../../context/ThemeContext';
import { useHaptics } from '../../../hooks/useHaptics';
import { LoadingSkeleton, ErrorDisplay } from '../../../components';

export default function ConfigSettings() {
  const { data: config, loading, error, refetch } = useConfig();
  const [editing, setEditing] = useState(false);
  const [configText, setConfigText] = useState('');
  const { theme } = useTheme();
  const haptics = useHaptics();

  useEffect(() => {
    if (config) {
      setConfigText(JSON.stringify(config, null, 2));
    }
  }, [config]);

  const handleSave = async () => {
    haptics.medium();
    try {
      await updateConfig(configText);
      setEditing(false);
      refetch();
      haptics.success();
      Alert.alert('Success', 'Configuration updated');
    } catch {
      haptics.error();
      Alert.alert('Error', 'Failed to update configuration');
    }
  };

  const handleRefresh = () => {
    haptics.light();
    refetch();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    editButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    editButtonText: { color: '#fff', fontWeight: '600' },
    configDisplay: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 8 },
    configText: { fontFamily: 'monospace', fontSize: 12, color: theme.colors.text },
    configInput: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 8, fontFamily: 'monospace', fontSize: 12, minHeight: 300, textAlignVertical: 'top', color: theme.colors.text },
    cancelButton: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
    cancelButtonText: { color: theme.colors.textSecondary, fontWeight: '600' },
  });

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorDisplay message="Failed to load configuration" onRetry={handleRefresh} />
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel="Configuration settings">
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Configuration</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            haptics.light();
            editing ? handleSave() : setEditing(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={editing ? 'Save configuration' : 'Edit configuration'}
        >
          <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {loading && !config ? (
        <LoadingSkeleton type="text" count={5} />
      ) : editing ? (
        <TextInput
          style={styles.configInput}
          value={configText}
          onChangeText={setConfigText}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Configuration editor"
        />
      ) : (
        <View style={styles.configDisplay}>
          <Text style={styles.configText}>{configText}</Text>
        </View>
      )}

      {editing && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => {
          haptics.light();
          setEditing(false);
          setConfigText(JSON.stringify(config, null, 2));
        }} accessibilityRole="button" accessibilityLabel="Cancel editing">
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
