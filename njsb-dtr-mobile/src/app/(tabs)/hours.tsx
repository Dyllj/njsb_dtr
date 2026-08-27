import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HoursScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">My hours</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>Today&apos;s attendance record</ThemedText>
        <View style={styles.card}>
          <ThemedText type="small" themeColor="textSecondary">CURRENT STATUS</ThemedText>
          <ThemedText type="subtitle" style={styles.status}>Not clocked in</ThemedText>
          <ThemedText themeColor="textSecondary">Scan your workplace QR code to start your shift.</ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  subtitle: { marginTop: 8 },
  card: { backgroundColor: '#f0f0f3', borderRadius: 16, marginTop: 32, padding: 20 },
  status: { fontSize: 24, lineHeight: 32, marginVertical: 12 },
});
