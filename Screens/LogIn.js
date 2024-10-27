import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import React, {useState } from 'react'
import { Input, InputField, InputIcon, InputSlot, VStack, HStack, Divider, Button, 
    Center, Heading, EyeIcon, ButtonText, 
    EyeOffIcon, Card } from '@gluestack-ui/themed'
import {createUserEmailPassword,  signInUserEmailPassword, forgotPassword, signOutUser, 
    deleteTheUser, storeCodeAndEmail, verifyCodeDB, updateEmailVerificationDB
} from '../firebase.js'
import {isValidEmail, isValidPassword, deleteAllFromAsyncStorage, 
    address_function_send_code_verification} from "../diverse.js"
import uuid from 'react-native-uuid';
import axios from 'axios';
import ModalReAuth from '../Components/ModalReAuth.js';

const LogIn = (props) => {

    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState({ input: '', showState: false });
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputSecondName, setInputSecondName] = useState('');
    const [signInOrUp, setSignInOrUp] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState('');
    const [codeVerify, setCodeVerify] = useState('');
    const [isModalVisibleReAuth, setModalVisibleReAuth] = useState(false);


    async function createAccout(){
        if(!inputEmail || !inputPassword.input || !inputFirstName || !inputSecondName){
            props.addNotification('warning', "Please complete all inputs");
            return;
        }

        if(!isValidEmail(inputEmail)){
            props.addNotification('error', "The email address is not valid");
            return;
        }

        if(!isValidPassword(inputPassword.input)){
            props.addNotification('error', "The password must have at least seven characters, two of which must be numbers");
            return;
        }

        const rez = await createUserEmailPassword(inputEmail, inputPassword.input, inputFirstName, inputSecondName);
        if(!rez.type){
            if(rez.err?.message?.includes("auth/email-already-in-use")){
                props.addNotification('error',"This email address is already in use");
            }else{
                props.addNotification('error', "Unfortunately I could not create the account ");
            }
            console.log(rez.err);
        }
    }

    async function logIn(){
        if(!inputEmail || !inputPassword.input){
            props.addNotification('warning', "Please complete all inputs");
            return;
        }

        if(!isValidEmail(inputEmail)){
            props.addNotification('error', "The email address is not valid");
            return;
        }

        const rez = await signInUserEmailPassword(inputEmail, inputPassword.input);
        if(rez.type){
            const user = rez.data;
        }else{
            props.addNotification('error', "Invalid login credentials");
            console.log(rez.err);

        }
    }

    
    async function forgotThePassword(){
        if(!isValidEmail(inputEmail)){
            props.addNotification('error', "The email address is not valid");
            return;
        }

        const rez = await forgotPassword(inputEmail);
        if(rez.type){
            props.addNotification('success', "Password reset email has been sent");
        }else{
            props.addNotification('error', "Sending the password reset email did not work");
            console.log(rez.err);
        }
    }

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

    async function sendCodeToEmail(){
        const code = uuid.v4().slice(0, 6);
        const email = props.user.email;
        const rezStore = await storeCodeAndEmail(code, email);
        if(!rezStore.type){
            console.log(rezStore);
            props.addNotification('error', "There was a problem sending the code by email");
            return;
        }
        const rezSend = await axios.post(address_function_send_code_verification, {code, email});
        if(!rezSend.data.type){
            console.log(rezSend.data.err);
            props.addNotification('error', "There was a problem sending the code by email");
            return;
        }
        props.addNotification('success', "The email was successful. Please enter the code received on the email address in the input");
    }

    async function verifyCode(){
        if(codeVerify.length != 6){
            props.addNotification('error', 'The code must have 6 characters, without spaces');
            return;
        }        
        const rezDB = await verifyCodeDB(codeVerify, props.user.email);
        if(!rezDB.type){
            props.addNotification('error', 'There was a problem verifying the code');
            return
        }else if(rezDB.type && rezDB.mes){
            props.addNotification('error', rezDB.mes);
            return;
        }

        const rezUpdateDB = await updateEmailVerificationDB(props.user.uid);
        if(!rezUpdateDB.type){
            props.addNotification('error', 'Please retry the operation and generate a new code');
            return;
        }
        props.setUser((prev)=>{
            return {...prev, email_verified: true};
        });

        props.navigation.navigate('SetUpTrip');
    }

  return (
    <ScrollView>

        <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />

        {props.user ? 
        <View>
            {!props.user?.emailVerified_code ? 
            <View>
                <Center>
                    <Heading color="$text900" lineHeight="$md">
                        The next step is to verify your 
                    </Heading>
                    <Heading>
                        email address.
                    </Heading>
                </Center>

                <Button onPress={sendCodeToEmail} size="xl" style={{margin: 20}} >
                    <ButtonText>Send code to email</ButtonText>
                </Button>

                <VStack space="xs" style={{margin: 20}} >
                    <Text color="$text500" lineHeight="$xs">
                        Enter the code received via email
                    </Text>
                    <Input >
                        <InputField
                        type="text"
                        value={codeVerify}
                        onChangeText={(text) => setCodeVerify(text)}
                        />
                    </Input>
                </VStack>

                <Button onPress={verifyCode} size="xl" style={{margin: 20}} >
                    <ButtonText>Verify code</ButtonText>
                </Button>
            
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
            : 
            <View></View>
            }
        </View>
        :
        <View >
            {signInOrUp ? 
            <View  style={{marginBottom: 50, margin: 20}} >
                <Card p="$5" borderRadius="$lg"  m="$3" style={styles.shadow} maxWidth={400} >

                    {isForgotPassword ? 
                
                    <VStack space="xs">
        
                        <Text color="$text500" lineHeight="$xs">
                            Write the email to which you want to reset the password
                        </Text>
                        <Input>
                            <InputField
                            type="text"
                            value={inputEmail}
                            onChangeText={(text) => setInputEmail(text)}
                            />
                        </Input>
                        <Button ml="auto" >
                            <ButtonText color="$white" onPress={forgotThePassword} >Send email</ButtonText>
                        </Button>
                    </VStack>
                    :    
                    <VStack space="xl">
                        <Heading color="$text900" lineHeight="$md">
                            {signInOrUp === "signup" ? "Create accout" :  "Log in"  }
                        </Heading>
                        {signInOrUp === "signup" ? 
                            <VStack space="xs">
                                <Text color="$text500" lineHeight="$xs">
                                First name
                                </Text>
                                <Input>
                                <InputField
                                    type="text"
                                    value={inputFirstName}
                                    onChangeText={(text) => setInputFirstName(text)}
                                />
                                </Input>
                            </VStack> : <View></View>
                        }  
                        {signInOrUp === "signup" ? 
                            <VStack space="xs">
                                <Text color="$text500" lineHeight="$xs">
                                Second name
                                </Text>
                                <Input>
                                <InputField
                                    type="text"
                                    value={inputSecondName}
                                    onChangeText={(text) => setInputSecondName(text)}
                                />
                                </Input>
                            </VStack> : <View></View>
                        }
                        <VStack space="xs">
                            <Text color="$text500" lineHeight="$xs">
                                Email
                            </Text>
                            <Input>
                                <InputField
                                type="text"
                                value={inputEmail}
                                onChangeText={(text) => setInputEmail(text)}
                                />
                            </Input>
                        </VStack>
                        <VStack space="xs">
                            <Text color="$text500" lineHeight="$xs"> 
                                Password 
                                {signInOrUp === "signup" ? "The password must have at least seven characters, two of which must be numbers" : ""}
                            </Text>
                            <Input textAlign="center">
                                <InputField
                                type={inputPassword.showState ? "text" : "password"}
                                value={inputPassword.input}
                                onChangeText={(text) => setInputPassword({ ...inputPassword, input: text })}
                                />
                                <InputSlot pr="$3" onPress={() => setInputPassword(prev => ({ ...prev, showState: !prev.showState }))}>
                                <InputIcon
                                    as={inputPassword.showState ? EyeIcon : EyeOffIcon}
                                    color="$darkBlue500"
                                />
                                </InputSlot>
                            </Input>
                        </VStack>
                        <Pressable onPress={()=>setIsForgotPassword(true)}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>
                                Forgot your password? Click here
                            </Text>
                        </Pressable>

                        <Button ml="auto">
                            <ButtonText color="$white" onPress={signInOrUp === "signup" ? createAccout : logIn}>
                                {signInOrUp === "signup" ? "Create" : "Log in"}
                            </ButtonText>
                        </Button>
                    </VStack>
                    }
                </Card>
            </View>

            :<View></View>
            }

            <View style={{ alignItems: 'center' }}>
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
            </View>
        </View>
    
        }
    </ScrollView>
  )
}

export default LogIn

const styles = StyleSheet.create({
    shadow:{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
})
