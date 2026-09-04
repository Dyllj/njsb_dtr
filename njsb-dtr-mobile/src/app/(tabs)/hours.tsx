import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clock, Calendar as CalendarIcon } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopRightRefresh } from '@/components/top-right-refresh';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/authStore';
import { getInternById, type InternProfile } from '@/services/internService';
import { getAttendanceByIntern, type AttendanceRecord } from '@/services/attendanceService';

function formatHours(h: number) {
  return `${h.toFixed(2)} hrs`;
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '—';

  try {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  } catch {
    // fall through
  }

  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
}

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

const STATUS_COLORS: Record<string, string> = {
  PRESENT: '#16a34a',
  ABSENT: '#dc2626',
  LATE: '#f59e0b',
  UNDERTIME: '#eab308',
};

function HoursScreen() {
  const theme = useTheme();
  const { intern: authIntern, isAuthenticated, hasHydrated } = useAuth();
  const [intern, setIntern] = useState<InternProfile | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (!hasHydrated || !authIntern) return;

    const internId = authIntern.id;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [profile, attendance] = await Promise.all([
          getInternById(internId),
          getAttendanceByIntern(internId),
        ]);

        if (!cancelled) {
          setIntern(profile);
          setRecords(attendance);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [authIntern, hasHydrated]);

  const handleRefresh = () => {
    if (!authIntern) return;

    setLoading(true);
    setError(null);
    setRecords([]);

    Promise.all([
      getInternById(authIntern.id),
      getAttendanceByIntern(authIntern.id),
    ])
      .then(([profile, attendance]) => {
        setIntern(profile);
        setRecords(attendance);
      })
      .catch((e) => {
        setError((e as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!hasHydrated || !isAuthenticated || !authIntern) {
    return <ThemedView style={styles.container} />;
  }

  const remaining = intern ? Math.max(0, intern.totalHours - intern.accumulatedHours) : 0;
  const progress = intern && intern.totalHours > 0
    ? (intern.accumulatedHours / intern.totalHours) * 100
    : 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="title">My Hours</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Track your accumulated and remaining hours
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
        ) : intern ? (
          <>
            <View style={styles.summaryRow}>
              <ThemedView type="card" style={styles.summaryCard}>
                <Clock color={theme.primary} size={20} />
                <ThemedText type="smallBold" style={styles.summaryValue}>
                  {formatHours(intern.accumulatedHours)}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Accumulated
                </ThemedText>
              </ThemedView>

              <ThemedView type="card" style={styles.summaryCard}>
                <CalendarIcon color={theme.primary} size={20} />
                <ThemedText type="smallBold" style={styles.summaryValue}>
                  {formatHours(remaining)}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Remaining
                </ThemedText>
              </ThemedView>
            </View>

            <View style={styles.progressSection}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.progressLabel}>
                {progress.toFixed(1)}% complete
              </ThemedText>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(progress, 100)}%`, backgroundColor: theme.primary },
                  ]}
                />
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Recent Attendance
              </ThemedText>
              {records.length === 0 ? (
                <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
                  No attendance records yet.
                </ThemedText>
              ) : (
                <View style={styles.list}>
                  {records.slice(0, 10).map((record) => (
                    <ThemedView key={record.id} type="card" style={styles.attendanceRow}>
                      <View style={styles.attendanceDate}>
                        <ThemedText type="smallBold">
                          {formatDate(record.date)}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {record.session}
                        </ThemedText>
                      </View>
                      <View style={styles.attendanceTimes}>
                        <ThemedText type="small">
                          In: {formatTime(record.timeIn)}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          Out: {formatTime(record.timeOut)}
                        </ThemedText>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[record.status] || theme.textSecondary }]}>
                        <ThemedText type="small" style={{ color: '#ffffff', fontWeight: 600 }}>
                          {record.status}
                        </ThemedText>
                      </View>
                    </ThemedView>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            No intern data available.
          </ThemedText>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

export default HoursScreen;

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
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  summaryValue: {
    fontSize: 18,
  },
  progressSection: {
    marginBottom: Spacing.four,
  },
  progressLabel: {
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    marginBottom: Spacing.two,
    fontSize: 14,
  },
  list: { gap: Spacing.two },
  attendanceRow: {
    borderRadius: 12,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attendanceDate: {
    flex: 1,
  },
  attendanceTimes: {
    flex: 1,
    gap: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  empty: { textAlign: 'center', marginTop: 32 },
});
