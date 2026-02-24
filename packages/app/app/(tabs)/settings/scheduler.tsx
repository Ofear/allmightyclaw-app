import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useCronJobs } from '../../../hooks/useApi';
import { addCronJob, deleteCronJob } from '../../../lib/api';
import type { CronJob } from '../../../lib/types';

export default function SchedulerSettings() {
  const { data: jobs, loading, refetch } = useCronJobs();
  const [showAdd, setShowAdd] = useState(false);
  const [newExpression, setNewExpression] = useState('');
  const [newCommand, setNewCommand] = useState('');

  const handleAdd = async () => {
    if (!newExpression.trim() || !newCommand.trim()) return;
    try {
      await addCronJob(newExpression, newCommand);
      setNewExpression('');
      setNewCommand('');
      setShowAdd(false);
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to add cron job');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Job', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteCronJob(id);
        refetch();
      }},
    ]);
  };

  const formatNextRun = (timestamp: number) => {
    const diff = timestamp - Date.now();
    if (diff < 0) return 'Overdue';
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
    return `in ${minutes}m`;
  };

  const renderJob = ({ item }: { item: CronJob }) => (
    <View style={styles.job}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobExpression}>{item.expression}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.jobCommand}>{item.command}</Text>
      <Text style={styles.nextRun}>Next run: {formatNextRun(item.nextRun)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduler</Text>

      {showAdd ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Cron expression (e.g., 0 9 * * *)"
            value={newExpression}
            onChangeText={setNewExpression}
          />
          <TextInput
            style={styles.input}
            placeholder="Command"
            value={newCommand}
            onChangeText={setNewCommand}
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
          <Text style={styles.addButtonText}>+ Add Scheduled Task</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={jobs || []}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No scheduled tasks</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  job: { padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 12 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  jobExpression: { fontFamily: 'monospace', fontSize: 14, color: '#2563EB', fontWeight: '600' },
  deleteText: { color: '#EF4444', fontSize: 14 },
  jobCommand: { color: '#111827', fontSize: 14, marginBottom: 8 },
  nextRun: { color: '#6B7280', fontSize: 12 },
  addForm: { marginBottom: 16 },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 8 },
  addButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600' },
  addButtons: { flexDirection: 'row', gap: 8 },
  cancelButton: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
  cancelButtonText: { color: '#6B7280', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
});
