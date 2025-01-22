import { StyleSheet, View, Pressable, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native'
import { useReducer, useState } from 'react'
import { Icon, VStack, EyeIcon, EyeOffIcon, Spinner } from '@gluestack-ui/themed'
import { FirebaseAuth, FirebaseFirestore } from '../Firebase.js'
import {isValidEmail, isValidPassword, deleteAllFromAsyncStorage, address_function_send_code_verification} from "../diverse.js"
import uuid from 'react-native-uuid';
import axios from 'axios';
import ModalReAuth from '../Components/Modals/ModalReAuth.js';
import {ButtonWhite, ButtonBlue} from '../CustomElements/buttonsTwoColors.js';
import { arrayUnion } from "firebase/firestore";


function ViewIfSignUpMethod(props){
  return (
    <>
      {props.signInOrUp === "signup" ? props.children : null}
    </>
  )
}

function ViewIfUserExistsWithoutEmailVerified(props){
  return (
    <>
      {props.user && !props.emailVerified_code ? props.children : null}
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

function ViewClientSignUp(props){
  return (
    <>
      {!props.isForgotsPassword ? props.children : null}
    </>
  )
}

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

      <ImageBackground   style={styles.backgroundImage}  source={require('../img/background.jpg')}>

        <ScrollView>

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

          <ViewIfUserExistsWithoutEmailVerified user={props.user}  emailVerified_code={props.user?.emailVerified_code}>
            <View >

              <VStack >
                <Text style={styles.actionNameLow}>The next step is to verify your email address</Text>

                <View style={{margin: 10}} />

                <ButtonBlue name={'Send code to email'} func={sendCodeToEmail} />

                <View style={{margin: 10}} />

                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder='Enter the code from email' placeholderTextColor="white"
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
          </ViewIfUserExistsWithoutEmailVerified>

          <ViewIfUserDoesntExist user={props.user} >
            <View >

              <View  style={{ marginBottom: 40, marginRight: 20,  marginLeft: 20}} >

                <ViewIfUserForgotsPassword isForgotsPassword={isForgotsPassword} >
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
                </ViewIfUserForgotsPassword>

                <ViewClientSignUp isForgotsPassword={isForgotsPassword} >
                  <VStack space="xl">
                    <Text style={styles.actionName}>{signInOrUp === "signup" ? "Create accout" :  "Log in"  }</Text>

                    <ViewIfSignUpMethod signInOrUp={signInOrUp} >
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder='Name' placeholderTextColor="white"
                          value={inputFirstName}  onChangeText={(text) => setInputFirstName(text)}/>
                      </View>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder='Second name' placeholderTextColor="white"
                          value={inputSecondName}  onChangeText={(text) => setInputSecondName(text)}/>
                      </View>
                    </ViewIfSignUpMethod>

                    <View style={styles.inputContainer}>
                      <TextInput style={styles.input} placeholder='Email' placeholderTextColor="white"
                        value={inputEmail}  onChangeText={(text) => setInputEmail(text)}/>
                    </View>

                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                          onPress={() => passwordDispatch({type: 'showState'})}
                        >
                          <Icon
                            as={inputPassword.showState ? EyeIcon : EyeOffIcon}
                            color="$darkBlue500"
                          />
                        </TouchableOpacity>
                      <TextInput style={styles.input} placeholder='Password' placeholderTextColor="white"
                        value={inputPassword.input} onChangeText={(text) => passwordDispatch({type: 'changeInput', payload: text})}
                        secureTextEntry={!inputPassword.showState}
                        />
                    </View>

                    <ViewIfSignUpMethod signInOrUp={signInOrUp}>
                      <Text  style={styles.textPassword}>
                        The password must have at least seven characters, two of which must be numbers
                      </Text>
                    </ViewIfSignUpMethod>

                    <Pressable onPress={()=>setIsForgotsPassword(true)}>
                      <Text style={styles.textForgot}>
                        Forgot your password? Click here
                      </Text>
                    </Pressable>

                    <ButtonBlue name={signInOrUp === "signup" ? "Create" : "Log in"} func={signInOrUp === "signup" ? createAccount : logIn} />

                  </VStack>
                </ViewClientSignUp>

              </View>

              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <ButtonWhite func={createAcc} name={'Create accout'}/>
                <View style={styles.separator} />
                <ButtonWhite func={logInMethod} name={'Log in'}/>
              </View>
            </View>

          </ViewIfUserDoesntExist>

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
    width: '90%',
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    alignSelf: 'center',
  },
  input: {
    width: '80%',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  textPassword: {
    width: '90%',
    alignSelf: 'center',
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
