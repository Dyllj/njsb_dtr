import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Calendar as CalendarIcon, Search } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface Intern {
  id: string;
  firstName: string;
  mi?: string;
  lastName: string;
  totalHours: number;
  accumulatedHours: number;
}

function formatHours(h: number) {
  return `${h.toFixed(2)} hrs`;
}

function HoursScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [interns] = useState<Intern[]>([
    { id: 'I-001', firstName: 'Alice', mi: 'B.', lastName: 'Garcia', totalHours: 480, accumulatedHours: 120 },
    { id: 'I-002', firstName: 'Bob', mi: 'C.', lastName: 'Lee', totalHours: 300, accumulatedHours: 200 },
    { id: 'I-003', firstName: 'Cara', mi: 'D.', lastName: 'Nguyen', totalHours: 400, accumulatedHours: 50 },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interns;
    return interns.filter((it) =>
      [it.id, it.firstName, it.mi || '', it.lastName]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [interns, query]);

  const totalAccumulated = filtered.reduce((sum, it) => sum + it.accumulatedHours, 0);
  const totalRemaining = filtered.reduce((sum, it) => sum + Math.max(0, it.totalHours - it.accumulatedHours), 0);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.header}>
          <ThemedText type="title">My Hours</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Track your accumulated and remaining hours
          </ThemedText>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search color={theme.textSecondary} size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name or ID"
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text, backgroundColor: 'transparent' }]}
            onChangeText={setQuery}
            value={query}
          />
        </View>

        <View style={styles.summaryRow}>
          <ThemedView type="card" style={styles.summaryCard}>
            <Clock color={theme.primary} size={20} />
            <ThemedText type="smallBold" style={styles.summaryValue}>
              {formatHours(totalAccumulated)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Accumulated
            </ThemedText>
          </ThemedView>

          <ThemedView type="card" style={styles.summaryCard}>
            <CalendarIcon color={theme.primary} size={20} />
            <ThemedText type="smallBold" style={styles.summaryValue}>
              {formatHours(totalRemaining)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Remaining
            </ThemedText>
          </ThemedView>
        </View>

        <View style={styles.list}>
          {filtered.length === 0 ? (
            <ThemedText themeColor="textSecondary" style={styles.empty}>
              No interns found.
            </ThemedText>
          ) : (
            filtered.map((it) => {
              const remaining = Math.max(0, it.totalHours - it.accumulatedHours);
              const progress = it.totalHours > 0 ? (it.accumulatedHours / it.totalHours) * 100 : 0;

              return (
                <ThemedView key={it.id} type="card" style={styles.internRow}>
                  <View style={styles.internInfo}>
                    <ThemedText type="smallBold">
                      {it.firstName} {it.mi || ''} {it.lastName}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {it.id}
                    </ThemedText>
                  </View>

                  <View style={styles.hoursInfo}>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.hoursLabel}>
                      {formatHours(remaining)} left
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
                </ThemedView>
              );
            })
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  header: { marginBottom: 24 },
  subtitle: { marginTop: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
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
  list: { gap: Spacing.two },
  internRow: {
    borderRadius: 12,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  internInfo: { flex: 1, gap: 2 },
  hoursInfo: { alignItems: 'flex-end', minWidth: 80 },
  hoursLabel: { marginBottom: 4 },
  progressBar: {
    width: 64,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  empty: { textAlign: 'center', marginTop: 32 },
});

export default HoursScreen;
