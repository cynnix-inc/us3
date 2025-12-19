import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';

export default function PlayScreen() {
  const scheme = useColorScheme();
  const borderColor = scheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Play
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.body}>Classic Sudoku modes will live here (Free Play + Adaptive).</Text>

      <View style={[styles.card, { borderColor }]}>
        <Text style={styles.cardTitle}>Game types</Text>
        <Text style={styles.cardBody}>Coming soon!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card: {
    marginTop: 24,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 520,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    opacity: 0.85,
  },
});
