import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from './IpPublic';

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ipAddress}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        navigation.replace('Tabs');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.title}>Selamat Datang!</Text>
        <Text style={styles.subtitle}>Masukkan email & password</Text>

        <Input
          placeholder="Email"
          leftIcon={<Ionicons name="mail-outline" size={20} color="#3F9AAE" />}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputBox}
        />

        <Input
          placeholder="Password"
          leftIcon={
            <Ionicons name="lock-closed-outline" size={20} color="#3F9AAE" />
          }
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputBox}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'LOGIN'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.register}>
          Belum punya akun? Silahkan kunjungi situs web.
        </Text>
      </View>
    </View>
  );
};

// ================== STYLE ==================

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Dominasi putih
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 28,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#3F9AAE',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    marginBottom: 25,
  },
  inputBox: {
    borderBottomWidth: 1.3,
    borderColor: '#3F9AAE',
    paddingBottom: 4,
  },
  inputText: {
    color: '#000',
    marginLeft: 6,
  },
  button: {
    backgroundColor: '#3F9AAE',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#a5a5a5',
  },
  register: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    fontSize: 14,
  },
  registerBold: {
    fontWeight: 'bold',
    color: '#3F9AAE',
  },
});

export default LoginForm;
