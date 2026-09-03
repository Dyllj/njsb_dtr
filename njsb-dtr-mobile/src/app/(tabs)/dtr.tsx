import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CalendarRange, ChevronLeft, ChevronRight, FileDown, RefreshCw, LogOut } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/authStore';
import { getInternById, type InternProfile } from '@/services/internService';
import {
  getDtrForMonth,
  type AttendanceRecord,
  type AttendanceSession,
} from '@/services/attendanceService';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type DtrCell = {
  amIn: string | null;
  amOut: string | null;
  pmIn: string | null;
  pmOut: string | null;
};

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';

  try {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).toUpperCase();
    }
  } catch {
    // fall through to time-only parsing
  }

  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
}

function formatDateLong(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Group raw attendance rows by date and split into AM/PM time-in/out cells.
 * Each date can have up to 2 rows (AM + PM).
 */
function buildDtrMatrix(records: AttendanceRecord[]): Record<string, DtrCell> {
  const matrix: Record<string, DtrCell> = {};
  for (const r of records) {
    if (!matrix[r.date]) {
      matrix[r.date] = { amIn: null, amOut: null, pmIn: null, pmOut: null };
    }
    const cell = matrix[r.date];
    if (r.session === 'AM') {
      cell.amIn = r.timeIn;
      cell.amOut = r.timeOut;
    } else {
      cell.pmIn = r.timeIn;
      cell.pmOut = r.timeOut;
    }
  }
  return matrix;
}

function buildDtrHtml(args: {
  intern: InternProfile;
  monthLabel: string;
  year: number;
  month: number;
  rows: Array<{ date: string; cell: DtrCell }>;
}): string {
  const { intern, monthLabel, year, month, rows } = args;
  const generatedAt = new Date().toLocaleString();

  const rowHtml = rows
    .map(
      (r) => `
      <tr>
        <td>${formatDateLong(r.date)}</td>
        <td>${formatTime(r.cell.amIn) || '&mdash;'}</td>
        <td>${formatTime(r.cell.amOut) || '&mdash;'}</td>
        <td>${formatTime(r.cell.pmIn) || '&mdash;'}</td>
        <td>${formatTime(r.cell.pmOut) || '&mdash;'}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DTR - ${intern.firstName} ${intern.lastName} - ${monthLabel} ${year}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        margin: 32px;
        color: #0f172a;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 2px solid #0f172a;
        padding-bottom: 12px;
        margin-bottom: 20px;
      }
      .title {
        font-size: 22px;
        font-weight: 700;
        margin: 0;
      }
      .subtitle {
        font-size: 13px;
        color: #475569;
        margin: 4px 0 0;
      }
      .meta {
        text-align: right;
        font-size: 11px;
        color: #475569;
      }
      .meta strong { color: #0f172a; }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      th, td {
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        text-align: left;
      }
      th {
        background: #f1f5f9;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 0.5px;
      }
      td:nth-child(n+2) { text-align: center; font-variant-numeric: tabular-nums; }
      tbody tr:nth-child(even) { background: #f8fafc; }
      .footer {
        margin-top: 24px;
        font-size: 10px;
        color: #94a3b8;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1 class="title">Daily Time Record</h1>
        <p class="subtitle">${monthLabel} ${year}</p>
      </div>
      <div class="meta">
        <div><strong>${intern.firstName} ${intern.lastName}</strong></div>
        <div>${intern.id}</div>
        <div>Generated: ${generatedAt}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>AM In</th>
          <th>AM Out</th>
          <th>PM In</th>
          <th>PM Out</th>
        </tr>
      </thead>
      <tbody>
        ${rowHtml || '<tr><td colspan="5" style="text-align:center;color:#94a3b8;">No attendance records for this month.</td></tr>'}
      </tbody>
    </table>
    <div class="footer">NJSB DTR &middot; Mobile app</div>
  </body>
</html>`;
}

export default function DtrScreen() {
  const theme = useTheme();
  const { intern: authIntern, isAuthenticated, hasHydrated, logout } = useAuth();
  const [intern, setIntern] = useState<InternProfile | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hasHydrated, isAuthenticated]);

  const fetchData = useCallback(async () => {
    if (!authIntern) return;
    setLoading(true);
    setError(null);
    try {
      const [profile, dtr] = await Promise.all([
        getInternById(authIntern.id),
        getDtrForMonth(authIntern.id, viewYear, viewMonth),
      ]);
      setIntern(profile);
      setRecords(dtr);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [authIntern, viewYear, viewMonth]);

  useEffect(() => {
    if (!hasHydrated || !authIntern) return;
    void fetchData();
  }, [hasHydrated, authIntern, fetchData]);

  const matrix = useMemo(() => buildDtrMatrix(records), [records]);

  // Build a chronological list of dates in the month that have any record.
  const rows = useMemo(() => {
    return Object.keys(matrix)
      .sort((a, b) => a.localeCompare(b))
      .map((date) => ({ date, cell: matrix[date] }));
  }, [matrix]);

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const handlePrint = async () => {
    if (!intern) return;
    setPrinting(true);
    try {
      const html = buildDtrHtml({
        intern,
        monthLabel: MONTH_NAMES[viewMonth],
        year: viewYear,
        month: viewMonth,
        rows,
      });
      const { uri } = await Print.printToFileAsync({ html });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `DTR - ${MONTH_NAMES[viewMonth]} ${viewYear}`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (e) {
      setError(`Failed to generate PDF: ${(e as Error).message}`);
    } finally {
      setPrinting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (!hasHydrated || !isAuthenticated || !authIntern) {
    return <ThemedView style={styles.container} />;
  }

  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <ThemedText type="title">DTR</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Daily Time Record — {monthLabel}
            </ThemedText>
          </View>
        </View>

        <View style={styles.monthNav}>
          <Pressable
            onPress={goPrev}
            style={[styles.chevronBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ChevronLeft color={theme.primary} size={20} />
          </Pressable>

          <Pressable
            onPress={goToday}
            style={[styles.monthLabelBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <CalendarRange color={theme.primary} size={16} />
            <ThemedText type="smallBold" style={{ color: theme.text, marginLeft: 6 }}>
              {monthLabel}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={goNext}
            style={[styles.chevronBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ChevronRight color={theme.primary} size={20} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.error}>{error}</ThemedText>
            <Pressable
              onPress={fetchData}
              style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <RefreshCw color={theme.primary} size={20} />
              <ThemedText type="small" style={{ color: theme.text, marginLeft: 4 }}>
                Retry
              </ThemedText>
            </Pressable>
          </View>
        ) : rows.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              No attendance records for {monthLabel}.
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              Time in/out will appear here as you scan the QR.
            </ThemedText>
          </View>
        ) : (
          <ScrollView style={styles.tableScroll} contentContainerStyle={styles.tableScrollContent}>
            <ThemedView type="card" style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <ThemedText type="smallBold" style={[styles.headerCell, styles.dateCell]}>
                  Date
                </ThemedText>
                <ThemedText type="smallBold" style={styles.headerCell}>AM In</ThemedText>
                <ThemedText type="smallBold" style={styles.headerCell}>AM Out</ThemedText>
                <ThemedText type="smallBold" style={styles.headerCell}>PM In</ThemedText>
                <ThemedText type="smallBold" style={styles.headerCell}>PM Out</ThemedText>
              </View>

              {rows.map((r) => (
                <View key={r.date} style={styles.tableRow}>
                  <ThemedText style={[styles.cell, styles.dateCell]} numberOfLines={1}>
                    {formatDateLong(r.date)}
                  </ThemedText>
                  <ThemedText style={styles.cell}>{formatTime(r.cell.amIn) || '—'}</ThemedText>
                  <ThemedText style={styles.cell}>{formatTime(r.cell.amOut) || '—'}</ThemedText>
                  <ThemedText style={styles.cell}>{formatTime(r.cell.pmIn) || '—'}</ThemedText>
                  <ThemedText style={styles.cell}>{formatTime(r.cell.pmOut) || '—'}</ThemedText>
                </View>
              ))}
            </ThemedView>
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Pressable
            onPress={handlePrint}
            disabled={printing}
            style={[
              styles.printButton,
              { backgroundColor: theme.primary, opacity: printing ? 0.7 : 1 },
            ]}>
            <FileDown color={theme.primaryForeground} size={18} />
            <ThemedText style={[styles.printText, { color: theme.primaryForeground }]}>
              {printing ? 'Generating PDF…' : 'Print / Export PDF'}
            </ThemedText>
          </Pressable>

          <View style={styles.footerRow}>
            <Pressable
              onPress={fetchData}
              style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <RefreshCw color={theme.primary} size={20} />
              <ThemedText type="small" style={{ color: theme.text, marginLeft: 4 }}>
                Refresh
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <LogOut color={theme.primary} size={20} />
              <ThemedText type="small" style={{ color: theme.text, marginLeft: 4 }}>
                Logout
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  header: { marginBottom: 16 },
  subtitle: { marginTop: 4 },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  chevronBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  error: { color: '#c62828', textAlign: 'center' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: { textAlign: 'center' },
  emptyHint: { textAlign: 'center', maxWidth: 240 },
  tableScroll: { flex: 1 },
  tableScrollContent: { paddingBottom: Spacing.two },
  tableCard: {
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  dateCell: { flex: 1.4, textAlign: 'left' },
  footer: { marginTop: Spacing.three, gap: Spacing.two },
  footerRow: { flexDirection: 'row', gap: Spacing.two },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  printText: { fontSize: 15, fontWeight: '600' },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
  },
});
