import React, { useLayoutEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ModuleScreen from './ModuleScreen';
import TugasScreen from './TugasScreen';

const Tab = createMaterialTopTabNavigator();

export default function Matakuliah({ route, navigation }) {
  const { nama_matakuliah, kode_matakuliah } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: nama_matakuliah,
      headerStyle: {
        backgroundColor: '#6C9EE5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6C9EE5',
        tabBarInactiveTintColor: '#999',
        tabBarIndicatorStyle: {
          backgroundColor: '#6C9EE5',
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#FFF',
        },
      }}
    >
      <Tab.Screen
        name="Module"
        component={ModuleScreen}
        initialParams={{ kode_matakuliah }}
      />
      <Tab.Screen
        name="Tugas"
        component={TugasScreen}
        initialParams={{ kode_matakuliah }}
      />
    </Tab.Navigator>
  );
}
