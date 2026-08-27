import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ReportScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Report</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Review and submit your attendance report.
        </ThemedText>
        <ThemedText style={styles.empty}>No attendance report is available yet.</ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  subtitle: { marginTop: 8 },
  empty: { marginTop: 48, textAlign: 'center' },
});
