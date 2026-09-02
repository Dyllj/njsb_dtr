import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CheckCircle, QrCode, XCircle } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/stores/authStore';
import { validateQRCode, type QrCodeRecord } from '@/services/qrCodeService';
import {
  getTodaySessions,
  recordCheckIn,
  recordCheckOut,
  getCurrentSession,
  type AttendanceRecord,
  type AttendanceSession,
} from '@/services/attendanceService';

/**
 * Extract the raw QR code value from scanned data.
 * Handles both plain codes and URLs that embed the code in the path.
 */
function extractCode(data: string): string {
  if (data.includes('://')) {
    const pathPart = data.split('://')[1];
    const segments = pathPart.split('/').filter(Boolean);
    return segments[segments.length - 1] || data;
  }
  if (data.startsWith('/')) {
    const segments = data.split('/').filter(Boolean);
    return segments[segments.length - 1] || data;
  }
  return data;
}

/**
 * Format a stored time string (either full ISO timestamp or time-only)
 * into a display-friendly HH:MM AM/PM format.
 */
function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';

  try {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
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

type ScanResult =
  | { status: 'idle' }
  | { status: 'processing' }
  | {
      status: 'success';
      action: 'check-in' | 'check-out';
      session: AttendanceSession;
      time: string;
      message: string;
    }
  | { status: 'error'; message: string };

export default function ScanScreen() {
  const theme = useTheme();
  const { intern, isAuthenticated, hasHydrated } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState<ScanResult>({ status: 'idle' });

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hasHydrated, isAuthenticated]);

  if (!hasHydrated || !isAuthenticated || !intern) {
    return <ThemedView style={styles.container} />;
  }

  const scanning = scanResult.status === 'processing';

  async function handleBarcodeScanned({ data }: { data: string }) {
    if (scanning || !intern) return;

    setScanResult({ status: 'processing' });

    try {
      const code = extractCode(data);

      const qr: QrCodeRecord | null = await validateQRCode(code);
      if (!qr) {
        setScanResult({
          status: 'error',
          message:
            'This QR code is no longer valid. Please ask your administrator for the current QR code.',
        });
        return;
      }

      const { am, pm } = await getTodaySessions(intern.id);
      const currentSession = getCurrentSession();
      const currentRow = currentSession === 'AM' ? am : pm;
      const otherRow = currentSession === 'AM' ? pm : am;

      // 4-state decision tree per session.
      // Each intern can have up to 2 check-in/out cycles per day (AM + PM).
      // The QR is a presence signal — the action is inferred from which
      // session is "open" (time_in set, time_out not yet set) for this intern.
      if (currentRow && currentRow.timeIn && !currentRow.timeOut) {
        // Current session is open → this is the time OUT for that session
        const record: AttendanceRecord = await recordCheckOut(intern.id, currentSession);
        setScanResult({
          status: 'success',
          action: 'check-out',
          session: currentSession,
          time: formatTime(record.timeOut),
          message: `Goodbye, ${intern.firstName}! Your ${currentSession} time out has been recorded.`,
        });
        return;
      }

      if (!currentRow || !currentRow.timeIn) {
        // No time-in yet for the current session → this is the time IN
        const record: AttendanceRecord = await recordCheckIn(intern.id, currentSession);
        setScanResult({
          status: 'success',
          action: 'check-in',
          session: currentSession,
          time: formatTime(record.timeIn),
          message: `Welcome, ${intern.firstName}! Your ${currentSession} time in has been recorded.`,
        });
        return;
      }

      // Current session is fully done (both time_in and time_out set).
      // If the other session is open, this scan records that one.
      if (otherRow && otherRow.timeIn && !otherRow.timeOut) {
        const record: AttendanceRecord = await recordCheckOut(intern.id, otherRow.session);
        setScanResult({
          status: 'success',
          action: 'check-out',
          session: otherRow.session,
          time: formatTime(record.timeOut),
          message: `Goodbye, ${intern.firstName}! Your ${otherRow.session} time out has been recorded.`,
        });
        return;
      }

      if (!otherRow || !otherRow.timeIn) {
        const record: AttendanceRecord = await recordCheckIn(intern.id, otherRow?.session ?? (currentSession === 'AM' ? 'PM' : 'AM'));
        setScanResult({
          status: 'success',
          action: 'check-in',
          session: record.session,
          time: formatTime(record.timeIn),
          message: `Welcome, ${intern.firstName}! Your ${record.session} time in has been recorded.`,
        });
        return;
      }

      // Both AM and PM are fully complete
      setScanResult({
        status: 'error',
        message:
          'You have already completed both AM and PM attendance for today. See you tomorrow!',
      });
    } catch (e) {
      const err = e as Error;
      setScanResult({
        status: 'error',
        message: err.message || 'Failed to process the scan. Please try again.',
      });
    }
  }

  function resetScan() {
    setScanResult({ status: 'idle' });
  }

  if (!permission) return <ThemedView style={styles.container} />;

  if (!permission.granted) {
    return (
      <ThemedView style={styles.centered}>
        <QrCode color={theme.primary} size={64} />
        <ThemedText type="title" style={styles.permissionTitle}>
          Camera access needed
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.centerText}>
          Allow camera access to scan your time in and time out QR code.
        </ThemedText>
        <Pressable
          onPress={requestPermission}
          style={[styles.button, { backgroundColor: theme.primary }]}>
          <ThemedText style={[styles.buttonText, { color: theme.primaryForeground }]}>
            Allow camera
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Scan attendance QR</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.internInfo}>
            {intern.firstName} {intern.lastName} — {intern.id}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.instruction}>
            {scanning
              ? 'Validating QR code and recording attendance...'
              : 'Align the QR code inside the frame'}
          </ThemedText>
        </View>

        <View style={styles.scanner}>
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanning ? undefined : handleBarcodeScanned}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.frame, { borderColor: theme.primary }]} />

          {scanning && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={theme.primaryForeground} />
            </View>
          )}
        </View>

        {scanResult.status !== 'idle' && scanResult.status !== 'processing' && (
          <>
            <View
              style={[
                styles.resultBanner,
                scanResult.status === 'success'
                  ? [styles.successBanner, { backgroundColor: '#dcfce7', borderColor: '#86efac' }]
                  : [styles.errorBanner, { backgroundColor: '#fee2e2', borderColor: '#fca5a5' }],
              ]}>
              {scanResult.status === 'success' ? (
                <CheckCircle color="#16a34a" size={20} />
              ) : (
                <XCircle color="#dc2626" size={20} />
              )}
              <View style={styles.resultTextContainer}>
                <ThemedText
                  type="smallBold"
                  style={{
                    color: scanResult.status === 'success' ? '#166534' : '#991b1b',
                  }}>
                  {scanResult.status === 'success'
                    ? `${scanResult.action === 'check-in' ? 'Time In' : 'Time Out'} (${scanResult.session}) at ${scanResult.time}`
                    : 'Scan Failed'}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{
                    color: scanResult.status === 'success' ? '#15803d' : '#b91c1c',
                    marginTop: 2,
                  }}>
                  {scanResult.message}
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={resetScan}
              style={[styles.button, { backgroundColor: theme.primary }]}>
              <ThemedText style={[styles.buttonText, { color: theme.primaryForeground }]}>
                Scan again
              </ThemedText>
            </Pressable>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  header: { marginBottom: 16 },
  internInfo: { marginTop: 4 },
  instruction: { marginTop: 4 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  permissionTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 16,
  },
  centerText: {
    textAlign: 'center',
    maxWidth: 260,
  },
  scanner: {
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 28,
    width: '100%',
    position: 'relative',
  },
  frame: {
    borderRadius: 16,
    borderWidth: 3,
    height: '65%',
    width: '65%',
    alignSelf: 'center',
    marginTop: '17.5%',
    backgroundColor: 'transparent',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
  },
  successBanner: {},
  errorBanner: {},
  resultTextContainer: {
    flex: 1,
    gap: 2,
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
