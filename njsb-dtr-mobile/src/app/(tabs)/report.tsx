import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, FileText } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

const reports = [
  { id: 1, name: 'Juan Dela Cruz - August 2026 DTR', generatedOn: 'Aug 20, 2026' },
  { id: 2, name: 'Maria Santos - August 2026 DTR', generatedOn: 'Aug 20, 2026' },
  { id: 3, name: 'Pedro Reyes - August 2026 DTR', generatedOn: 'Aug 20, 2026' },
];

function ReportScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title">Report</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Review and download your attendance reports.
          </ThemedText>
        </View>

        {reports.length === 0 ? (
          <View style={styles.empty}>
            <FileText color={theme.textSecondary} size={48} />
            <ThemedText themeColor="textSecondary">
              No attendance reports are available yet.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {reports.map((report) => (
              <ThemedView key={report.id} type="card" style={styles.reportRow}>
                <View style={styles.reportInfo}>
                  <FileText color={theme.primary} size={20} />
                  <View>
                    <ThemedText type="smallBold">{report.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      Generated on {report.generatedOn}
                    </ThemedText>
                  </View>
                </View>
                <Pressable style={[styles.downloadButton, { backgroundColor: theme.primary }]}>
                  <Download color={theme.primaryForeground} size={16} />
                  <ThemedText style={[styles.downloadText, { color: theme.primaryForeground }]}>
                    PDF
                  </ThemedText>
                </Pressable>
              </ThemedView>
            ))}
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  header: { marginBottom: 24 },
  subtitle: { marginTop: 4 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  list: { gap: Spacing.two },
  reportRow: {
    borderRadius: 12,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ReportScreen;
