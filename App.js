import { StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Program from './Screens/Program.js';
import DailyProgram from './Screens/DailyProgram.js';
import UserSettings from './Screens/UserSettings.js';
import Plans from './Screens/Plans.js';
import Locations from './Screens/Locations.js';
import {db, auth} from './firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import Layout from './Components/Layout.js';
import {onAuthStateChanged} from 'firebase/auth';
import Trip from './Screens/Trip.js';


const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(false);
 

  
  useEffect(()=>{
    reloadUser();
  }, [])


  function reloadUser(){
    onAuthStateChanged(auth, (us) => {
      if (us) {
        setUser(us);
        const uid = us.uid;
        console.log('Avem uid deci avem user => ', uid)
      } else {
        setUser(false);
        console.log('nu avem user conectat')
      }
    });
  }


  const HomeScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}   >
      <Home/>
    </Layout>
  );
  
  const ProgramScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route}  user={user} setUser={setUser}   >
      <Program/>
    </Layout>
  );
  const DailyProgramScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route}  user={user} setUser={setUser}   >
      <DailyProgram/>
    </Layout>
  );

  const UserSettingsScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}  >
      <UserSettings/>
    </Layout>
  );

  const PlansScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}  >
      <Plans/>
    </Layout>
  );

  const LocationsScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}   >
      <Locations/>
    </Layout>
  );

  const TripScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}   >
      <Trip/>
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
            name="Locations"
            component={LocationsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Trip"
            component={TripScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Program"
            component={ProgramScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSettings"
            component={UserSettingsScreen}
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



// Plan standard:
// il las e utilizator sa isi creeze un program si sa isi editeze el orele



// Plan premium:
// Il las pe utilizator sa isi adauge locatie hotelului si sa ii fac eu cel mai bun traseu
// Oferte si reduceri 
// Navigare si integrare cu transportul
// Optimizare in functie de mijlocul de transport ales 




// De facut: 
// DUPA CE CLINETUL A SCHIMBAT ORA DE MERS LA LOCATIE, SORTEZ LOCATILE DUPA ORA , SA FIE IN ORDINE CRESCATOARE
// CLIENTUL SA ISI ADAUGE SINGUR O LOCATIE
// partea de autentificare nodemailer 

