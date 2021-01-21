import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">           
        <Stack.Screen
            name="Home"
            component={Home}
            options={{              
                headerShown: false
            }}
        />
       </Stack.Navigator>
    </NavigationContainer>
  );
}