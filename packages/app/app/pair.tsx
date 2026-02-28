import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { pairWithServer } from '../lib/auth';
import { checkHealth } from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';

export default function PairScreen() {
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'url' | 'code'>('url');
  const { theme } = useTheme();
  const haptics = useHaptics();

  const handleCheckServer = async () => {
    if (!serverUrl.trim()) {
      setError('Please enter a server URL');
      haptics.warning();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const healthy = await checkHealth(serverUrl.trim());
      if (healthy) {
        haptics.success();
        setStep('code');
      } else {
        haptics.error();
        setError('Server is not reachable');
      }
    } catch {
      haptics.error();
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handlePair = async () => {
    if (!pairingCode.trim() || pairingCode.length !== 6) {
      setError('Please enter a valid 6-character pairing code');
      haptics.warning();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await pairWithServer(serverUrl.trim(), pairingCode.trim());
      haptics.success();
      router.replace('/(tabs)');
    } catch (err) {
      haptics.error();
      setError(err instanceof Error ? err.message : 'Pairing failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: theme.colors.background },
    logo: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 48 },
    label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
    hint: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8 },
    input: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 8, fontSize: 16, marginBottom: 16, color: theme.colors.text },
    button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: theme.colors.primary + '60' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    backButton: { marginTop: 16, alignItems: 'center' },
    backButtonText: { color: theme.colors.textSecondary, fontSize: 14 },
    errorContainer: { backgroundColor: theme.dark ? '#3f1a1a' : '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 },
    errorText: { color: theme.colors.error, textAlign: 'center' },
  });

  return (
    <View style={styles.container} accessibilityLabel="Pair with server">
      <Text style={styles.logo} accessibilityRole="header">AllMightyClaw</Text>
      <Text style={styles.subtitle}>Connect to your AI agent</Text>

      {error && (
        <View style={styles.errorContainer} accessibilityRole="alert">
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {step === 'url' ? (
        <>
          <Text style={styles.label}>Server URL</Text>
          <TextInput
            style={styles.input}
            placeholder="http://192.168.1.50:42617"
            placeholderTextColor={theme.colors.textSecondary}
            value={serverUrl}
            onChangeText={setServerUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            accessibilityLabel="Server URL input"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCheckServer}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Connect to server"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Pairing Code</Text>
          <Text style={styles.hint}>Enter the 6-character code shown in your AllMightyClaw terminal</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXXXX"
            placeholderTextColor={theme.colors.textSecondary}
            value={pairingCode}
            onChangeText={setPairingCode}
            maxLength={6}
            autoCapitalize="characters"
            accessibilityLabel="Pairing code input"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePair}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Pair with server"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Pair</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            haptics.light();
            setStep('url');
            setError(null);
          }} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
