import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('Align the QR code inside the frame');

  if (!permission) return <ThemedView style={styles.container} />;

  if (!permission.granted) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Camera access needed</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.centerText}>
          Allow camera access to scan your time in and time out QR code.
        </ThemedText>
        <Pressable onPress={requestPermission} style={styles.button}>
          <ThemedText style={styles.buttonText}>Allow camera</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Scan attendance QR</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.instruction}>{message}</ThemedText>
        <View style={styles.scanner}>
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : ({ data }) => {
              setScanned(true);
              setMessage(`Scan received: ${data}`);
            }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.frame} />
        </View>
        {scanned ? (
          <Pressable onPress={() => { setScanned(false); setMessage('Align the QR code inside the frame'); }} style={styles.button}>
            <ThemedText style={styles.buttonText}>Scan again</ThemedText>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  centered: { flex: 1, justifyContent: 'center', padding: 24, alignItems: 'center' },
  centerText: { marginTop: 12, textAlign: 'center' },
  instruction: { marginTop: 8 },
  scanner: { aspectRatio: 1, borderRadius: 20, overflow: 'hidden', marginTop: 28, width: '100%' },
  frame: { borderColor: '#fff', borderRadius: 18, borderWidth: 3, height: '65%', width: '65%', alignSelf: 'center', marginTop: '17.5%' },
  button: { alignItems: 'center', backgroundColor: '#1769aa', borderRadius: 10, marginTop: 24, paddingVertical: 14, paddingHorizontal: 24 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
