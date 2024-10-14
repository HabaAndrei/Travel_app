import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Icon, GlobeIcon, CalendarDaysIcon, SettingsIcon, MenuIcon, CheckCircleIcon } from "@gluestack-ui/themed";
import Notification from './Notification';
import ModalDelete from './ModalDelete';
import uuid from 'react-native-uuid';
import LogIn from '../Screens/LogIn.js';
import * as Updates from 'expo-updates';


const Layout = ({ children, navigation, route, user, setUser}) => {

  const [modalDelete, setModalDelete] = useState(false);
  const [notification, setNotification] = useState([]);
  const [deletePromise, setDeletePromise] = useState(null);

  

  function addNotification(type, mes){
    console.log('se apeleaza si functia mama din layout de notificare')
    setNotification((prev)=>{
      return [...prev, {id: uuid.v4().slice(0, 5), type, mes}];
    })
  }

  async function refreshApp(){
    try {
      await Updates.reloadAsync(); 
    } catch (err) {
      console.log('Eroare la reincarcarea aplicatiei: ', err);
    }
  };


  async function areYouSureDeleting() {
    return new Promise((resolve) => {
      setDeletePromise(() => resolve); 
      setModalDelete(true); 
    });
  }

  function handleModalResponse(response) {
    if (deletePromise) {
      deletePromise(response);
      setDeletePromise(null); 
    }
  }




  const renderChildrenWithProps = () => {
    return React.Children.map(children, child => {
      return React.cloneElement(child, { 
        route, notification, setNotification, addNotification, areYouSureDeleting, navigation, 
        user, setUser
      });
    });
  };

  
  return (
    <View style={styles.container}>

      <ModalDelete   modalDelete={modalDelete} setModalDelete={setModalDelete} handleModalResponse={handleModalResponse} />

      <Notification  notification={notification} setNotification={setNotification}  />

      {user?.emailVerified ? 
      
        <View style={styles.content}>
      
          {renderChildrenWithProps()}
        </View> 
        : 
        <LogIn   user={user} setUser={setUser} addNotification={addNotification} 
          areYouSureDeleting={areYouSureDeleting} />
      }


     {user?.emailVerified ?  
          
      <View style={styles.footerContainer}>
        <ScrollView 
          horizontal={true} 
          style={styles.footer} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.footerContent}
        >
          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Home')} >
            <Icon as={GlobeIcon} m="$2" w="$5" h="$5"  color="white"/>
            <Text style={styles.pressableText}>Home</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Program')} >
            <Icon as={CalendarDaysIcon} m="$2" w="$5" h="$5" color="white" />
            <Text style={styles.pressableText}>Program</Text>
          </Pressable>
          
          <Pressable style={styles.pressable} onPress={() => navigation.navigate('UserSettings')} >
            <Icon as={SettingsIcon} m="$2" w="$5" h="$5" color="white" />
            <Text style={styles.pressableText}>Settings</Text>
          </Pressable>
         
          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Plans')} >
            <Icon as={MenuIcon} m="$2" w="$5" h="$5" color="white" />
            <Text style={styles.pressableText}>Plans</Text>
          </Pressable> 


        </ScrollView>
      </View> : <View/> 
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
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
  footer: {
    flex: 1,
  },
  footerContent: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  pressable: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10, 
    padding: 10, 
    borderRadius: 8, 
  },
  pressableText: {
    marginTop: 4,
    fontSize: 12, 
    color: 'white', 
  },
});

export default Layout;


// Golden top: #d8ab4e

// Golden bottom: #b48c36

// Charcoal Black: #040404