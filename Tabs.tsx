import React, { useState, useEffect } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackHome from './Screen/HomeStack/StackHome';
import StackTugas from './Screen/TugasScreen/StackTugas';
import StackUser from './Screen/UserStack/StackUser';

import Icon from 'react-native-vector-icons/Ionicons';

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const icons = {
    Home: 'home-outline',
    Tugas: 'document-outline',
    User: 'person-outline',
  };

  const activeIcons = {
    Home: 'home',
    Tugas: 'document',
    User: 'person',
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        elevation: 2,
        borderTopColor: '#6C9EE5',
        borderTopWidth: 5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#f8f9fa',
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Icon
              name={isFocused ? activeIcons[route.name] : icons[route.name]}
              size={24}
              color={isFocused ? '#6C9EE5' : 'gray'}
            />

            <Text style={{ color: isFocused ? '#014639' : 'gray' }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={StackHome}
        options={{
          headerShown: false,
          headerTitleStyle: { color: 'white' },
          headerStyle: { backgroundColor: '#6C9EE5' },
        }}
      />
      <Tab.Screen
        name="Tugas"
        component={StackTugas}
        options={{
          headerShown: false,
          headerTitleStyle: { color: 'white' },
          headerStyle: { backgroundColor: '#6C9EE5' },
        }}
      />
      <Tab.Screen
        name="User"
        component={StackUser}
        options={{
          headerShown: false,
          headerTitleStyle: { color: 'white' },
          headerStyle: { backgroundColor: '#6C9EE5' },
        }}
      />
    </Tab.Navigator>
  );
}
