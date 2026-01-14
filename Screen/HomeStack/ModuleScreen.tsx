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
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { ipAddress } from '../IpPublic';

export default function ModuleScreen() {
  const route = useRoute<any>();
  const { kode_matakuliah } = route.params;

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModule = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      const response = await fetch(
        `${ipAddress}/moduls/data?kode_matakuliah=${kode_matakuliah}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await response.json();

      if (response.ok) {
        setModules(json.data);
      } else {
        Alert.alert('Error', json.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchModule();
    }, []),
  );

  const previewFile = async (url: string) => {
    try {
      const encodedUrl = encodeURI(url);
      await Linking.openURL(encodedUrl);
    } catch {
      Alert.alert('Error', 'File tidak bisa dibuka');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <List.Item
        title={item.judul}
        titleStyle={styles.title}
        description={`Upload: ${new Date(
          item.created_at,
        ).toLocaleDateString()}`}
        left={() => <List.Icon icon="file-pdf-box" color="#d32f2f" />}
        right={() => <List.Icon icon="eye" color="#1976d2" />}
        onPress={() => previewFile(item.file_url)}
      />
      <Divider />
      
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : modules.length === 0 ? (
        <Text style={styles.empty}>Belum ada modul</Text>
      ) : (
        <FlatList
          data={modules}
          keyExtractor={item => item.id.toString()}
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
  },
  loading: {
    marginTop: 20,
    textAlign: 'center',
  },
  empty: {
    marginTop: 30,
    textAlign: 'center',
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  previewText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});
