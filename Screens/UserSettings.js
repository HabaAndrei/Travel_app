import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native'
import { useState } from 'react';
import {VStack, HStack, Button, ButtonText, Divider, Heading, Center, Icon, SettingsIcon} from '@gluestack-ui/themed'
import { FirebaseAuth } from '../firebase.js';
import {deleteAllFromAsyncStorage} from '../diverse.js';
import ModalReAuth from '../Components/Modals/ModalReAuth.js';
import CardFeedback from '../Components/UserSettingsComponents/CardFeedback.js';

const UserSettings = (props) => {

  const [isModalVisibleReAuth, setModalVisibleReAuth] = useState(false);

  const firebaseAuth = new FirebaseAuth();

  async function signOut(){
    const rez = await firebaseAuth._signOut();
    if(rez.isResolved){
      props.setUser(undefined)
    }else{
      console.log(rez.err);
      props.addNotification('error', "Unfortunately, we couldn't log you out");
      return;
    }
  }

  async function deleteUser(){

    const response = await props.areYouSureDeleting();
    if (!response) return;

    const rez = await firebaseAuth._deleteUser();
    if(rez.isResolved){
      props.setUser(undefined);
      deleteAllFromAsyncStorage()
    }else{
      if(rez?.err?.includes('auth/requires-recent-login')){
        setModalVisibleReAuth(true);
      }else{
        props.addNotification('error', "Unfortunately, we could not delete the account");
      }
    }
  }

  return (
    <SafeAreaView style={{flex: 1}} >
      <ScrollView style={{marginTop: 20}} >

        <Center>
          <HStack alignItems="center">
            <Heading>Settings</Heading>
            <Icon as={SettingsIcon} m="$2" w="$4" h="$4" />
          </HStack>
        </Center>


        <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />

        <CardFeedback addNotification={props.addNotification} />


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
    </SafeAreaView>

  )
}

export default UserSettings

const styles = StyleSheet.create({});
