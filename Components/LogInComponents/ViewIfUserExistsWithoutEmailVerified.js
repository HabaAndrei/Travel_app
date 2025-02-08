import { StyleSheet, Text, View } from 'react-native'
import { VStack } from '@gluestack-ui/themed'
import {ButtonWhite, ButtonBlue} from '../../CustomElements/buttonsTwoColors.js';
import InputComponent from './InputComponent';


const ViewIfUserExistsWithoutEmailVerified = (props) => {
  return (
    <>
      {
        props.user && !props.emailVerified_code ?
          <TheView
            data={{...props}}
          />
        : null
      }
    </>
  )
}

const TheView = (props) => {
  return (
    <View >

      <VStack style={{ marginBottom: 40, marginRight: 20,  marginLeft: 20}} >
        <Text style={styles.actionNameLow}>The next step is to verify your email address</Text>

        <View style={{margin: 10}} />

        <ButtonBlue name={'Send code to email'} func={props.data.sendCodeToEmail} />

        <View style={{margin: 10}} />

        <InputComponent
          name={'Code from email'}
          placeholder={'Enter the code from email'}
          value={props.data.codeVerify}
          onChange={(text)=>props.data.setCodeVerify(text)}
        />

        <View style={{margin: 10}} />

        <ButtonBlue name={'Verify code'} func={props.data.verifyCode} />
      </VStack>

      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <ButtonWhite name={'Log out'} func={props.data.signOut} />

        <View style={styles.separator} />

        <ButtonWhite name={'Delete account'} func={props.data.deleteUser} />
      </View>

    </View>
  )
}

export default ViewIfUserExistsWithoutEmailVerified;

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: 400,
    marginVertical: 10,
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
})
