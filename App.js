import { StyleSheet} from 'react-native'
import React, {useState} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Program from './Screens/Program.js';
import {db} from './Firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import Layout from './Components/Layout.js';
import uuid from 'react-native-uuid';


const Stack = createNativeStackNavigator();



const App = () => {

  const [notification, setNotification] = useState([
    // {id: 1, type: 'warning', mes: 'warning'}, {id: 2, type: 'succes', mes:'successs'}, {id: 3, type: 'error', mes:'error'}
  ]);

  function addNotification(type, mes){
    setNotification((prev)=>{
      return [...prev, {id: uuid.v4().slice(0, 5), type, mes}];
    })
  }



  const HomeScreen = ({ navigation }) => (
    <Layout  navigation={navigation} notification={notification} setNotification={setNotification} >
      <Home notification={notification} setNotification={setNotification} 
        addNotification={addNotification}
      />
    </Layout>
  );
  
  const ProgramScreen = ({ navigation }) => (
    <Layout  navigation={navigation}  notification={notification} setNotification={setNotification}>
      <Program  notification={notification} setNotification={setNotification} 
        addNotification={addNotification}
      />
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
// adaug un buton care o sa ia de la inceput toata operatiunea de programare a vacantei
// adaug un buton sa se regenereze programul de la open ai, si daca il vrea si il accepta atunci il bag in baza de date !!

// add speener  cand cauta oras daca e nevoie

