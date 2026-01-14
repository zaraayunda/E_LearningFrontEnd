import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from './UserScreen';
import FormEdit from './FormEditPassword';
import FormEditPhoto from './FormEditPhoto';

const Stack = createNativeStackNavigator();

export default function StackUser() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {/* Halaman Profile */}
      <Stack.Screen 
        name="UserScreen" 
        component={UserScreen} 
      />

      {/* Halaman Ganti Password */}
      <Stack.Screen 
        name="FormEdit" 
        component={FormEdit} 
        options={{ 
          headerShown: true,
          title: 'Edit Profile',
         }}
      />
      <Stack.Screen 
        name="FormEditPhoto" 
        component={FormEditPhoto} 
        options={{ 
          headerShown: true,
          title: 'Edit Profile',
         }}
      />
    </Stack.Navigator>
  );
}


