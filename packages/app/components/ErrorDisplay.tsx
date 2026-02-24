import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleRetry = () => {
    haptics.light();
    onRetry?.();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.dark ? '#3f1a1a' : '#FEE2E2',
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    message: {
      color: theme.colors.error,
      fontSize: 14,
      flex: 1,
    },
    retryButton: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginLeft: 12,
    },
    retryText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <View style={styles.row}>
        <Text style={styles.message}>{message}</Text>
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            accessibilityLabel="Retry"
            accessibilityHint="Attempts to load the data again"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
