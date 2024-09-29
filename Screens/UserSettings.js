import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react';
import LogIn from '../Components/LogIn';
import {VStack, HStack, Button, ButtonText, Divider} from '@gluestack-ui/themed'
import {signOutUser} from '../firebase.js';

const UserSettings = (props) => {

  const [signInOrUp, setSignInOrUp] = useState('');

 
  console.log(props.user);
  

  async function signOut(){
    const rez = await signOutUser();
    if(rez.type){props.setUser(false)};
  }
 
  return (
    <View>


      <LogIn addNotification={props.addNotification} signInOrUp={signInOrUp} setSignInOrUp={setSignInOrUp} />
    
      
      <View style={{ alignItems: 'center' }}>
        {
        !props.user ?
        <VStack space="2xl">  
          <HStack  px="$3"  h="$8"  rounded="$sm"  borderWidth="$1"  borderColor="$backgroundLight300"  alignItems="center"  justifyContent="center"   $dark-borderColor="$backgroundDark700"  >
            <Button onPress={()=>setSignInOrUp("signup")} variant="link" size="xl">
              <ButtonText>Create accout</ButtonText>
            </Button>
            <Divider orientation="vertical" h="50%" mx="$2.5" />
            <Button  onPress={()=>setSignInOrUp("signin")} variant="link" size="xl">
              <ButtonText>Log in</ButtonText>
            </Button>          
          </HStack>
        </VStack> : 
        <Button  onPress={()=>signOut()}  size="xl">
          <ButtonText>Log out</ButtonText>
        </Button>   
        }

      </View>


    </View>

  )
}

export default UserSettings

const styles = StyleSheet.create({});
