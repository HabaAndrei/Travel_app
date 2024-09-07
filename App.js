import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Schedule from './Screens/Schedule.js';
import {db} from './Firebase.js';
//
import { GluestackUIProvider, Box } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { Alert, AlertIcon, AlertText } from "@gluestack-ui/themed"

const Stack = createNativeStackNavigator();



const App = () => {


  return (

    <GluestackUIProvider config={config}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
          // initialParams={{ 'ok': ok, 'setOk': setOk }}
        />
        <Stack.Screen
          name="Schedule"
          component={Schedule}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>


   
    </GluestackUIProvider>


  );
}

export default App

const styles = StyleSheet.create({})





// iau pachet care ia detalii despre telefonul utilizatorului