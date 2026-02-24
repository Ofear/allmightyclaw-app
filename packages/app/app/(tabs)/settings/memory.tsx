import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useMemory } from '../../../hooks/useApi';
import { addMemory } from '../../../lib/api';
import type { MemoryEntry } from '../../../lib/types';

export default function MemorySettings() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'core' | 'daily' | 'conversation'>('conversation');
  const { data: entries, loading, error, refetch } = useMemory(query, category);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    await addMemory(newContent, newCategory);
    setNewContent('');
    setShowAdd(false);
    refetch();
  };

  const renderEntry = ({ item }: { item: MemoryEntry }) => (
    <View style={styles.entry}>
      <View style={styles.entryHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.entryTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <Text style={styles.entryContent}>{item.content}</Text>
    </View>
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'core': return '#2563EB';
      case 'daily': return '#F59E0B';
      case 'conversation': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search memory..."
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filters}>
        {['core', 'daily', 'conversation'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterButton, category === cat && styles.activeFilter]}
            onPress={() => setCategory(category === cat ? undefined : cat)}
          >
            <Text style={[styles.filterText, category === cat && styles.activeFilterText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showAdd ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Memory content..."
            value={newContent}
            onChangeText={setNewContent}
            multiline
          />
          <View style={styles.categoryButtons}>
            {(['core', 'daily', 'conversation'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catButton, newCategory === cat && styles.activeCatButton]}
                onPress={() => setNewCategory(cat)}
              >
                <Text style={newCategory === cat ? styles.activeCatText : styles.catText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(true)}>
          <Text style={styles.addButtonText}>+ Add Memory</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={entries || []}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={<Text style={styles.empty}>No memory entries</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchInput: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#F3F4F6' },
  activeFilter: { backgroundColor: '#2563EB' },
  filterText: { color: '#6B7280', fontSize: 14 },
  activeFilterText: { color: '#fff' },
  entry: { padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 12 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  categoryText: { color: '#fff', fontSize: 12 },
  entryTime: { color: '#6B7280', fontSize: 12 },
  entryContent: { color: '#111827', fontSize: 14 },
  addForm: { marginBottom: 16 },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 8, minHeight: 80 },
  categoryButtons: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  catButton: { padding: 8, borderRadius: 4, backgroundColor: '#F3F4F6' },
  activeCatButton: { backgroundColor: '#2563EB' },
  catText: { color: '#6B7280' },
  activeCatText: { color: '#fff' },
  addButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
});
