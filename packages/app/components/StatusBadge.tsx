import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'connected' | 'disconnected' | 'enabled' | 'disabled';
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getColor = () => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'enabled':
        return '#10B981';
      case 'degraded':
        return '#F59E0B';
      case 'unhealthy':
      case 'disconnected':
      case 'disabled':
        return '#EF4444';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'degraded': return 'Degraded';
      case 'unhealthy': return 'Unhealthy';
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'enabled': return 'Enabled';
      case 'disabled': return 'Disabled';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getColor() }, size === 'small' && styles.small]}>
      <Text style={[styles.text, size === 'small' && styles.smallText]}>{getLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  small: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
  smallText: { fontSize: 10 },
});
