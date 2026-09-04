import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Download, FileText } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopRightRefresh } from '@/components/top-right-refresh';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/authStore';
import { getReports, type ReportRecord } from '@/services/reportService';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const TYPE_COLORS: Record<string, string> = {
  Attendance: '#0ea5e9',
  Summary: '#8b5cf6',
};

export default function ReportScreen() {
  const theme = useTheme();
  const { isAuthenticated, hasHydrated } = useAuth();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function fetchReports() {
      setLoading(true);
      setError(null);

      try {
        const data = await getReports();
        if (!cancelled) setReports(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchReports();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);

    getReports()
      .then((data) => {
        setReports(data);
      })
      .catch((e) => {
        setError((e as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownload = (report: ReportRecord) => {
    Alert.alert(
      'Download Report',
      `Report "${report.title}" can be downloaded from the web dashboard.`,
      [{ text: 'OK' }]
    );
  };

  if (!hasHydrated || !isAuthenticated) {
    return <ThemedView style={styles.container} />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="title">Report</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Review and download your attendance reports.
            </ThemedText>
          </View>
          <TopRightRefresh onPress={handleRefresh} loading={loading} />
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.error}>{error}</ThemedText>
            <TopRightRefresh onPress={handleRefresh} />
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.empty}>
            <FileText color={theme.textSecondary} size={48} />
            <ThemedText themeColor="textSecondary">
              No attendance reports are available yet.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {reports.map((report) => {
              const typeColor = TYPE_COLORS[report.type] || theme.textSecondary;
              return (
                <ThemedView key={report.id} type="card" style={styles.reportRow}>
                  <View style={styles.reportInfo}>
                    <FileText color={theme.primary} size={20} />
                    <View style={styles.reportDetails}>
                      <ThemedText type="smallBold">{report.title}</ThemedText>
                      <View style={styles.reportMeta}>
                        <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
                          <ThemedText type="small" style={{ color: typeColor, fontWeight: 600 }}>
                            {report.type}
                          </ThemedText>
                        </View>
                        <ThemedText type="small" themeColor="textSecondary">
                          {formatDate(report.generatedAt)}
                        </ThemedText>
                      </View>
                      {report.owner ? (
                        <ThemedText type="small" themeColor="textSecondary">
                          Owner: {report.owner}
                        </ThemedText>
                      ) : null}
                    </View>
                  </View>

                  <Pressable
                    onPress={() => handleDownload(report)}
                    style={[styles.downloadButton, { backgroundColor: theme.primary }]}>
                    <Download color={theme.primaryForeground} size={16} />
                    <ThemedText style={[styles.downloadText, { color: theme.primaryForeground }]}>
                      PDF
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              );
            })}
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  headerText: { flex: 1 },
  subtitle: { marginTop: 4 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
  },
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
  reportDetails: {
    flex: 1,
    gap: 2,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
