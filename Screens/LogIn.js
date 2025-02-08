import { StyleSheet, View, Pressable, Text, ScrollView, SafeAreaView, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native'
import { useReducer, useState } from 'react'
import { Spinner } from '@gluestack-ui/themed'
import { FirebaseAuth, FirebaseFirestore } from '../Firebase.js'
import {isValidEmail, isValidPassword, deleteAllFromAsyncStorage, address_function_send_code_verification} from "../diverse.js"
import uuid from 'react-native-uuid';
import axios from 'axios';
import ModalReAuth from '../Components/Modals/ModalReAuth.js';
import {ButtonWhite, ButtonBlue} from '../CustomElements/buttonsTwoColors.js';
import { arrayUnion } from "firebase/firestore";
import InputComponent from '../Components/LogInComponents/InputComponent.js';
import ViewIfUserExistsWithoutEmailVerified from '../Components/LogInComponents/ViewIfUserExistsWithoutEmailVerified.js';

function ViewIfSignUpMethod(props){
  return (
    <>
      {props.signInOrUp === "signup" ? props.children : null}
    </>
  )
}


function ViewIfUserDoesntExist(props){
  return (
    <>
      {!props.user ? props.children : null}
    </>
  )
}

function ViewIfUserForgotsPassword(props){
  return (
    <>
      {props.isForgotsPassword ? props.children : null}
    </>
  )
}

function SignInSignUpView(props){
  return (
    <>
      {!props.isForgotsPassword ? props.children : null}
    </>
  )
}

/** The Login screen */
const LogIn = (props) => {

  const [inputPassword, passwordDispatch] = useReducer(passwordReducer, {
    input: '', showState: false
  });
  function passwordReducer(state, action) {
    const { type, payload } = action;
    switch (type) {
      case 'changeInput': {
        return { ...state, input: payload || '' };
      }
      case 'showState': {
        return { ...state, showState: !state.showState };
      }
      default:
        return state;
    }
  }

  const [inputEmail, setInputEmail] = useState('');
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputSecondName, setInputSecondName] = useState('');
  const [signInOrUp, setSignInOrUp] = useState('signin');
  const [isForgotsPassword, setIsForgotsPassword] = useState('');
  const [codeVerify, setCodeVerify] = useState('');
  const [isModalVisibleReAuth, setModalVisibleReAuth] = useState(false);
  const [isLoadingSendEmail, setLoadingSendEmail] = useState(false);

  const firebaseAuth = new FirebaseAuth();
  const firebaseFirestore = new FirebaseFirestore();

  async function createAccount(){
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

    const rez = await firebaseAuth._createUserWithEmailAndPassword(inputEmail, inputPassword.input, inputFirstName, inputSecondName);
    if(!rez.isResolved){
      if(rez.err?.message?.includes("auth/email-already-in-use")){
        props.addNotification('error',"This email address is already in use");
      }else{
        props.addNotification('error', "Unfortunately I could not create the account ");
      }
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

    const rez = await firebaseAuth._signInWithEmailAndPassword(inputEmail, inputPassword.input);
    if(rez.isResolved){
      const user = rez.data;
      props.navigation.navigate('SetupTrip');
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

    const rez = await firebaseAuth._sendPasswordResetEmail(inputEmail);
    if(rez.isResolved){
      props.addNotification('success', "Password reset email has been sent");
    }else{
      props.addNotification('error', "Sending the password reset email did not work");
      console.log(rez.err);
    }
  }

  async function signOut(){
    const rez = await firebaseAuth._signOut();
    if(rez.isResolved){
      props.setUser(undefined)
    }else{
      console.log(rez.err);
      props.addNotification('error', "Unfortunately, we couldn't log you out");
    }
  }

  async function deleteUser(){
    const response = await props.areYouSure();
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

  async function sendCodeToEmail(){
    try{
      setLoadingSendEmail(true);
      const code = uuid.v4().slice(0, 6);
      const email = props.user.email;
      const rezStore = await firebaseFirestore.updateColumnsDatabase({
        database: 'code_verification',
        id: props.user.email,
        columnsWithValues: {'codes': arrayUnion(code)}
      })
      if(!rezStore.isResolved){
        setLoadingSendEmail(false);
        props.addNotification('error', "There was a problem sending the code by email");
        return;
      }
      const rezSend = await axios.post(address_function_send_code_verification, {code, email});
      if(!rezSend.data.isResolved){
        setLoadingSendEmail(false);
        props.addNotification('error', "There was a problem sending the code by email");
        return;
      }
      setLoadingSendEmail(false);
      props.addNotification('success', "The email will arive immediately. Please enter the code received on the email address in the input");
    }catch(err){
      console.log(err);
      setLoadingSendEmail(false);
      props.addNotification('error', "There was a problem sending the code by email");
    }
  }

  async function verifyCode(){
    if(codeVerify.length != 6){
      props.addNotification('error', 'The code must have 6 characters, without spaces');
      return;
    }
    const rezDB = await firebaseFirestore.verifyCodeDB(codeVerify, props.user.email);
    if(!rezDB.isResolved ){
      props.addNotification('error', rezDB?.mes ? rezDB?.mes : 'There was a problem verifying the code');
      return;
    }
    const rezUpdateDB = await firebaseFirestore.updateColumnsDatabase(
      {
        database: 'users',
        id: props.user.uid,
        columnsWithValues: {
          'email_verified': true
        }
      }
    );
    if(!rezUpdateDB.isResolved){
      props.addNotification('error', 'Please retry the operation and generate a new code');
      return;
    }
    props.setUser((prev)=>{
      return {...prev, userDetails: {email_verified: true}};
    });
    props.navigation.navigate('SetupTrip');
    // get details about user from database
    const userDetails = await firebaseFirestore.getDetailsUser(props?.user?.uid);
    props.setUser((prevUser)=>{
      return {...prevUser, userDetails: userDetails.data};
    })
  }

  function createAcc(){
    setSignInOrUp("signup");
    setIsForgotsPassword(false)
  }

  function logInMethod(){
    setSignInOrUp("signin");
    setIsForgotsPassword(false)
  }

  return (
    <SafeAreaView style={{flex: 1}} >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ImageBackground   style={styles.backgroundImage}  source={require('../img/background.jpg')}>
          <ScrollView keyboardShouldPersistTaps="handled" >

            {isLoadingSendEmail ?
              <View style={styles.spinnerContainer}>
                <Spinner size="large" color="white" />
              </View> : null
            }

            <View style={styles.titleContainer}>
              <Text style={styles.appName}>Travel Bot</Text>
              <Text style={styles.slogan}>– Where Every Trip Finds Its Way 🌍</Text>
            </View>

            <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />

            <ViewIfUserExistsWithoutEmailVerified
              user={props.user}
              emailVerified_code={props.user?.emailVerified_code}
              sendCodeToEmail={sendCodeToEmail}
              setCodeVerify={setCodeVerify}
              codeVerify={codeVerify}
              verifyCode={verifyCode}
              signOut={signOut}
              deleteUser={deleteUser}
            />

            <ViewIfUserDoesntExist user={props.user} >
              <View  style={{ marginBottom: 40, marginRight: 20,  marginLeft: 20}} >

                <ViewIfUserForgotsPassword isForgotsPassword={isForgotsPassword} >
                  <InputComponent
                    name={'Email to reset the password'}
                    placeholder={'Email to reset the password'}
                    value={inputEmail}
                    onChange={(text)=>setInputEmail(text)}
                  />
                  <ButtonBlue name={"Send email"} func={forgotThePassword} />
                </ViewIfUserForgotsPassword>

                <SignInSignUpView isForgotsPassword={isForgotsPassword} >

                  <Text style={styles.actionName}>{signInOrUp === "signup" ? "Create accout" :  "Log in"  }</Text>

                  <ViewIfSignUpMethod signInOrUp={signInOrUp} >
                    <InputComponent
                      name={'First name'}
                      placeholder={'First name'}
                      value={inputFirstName}
                      onChange={(text)=>setInputFirstName(text)}
                    />
                    <InputComponent
                      name={'Second name'}
                      placeholder={'Second name'}
                      value={inputSecondName}
                      onChange={(text)=>setInputSecondName(text)}
                    />
                  </ViewIfSignUpMethod>

                  <InputComponent
                    name={'Email'}
                    placeholder={'Email'}
                    value={inputEmail}
                    onChange={(text)=>setInputEmail(text)}
                  />

                  <InputComponent
                    name={'Password'}
                    placeholder={'Password'}
                    value={inputPassword.input}
                    description={'The password must have at least seven characters, two of which must be numbers'}
                    onChange={(text) => passwordDispatch({type: 'changeInput', payload: text})}
                    secureTextEntry={!inputPassword.showState}
                    showEyeIcon={true}
                    onEyePress={()=>passwordDispatch({type: 'showState'})}
                  />

                  <Pressable onPress={()=>setIsForgotsPassword(true)}>
                    <Text style={styles.textForgot}>
                      Forgot your password? Click here
                    </Text>
                  </Pressable>

                  <ButtonBlue name={signInOrUp === "signup" ? "Create" : "Authenticate"} func={signInOrUp === "signup" ? createAccount : logIn} />

                </SignInSignUpView>

              </View>

              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <ButtonWhite func={createAcc} name={'Create accout'}/>
                <View style={styles.separator} />
                <ButtonWhite func={logInMethod} name={'Log in'}/>
              </View>

            </ViewIfUserDoesntExist>

          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
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
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 255, 10)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 5,
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'white',
    marginTop: 5,
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
    marginBottom: 10
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
})
