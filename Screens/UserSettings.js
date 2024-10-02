import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react';
import LogIn from '../Components/LogIn';
import {VStack, HStack, Button, ButtonText, Divider} from '@gluestack-ui/themed'
import {signOutUser, deleteTheUser} from '../firebase.js';

const UserSettings = (props) => {

  const [signInOrUp, setSignInOrUp] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  
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
      props.setUser(false)
    }else{
      console.log(rez.err);
      props.addNotification('error', "Unfortunately, we could not delete the account");
      return;
    }
  }

 
  return (
    <ScrollView style={{marginTop: 20}} >


      <LogIn addNotification={props.addNotification} signInOrUp={signInOrUp} setSignInOrUp={setSignInOrUp} 
        user={props.user} setUser={props.setUser} isForgotPassword={isForgotPassword} setIsForgotPassword={setIsForgotPassword}
      />
    
      
      <View style={{ alignItems: 'center' }}>
        {
        !props.user ?
        <VStack space="2xl">  
          <HStack  px="$3"  h="$8"  rounded="$sm"  borderWidth="$2"  borderColor="$backgroundLight300"  alignItems="center"  justifyContent="center"   $dark-borderColor="$backgroundDark700"  >
            <Button onPress={()=>{setSignInOrUp("signup"); setIsForgotPassword(false);}} variant="link" size="xl">
              <ButtonText>Create accout</ButtonText>
            </Button>
            <Divider orientation="vertical" h="50%" mx="$2.5" style={{margin: 20}} />
            <Button  onPress={()=>{setSignInOrUp("signin"); setIsForgotPassword(false)}} variant="link" size="xl">
              <ButtonText>Log in</ButtonText>
            </Button>          
          </HStack>
        </VStack> 
        : 
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
        }

      </View>




    </ScrollView>

  )
}

export default UserSettings

const styles = StyleSheet.create({});
