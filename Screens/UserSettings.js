import { View, ScrollView, SafeAreaView, TouchableOpacity, Text, Linking } from 'react-native'
import { useState } from 'react';
import {VStack, HStack, Button, ButtonText, Divider, Heading, Center, Icon, SettingsIcon} from '@gluestack-ui/themed'
import { FirebaseAuth } from '../Firebase.js';
import {deleteAllFromAsyncStorage} from '../diverse.js';
import ModalReAuth from '../Components/Modals/ModalReAuth.js';
import CardFeedback from '../Components/UserSettingsComponents/CardFeedback.js';
import DetailsUserView from '../Components/UserSettingsComponents/DetailsUserView.js';
import CustomButton from '../CustomElements/CustomButton.js';

const UserLogged = ({user, children}) => {
  return (
    <>
      {
        user?.userDetails?.email_verified ? children : null
      }
    </>
  )
}

const UserDisconnected = ({user, children}) => {
  return (
    <>
      {
        !user?.userDetails?.email_verified ? children : null
      }
    </>
  )
}

/** UserSettings screen => where the client can adjust app settings */
const UserSettings = (props) => {

  const [isModalVisibleReAuth, setModalVisibleReAuth] = useState(false);

  const firebaseAuth = new FirebaseAuth();

  async function signOut(){
    if (!props.user?.userDetails?.email_verified) return
    const rez = await firebaseAuth._signOut();
    if(rez.isResolved){
      props.setUser(undefined);
      deleteAllFromAsyncStorage();
    }else{
      console.log(rez.err);
      props.addNotification('error', "Unfortunately, we couldn't log you out");
      return;
    }
  }

  async function deleteUser(){
    if (!props.user?.userDetails?.email_verified) return
    const response = await props.areYouSure();
    if (!response) return;

    const rez = await firebaseAuth._deleteUser();
    if(rez.isResolved){
      props.setUser(undefined);
      deleteAllFromAsyncStorage();
    }else{
      if(rez?.err?.includes('auth/requires-recent-login')){
        setModalVisibleReAuth(true);
      }else{
        props.addNotification('error', "Unfortunately, we could not delete the account");
      }
    }
  }

  function logIn(){
    props.navigation.navigate('LogIn');
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

        <UserLogged user={props.user} >
          <DetailsUserView user={props.user} addNotification={props.addNotification} />
          <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />
        </UserLogged>

        <CardFeedback addNotification={props.addNotification} user={props.user} />

        <UserLogged user={props.user} >
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
          </View>
        </UserLogged>

        <UserDisconnected user={props.user} >
          <CustomButton name={'Log in'} func={logIn} />
        </UserDisconnected>

        <Center style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:travelbot.suport@gmail.com")}
          >
            <Text
              style={{fontSize: 16, textDecorationLine: 'underline', padding: 10}}
            > Suport: travelbot.suport@gmail.com </Text>
          </TouchableOpacity>
        </Center>

      </ScrollView>
    </SafeAreaView>

  )
}

export default UserSettings;