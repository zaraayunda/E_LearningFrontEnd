import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { List, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { ipAddress } from '../IpPublic';

export default function TugasScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { kode_matakuliah } = route.params;

  const [tugas, setTugas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTugas = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('TOKEN:', token);

    try {
      const response = await fetch(
        `${ipAddress}/tugas/data?kode_matakuliah=${kode_matakuliah}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      const json = await response.json();

      if (response.ok) {
        setTugas(json.data);
      } else {
        console.log('STATUS:', response.status);
        console.log('ERROR:', json);
        Alert.alert('Error', json.message || 'Gagal mengambil data tugas');
      }
    } catch (e) {
      console.log('FETCH ERROR:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTugas();
    }, []),
  );

  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const openFile = async (url: string) => {
    try {
      await Linking.openURL(encodeURI(url));
    } catch {
      Alert.alert('Error', 'File tidak bisa dibuka');
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('PengumpulanTugas', {
            kode_tugas: item.kode_tugas,
          })
        }
      >
        <List.Item
          title={item.judul}
          description={() => (
            <View>
              <Text style={styles.deadline}>
                Deadline: {formatTanggal(item.deadline)}
              </Text>

              {item.nilai && (
                <Text style={styles.nilai}>Nilai: {item.nilai}</Text>
              )}
            </View>
          )}
          left={() => <List.Icon icon="clipboard-text" />}
          right={() => (
            <Chip
              style={{
                backgroundColor: item.sudah_kumpul ? '#C8E6C9' : '#FFCDD2',
                alignSelf: 'center',
              }}
            >
              {item.sudah_kumpul ? 'Selesai' : 'Belum'}
            </Chip>
          )}
        />

        {item.file_tugas_url && (
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => openFile(item.file_tugas_url)}
          >
            <Text style={styles.previewText}>Lihat Soal</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : tugas.length === 0 ? (
        <Text style={styles.empty}>Belum ada tugas</Text>
      ) : (
        <FlatList
          data={tugas}
          keyExtractor={item => item.kode_tugas}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  deadline: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },
  nilai: {
    marginTop: 4,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  previewBtn: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
    alignItems: 'center',
  },
  previewText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});
