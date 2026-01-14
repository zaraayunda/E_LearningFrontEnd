import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomeScreen';
import Matakuliah from './Matakuliah';
import FormUploadTugas from '../FormUploadTugas';

export default function StackHome() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      {/* UANG MASUK */}
      <Stack.Screen
        name="Matakuliah"
        component={Matakuliah}
        options={{ headerShown: true, title: 'Detail Matakuliah' }}
      />
      <Stack.Screen
        name="PengumpulanTugas"
        component={FormUploadTugas}
        options={{ headerShown: true, title: 'Detail Matakuliah' }}
      />
    </Stack.Navigator>
  );
}
