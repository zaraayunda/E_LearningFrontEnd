import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ipAddress } from './IpPublic';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function FormUploadTugas() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { kode_tugas } = route.params;

  const [tugas, setTugas] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [jawaban, setJawaban] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  /* ================= FETCH DETAIL ================= */
  const fetchDetail = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      const res = await fetch(
        `${ipAddress}/tugas/detail?kode_tugas=${kode_tugas}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const json = await res.json();

      if (res.ok) {
        setTugas(json.data);
        if (new Date() > new Date(json.data.deadline)) setIsExpired(true);
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

  /* ================= PICK IMAGE/VIDEO ================= */
  const pickMedia = async () => {
    const res = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 1,
    });

    if (res.didCancel) return;

    const asset = res.assets?.[0];
    if (!asset) return;

    if (asset.fileSize && asset.fileSize > MAX_SIZE) {
      Alert.alert('Error', 'Ukuran file maksimal 50 MB');
      return;
    }

    setFile({
      uri: asset.uri!,
      name: asset.fileName ?? 'media',
      type: asset.type ?? 'application/octet-stream',
    });
  };

  /* ================= UPLOAD JAWABAN ================= */
  const uploadJawaban = async () => {
  if (!jawaban.trim() && !file) {
    Alert.alert('Error', 'Isi jawaban atau pilih media');
    return;
  }

  const token = await AsyncStorage.getItem('userToken');
  setUploading(true);

  const formData = new FormData();
  formData.append('tugas_kode', kode_tugas);

  // kirim jawaban text (sesuai DB)
  if (jawaban.trim()) {
    formData.append('jawaban_text', jawaban);
  }

  // kirim file (backend simpan ke upload_foto_video)
  if (file) {
    formData.append('file', {
      uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
      name: file.name,
      type: file.type,
    } as any);
  }

  try {
    const res = await fetch(`${ipAddress}/tugas/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json', 
      },
      body: formData,
    });

    const json = await res.json();

    if (res.ok) {
      Alert.alert('Sukses', json.message);
      navigation.goBack();
    } else {
      Alert.alert('Gagal', json.message || 'Upload gagal');
    }
  } catch (err) {
    console.log(err);
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
      {/* CARD DETAIL TUGAS */}
      <View style={styles.card}>
        <Text style={styles.title}>{tugas.judul}</Text>
        <Text style={styles.desc}>{tugas.deskripsi}</Text>
        <Text style={styles.deadline}>
          Deadline: {new Date(tugas.deadline).toLocaleDateString('id-ID')},{' '}
          {new Date(tugas.deadline).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })} WIB
        </Text>

        {isExpired && <Text style={styles.expired}>⛔ Deadline berakhir</Text>}
      </View>

      {/* TEXT AREA JAWABAN */}
      <TextInput
        style={styles.textArea}
        placeholder="Ketik jawaban Anda di sini..."
        multiline
        numberOfLines={6}
        value={jawaban}
        editable={!isExpired}
        onChangeText={setJawaban}
      />

      {/* PREVIEW IMAGE */}
      {file && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview Media:</Text>
          {file.type.startsWith('image') ? (
            <Image source={{ uri: file.uri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.previewText}>{file.name}</Text>
          )}
        </View>
      )}

      {/* PILIH MEDIA */}
      <TouchableOpacity
        style={styles.pickBtn}
        disabled={isExpired}
        onPress={pickMedia}
      >
        <Text style={styles.pickBtnText}>Pilih Foto / Video (opsional)</Text>
      </TouchableOpacity>

      {/* UPLOAD JAWABAN */}
      <TouchableOpacity
        style={[styles.uploadBtn, (uploading || isExpired) && styles.disabled]}
        disabled={uploading || isExpired}
        onPress={uploadJawaban}
      >
        <Text style={styles.uploadText}>
          {uploading ? 'Mengupload...' : 'Kirim Jawaban'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e3f2fd', // light blue background
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0d47a1' },
  desc: { marginTop: 6, fontSize: 16, color: '#424242' },
  deadline: { color: '#1976d2', marginTop: 8, fontWeight: 'bold' },
  expired: { color: '#b71c1c', marginTop: 6 },
  textArea: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#90caf9',
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#212121',
  },
  pickBtn: {
    padding: 14,
    backgroundColor: '#42a5f5',
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  pickBtnText: { color: '#fff', fontWeight: 'bold' },
  uploadBtn: {
    padding: 16,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#0d47a1',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  uploadText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: { backgroundColor: '#90a4ae' },
  previewContainer: { marginTop: 12, alignItems: 'center' },
  previewLabel: { fontSize: 14, color: '#1976d2', marginBottom: 6 },
  previewImage: { width: 200, height: 200, borderRadius: 12 },
  previewText: { color: '#424242', fontSize: 16 },
});
