import * as React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/Themed';
import { Button } from '@/src/ui/Button';
import { useSettings } from '@/src/ui/settings/SettingsProvider';
import { useTheme } from '@/src/ui/theme/ThemeProvider';

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  title,
  description,
  right,
}: Readonly<{
  title: string;
  description: string;
  right: React.ReactNode;
}>) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, setSettings } = useSettings();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Settings
      </Text>

      <Section title="Appearance">
        <Text style={styles.help}>
          Choose how the app looks. “System” follows your device setting.
        </Text>
        <View style={styles.buttonRow}>
          <Button
            label="System"
            variant={theme.userTheme === 'system' ? 'primary' : 'secondary'}
            onPress={() => theme.setUserTheme('system')}
          />
          <Button
            label="Light"
            variant={theme.userTheme === 'light' ? 'primary' : 'secondary'}
            onPress={() => theme.setUserTheme('light')}
          />
          <Button
            label="Dark"
            variant={theme.userTheme === 'dark' ? 'primary' : 'secondary'}
            onPress={() => theme.setUserTheme('dark')}
          />
        </View>
      </Section>

      <Section title="Audio & haptics">
        <Row
          title="Sound"
          description="Enable or disable sound effects."
          right={
            <Switch
              accessibilityLabel="Sound"
              value={settings.soundEnabled}
              onValueChange={(value) => setSettings({ soundEnabled: value })}
            />
          }
        />
        <Row
          title="Haptics"
          description="Enable or disable vibration feedback."
          right={
            <Switch
              accessibilityLabel="Haptics"
              value={settings.hapticsEnabled}
              onValueChange={(value) => setSettings({ hapticsEnabled: value })}
            />
          }
        />
      </Section>

      <Section title="Accessibility">
        <Text style={styles.help}>Increase text size to make the UI easier to read.</Text>
        <View style={styles.buttonRow}>
          <Button
            label="Default"
            variant={settings.textSize === 'default' ? 'primary' : 'secondary'}
            onPress={() => setSettings({ textSize: 'default' })}
          />
          <Button
            label="Larger"
            variant={settings.textSize === 'large' ? 'primary' : 'secondary'}
            onPress={() => setSettings({ textSize: 'large' })}
          />
          <Button
            label="Largest"
            variant={settings.textSize === 'largest' ? 'primary' : 'secondary'}
            onPress={() => setSettings({ textSize: 'largest' })}
          />
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  help: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flex: 1,
    paddingRight: 12,
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
