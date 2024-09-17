import { StyleSheet} from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Program from './Screens/Program.js';
import {db} from './Firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import Layout from './Components/Layout.js';

const Stack = createNativeStackNavigator();



const App = () => {


  const HomeScreen = ({ navigation }) => (
    <Layout  navigation={navigation}>
      <Home />
    </Layout>
  );
  
  const ProgramScreen = ({ navigation }) => (
    <Layout  navigation={navigation}>
      <Program />
    </Layout>
  );


  return (

    <GluestackUIProvider config={config}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Program"
          component={ProgramScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>


   
    </GluestackUIProvider>


  );
}

export default App

const styles = StyleSheet.create({})





// iau pachet care ia detalii despre telefonul utilizatorului
// implementez detalii despre alterta 
// adaug un buton care o sa ia de la inceput toata operatiunea de programare a vacantei
// adaug un buton sa se regenereze programul de la open ai, si daca il vrea si il accepta atunci il bag in baza de date !!