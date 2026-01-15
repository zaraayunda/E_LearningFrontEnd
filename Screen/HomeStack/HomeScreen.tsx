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
              {/* ICON */}
              <View style={styles.iconWrapper}>
                <Text style={styles.icon}>📘</Text>
              </View>

              {/* BADGE KODE */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.kode_matakuliah}</Text>
              </View>

              {/* NAMA MATKUL */}
              <Text numberOfLines={2} style={styles.namaMatkul}>
                {item.nama_matakuliah}
              </Text>

              {/* FOOTER */}
              <View style={styles.footer}>
                <Text style={styles.subText}>Modul & Tugas</Text>
                <Text style={styles.arrow}>›</Text>
              </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  content: {
    paddingHorizontal: 12,
  },

  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 5,
    shadowColor: '#1565C0',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 22,
  },

  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#1565C0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  namaMatkul: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginTop: 4,
    minHeight: 38,
  },

  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subText: {
    fontSize: 12,
    color: '#607D8B',
  },
  arrow: {
    fontSize: 18,
    color: '#1565C0',
    fontWeight: 'bold',
  },
});
