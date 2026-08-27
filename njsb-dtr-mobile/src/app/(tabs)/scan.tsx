import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function ScanScreen() {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('Align the QR code inside the frame');

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
        <Pressable onPress={requestPermission} style={[styles.button, { backgroundColor: theme.primary }]}>
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
          <ThemedText themeColor="textSecondary" style={styles.instruction}>
            {message}
          </ThemedText>
        </View>

        <View style={styles.scanner}>
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : ({ data }) => {
              setScanned(true);
              setMessage(`Scan received: ${data}`);
            }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.frame, { borderColor: theme.primary }]} />
        </View>

        {scanned ? (
          <Pressable
            onPress={() => {
              setScanned(false);
              setMessage('Align the QR code inside the frame');
            }}
            style={[styles.button, { backgroundColor: theme.primary }]}>
            <ThemedText style={[styles.buttonText, { color: theme.primaryForeground }]}>
              Scan again
            </ThemedText>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  header: { marginBottom: 16 },
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
