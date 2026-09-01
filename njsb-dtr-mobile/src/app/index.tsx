import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/stores/authStore';

export default function HomeScreen() {
  const theme = useTheme();
  const { isAuthenticated, hasHydrated, isLoading, login } = useAuth();
  const [internId, setInternId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace('/(tabs)/scan');
    }
  }, [hasHydrated, isAuthenticated]);

  if (!hasHydrated || (hasHydrated && isAuthenticated)) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  async function handleLogin() {
    if (!internId.trim()) {
      setError('Enter your Intern ID to continue.');
      return;
    }

    setError('');
    try {
      await login(internId.trim());
      router.replace('/(tabs)/scan');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.content}>
          <View style={styles.brand}>
            <View style={[styles.logo, { backgroundColor: theme.primary }]}>
              <LogIn color={theme.primaryForeground} size={32} strokeWidth={2.5} />
            </View>
            <ThemedText type="title" style={styles.title}>
              Intern Timekeeping
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Sign in to record your attendance
            </ThemedText>
          </View>

          <View style={styles.form}>
            <ThemedText type="smallBold">Intern ID</ThemedText>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setInternId}
              placeholder="e.g. I-001"
              placeholderTextColor="#8d9299"
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              value={internId}
            />

            <ThemedText type="smallBold">Password</ThemedText>
            <TextInput
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#8d9299"
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              value={password}
            />

            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

            <ThemedView type="backgroundElement" style={styles.credentialsCard}>
              <ThemedText type="small" themeColor="textSecondary">
                Enter the Intern ID provided by your administrator.
              </ThemedText>
            </ThemedView>

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
                isLoading && { opacity: 0.7 },
              ]}>
              {isLoading ? (
                <ActivityIndicator color={theme.primaryForeground} />
              ) : (
                <ThemedText style={[styles.buttonText, { color: theme.primaryForeground }]}>
                  Sign in
                </ThemedText>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    alignItems: 'center',
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginBottom: 24,
    width: 80,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    gap: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    color: '#c62828',
    marginTop: 2,
  },
  credentialsCard: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
  },
  credentialsText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
