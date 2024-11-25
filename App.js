import { StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetUpTrip from './Screens/SetUpTrip.js';
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

  const [user, setUser] = useState(false);

  useEffect(()=>{
    reloadUser();
  }, [])

  function reloadUser(){
    onAuthStateChanged(auth, async (us) => {
      if (us) {
        const uid = us.uid;
        const rezEmailVerified = await verifyEmailVerifiedDB(uid);
        if(rezEmailVerified.type){
          setUser({...us, email_verified: true});
        }else if(!rezEmailVerified.type && !rezEmailVerified.err){
          setUser(us);
        }else if(!rezEmailVerified.type && rezEmailVerified.err){
          setUser(us);
        }
        console.log('Avem uid deci avem user => ', uid)
      } else {
        setUser(false);
        console.log('nu avem user conectat')
      }
    });
  }


  const SetUpTripScreen = ({ navigation, route }) => (
    <Layout  navigation={navigation} route={route} user={user} setUser={setUser}   >
      <SetUpTrip/>
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
            name="Chat"
            component={ChatScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Locations"
            component={LocationsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyTrips"
            component={MyTripsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SetUpTrip"
            component={SetUpTripScreen}
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



// In pagina locations mai adaug :
// Un input in care sa fie locatia hotelului

// Rezolv bug ul cu datepickerul, si adaug butoane custom!!

// trimit in server si partea cu average hors visit =>>> vezi ca nu ma asculta din pacate , mergi si verifica!!

// caut alte date de cautare cu nume doar in engleza

