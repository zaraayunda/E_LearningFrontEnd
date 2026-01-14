import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
// import { pickSingle, types, isCancel } from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ipAddress } from './IpPublic';

export default function FormUploadTugas() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { kode_tugas } = route.params;

  const [tugas, setTugas] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH DETAIL TUGAS ================= */
  const fetchDetail = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      const res = await fetch(
        `${ipAddress}/tugas/detail?kode_tugas=${kode_tugas}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await res.json();

      if (res.ok) {
        setTugas(json.data);

        const deadline = new Date(json.data.deadline);
        const now = new Date();
        if (now > deadline) setIsExpired(true);
      } else {
        Alert.alert('Error', json.message);
      }
    } catch {
      Alert.alert('Error', 'Gagal mengambil detail tugas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  /* ================= PICK FILE ================= */
  // const pickFile = async () => {
  //   try {
  //     const res = await pickSingle({
  //       type: [types.allFiles],
  //     });

  //     setFile(res);
  //   } catch (err) {
  //     if (!isCancel(err)) {
  //       Alert.alert('Error', 'Gagal memilih file');
  //     }
  //   }
  // };

  /* ================= UPLOAD JAWABAN ================= */
  const uploadJawaban = async () => {
    if (!file) {
      Alert.alert('Error', 'Pilih file terlebih dahulu');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    setUploading(true);

    const formData = new FormData();
    formData.append('kode_tugas', kode_tugas);
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name,
    } as any);

    try {
      const res = await fetch(`${ipAddress}/tugas/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        Alert.alert('Sukses', json.message);
        navigation.goBack();
      } else {
        Alert.alert('Gagal', json.message);
      }
    } catch {
      Alert.alert('Error', 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#1976d2"
        style={{ marginTop: 40 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* DETAIL TUGAS */}
      <View style={styles.card}>
        <Text style={styles.title}>{tugas.judul}</Text>
        <Text style={styles.desc}>{tugas.deskripsi}</Text>
        <Text style={styles.deadline}>
          Deadline:{' '}
          {new Date(tugas.deadline).toLocaleDateString('id-ID')}
        </Text>

        {isExpired && (
          <Text style={styles.expiredText}>
            ⛔ Deadline telah berakhir
          </Text>
        )}
      </View>

      {/* PILIH FILE */}
      <TouchableOpacity
        style={[styles.pickBtn, isExpired && styles.disabledBtn]}
        disabled={isExpired}
      >
        <Text style={styles.pickText}>
          {isExpired
            ? 'Upload ditutup'
            : file
            ? file.name
            : 'Pilih File Jawaban'}
        </Text>
      </TouchableOpacity>

      {/* UPLOAD */}
      <TouchableOpacity
        style={[
          styles.uploadBtn,
          (isExpired || uploading) && styles.disabledBtn,
        ]}
        onPress={uploadJawaban}
        disabled={isExpired || uploading}
      >
        <Text style={styles.uploadText}>
          {uploading ? 'Mengupload...' : 'Upload Jawaban'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  desc: {
    color: '#555',
    marginBottom: 10,
  },
  deadline: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  expiredText: {
    marginTop: 6,
    color: '#b71c1c',
    fontWeight: 'bold',
  },
  pickBtn: {
    padding: 14,
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    marginBottom: 16,
  },
  pickText: {
    textAlign: 'center',
  },
  uploadBtn: {
    padding: 14,
    backgroundColor: '#1976d2',
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
  },
});
