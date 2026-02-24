import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useStatus, useCost, useHealth } from '../hooks/useApi';

export default function DashboardScreen() {
  const { data: status, loading: statusLoading, error: statusError, refetch: refetchStatus } = useStatus();
  const { data: cost, loading: costLoading, error: costError, refetch: refetchCost } = useCost();
  const { data: health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();

  const refetch = () => {
    refetchStatus();
    refetchCost();
    refetchHealth();
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getHealthColor = (h: string) => {
    switch (h) {
      case 'healthy': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'unhealthy': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={statusLoading || costLoading || healthLoading} onRefresh={refetch} />}
    >
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        {statusError ? (
          <Text style={styles.error}>Failed to load status</Text>
        ) : status ? (
          <View>
            <Text>Provider: {status.provider}</Text>
            <Text>Model: {status.model}</Text>
            <Text>Uptime: {formatUptime(status.uptime)}</Text>
            <Text>Health: <Text style={{ color: getHealthColor(status.health) }}>{status.health}</Text></Text>
            <Text>Channels: {status.channels.join(', ')}</Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cost Summary</Text>
        {costError ? (
          <Text style={styles.error}>Failed to load cost</Text>
        ) : cost ? (
          <View>
            <View style={styles.costRow}>
              <Text>Session</Text>
              <Text>${cost.session.usd.toFixed(4)} ({cost.session.tokens} tokens)</Text>
            </View>
            <View style={styles.costRow}>
              <Text>Daily</Text>
              <Text>${cost.daily.usd.toFixed(4)} ({cost.daily.tokens} tokens)</Text>
            </View>
            <View style={styles.costRow}>
              <Text>Monthly</Text>
              <Text>${cost.monthly.usd.toFixed(4)} ({cost.monthly.tokens} tokens)</Text>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health</Text>
        {healthError ? (
          <Text style={styles.error}>Failed to load health</Text>
        ) : health ? (
          <View>
            {Object.entries(health).map(([component, status]) => (
              <View key={component} style={styles.healthRow}>
                <Text>{component}</Text>
                <Text style={{ color: getHealthColor(status) }}>{status}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 24, padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  error: { color: '#EF4444' },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
