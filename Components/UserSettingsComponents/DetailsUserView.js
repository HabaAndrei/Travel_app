import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useReducer } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FirebaseFirestore } from '../../firebase.js';

const InputWithAction = (props) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{props.title}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        value={props.value}
        onChangeText={(text) => props.onChange(text)}
        style={styles.textInput}
        placeholderTextColor="gray"
      />
      {props.isModified ?
        <>
        <TouchableOpacity onPress={()=>props.pressOnSave(props.param)} >
          <AntDesign name="check" size={24} color="green" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>props.pressOnCancel(props.param)} >
          <AntDesign name="close" size={24} color="red" style={styles.icon} />
        </TouchableOpacity>
        </> : null
      }
    </View>
  </View>
)

const DetailsUserView = (props) => {

  const firebaseFirestore = new FirebaseFirestore();

  const [detailsUser, detailsUserDispatch] = useReducer(detailsUserReducer, {
    firstName: props?.user?.userDetails?.firstName,
    secondName: props?.user?.userDetails?.secondName,
    isModifiedFirstName: false,
    isModifiedSecondName: false,
  });
  function detailsUserReducer(state, action) {
    const { type, payload } = action;
    switch (type) {
      case 'setFirstName': {
        const resultCondition = payload.trim() != props?.user?.userDetails?.firstName;
        return { ...state, firstName: payload, isModifiedFirstName: resultCondition };
      }
      case 'setSecondName': {
        const resultCondition = payload.trim() != props?.user?.userDetails?.secondName;
        return { ...state, secondName: payload, isModifiedSecondName: resultCondition };
      }
      case 'setModifiedFirstName': {
        return { ...state, isModifiedFirstName: payload };
      }
      case 'setModifiedSecondName': {
        return { ...state, isModifiedSecondName: payload };
      }
      case 'cancelChangeFirstName': {
        return {...state, isModifiedFirstName: false, firstName: props.user.userDetails.firstName}
      }
      case 'cancelChangeSecondName': {
        return {...state, isModifiedSecondName: false, secondName: props.user.userDetails.secondName}
      }
      default:
        return state;
    }
  }

  function cancelChangeName(type){
    const keysWithComands = {
      'firstName': 'cancelChangeFirstName',
      'secondName': 'cancelChangeSecondName',
    };
    detailsUserDispatch({type: keysWithComands[type] })
  }

  async function saveChangeName(type){
    const typeAction = {
      firstName: {
        firstDispatchName: 'setModifiedFirstName',
        userDetails: 'firstName',
        secondDispatchName: 'setFirstName',
      },
      secondName: {
        firstDispatchName: 'setModifiedSecondName',
        userDetails: 'secondName',
        secondDispatchName: 'setSecondName',
      }
    }
    const {firstDispatchName, userDetails, secondDispatchName} = typeAction[type];

    detailsUserDispatch({type: firstDispatchName, payload: false});
    const value = detailsUser[userDetails].trim();
    const data = await firebaseFirestore.updateUserInformation(userDetails, value)
    if (data.isResolved){
      props.user.userDetails[userDetails] = value;
      detailsUserDispatch({ type: secondDispatchName, payload: value})
    }
  }

  return (
    <View style={styles.container}>

      <InputWithAction
        title={'First name'}
        onChange={(text)=>detailsUserDispatch({ type: 'setFirstName', payload: text })}
        value={detailsUser.firstName}
        pressOnSave={(type)=>saveChangeName(type)}
        pressOnCancel={(type)=>cancelChangeName(type)}
        param={'firstName'}
        isModified={detailsUser.isModifiedFirstName}
      />

      <InputWithAction
        title={'Second name'}
        onChange={(text)=>detailsUserDispatch({ type: 'setSecondName', payload: text })}
        value={detailsUser.secondName}
        pressOnSave={(type)=>saveChangeName(type)}
        pressOnCancel={(type)=>cancelChangeName(type)}
        param={'secondName'}
        isModified={detailsUser.isModifiedSecondName}
      />

    </View>
  );
};

export default DetailsUserView;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  icon: {
    paddingHorizontal: 10,
  },
});