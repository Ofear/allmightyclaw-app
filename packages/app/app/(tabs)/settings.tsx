import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useServers } from '../hooks/useServers';
import { logout } from '../lib/auth';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/pair');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/servers')}>
        <Text style={styles.menuText}>Servers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/memory')}>
        <Text style={styles.menuText}>Memory</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/scheduler')}>
        <Text style={styles.menuText}>Scheduler</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/config')}>
        <Text style={styles.menuText}>Config</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  menuItem: { padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 12 },
  menuText: { fontSize: 16, color: '#111827' },
  logoutButton: { backgroundColor: '#FEE2E2' },
  logoutText: { fontSize: 16, color: '#EF4444' },
});
