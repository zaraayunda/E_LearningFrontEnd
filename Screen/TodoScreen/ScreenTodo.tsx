import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Card,
  List,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ipAddress } from '../IpPublic';

export default function ScreenTodo() {
  const navigation = useNavigation<any>();
  const [tugas, setTugas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTodo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${ipAddress}/tugas/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const json = await response.json();
      if (response.ok) setTugas(json.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTodo();
    }, [])
  );

  const formatTanggal = (tanggal: string) =>
    new Date(tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const openFile = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }: any) => (
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
        titleStyle={styles.judul}
        description={() => (
          <View>
            <Text style={styles.matkul}>{item.nama_matakuliah}</Text>
            <Text style={styles.deadline}>
              Deadline: {formatTanggal(item.deadline)}
            </Text>

            {item.nilai && (
              <Text style={styles.nilai}>Nilai: {item.nilai}</Text>
            )}
          </View>
        )}
        left={() => (
          <List.Icon icon="clipboard-text" color="#1565C0" />
        )}
        right={() => (
          <Chip
            style={[
              styles.chip,
              {
                backgroundColor: item.sudah_kumpul
                  ? '#C8E6C9'
                  : '#FFCDD2',
              },
            ]}
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

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📘 Tugas Saya</Text>
        <Text style={styles.headerSubtitle}>
          Daftar tugas yang belum dikumpulkan
        </Text>
      </View>

      {tugas.length === 0 ? (
        <Text style={styles.empty}>
          Tidak ada tugas 🎉
        </Text>
      ) : (
        <FlatList
          data={tugas}
          keyExtractor={(item) => item.kode_tugas}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },

  header: {
    padding: 40,
    backgroundColor: '#1565C0',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
  },
  headerSubtitle: {
    color: '#E3F2FD',
    fontSize: 13,
    marginTop: 4,
    alignContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    elevation: 4,
    paddingBottom: 6,
  },

  judul: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0D47A1',
  },
  matkul: {
    color: '#555',
    marginTop: 2,
  },
  deadline: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 4,
  },
  nilai: {
    marginTop: 4,
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  chip: {
    alignSelf: 'center',
  },

  previewBtn: {
    borderTopWidth: 1,
    borderColor: '#000000',
    paddingVertical: 10,
    alignItems: 'center',
  },
  previewText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#555',
    fontSize: 15,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
