import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetupTrip from './Screens/SetupTrip.js';
import Program from './Screens/Program.js';
import DailyProgram from './Screens/DailyProgram.js';
import UserSettings from './Screens/UserSettings.js';
import MyTrips from './Screens/MyTrips.js';
import Locations from './Screens/Locations.js';
import Trip from './Screens/Trip.js';
import Chat from './Screens/Chat.js';
import FindLocation from './Screens/FindLocation.js';
import LogIn from './Screens/LogIn.js';
import Update from './Screens/Update.js';
import Layout from './Components/Layout.js';
import { auth, FirebaseFirestore } from './Firebase.js';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { onAuthStateChanged } from 'firebase/auth';
import { existsUpdates } from './diverse.js';

const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(undefined);
  const [updateApp, setUpdateApp] = useState(undefined);

  const firebaseFirestore = new FirebaseFirestore();

  useEffect(()=>{
    try{
      reloadUser();
      verifyAppUpdates();
    }catch(err){
      firebaseFirestore.storeErr(err.message);
    };
  }, []);

  async function verifyAppUpdates(){
    const data = await existsUpdates();
    setUpdateApp(data);
  };

  function reloadUser(){
    onAuthStateChanged(auth, async (_user) => {
      if (_user) {
        const uid = _user.uid;
        const userDetails = await firebaseFirestore.getDetailsUser(uid);
        if (userDetails?.data?.email_verified) {
          setUser({..._user, userDetails: userDetails.data});
        } else {
          setUser(_user);
        }
      } else {
        setUser(undefined);
      }
    });
  }

  const customComponent = (Component) => {
    return ({ navigation, route }) => {
      return (
        <Layout navigation={navigation} route={route} user={user} setUser={setUser} updateApp={updateApp} >
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
            name="Update"
            component={customComponent(Update)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Chat"
            component={customComponent(Chat)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSettings"
            component={customComponent(UserSettings)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FindLocation"
            component={customComponent(FindLocation)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyTrips"
            component={customComponent(MyTrips)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Program"
            component={customComponent(Program)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Trip"
            component={customComponent(Trip)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Locations"
            component={customComponent(Locations)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DailyProgram"
            component={customComponent(DailyProgram)}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LogIn"
            component={customComponent(LogIn)}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;

