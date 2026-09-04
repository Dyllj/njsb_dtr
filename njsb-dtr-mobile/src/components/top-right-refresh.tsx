import { Pressable, StyleSheet, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  onPress: () => void;
  loading?: boolean;
};

/**
 * A small icon-only Refresh button designed to sit in the top-right of a
 * screen header. Press feedback and a busy state are built in.
 */
export function TopRightRefresh({ onPress, loading = false }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        disabled={loading}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Refresh"
        style={({ pressed }) => [
          styles.button,
          { borderColor: theme.border, backgroundColor: theme.card },
          pressed && { opacity: 0.7 },
          loading && { opacity: 0.5 },
        ]}>
        <RefreshCw color={theme.primary} size={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingRight: 4,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
