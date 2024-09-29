import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react';
import LogIn from '../Components/LogIn';
import {VStack, HStack, Button, ButtonText, Divider} from '@gluestack-ui/themed'

const UserSettings = (props) => {

  const [signInOrUp, setSignInOrUp] = useState('');

 


 
  return (
    <View>


      <LogIn addNotification={props.addNotification} signInOrUp={signInOrUp} setSignInOrUp={setSignInOrUp} />
    
      
      <View style={{ alignItems: 'center' }}>
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
        </VStack>
      </View>
    </View>

  )
}

export default UserSettings

const styles = StyleSheet.create({});
