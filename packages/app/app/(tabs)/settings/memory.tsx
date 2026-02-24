import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useMemory } from '../../../hooks/useApi';
import { addMemory } from '../../../lib/api';
import { useTheme } from '../../../context/ThemeContext';
import { useHaptics } from '../../../hooks/useHaptics';
import { LoadingSkeleton, ErrorDisplay } from '../../../components';
import type { MemoryEntry } from '../../../lib/types';

export default function MemorySettings() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'core' | 'daily' | 'conversation'>('conversation');
  const { data: entries, loading, error, refetch } = useMemory(query, category);
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    haptics.medium();
    await addMemory(newContent, newCategory);
    setNewContent('');
    setShowAdd(false);
    refetch();
    haptics.success();
  };

  const handleRefresh = () => {
    haptics.light();
    refetch();
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'core': return theme.colors.primary;
      case 'daily': return theme.colors.warning;
      case 'conversation': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    searchInput: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, marginBottom: 12, color: theme.colors.text },
    filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: theme.colors.surface },
    activeFilter: { backgroundColor: theme.colors.primary },
    filterText: { color: theme.colors.textSecondary, fontSize: 14 },
    activeFilterText: { color: '#fff' },
    entry: { padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8, marginBottom: 12 },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    categoryText: { color: '#fff', fontSize: 12 },
    entryTime: { color: theme.colors.textSecondary, fontSize: 12 },
    entryContent: { color: theme.colors.text, fontSize: 14 },
    addForm: { marginBottom: 16 },
    input: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, marginBottom: 8, minHeight: 80, color: theme.colors.text },
    categoryButtons: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    catButton: { padding: 8, borderRadius: 4, backgroundColor: theme.colors.surface },
    activeCatButton: { backgroundColor: theme.colors.primary },
    catText: { color: theme.colors.textSecondary },
    activeCatText: { color: '#fff' },
    addButton: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
    addButtonText: { color: '#fff', fontWeight: '600' },
    empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 },
  });

  const renderEntry = ({ item }: { item: MemoryEntry }) => (
    <View style={styles.entry} accessibilityLabel={`Memory: ${item.content}`}>
      <View style={styles.entryHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.entryTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <Text style={styles.entryContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container} accessibilityLabel="Memory settings">
      <Text style={styles.title} accessibilityRole="header">Memory</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search memory..."
        placeholderTextColor={theme.colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        accessibilityLabel="Search memory"
      />

      <View style={styles.filters}>
        {['core', 'daily', 'conversation'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterButton, category === cat && styles.activeFilter]}
            onPress={() => {
              haptics.light();
              setCategory(category === cat ? undefined : cat);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: category === cat }}
            accessibilityLabel={`Filter by ${cat}`}
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
            placeholderTextColor={theme.colors.textSecondary}
            value={newContent}
            onChangeText={setNewContent}
            multiline
            accessibilityLabel="New memory content"
          />
          <View style={styles.categoryButtons}>
            {(['core', 'daily', 'conversation'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catButton, newCategory === cat && styles.activeCatButton]}
                onPress={() => {
                  haptics.light();
                  setNewCategory(cat);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: newCategory === cat }}
              >
                <Text style={newCategory === cat ? styles.activeCatText : styles.catText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd} accessibilityRole="button" accessibilityLabel="Save memory">
            <Text style={styles.addButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            haptics.light();
            setShowAdd(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Add memory"
        >
          <Text style={styles.addButtonText}>+ Add Memory</Text>
        </TouchableOpacity>
      )}

      {error && <ErrorDisplay message="Failed to load memory" onRetry={handleRefresh} />}

      {loading && !entries ? (
        <LoadingSkeleton type="list" count={3} />
      ) : (
        <FlatList
          data={entries || []}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
          ListEmptyComponent={!loading ? <Text style={styles.empty}>No memory entries</Text> : null}
        />
      )}
    </View>
  );
}
