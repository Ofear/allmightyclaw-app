import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useStatus, useCost, useHealth } from '../../hooks/useApi';
import { useTheme } from '../../context/ThemeContext';
import { LoadingSkeleton, ErrorDisplay } from '../../components';
import { useHaptics } from '../../hooks/useHaptics';

export default function DashboardScreen() {
  const { data: status, loading: statusLoading, error: statusError, refetch: refetchStatus } = useStatus();
  const { data: cost, loading: costLoading, error: costError, refetch: refetchCost } = useCost();
  const { data: health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();
  const { theme } = useTheme();
  const haptics = useHaptics();

  const refetch = () => {
    haptics.light();
    refetchStatus();
    refetchCost();
    refetchHealth();
  };

  const isLoading = statusLoading || costLoading || healthLoading;

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getHealthColor = (h: string) => {
    switch (h) {
      case 'healthy': return theme.colors.success;
      case 'degraded': return theme.colors.warning;
      case 'unhealthy': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    section: { marginBottom: 24, padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: theme.colors.text },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    rowLabel: { color: theme.colors.text },
    rowValue: { color: theme.colors.textSecondary },
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={theme.colors.primary} />}
      accessibilityLabel="Dashboard screen"
    >
      <Text style={styles.title} accessibilityRole="header">Dashboard</Text>

      <View style={styles.section} accessibilityLabel="System Status section">
        <Text style={styles.sectionTitle}>System Status</Text>
        {statusError ? (
          <ErrorDisplay message="Failed to load status" onRetry={refetchStatus} />
        ) : status ? (
          <View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Provider</Text>
              <Text style={styles.rowValue}>{status.provider}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Model</Text>
              <Text style={styles.rowValue}>{status.model}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Uptime</Text>
              <Text style={styles.rowValue}>{formatUptime(status.uptime)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Health</Text>
              <Text style={{ color: getHealthColor(status.health) }}>{status.health}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Channels</Text>
              <Text style={styles.rowValue}>{status.channels.join(', ')}</Text>
            </View>
          </View>
        ) : (
          <LoadingSkeleton type="text" count={1} />
        )}
      </View>

      <View style={styles.section} accessibilityLabel="Cost Summary section">
        <Text style={styles.sectionTitle}>Cost Summary</Text>
        {costError ? (
          <ErrorDisplay message="Failed to load cost" onRetry={refetchCost} />
        ) : cost ? (
          <View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Session</Text>
              <Text style={styles.rowValue}>${cost.session.usd.toFixed(4)} ({cost.session.tokens} tokens)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Daily</Text>
              <Text style={styles.rowValue}>${cost.daily.usd.toFixed(4)} ({cost.daily.tokens} tokens)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Monthly</Text>
              <Text style={styles.rowValue}>${cost.monthly.usd.toFixed(4)} ({cost.monthly.tokens} tokens)</Text>
            </View>
          </View>
        ) : (
          <LoadingSkeleton type="text" count={1} />
        )}
      </View>

      <View style={styles.section} accessibilityLabel="Health section">
        <Text style={styles.sectionTitle}>Health</Text>
        {healthError ? (
          <ErrorDisplay message="Failed to load health" onRetry={refetchHealth} />
        ) : health ? (
          <View>
            {Object.entries(health).map(([component, healthStatus]) => (
              <View key={component} style={styles.row}>
                <Text style={styles.rowLabel}>{component}</Text>
                <Text style={{ color: getHealthColor(healthStatus) }}>{healthStatus}</Text>
              </View>
            ))}
          </View>
        ) : (
          <LoadingSkeleton type="text" count={1} />
        )}
      </View>
    </ScrollView>
  );
}
