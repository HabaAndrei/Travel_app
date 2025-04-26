import { StyleSheet, View, Text, ScrollView, SafeAreaView, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native'
import { useReducer, useState, useRef } from 'react'
import { FirebaseAuth, FirebaseFirestore } from '../Firebase.js'
import { isValidEmail, isValidPassword, deleteAllFromAsyncStorage } from "../diverse.js"
import uuid from 'react-native-uuid';
import axios from 'axios';
import ModalReAuth from '../Components/Modals/ModalReAuth.js';
import {ButtonWhite, ButtonBlue} from '../CustomElements/buttonsTwoColors.js';
import { arrayUnion } from "firebase/firestore";
import InputComponent from '../Components/LogInComponents/InputComponent.js';
import ViewIfUserExistsWithoutEmailVerified from '../Components/LogInComponents/ViewIfUserExistsWithoutEmailVerified.js';
import SignInSignUpView from '../Components/LogInComponents/SignInSignUpView.js';
import { EnvConfig } from '../providers/EnvConfig.js';
import CustomSpinner from '../CustomElements/CustomSpinner.js';

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
  const isCreatingAccount = useRef(false);

  const firebaseAuth = new FirebaseAuth();
  const firebaseFirestore = new FirebaseFirestore();

  async function createAccount(){

    if (isCreatingAccount.current) return;

    const email = inputEmail?.trim();
    const password = inputPassword?.input.trim();
    const firstName = inputFirstName?.trim();
    const secondName = inputSecondName?.trim();

    if( !email?.length || !password?.length || !firstName?.length || !secondName?.length ){
      props.addNotification('warning', "Please complete all inputs");
      return;
    }

    if(!isValidEmail(email)){
      props.addNotification('error', "The email address is not valid");
      return;
    }

    if(!isValidPassword(password)){
      props.addNotification('error', "The password must have at least seven characters, two of which must be numbers");
      return;
    }

    isCreatingAccount.current = true;
    const resultCreateAccount = await firebaseAuth._createUserWithEmailAndPassword(
      { email, password, firstName, secondName }
    );
    isCreatingAccount.current = false;
    if(!resultCreateAccount.isResolved){
      if(resultCreateAccount.err?.includes("email-already-in-use")){
        props.addNotification('error', "This email is already registered. Try logging in or use a different email.");
      } else {
        props.addNotification('error', "Account creation failed. Please check your details and try again.");
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
        // If the update cannot be done, the store is probably not created, and we need to create that database with IDs
        const createDatabase = await firebaseFirestore.addIntoDatabase({
          database: 'code_verification',
          id: props.user.email,
          columnsWithValues: {'codes': arrayUnion(code)}
        })
        if (!createDatabase.isResolved){
          setLoadingSendEmail(false);
          props.addNotification('error', "There was a problem sending the code by email");
          return;
        }
      }
      const rezSend = await axios.post(EnvConfig.getInstance().get('address_function_send_code_verification'), {code, email});
      if(!rezSend.data.isResolved){
        setLoadingSendEmail(false);
        props.addNotification('error', "There was a problem sending the code by email");
        return;
      }
      setLoadingSendEmail(false);
      props.addNotification('success', 'Enter the code sent to your email. Check spam if needed.');
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
                <CustomSpinner />
              </View> : null
            }

            <View style={styles.titleContainer}>
              <Text style={styles.appName}>Travel Bot</Text>
              <Text style={styles.slogan}>– Where Every Trip Finds Its Way 🌍</Text>
            </View>

            <ModalReAuth  isModalVisibleReAuth={isModalVisibleReAuth} setModalVisibleReAuth={setModalVisibleReAuth} />

            <ViewIfUserExistsWithoutEmailVerified
              user={props?.user}
              emailVerified_code={props?.user?.userDetails?.email_verified}
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

                <SignInSignUpView
                  isForgotsPassword={isForgotsPassword}
                  setIsForgotsPassword={setIsForgotsPassword}
                  signInOrUp={signInOrUp}
                  inputFirstName={inputFirstName}
                  setInputFirstName={setInputFirstName}
                  inputSecondName={inputSecondName}
                  setInputSecondName={setInputSecondName}
                  inputEmail={inputEmail}
                  setInputEmail={setInputEmail}
                  inputPassword={inputPassword}
                  passwordDispatch={passwordDispatch}
                  createAccount={createAccount}
                  logIn={logIn}
                />

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
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'white',
    marginTop: 5,
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
