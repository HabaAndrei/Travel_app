import { StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home.js';
import Program from './Screens/Program.js';
import DailyProgram from './Screens/DailyProgram.js';
import UserSettings from './Screens/UserSettings.js';
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
        console.log('Avem user conectat cu uid: ' , uid);
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


  return (

    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
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
            name="Program"
            component={ProgramScreen}
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


