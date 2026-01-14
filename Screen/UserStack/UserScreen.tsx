import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, FAB } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress, IpSaja } from '../IpPublic';
import { useFocusEffect } from '@react-navigation/native';

export default function UserScreen({ navigation }) {
  const [user, setUser] = useState<any>(null);
  const [mahasiswa, setMahasiswa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.replace('Login');
      return;
    }
    try {
      const response = await fetch(`${ipAddress}/data-pengguna`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setMahasiswa(data.mahasiswa);
      } else {
        Alert.alert('Erroras', data.message || 'Failed to fetch user data');
        navigation.replace('Login');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Yakin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#3F9AAE', '#f5f5f5']}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#3F9AAE', '#ffffff']} style={styles.container}>
      {/* CARD PROFILE */}
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FormEditPhoto', {
              currentPhoto: user?.photo
                ? IpSaja + user.photo
                : null,
            })
          }
        >
          <Avatar
            rounded
            size="xlarge"
            source={
              user?.photo_thumb
                ? { uri: IpSaja + user.photo_thumb }
                : require('../assets/img/foto.jpeg')
            }
            containerStyle={styles.avatar}
          />
        </TouchableOpacity>


        <Text style={styles.username}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* LIST INFORMASI */}
        <View style={styles.infoBox}>
          <InfoItem label="Nama" value={user?.name} />
          <InfoItem label="Email" value={user?.email} />
          <InfoItem label="Prodi" value={mahasiswa?.prodi} />
          <InfoItem label="Angkatan" value={mahasiswa?.angkatan} />
          <InfoItem label="Status" value={mahasiswa?.status} />
          <InfoItem
            label="Akun Dibuat"
            value={user?.created_at?.slice(0, 10)}
          />
          <InfoItem
            label="Akun Diperbarui"
            value={user?.updated_at?.slice(0, 10)}
          />
        </View>

        {/* TOMBOL LOGOUT */}
        <View style={styles.actionContainer}>
          {/* Tombol Edit */}
          <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('FormEdit')}>
            <Ionicons name="create-outline" size={25} color="white" />
            <Text style={styles.actionText}>Ganti Password</Text>
          </TouchableOpacity>

          {/* Tombol Logout */}
          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={25} color="white" />
            <Text style={styles.actionText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 12,
    shadowColor: '#000',
    alignItems: 'center',
  },
  avatar: { borderWidth: 4, borderColor: '#3F9AAE', marginBottom: 14 },
  username: { fontSize: 24, fontWeight: '700', color: '#000000' },
  email: { fontSize: 14, color: '#555', marginBottom: 25 },

  infoBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 9,
    padding: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  rowLabel: { fontWeight: 'bold', color: '#3F9AAE' },
  rowValue: { fontWeight: '600', color: '#333' },
  logoutText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  edit: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});
