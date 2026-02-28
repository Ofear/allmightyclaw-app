import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getToken } from '../../lib/api';

export default function TabLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    getToken()
      .then(token => setIsAuthenticated(!!token))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/pair');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{ title: 'Chat', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="tools"
        options={{ title: 'Tools', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: () => null }}
      />
    </Tabs>
  );
}
