import { StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Program from './Screens/Program.js';
import DailyProgram from './Screens/DailyProgram.js';
import UserSettings from './Screens/UserSettings.js';
import Plans from './Screens/Plans.js';
import {db, auth} from './firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import Layout from './Components/Layout.js';
import {onAuthStateChanged} from 'firebase/auth';



const Stack = createNativeStackNavigator();



const App = () => {

  const [user, setUser] = useState(false);

  useEffect(()=>{

    onAuthStateChanged(auth, (us) => {
      if (us) {
        setUser(us);
        const uid = us.uid;
      } else {
        setUser(false);
        console.log('nu avem user conectat')
      }
    });

  }, []);


  const HomeScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser} >
      <Home/>
    </Layout>
  );
  
  const ProgramScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route}  user={user} setUser={setUser}  >
      <Program/>
    </Layout>
  );
  const DailyProgramScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route}  user={user} setUser={setUser}  >
      <DailyProgram/>
    </Layout>
  );

  const UserSettingsScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser} >
      <UserSettings/>
    </Layout>
  );

  const PlansScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser} >
      <Plans/>
    </Layout>
  );


  return (

    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Plans"
            component={PlansScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Program"
            component={ProgramScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSettings"
            component={UserSettingsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DailyProgram"
            component={DailyProgramScreen}
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




//Lucruri de imbunatati cu ai:

//Nu este atent daca obiectivul functioneaza la orele pe care el mi le da
//Imi alege obiective care sunt indepartate si nu are un tarseu benefic pentru utilizator 
// Nu imi genereaza adresa exacta




