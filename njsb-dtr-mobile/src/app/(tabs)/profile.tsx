import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Check,
  Edit3,
  LogOut,
  Mail,
  User as UserIcon,
  X,
} from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/authStore';
import { useAuthStore } from '@/stores/authStore';
import {
  getInternById,
  updateInternProfile,
  type InternProfile,
} from '@/services/internService';

function InfoRow({
  icon,
  label,
  value,
  editable,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  editable?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!editable}
      style={({ pressed }) => [
        styles.infoRow,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && editable && { opacity: 0.7 },
      ]}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoContent}>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.infoValue}>
          {value || '—'}
        </ThemedText>
      </View>
      {editable ? (
        <Edit3 color={theme.textSecondary} size={16} />
      ) : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { intern: authIntern, isAuthenticated, hasHydrated, logout } = useAuth();

  const [profile, setProfile] = useState<InternProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editField, setEditField] = useState<'username' | 'email' | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hasHydrated, isAuthenticated]);

  const fetchProfile = async () => {
    if (!authIntern) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getInternById(authIntern.id);
      setProfile(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasHydrated || !authIntern) return;
    void fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, authIntern]);

  const openEdit = (field: 'username' | 'email') => {
    if (!profile) return;
    setEditField(field);
    setDraftValue((profile[field] as string | null) ?? '');
  };

  const closeEdit = () => {
    if (saving) return;
    setEditField(null);
    setDraftValue('');
  };

  const saveEdit = async () => {
    if (!profile || !editField) return;
    const trimmed = draftValue.trim();
    if (!trimmed) {
      Alert.alert('Validation', `${editField === 'username' ? 'Username' : 'Email'} cannot be empty.`);
      return;
    }
    if (editField === 'email' && !/^\S+@\S+\.\S+$/.test(trimmed)) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateInternProfile(profile.id, {
        [editField]: trimmed,
      });
      setProfile(updated);
      // Keep the auth store in sync so the rest of the app sees the new value.
      useAuthStore.setState((s) =>
        s.intern
          ? {
              intern: {
                ...s.intern,
                username: updated.username,
                email: updated.email,
              },
            }
          : s
      );
      closeEdit();
    } catch (e) {
      Alert.alert('Save failed', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  if (!hasHydrated || !isAuthenticated || !authIntern) {
    return <ThemedView style={styles.container} />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ThemedText type="title">Profile</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              View and update your personal information
            </ThemedText>
          </View>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : profile ? (
            <>
              <ThemedView type="card" style={styles.identityCard}>
                <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                  <UserIcon color={theme.primaryForeground} size={32} />
                </View>
                <View style={styles.identityText}>
                  <ThemedText type="subtitle" style={styles.fullName}>
                    {profile.firstName} {profile.lastName}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {profile.id} · {profile.status}
                  </ThemedText>
                </View>
              </ThemedView>

              <ThemedText type="smallBold" style={styles.sectionLabel}>
                Account
              </ThemedText>
              <InfoRow
                icon={<UserIcon color={theme.primary} size={18} />}
                label="Username"
                value={profile.username}
                editable
                onPress={() => openEdit('username')}
              />
              <InfoRow
                icon={<Mail color={theme.primary} size={18} />}
                label="Email"
                value={profile.email}
                editable
                onPress={() => openEdit('email')}
              />

              <ThemedText type="smallBold" style={styles.sectionLabel}>
                Hours
              </ThemedText>
              <InfoRow
                icon={<UserIcon color={theme.primary} size={18} />}
                label="Total hours"
                value={`${profile.totalHours.toFixed(2)} hrs`}
              />
              <InfoRow
                icon={<UserIcon color={theme.primary} size={18} />}
                label="Accumulated hours"
                value={`${profile.accumulatedHours.toFixed(2)} hrs`}
              />
              <InfoRow
                icon={<UserIcon color={theme.primary} size={18} />}
                label="Remaining hours"
                value={`${Math.max(0, profile.totalHours - profile.accumulatedHours).toFixed(2)} hrs`}
              />
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              { borderColor: theme.border, backgroundColor: theme.card },
              pressed && { opacity: 0.85 },
            ]}>
            <LogOut color={theme.primary} size={18} />
            <ThemedText style={[styles.logoutText, { color: theme.primary }]}>
              Log out
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
        visible={editField !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}>
          <ThemedView type="card" style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">
                Edit {editField === 'username' ? 'username' : 'email'}
              </ThemedText>
              <Pressable onPress={closeEdit} hitSlop={8}>
                <X color={theme.text} size={20} />
              </Pressable>
            </View>
            <TextInput
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={editField === 'email' ? 'email-address' : 'default'}
              value={draftValue}
              onChangeText={setDraftValue}
              placeholder={editField === 'email' ? 'you@example.com' : 'username'}
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
              ]}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={closeEdit}
                disabled={saving}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: theme.backgroundElement },
                  pressed && { opacity: 0.85 },
                ]}>
                <ThemedText type="smallBold">Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={saveEdit}
                disabled={saving}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: theme.primary, opacity: saving ? 0.7 : 1 },
                  pressed && { opacity: 0.85 },
                ]}>
                {saving ? (
                  <ActivityIndicator size="small" color={theme.primaryForeground} />
                ) : (
                  <View style={styles.saveButtonContent}>
                    <Check color={theme.primaryForeground} size={16} />
                    <ThemedText
                      type="smallBold"
                      style={{ color: theme.primaryForeground, marginLeft: 4 }}>
                      Save
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: Spacing.five },
  header: { marginBottom: 24 },
  subtitle: { marginTop: 4 },
  loading: { paddingVertical: 40, alignItems: 'center' },
  error: { color: '#c62828', textAlign: 'center', paddingVertical: 20 },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 16,
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1 },
  fullName: { fontSize: 22, lineHeight: 28 },
  sectionLabel: {
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  infoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoValue: { marginTop: 2 },
  footer: {
    padding: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: Spacing.four,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonContent: { flexDirection: 'row', alignItems: 'center' },
});
