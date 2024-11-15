import { StyleSheet, View, Pressable, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native'
import React, {useState } from 'react'
import { Input, InputField, Text, Icon, VStack, HStack, Divider, Button, 
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
  const [signInOrUp, setSignInOrUp] = useState('signin');
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
        return;
      }else{
        props.addNotification('error', "Unfortunately I could not create the account ");
        return;
      }
    }
    props.navigation.navigate('SetUpTrip');
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
      props.navigation.navigate('SetUpTrip');
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
      console.log(rezStore.err);
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
    <SafeAreaView style={{flex: 1}} >

      <ImageBackground   style={styles.backgroundImage}  source={require('../img/background.jpg')}>

      <ScrollView>

        <View style={styles.titleContainer}>
          <Text style={styles.appName}>Travel Bot</Text>
          <Text style={styles.slogan}>– Where Every Trip Finds Its Way 🌍</Text>
        </View>

        <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />

        {props.user ? 
        <View>
          {!props.user?.emailVerified_code ? 
            <View style={{ marginBottom: 40, marginRight: 20,  marginLeft: 20}} >
              <Card p="$5" borderRadius="$lg"  m="$3" style={styles.shadow} maxWidth={400} >
                <Center>
                  <Heading color="$text900" lineHeight="$md">
                    The next step is to verify your 
                  </Heading>
                  <Heading>
                    email address.
                  </Heading>
                </Center>

                <Button onPress={sendCodeToEmail} size="l" style={{margin: 20}} >
                  <ButtonText>Send code to email</ButtonText>
                </Button>

                <VStack   style={{margin: 20}} >
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
                
                <Button ml="auto" onPress={verifyCode}>
                  <ButtonText>Verify code</ButtonText>
                </Button>
              </Card>
          
              <VStack space="2xl">  
                <HStack  px="$3"  h="$8"  rounded="$sm" alignItems="center" justifyContent="center" style={{marginBottom: 30}} >
                  <Button onPress={()=>signOut()} size="l">
                    <ButtonText>Log out</ButtonText>
                  </Button>
                  <Divider  w={20} variant="horizontal" style={{margin: 10}} />
                  <Button  onPress={()=>deleteUser()} size="l">
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
            <View  style={{ marginBottom: 40, marginRight: 20,  marginLeft: 20}} >

              {isForgotPassword ? 
                <VStack  >
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
                  <Text style={styles.actionName}>{signInOrUp === "signup" ? "Create accout" :  "Log in"  }</Text>

                  {signInOrUp === "signup" ? 
                    <View style={styles.inputContainer}>
                      <TextInput style={styles.input} placeholder='Write your email' placeholderTextColor="white"
                        value={inputFirstName}  onChangeText={(text) => setInputFirstName(text)}/>
                    </View>
                    : <View></View>
                  }  
                  {signInOrUp === "signup" ? 
                    <View style={styles.inputContainer}>
                      <TextInput style={styles.input} placeholder='Second name' placeholderTextColor="white"
                        value={inputSecondName}  onChangeText={(text) => setInputSecondName(text)}/>
                    </View>
                    : <View></View>
                  }

                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder='Email' placeholderTextColor="white"
                      value={inputEmail}  onChangeText={(text) => setInputEmail(text)}/>
                  </View>
                 
                  
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                        onPress={() => setInputPassword(prev => ({ ...prev, showState: !prev.showState }))} // Schimbă starea de vizibilitate a parolei
                      >
                        <Icon
                          as={inputPassword.showState ? EyeIcon : EyeOffIcon}
                          color="$darkBlue500"
                        />
                      </TouchableOpacity>
                    <TextInput style={styles.input} placeholder='Password' placeholderTextColor="white"
                      value={inputPassword.input} onChangeText={(text) => setInputPassword({ ...inputPassword, input: text })}
                      secureTextEntry={inputPassword.showState}
                      />
                  </View>

                  {signInOrUp === "signup" ? 
                    <Text  style={styles.textPassword}> 
                      The password must have at least seven characters, two of which must be numbers
                    </Text> : <Text></Text>
                  }
                  {/* <Text  style={signInOrUp === "signup" ? styles.textPassword : ''}> 
                    {signInOrUp === "signup" ? "The password must have at least seven characters, two of which must be numbers" : ""}
                  </Text>
                   */}
                  <Pressable onPress={()=>setIsForgotPassword(true)}>
                    <Text style={styles.textForgot}>
                      Forgot your password? Click here
                    </Text>
                  </Pressable>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}
                      onPress={signInOrUp === "signup" ? createAccout : logIn}>
                      <Text style={styles.buttonText}> {signInOrUp === "signup" ? "Create" : "Log in"}    </Text>
                    </TouchableOpacity>         
                  </View>

                </VStack>
              }
            </View>
            :
            <View></View>
          }

          <View style={{ alignItems: 'center', marginTop: 50 }}>
              
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}
                onPress={()=>{setSignInOrUp("signup"); setIsForgotPassword(false);}}
              >
                <Text style={styles.buttonText}>Create accout</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.separator} /> 

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}
                onPress={()=>{setSignInOrUp("signin"); setIsForgotPassword(false)}}
                >
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>         
            </View>
             
          </View>
        </View>
        }
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>

  )
}

export default LogIn

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  button: {
    backgroundColor: 'rgba(0, 0, 255, 0.45)', 
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 200
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1, 
    borderBottomColor: 'white', 
    width: 400, 
    marginVertical: 10, 
  },
  titleContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: 20, 
  },
  appName: {
    fontSize: 36, 
    fontWeight: 'bold',
    color: 'rgba(0, 0, 255, 0.9)', 
  },
  actionName:{
    fontSize: 28, 
    fontWeight: 'bold',
    color: 'rgba(0, 0, 255, 10)',
  },
  slogan: {
    fontSize: 16, 
    fontStyle: 'italic',
    color: 'white', 
    marginTop: 5, 
  },
  inputContainer: {
    width: '80%',
    borderBottomWidth: 4, // Linie sub input
    borderBottomColor: 'white', // Culoarea liniei
    marginVertical: 1, 
  },
  input: {
    fontSize: 16,
    color: 'white', 
    paddingVertical: 5, 
    fontWeight: 'bold'
  },
  textPassword: {
    fontSize: 13,
    color: 'white', 
    paddingVertical: 5, 
    fontWeight: 'bold'
  }, 
  textForgot: {
    color: 'rgba(255, 255, 255, 0.7)', // Text alb, cu opacitate pentru a fi mai discret
    backgroundColor: 'transparent', // Fundal transparent
    textDecorationLine: 'underline', // Adaugă subliniere
    fontSize: 14, // Dimensiunea fontului
    marginTop: 10, // Spațiu deasupra textului pentru a nu fi lipit de input
  },
})
