import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { pairWithServer } from '../lib/auth';
import { checkHealth } from '../lib/api';

export default function PairScreen() {
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'url' | 'code'>('url');

  const handleCheckServer = async () => {
    if (!serverUrl.trim()) {
      Alert.alert('Error', 'Please enter a server URL');
      return;
    }

    setLoading(true);
    try {
      const healthy = await checkHealth(serverUrl.trim());
      if (healthy) {
        setStep('code');
      } else {
        Alert.alert('Error', 'Server is not reachable');
      }
    } catch {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handlePair = async () => {
    if (!pairingCode.trim() || pairingCode.length !== 8) {
      Alert.alert('Error', 'Please enter a valid 8-character pairing code');
      return;
    }

    setLoading(true);
    try {
      await pairWithServer(serverUrl.trim(), pairingCode.trim());
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Pairing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AllMightyClaw</Text>
      <Text style={styles.subtitle}>Connect to your AI agent</Text>

      {step === 'url' ? (
        <>
          <Text style={styles.label}>Server URL</Text>
          <TextInput
            style={styles.input}
            placeholder="http://192.168.1.50:42617"
            value={serverUrl}
            onChangeText={setServerUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCheckServer}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Connecting...' : 'Connect'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Pairing Code</Text>
          <Text style={styles.hint}>Enter the 8-character code shown in your AllMightyClaw terminal</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXXXXXX"
            value={pairingCode}
            onChangeText={setPairingCode}
            maxLength={8}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePair}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Pairing...' : 'Pair'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('url')}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#2563EB', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 48 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  hint: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  input: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  backButton: { marginTop: 16, alignItems: 'center' },
  backButtonText: { color: '#6B7280', fontSize: 14 },
});