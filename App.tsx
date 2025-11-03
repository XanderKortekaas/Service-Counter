// Root App.tsx (in de hoofdmap, niet in /app folder)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import AdminPanel from './app/adminPanel';
import Index from './app/index';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Admin: undefined;
    }
  }
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Index} 
          options={{ title: 'CHE Service Counter' }}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminPanel} 
          options={{ title: 'Admin Panel' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}