import { StyleSheet, View, Pressable, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native'
import React, {useState } from 'react'
import { Icon, VStack, EyeIcon, EyeOffIcon } from '@gluestack-ui/themed'
import {createUserEmailPassword,  signInUserEmailPassword, forgotPassword, signOutUser,
    deleteTheUser, storeCodeAndEmail, verifyCodeDB, updateEmailVerificationDB
} from '../firebase.js'
import {isValidEmail, isValidPassword, deleteAllFromAsyncStorage,
    address_function_send_code_verification} from "../diverse.js"
import uuid from 'react-native-uuid';
import axios from 'axios';
import ModalReAuth from '../Components/ModalReAuth.js';
import {ButtonWhite, ButtonBlue} from '../CustomElements/buttonsTwoColors.js';

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
    if(!inputEmail?.length || !inputPassword?.input?.length || !inputFirstName?.length || !inputSecondName?.length){
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

    const rez = await deleteTheUser();
    if(rez.type){
      props.setUser(undefined);
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
    try{
      const code = uuid.v4().slice(0, 6);
      const email = props.user.email;
      const rezStore = await storeCodeAndEmail(code, email);
      if(!rezStore.type){
        props.addNotification('error', "There was a problem sending the code by email");
        return;
      }
      const rezSend = await axios.post(address_function_send_code_verification, {code, email});
      if(!rezSend.data.type){
        props.addNotification('error', "There was a problem sending the code by email");
        return;
      }
      props.addNotification('success', "The email was successful. Please enter the code received on the email address in the input");
    }catch(err){
      console.log(err);
      props.addNotification('error', "There was a problem sending the code by email");
    }
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

  function createAcc(){
    setSignInOrUp("signup");
    setIsForgotPassword(false)
  }

  function logIN(){
    setSignInOrUp("signin");
    setIsForgotPassword(false)
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
            <View >
              <VStack >
                <Text style={styles.actionNameLow}>The next step is to verify your email address</Text>

                <View style={{margin: 10}} />

                <ButtonBlue name={'Send code to email'} func={sendCodeToEmail} />

                <View style={{margin: 10}} />

                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder='Enter the code received via email' placeholderTextColor="white"
                    value={codeVerify}
                    onChangeText={(text) => setCodeVerify(text)}/>
                </View>

                <View style={{margin: 10}} />

                <ButtonBlue name={'Verify code'} func={verifyCode} />


              </VStack>

              <View style={{ alignItems: 'center', marginTop: 50 }}>

                <ButtonWhite name={'Log out'} func={signOut} />

                <View style={styles.separator} />

                <ButtonWhite name={'Delete account'} func={deleteUser} />

              </View>
            </View>
            :
            null
          }
        </View>
        :
        <View >
          {signInOrUp ?
            <View  style={{ marginBottom: 40, marginRight: 20,  marginLeft: 20}} >

              {isForgotPassword ?
                <View  >
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder='Email to reset the password'
                      placeholderTextColor="white"
                      value={inputEmail} onChangeText={(text) => setInputEmail(text)}/>
                  </View>

                  <View style={{margin:10}} />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}
                      onPress={forgotThePassword}>
                      <Text style={styles.buttonText}>Send email</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                :
                <VStack space="xl">
                  <Text style={styles.actionName}>{signInOrUp === "signup" ? "Create accout" :  "Log in"  }</Text>

                  {signInOrUp === "signup" ?
                    <View style={styles.inputContainer}>
                      <TextInput style={styles.input} placeholder='Name' placeholderTextColor="white"
                        value={inputFirstName}  onChangeText={(text) => setInputFirstName(text)}/>
                    </View>
                    : null
                  }
                  {signInOrUp === "signup" ?
                    <View style={styles.inputContainer}>
                      <TextInput style={styles.input} placeholder='Second name' placeholderTextColor="white"
                        value={inputSecondName}  onChangeText={(text) => setInputSecondName(text)}/>
                    </View>
                    : null
                  }

                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder='Email' placeholderTextColor="white"
                      value={inputEmail}  onChangeText={(text) => setInputEmail(text)}/>
                  </View>

                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                        onPress={() => setInputPassword(prev => ({ ...prev, showState: !prev.showState }))}
                      >
                        <Icon
                          as={inputPassword.showState ? EyeIcon : EyeOffIcon}
                          color="$darkBlue500"
                        />
                      </TouchableOpacity>
                    <TextInput style={styles.input} placeholder='Password' placeholderTextColor="white"
                      value={inputPassword.input} onChangeText={(text) => setInputPassword({ ...inputPassword, input: text })}
                      secureTextEntry={!inputPassword.showState}
                      />
                  </View>

                  {
                    signInOrUp === "signup" ?
                    <Text  style={styles.textPassword}>
                      The password must have at least seven characters, two of which must be numbers
                    </Text> : null
                  }

                  <Pressable onPress={()=>setIsForgotPassword(true)}>
                    <Text style={styles.textForgot}>
                      Forgot your password? Click here
                    </Text>
                  </Pressable>

                  <ButtonBlue name={signInOrUp === "signup" ? "Create" : "Log in"} func={signInOrUp === "signup" ? createAccout : logIn} />

                </VStack>
              }
            </View>
            :
            null
          }

          <View style={{ alignItems: 'center', marginTop: 50 }}>

            <ButtonWhite func={createAcc} name={'Create accout'}/>

            <View style={styles.separator} />

            <ButtonWhite func={logIN} name={'Log in'}/>

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
  buttonWhite:{
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  buttonTextWhite: {
    color: 'rgba(0, 0, 255, 10)',
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
    color: 'white',
  },
  actionName:{
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 255, 10)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 5,
    alignSelf: 'flex-start',
  },
  actionNameLow:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 255, 10)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 5,
    alignSelf: 'flex-start',
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'white',
    marginTop: 5,
  },
  inputContainer: {
    width: '80%',
    borderBottomWidth: 4,
    borderBottomColor: 'white',
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
    color: 'white',
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 5,
    borderRadius: 3,
    alignSelf: 'flex-end',
  },

})
