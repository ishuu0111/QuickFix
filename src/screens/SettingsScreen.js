import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header, Card } from '../components';

export default function SettingsScreen({ navigation }) {
  const { theme, isDarkMode, setIsDarkMode, notificationSettings, setNotificationSettings, language } = useApp();

  const toggleNotif = (key) =>
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Settings" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <SectionLabel text="Appearance" theme={theme} />
        <Card padded={false}>
          <RowSwitch
            icon="moon-outline"
            label="Dark Mode"
            theme={theme}
            value={isDarkMode}
            onValueChange={setIsDarkMode}
          />
        </Card>

        <SectionLabel text="Language" theme={theme} />
        <Card padded={false}>
          <RowNav icon="language-outline" label="App Language" value={language} theme={theme} last />
        </Card>

        <SectionLabel text="Notifications" theme={theme} />
        <Card padded={false}>
          <RowSwitch
            icon="notifications-outline"
            label="Push Notifications"
            theme={theme}
            value={notificationSettings.push}
            onValueChange={() => toggleNotif('push')}
          />
          <RowSwitch
            icon="mail-outline"
            label="Email Notifications"
            theme={theme}
            value={notificationSettings.email}
            onValueChange={() => toggleNotif('email')}
          />
          <RowSwitch
            icon="chatbox-outline"
            label="SMS Notifications"
            theme={theme}
            value={notificationSettings.sms}
            onValueChange={() => toggleNotif('sms')}
          />
          <RowSwitch
            icon="pricetag-outline"
            label="Promotions & Offers"
            theme={theme}
            value={notificationSettings.promotions}
            onValueChange={() => toggleNotif('promotions')}
            last
          />
        </Card>

        <SectionLabel text="Security" theme={theme} />
        <Card padded={false}>
          <RowNav icon="finger-print-outline" label="Biometric Login" value="Enabled" theme={theme} />
          <RowNav icon="key-outline" label="Change Password" theme={theme} last />
        </Card>

        <SectionLabel text="About" theme={theme} />
        <Card padded={false}>
          <RowNav icon="document-text-outline" label="Terms of Service" theme={theme} />
          <RowNav icon="lock-closed-outline" label="Privacy Policy" theme={theme} />
          <RowNav icon="information-circle-outline" label="App Version" value="1.0.0" theme={theme} last />
        </Card>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ text, theme }) {
  return <Text style={[styles.sectionTitle, { color: theme.colors.subtitle }]}>{text}</Text>;
}

function RowSwitch({ icon, label, value, onValueChange, theme, last }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderColor: theme.colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '12' }]}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: theme.colors.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function RowNav({ icon, label, value, theme, last }) {
  return (
    <Pressable style={[styles.row, !last && { borderBottomWidth: 1, borderColor: theme.colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '12' }]}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: theme.colors.text }]}>{label}</Text>
      {value ? <Text style={{ color: theme.colors.subtitle, fontSize: 12, fontWeight: '600', marginRight: 6 }}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={17} color={theme.colors.subtitle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 10, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, marginLeft: 12, fontSize: 13.5, fontWeight: '600' },
});
