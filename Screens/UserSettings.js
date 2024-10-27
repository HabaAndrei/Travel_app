import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react';
import {VStack, HStack, Button, ButtonText, Divider} from '@gluestack-ui/themed'
import {signOutUser, deleteTheUser, } from '../firebase.js';
import {deleteAllFromAsyncStorage} from '../diverse.js';
import ModalReAuth from '../Components/ModalReAuth.js';

const UserSettings = (props) => {

  const [isModalVisibleReAuth, setModalVisibleReAuth] = useState(false);

  
  async function signOut(){
    const rez = await signOutUser();
    if(rez.type){
      props.setUser(false)
    }else{
      console.log(rez.err);
      props.addNotification('error', "Unfortunately, we couldn't log you out");
      return;
    }
  }

  async function deleteUser(){

    const response = await props.areYouSureDeleting();
    if (!response) return;

    const rez = await deleteTheUser();
    if(rez.type){
      props.setUser(false);
      deleteAllFromAsyncStorage()
    }else{
      if(rez?.err?.message?.includes('auth/requires-recent-login')){
        setModalVisibleReAuth(true);
      }else{
        props.addNotification('error', "Unfortunately, we could not delete the account");
      }
    }
  }

  return (
    <ScrollView style={{marginTop: 20}} >

      <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />

      <View style={{ alignItems: 'center' }}>
        <VStack space="2xl">  
          <HStack  px="$3"  h="$8"  rounded="$sm"  borderWidth="$2"  borderColor="$backgroundLight300"  alignItems="center"  justifyContent="center"   $dark-borderColor="$backgroundDark700"  >
            <Button onPress={()=>signOut()} variant="link" size="xl">
              <ButtonText>Log out</ButtonText>
            </Button>
            <Divider orientation="vertical" h="50%" mx="$2.5" style={{margin: 20}} />
            <Button  onPress={()=>deleteUser()} variant="link" size="xl">
              <ButtonText>Delete accout</ButtonText>
            </Button>          
          </HStack>
        </VStack>


        <View  >
          <Pressable onPress={()=>deleteAllFromAsyncStorage()} >
            <Text style={{margin: 50, backgroundColor: 'blue'}}  >
              Delete all from Async Storage
            </Text>
          </Pressable>
        </View>
      </View>

    </ScrollView>

  )
}

export default UserSettings

const styles = StyleSheet.create({});
