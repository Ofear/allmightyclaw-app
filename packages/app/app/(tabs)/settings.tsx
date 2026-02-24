import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../../lib/auth';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, mode, setMode, toggleTheme } = useTheme();
  const haptics = useHaptics();

  const handleLogout = async () => {
    haptics.medium();
    await logout();
    router.replace('/pair');
  };

  const handleNavigation = (route: string) => {
    haptics.light();
    router.push(route as never);
  };

  const handleThemeToggle = () => {
    haptics.light();
    toggleTheme();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    menuItem: { padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    menuText: { fontSize: 16, color: theme.colors.text },
    menuIcon: { color: theme.colors.textSecondary },
    themeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    themeLabel: { fontSize: 16, color: theme.colors.text },
    themeValue: { fontSize: 14, color: theme.colors.textSecondary },
    logoutButton: { backgroundColor: theme.dark ? '#3f1a1a' : '#FEE2E2', marginTop: 16 },
    logoutText: { fontSize: 16, color: theme.colors.error },
  });

  const menuItems = [
    { label: 'Servers', route: '/(tabs)/settings/servers' },
    { label: 'Memory', route: '/(tabs)/settings/memory' },
    { label: 'Scheduler', route: '/(tabs)/settings/scheduler' },
    { label: 'Config', route: '/(tabs)/settings/config' },
  ];

  return (
    <ScrollView style={styles.container} accessibilityLabel="Settings screen">
      <Text style={styles.title} accessibilityRole="header">Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.menuItem}>
          <Text style={styles.themeLabel}>Dark Mode</Text>
          <Switch
            value={theme.dark}
            onValueChange={handleThemeToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            accessibilityLabel="Toggle dark mode"
          />
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.themeLabel}>Theme</Text>
          <Text style={styles.themeValue}>{mode === 'system' ? 'System' : mode === 'dark' ? 'Dark' : 'Light'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.route)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label} settings`}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <Text style={styles.menuIcon}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.menuItem, styles.logoutButton]}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Logout"
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
