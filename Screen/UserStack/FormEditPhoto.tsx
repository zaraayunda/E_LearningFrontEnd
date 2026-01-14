import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { ipAddress } from '../IpPublic';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormEditPhoto({ navigation, route }) {
  // ✅ FOTO USER DARI UserScreen
  const currentPhoto = route?.params?.currentPhoto;

  const [loadingButton, setLoadingButton] = useState(false);
  const [uriImage, setUriImage] = useState<string | null>(null);
  const [typeImage, setTypeImage] = useState<string | null>(null);
  const [fileNameImage, setFileNameImage] = useState<string | null>(null);

  const setToastPesan = (pesan: string) => {
    ToastAndroid.show(pesan, ToastAndroid.SHORT);
  };

  /* ================= CAMERA ================= */
  const ambilDariKamera = async () => {
    const result = await launchCamera({ mediaType: 'photo' });

    if (result.didCancel) return;
    if (result.errorCode) {
      setToastPesan('Gagal membuka kamera');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset) return;

    if (asset.fileSize && asset.fileSize > 5242880) {
      setToastPesan('Ukuran gambar maksimal 5MB');
      return;
    }

    setUriImage(asset.uri ?? null);
    setTypeImage(asset.type ?? null);
    setFileNameImage(asset.fileName ?? 'photo.jpg');
  };

  /* ================= GALLERY ================= */
  const pilihDariGaleri = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.didCancel) return;
    if (result.errorCode) {
      setToastPesan('Gagal membuka galeri');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset) return;

    if (asset.fileSize && asset.fileSize > 5242880) {
      setToastPesan('Ukuran gambar maksimal 5MB');
      return;
    }

    setUriImage(asset.uri ?? null);
    setTypeImage(asset.type ?? null);
    setFileNameImage(asset.fileName ?? 'photo.jpg');
  };

  /* ================= UPLOAD ================= */
  const uploadImageToApi = async () => {
    if (!uriImage) {
      setToastPesan('Pilih gambar terlebih dahulu');
      return;
    }

    setLoadingButton(true);

    const formData = new FormData();
    formData.append('photo', {
      uri: uriImage,
      type: typeImage || 'image/jpeg',
      name: fileNameImage || 'photo.jpg',
    });

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${ipAddress}/update-photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const res = await response.json();
      setToastPesan(res.message || 'Upload berhasil');
      navigation.goBack();
    } catch {
      setToastPesan('Gagal upload foto');
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ganti Foto Profil</Text>

      {/* ✅ FOTO KONSISTEN */}
      <Avatar
        rounded
        size="xlarge"
        source={
          uriImage
            ? { uri: uriImage }        // preview foto baru
            : currentPhoto
            ? { uri: currentPhoto }    // foto lama user
            : require('../assets/img/foto.jpeg')
        }
        containerStyle={styles.avatar}
      />

      <TouchableOpacity style={styles.button} onPress={pilihDariGaleri}>
        <Icon name="image-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Pilih dari Galeri</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={ambilDariKamera}>
        <Icon name="camera-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Ambil Foto</Text>
      </TouchableOpacity>

      <Button
        title={
          loadingButton ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            'Upload Image'
          )
        }
        onPress={uploadImageToApi}
        disabled={loadingButton}
        buttonStyle={styles.uploadButton}
      />
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  avatar: {
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2575fc',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#03ac3b',
    borderRadius: 10,
    paddingHorizontal: 30,
  },
});
