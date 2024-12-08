import { StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetupTrip from './Screens/SetupTrip.js';
import Program from './Screens/Program.js';
import DailyProgram from './Screens/DailyProgram.js';
import UserSettings from './Screens/UserSettings.js';
import MyTrips from './Screens/MyTrips.js';
import Locations from './Screens/Locations.js';
import Trip from './Screens/Trip.js';
import Chat from './Screens/Chat.js';
import Layout from './Components/Layout.js';
import {db, auth, verifyEmailVerifiedDB} from './firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import {onAuthStateChanged} from 'firebase/auth';


const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(undefined);

  useEffect(()=>{
    reloadUser();
  }, [])

  function reloadUser(){
    onAuthStateChanged(auth, async (_user) => {
      if (_user) {
        const uid = _user.uid;
        const rezEmailVerified = await verifyEmailVerifiedDB(uid);
        if (rezEmailVerified.type) {
          setUser({..._user, email_verified: true});
        } else {
          setUser(_user);
        }
        console.log('user connected')
      } else {
        setUser(undefined);
        console.log('user disconnected')
      }
    });
  }


  const SetupTripScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}   >
      <SetupTrip/>
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

  const MyTripsScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}  >
      <MyTrips/>
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

  const ChatScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}   >
      <Chat/>
    </Layout>
  );

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Locations"
            component={LocationsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyTrips"
            component={MyTripsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SetupTrip"
            component={SetupTripScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSettings"
            component={UserSettingsScreen}
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
