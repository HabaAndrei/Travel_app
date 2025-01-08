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
        if (payload.trim() != props?.user?.userDetails?.firstName) {
          return { ...state, firstName: payload, isModifiedFirstName: true };
        }else{
          return { ...state, firstName: payload, isModifiedFirstName: false };
        }
      }
      case 'setSecondName': {
        if (payload.trim() != props?.user?.userDetails?.secondName) {
          return { ...state, secondName: payload, isModifiedSecondName: true };
        }else{
          return { ...state, secondName: payload, isModifiedSecondName: false };
        }
      }
      case 'setModifiedFirstName': {
        return { ...state, isModifiedFirstName: payload };
      }
      case 'setModifiedSecondName': {
        return { ...state, isModifiedSecondName: payload };
      }
      default:
        return state;
    }
  }

  function cancelChangeName(type){
    if (type === 'firstName') {
      detailsUserDispatch({ type: 'setFirstName', payload: props.user.userDetails.firstName })
      detailsUserDispatch({type: 'setModifiedFirstName', payload: false});
    } else if (type === 'secondName') {
      detailsUserDispatch({ type: 'setSecondName', payload: props.user.userDetails.secondName })
      detailsUserDispatch({type: 'setModifiedSecondName', payload: false});
    }
  }

  async function saveChangeName(type){
    if (type === 'firstName') {
      detailsUserDispatch({type: 'setModifiedFirstName', payload: false});
      const data = await firebaseFirestore.updateUserInformation('firstName', detailsUser.firstName)
      if (data.isResolved){
        const firstName = detailsUser.firstName.trim();
        props.user.userDetails.firstName = firstName;
        detailsUserDispatch({ type: 'setFirstName', payload: firstName})
      }
    } else if (type === 'secondName') {
      detailsUserDispatch({type: 'setModifiedSecondName', payload: false});
      const data = await firebaseFirestore.updateUserInformation('secondName', detailsUser.secondName)
      if (data.isResolved){
        const secondName = detailsUser.secondName.trim();
        props.user.userDetails.secondName = secondName;
        detailsUserDispatch({ type: 'setSecondName', payload: secondName})
      }
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
