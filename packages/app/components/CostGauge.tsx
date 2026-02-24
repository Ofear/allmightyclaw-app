import { View, Text, StyleSheet } from 'react-native';
import type { CostSummary } from '../lib/types';

interface CostGaugeProps {
  cost: CostSummary;
  period?: 'session' | 'daily' | 'monthly';
}

export function CostGauge({ cost, period = 'session' }: CostGaugeProps) {
  const data = cost[period];
  const maxTokens = period === 'session' ? 100000 : period === 'daily' ? 1000000 : 10000000;
  const tokenPercentage = Math.min((data.tokens / maxTokens) * 100, 100);
  
  const getBarColor = () => {
    if (tokenPercentage < 50) return '#10B981';
    if (tokenPercentage < 80) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.period}>{period.charAt(0).toUpperCase() + period.slice(1)}</Text>
        <Text style={styles.cost}>${data.usd.toFixed(4)}</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.bar, { width: `${tokenPercentage}%`, backgroundColor: getBarColor() }]} />
      </View>
      <Text style={styles.tokens}>{data.tokens.toLocaleString()} tokens</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  period: { fontSize: 14, fontWeight: '600', color: '#111827' },
  cost: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
  barBackground: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 3 },
  tokens: { fontSize: 12, color: '#6B7280', marginTop: 4 },
});
