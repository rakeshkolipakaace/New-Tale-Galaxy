import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import StorySelectionScreen from './src/screens/StorySelectionScreen';
import BookScreen from './src/screens/BookScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="StorySelection" 
          component={StorySelectionScreen} 
        />
        <Stack.Screen 
          name="Book" 
          component={BookScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
