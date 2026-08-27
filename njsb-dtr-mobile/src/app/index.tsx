import { router, type Href } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [internId, setInternId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    if (!internId.trim() || !password) {
      setError('Enter your intern ID and password to continue.');
      return;
    }

    setError('');
    router.replace('/(tabs)/scan' as Href);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.content}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <ThemedText style={styles.logoText}>DTR</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>Intern Timekeeping</ThemedText>
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
              placeholder="e.g. INT-0001"
              placeholderTextColor="#8d9299"
              style={styles.input}
              value={internId}
            />
            <ThemedText type="smallBold">Password</ThemedText>
            <TextInput
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#8d9299"
              secureTextEntry
              style={styles.input}
              value={password}
            />
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            <Pressable onPress={handleLogin} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <ThemedText style={styles.buttonText}>Sign in</ThemedText>
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
    backgroundColor: '#1769aa',
    borderRadius: 18,
    height: 72,
    justifyContent: 'center',
    marginBottom: 20,
    width: 72,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
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
    gap: 10,
  },
  input: {
    borderColor: '#d7dbe0',
    borderRadius: 10,
    borderWidth: 1,
    color: '#111',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
  },
  error: {
    color: '#c62828',
    marginBottom: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1769aa',
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
