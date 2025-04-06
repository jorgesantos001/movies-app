import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/pages/login';
import Cards from './src/pages/cards';
import Details from './src/pages/details';
import Register from './src/pages/register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen
          name="Cards"
          component={Cards}
          options={{ title: 'Filmes Populares' }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ title: 'Detalhes do Filme' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
