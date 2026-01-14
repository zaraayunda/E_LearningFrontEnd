import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { Input, Button, Text } from 'react-native-elements';
import { ipAddress } from '../IpPublic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FormEditPassword({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
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
          setName(data.user.name);
          setEmail(data.user.email);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch user data');
          navigation.replace('Login');
        }
      } catch (error) {
        Alert.alert('Error', `An error occurred: ${error}`);
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleUpdateUser = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.replace('Login');
      return;
    }

    try {
      const response = await fetch(`${ipAddress}/update-user`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Data updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Failed', data.message || 'Update failed.');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error}`);
    }

    setLoading(false);
  };

  return (
    <LinearGradient colors={['#6C9EE5', '#eff2f7']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Update Akun</Text>

        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          leftIcon={<Icon name="person" size={24} color="gray" />}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          leftIcon={<Icon name="mail" size={24} color="gray" />}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Password"
          placeholder="Enter your new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Icon name="lock-closed" size={24} color="gray" />}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your new password"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          leftIcon={<Icon name="lock-closed" size={24} color="gray" />}
          containerStyle={styles.inputContainer}
        />

        <Button
          title={loading ? <ActivityIndicator color="blue" /> : 'Update Data'}
          onPress={handleUpdateUser}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          disabled={loading}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    marginHorizontal: 30,
    backgroundColor: '#ffffffaa',
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  inputContainer: {
    marginTop: -10,
  },
  button: {
    backgroundColor: '#6C9EE5',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
