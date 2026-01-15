import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from './ScreenTodo';
import FormUploadTugas from '../FormUploadTugas';

export default function StackHome() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="TodoList">
      <Stack.Screen
        name="TodoList"
        component={TodoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PengumpulanTugas"
        component={FormUploadTugas}
        options={{ headerShown: true, title: 'Detail Matakuliah' }}
      />
    </Stack.Navigator>
  );
}
