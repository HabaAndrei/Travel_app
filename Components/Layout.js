import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Notification from './Notification';
import ConfirmActionModal from './Modals/ConfirmActionModal';
import uuid from 'react-native-uuid';
import LogIn from '../Screens/LogIn.js';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from '@react-navigation/native';

/** The main layout for the entire application */
const Layout = ({ children, navigation, route, user, setUser}) => {

  const insets = useSafeAreaInsets();
  const [isConfirmActionModal, setConfirmActionModal] = useState(false);
  const [notification, setNotification] = useState([]);
  const [deletePromise, setDeletePromise] = useState(null);
  const [navigationPath, setNavigationPath] = useState('SetupTrip')

  useFocusEffect(
    useCallback(() => {
      const currentRoute = route?.name;
      if (currentRoute) {
        setNavigationPath(currentRoute);
      }
    }, [route?.name])
  );

  // This function adds a notification for the entire application
  function addNotification(type, mes){
    setNotification((prev)=>{
      return [...prev, {id: uuid.v4().slice(0, 5), type, mes}];
    })
  }

  // Function that allows the user to confirm their action
  async function areYouSure() {
    return new Promise((resolve) => {
      setDeletePromise(() => resolve);
      setConfirmActionModal(true);
    });
  }

  function handleModalResponse(response) {
    if (deletePromise) {
      deletePromise(response);
      setDeletePromise(null);
    }
  }

  // for each screen create the layout
  const renderChildrenWithProps = () => {
    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        route, notification, setNotification, addNotification, areYouSure, navigation,
        user, setUser
      });
    });
  };

  return (
    <View style={styles.container}>
      {/* Background color for statusBar */}
      <View style={{ height: insets.top, backgroundColor: '#040404',}} />

      <StatusBar style="light"/>

      <ConfirmActionModal   isConfirmActionModal={isConfirmActionModal} setConfirmActionModal={setConfirmActionModal} handleModalResponse={handleModalResponse} />

      <Notification  notification={notification} setNotification={setNotification}  />

      {user?.userDetails?.email_verified ?

        <View style={styles.content}>

          {renderChildrenWithProps()}
        </View>
        :
        <LogIn   user={user} setUser={setUser} addNotification={addNotification}
          areYouSure={areYouSure}  navigation={navigation} />
      }


     {user?.userDetails?.email_verified ?

      <View style={styles.footerContainer}>
        <ScrollView
          horizontal={true}
          style={styles.footer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.footerContent}
        >
          <Pressable style={styles.pressable} onPress={() => navigation.navigate('MyTrips')} >
            <FontAwesome6 name="earth-americas" size={navigationPath === 'MyTrips' ? 27 : 22} color="white" />
            <Text style={styles.pressableText}>My Trips</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('FindLocation')} >
            <FontAwesome name="search" size={navigationPath === 'FindLocation' ? 27 : 22} color="white" />
            <Text style={styles.pressableText}>Find place</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('SetupTrip')} >
            <Entypo name="circle-with-plus" size={navigationPath === 'SetupTrip' ? 27 : 22} color="white" />
            <Text style={styles.pressableText}>New trip</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Chat')} >
            <MaterialCommunityIcons name="robot-outline" size={navigationPath === 'Chat' ? 27 : 22} color="white" />
            <Text style={styles.pressableText}>Assistant</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('UserSettings')} >
            <Feather name="settings" size={navigationPath === 'UserSettings' ? 27 : 22} color="white" />
            <Text style={styles.pressableText}>Settings</Text>
          </Pressable>

        </ScrollView>
      </View> : <View
        style={styles.footerContainerClear}
      />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AAAABAD',
  },
  content: {
    flex: 1,
  },
  footerContainer: {
    height: 80,
    paddingBottom: 20,
    backgroundColor: '#040404',
  },
  footerContainerClear: {
    height: 50,
    backgroundColor: '#040404',
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    minWidth: '100%',
  },
  pressable: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 5,
  },
  pressableText: {
    marginTop: 4,
    fontSize: 12,
    color: 'white',
  },
});

export default Layout;
