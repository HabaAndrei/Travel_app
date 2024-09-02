import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Test from './Screens/Test.js';
import {db} from './Firebase.js';


const Stack = createNativeStackNavigator();



const App = () => {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
          // initialParams={{ 'ok': ok, 'setOk': setOk }}
        />
        <Stack.Screen
          name="Test"
          component={Test}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App

const styles = StyleSheet.create({})


// onPress={() =>
  // navigation.navigate('Test', {name: 'Test', 'parametru': {'oras': 'Brasov '}})
// }


// iau pachet care ia detalii despre telefonul utilizatorului