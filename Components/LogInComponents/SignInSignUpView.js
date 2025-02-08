import { StyleSheet, Pressable, Text } from 'react-native'
import InputComponent from './InputComponent.js';
import {ButtonBlue} from '../../CustomElements/buttonsTwoColors.js';

const SignInSignUpView = (props) => {
  return (
    <>
      {
        !props.isForgotsPassword ?
          <TheView
            {...props}
          />
        : null
      }
    </>
  )
}

function ViewIfSignUpMethod(props){
  return (
    <>
      {props.signInOrUp === "signup" ? props.children : null}
    </>
  )
}

const TheView = (props) => {
  return (
    <>
      <Text style={styles.actionName}>
        {props.signInOrUp === "signup" ? "Create accout" :  "Log in"  }
      </Text>

      <ViewIfSignUpMethod signInOrUp={props.signInOrUp} >
        <InputComponent
          name={'First name'}
          placeholder={'First name'}
          value={props.inputFirstName}
          onChange={(text)=>props.setInputFirstName(text)}
        />
        <InputComponent
          name={'Second name'}
          placeholder={'Second name'}
          value={props.inputSecondName}
          onChange={(text)=>props.setInputSecondName(text)}
        />
      </ViewIfSignUpMethod>

      <InputComponent
        name={'Email'}
        placeholder={'Email'}
        value={props.inputEmail}
        onChange={(text)=>props.setInputEmail(text)}
      />

      <InputComponent
        name={'Password'}
        placeholder={'Password'}
        value={props.inputPassword.input}
        description={'The password must have at least seven characters, two of which must be numbers'}
        onChange={(text) => props.passwordDispatch({type: 'changeInput', payload: text})}
        secureTextEntry={!props.inputPassword.showState}
        showEyeIcon={true}
        onEyePress={()=>props.passwordDispatch({type: 'showState'})}
      />

      <Pressable onPress={()=>props.setIsForgotsPassword(true)}>
        <Text style={styles.textForgot}>
          Forgot your password? Click here
        </Text>
      </Pressable>

      <ButtonBlue
        name={props.signInOrUp === "signup" ? "Create" : "Authenticate"}
        func={props.signInOrUp === "signup" ? props.createAccount : props.logIn}
      />
    </>
  )
}

export default SignInSignUpView


const styles = StyleSheet.create({
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
})
