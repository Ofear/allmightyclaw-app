import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useCronJobs } from '../../../hooks/useApi';
import { addCronJob, deleteCronJob } from '../../../lib/api';
import { useTheme } from '../../../context/ThemeContext';
import { useHaptics } from '../../../hooks/useHaptics';
import { LoadingSkeleton, ErrorDisplay } from '../../../components';
import type { CronJob } from '../../../lib/types';

export default function SchedulerSettings() {
  const { data: jobs, loading, refetch } = useCronJobs();
  const [showAdd, setShowAdd] = useState(false);
  const [newExpression, setNewExpression] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleAdd = async () => {
    if (!newExpression.trim() || !newCommand.trim()) return;
    haptics.medium();
    try {
      await addCronJob(newExpression, newCommand);
      setNewExpression('');
      setNewCommand('');
      setShowAdd(false);
      refetch();
      haptics.success();
    } catch {
      haptics.error();
      Alert.alert('Error', 'Failed to add cron job');
    }
  };

  const handleDelete = async (id: string) => {
    haptics.medium();
    Alert.alert('Delete Job', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteCronJob(id);
        refetch();
        haptics.success();
      }},
    ]);
  };

  const handleRefresh = () => {
    haptics.light();
    refetch();
  };

  const formatNextRun = (timestamp: number) => {
    const diff = timestamp - Date.now();
    if (diff < 0) return 'Overdue';
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
    return `in ${minutes}m`;
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    job: { padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8, marginBottom: 12 },
    jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    jobExpression: { fontFamily: 'monospace', fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
    deleteText: { color: theme.colors.error, fontSize: 14 },
    jobCommand: { color: theme.colors.text, fontSize: 14, marginBottom: 8 },
    nextRun: { color: theme.colors.textSecondary, fontSize: 12 },
    addForm: { marginBottom: 16 },
    input: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, marginBottom: 8, color: theme.colors.text },
    addButton: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: '#fff', fontWeight: '600' },
    addButtons: { flexDirection: 'row', gap: 8 },
    cancelButton: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
    cancelButtonText: { color: theme.colors.textSecondary, fontWeight: '600' },
    empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 },
  });

  const renderJob = ({ item }: { item: CronJob }) => (
    <View style={styles.job} accessibilityLabel={`Cron job: ${item.command}, runs ${item.expression}`}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobExpression}>{item.expression}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)} accessibilityRole="button" accessibilityLabel="Delete job">
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.jobCommand}>{item.command}</Text>
      <Text style={styles.nextRun}>Next run: {formatNextRun(item.nextRun)}</Text>
    </View>
  );

  return (
    <View style={styles.container} accessibilityLabel="Scheduler settings">
      <Text style={styles.title} accessibilityRole="header">Scheduler</Text>

      {showAdd ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Cron expression (e.g., 0 9 * * *)"
            placeholderTextColor={theme.colors.textSecondary}
            value={newExpression}
            onChangeText={setNewExpression}
            accessibilityLabel="Cron expression"
          />
          <TextInput
            style={styles.input}
            placeholder="Command"
            placeholderTextColor={theme.colors.textSecondary}
            value={newCommand}
            onChangeText={setNewCommand}
            accessibilityLabel="Command to run"
          />
          <View style={styles.addButtons}>
            <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={handleAdd} accessibilityRole="button" accessibilityLabel="Add job">
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
          accessibilityLabel="Add scheduled task"
        >
          <Text style={styles.addButtonText}>+ Add Scheduled Task</Text>
        </TouchableOpacity>
      )}

      {loading && !jobs ? (
        <LoadingSkeleton type="list" count={3} />
      ) : (
        <FlatList
          data={jobs || []}
          renderItem={renderJob}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
          ListEmptyComponent={<Text style={styles.empty}>No scheduled tasks</Text>}
        />
      )}
    </View>
  );
}
