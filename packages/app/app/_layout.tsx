import { Stack } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="pair" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
