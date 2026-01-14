import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// import { Avatar, FAB } from 'react-native-elements';
// import LinearGradient from 'react-native-linear-gradient';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress, IpSaja } from '../IpPublic';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState<any>(null);
  const [matkul, setMatkul] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDataMatakuliah = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.replace('Login');
      return;
    }

    try {
      const response = await fetch(`${ipAddress}/matakuliah-saya`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMatkul(data.matkul); // ← ARRAY
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data matakuliah');
    }
  };

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
      fetchDataMatakuliah();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang 👋</Text>
        <Text style={styles.userText}>{user?.name}</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <FlatList
          data={matkul}
          keyExtractor={item => item.kode_matakuliah}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Matakuliah', {
                  kode_matakuliah: item.kode_matakuliah,
                  nama_matakuliah: item.nama_matakuliah,
                })
              }
            >
              {/* Badge kode */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.kode_matakuliah}</Text>
              </View>

              {/* Nama matkul */}
              <Text style={styles.namaMatkul}>{item.nama_matakuliah}</Text>

              {/* Footer kecil */}
              <Text style={styles.subText}>Lihat Modul & Tugas</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  /* HEADER */
  header: {
    height: 140,
    backgroundColor: '#6C9EE5',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#EAF1FF',
  },
  userText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },

  /* CONTENT */
  content: {
    padding: 20,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  kode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C9EE5',
    marginBottom: 4,
  },
  nama: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C9EE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },

  namaMatkul: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },

  subText: {
    fontSize: 12,
    color: '#888',
  },
});
