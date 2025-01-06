import { StyleSheet} from 'react-native'
import {useEffect, useState} from 'react'
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
import {auth, FirebaseFirestore} from './firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import {onAuthStateChanged} from 'firebase/auth';


const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(undefined);

  const firebaseFirestore = new FirebaseFirestore();

  useEffect(()=>{
    reloadUser();
  }, [])

  function reloadUser(){
    onAuthStateChanged(auth, async (_user) => {
      if (_user) {
        const uid = _user.uid;
        const rezEmailVerified = await firebaseFirestore.verifyEmailVerifiedDB(uid);
        if (rezEmailVerified.isResolved) {
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

  const customComponent = (Component) => {
    return ({ navigation, route }) => {
      return (
        <Layout navigation={navigation} route={route} user={user} setUser={setUser} >
          <Component />
        </Layout>
      );
    };
  };

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SetupTrip"
            component={customComponent(SetupTrip)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Chat"
            component={customComponent(Chat)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyTrips"
            component={customComponent(MyTrips)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Locations"
            component={customComponent(Locations)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSettings"
            component={customComponent(UserSettings)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Trip"
            component={customComponent(Trip)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Program"
            component={customComponent(Program)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DailyProgram"
            component={customComponent(DailyProgram)}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App

const styles = StyleSheet.create({})
