import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header, Input, Button, Avatar } from '../components';

export default function EditProfileScreen({ navigation }) {
  const { theme, user, setUser } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser((prev) => ({ ...prev, name, email, phone, location }));
    setSaved(true);
    setTimeout(() => {
      navigation.goBack();
    }, 700);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Edit Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <Avatar name={name} size={92} />
          <Pressable style={[styles.cameraBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.background }]}>
            <Ionicons name="camera" size={16} color="#fff" />
          </Pressable>
        </View>

        <Input label="Full name" value={name} onChangeText={setName} icon="person-outline" />
        <Input label="Email address" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" />
        <Input label="Phone number" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" />
        <Input label="Location" value={location} onChangeText={setLocation} icon="location-outline" />

        <Button
          title={saved ? 'Saved!' : 'Save Changes'}
          onPress={handleSave}
          size="lg"
          icon={saved ? 'checkmark' : undefined}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignItems: 'center', marginBottom: 28, marginTop: 6 },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: '38%',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
});
