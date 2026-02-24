import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 4, style }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

interface LoadingSkeletonProps {
  count?: number;
  type?: 'text' | 'card' | 'list' | 'dashboard';
}

export function LoadingSkeleton({ count = 3, type = 'text' }: LoadingSkeletonProps) {
  const renderTextSkeleton = () => (
    <View style={styles.textContainer}>
      <Skeleton width="80%" height={16} style={styles.mb8} />
      <Skeleton width="60%" height={14} style={styles.mb8} />
      <Skeleton width="90%" height={14} />
    </View>
  );

  const renderCardSkeleton = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Skeleton width={120} height={16} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
      <Skeleton width="100%" height={14} style={styles.mt8} />
      <Skeleton width="70%" height={14} style={styles.mt8} />
    </View>
  );

  const renderListSkeleton = () => (
    <View style={styles.listItem}>
      <View style={styles.listRow}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.listContent}>
          <Skeleton width={120} height={14} />
          <Skeleton width={200} height={12} style={styles.mt4} />
        </View>
      </View>
    </View>
  );

  const renderDashboardSkeleton = () => (
    <View style={styles.dashboard}>
      <View style={styles.section}>
        <Skeleton width={120} height={18} style={styles.mb12} />
        <View style={styles.dashboardRow}>
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.dashboardRow}>
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.dashboardRow}>
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={14} />
        </View>
      </View>
      <View style={styles.section}>
        <Skeleton width={120} height={18} style={styles.mb12} />
        <Skeleton width="100%" height={80} borderRadius={8} />
      </View>
    </View>
  );

  const skeletons = [];
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'card':
        skeletons.push(<View key={i}>{renderCardSkeleton()}</View>);
        break;
      case 'list':
        skeletons.push(<View key={i}>{renderListSkeleton()}</View>);
        break;
      case 'dashboard':
        skeletons.push(<View key={i}>{renderDashboardSkeleton()}</View>);
        break;
      default:
        skeletons.push(<View key={i}>{renderTextSkeleton()}</View>);
    }
  }

  return <>{skeletons}</>;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  textContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    marginLeft: 12,
    flex: 1,
  },
  dashboard: {
    padding: 16,
  },
  section: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mb4: {
    marginBottom: 4,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mt4: {
    marginTop: 4,
  },
  mt8: {
    marginTop: 8,
  },
});
