import { StyleSheet, View } from 'react-native';
import { useReducer } from 'react';
import { FirebaseFirestore } from '../../Firebase.js';
import InputChanges from '../InputChanges.js';

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

    // update User Information
    const resultUpdate = await firebaseFirestore.updateColumnsDatabase({
      database: 'users',
      id: props.user.uid,
      columnsWithValues: {
        [`${userDetails}`]: value
      }
    });
    if (resultUpdate.isResolved){
      props.user.userDetails[userDetails] = value;
      detailsUserDispatch({ type: secondDispatchName, payload: value})
    }
  }

  return (
    <View style={styles.container}>

      <InputChanges
        title={'First name'}
        onChange={(text)=>detailsUserDispatch({ type: 'setFirstName', payload: text })}
        value={detailsUser.firstName}
        pressOnSave={(type)=>saveChangeName(type)}
        pressOnCancel={(type)=>cancelChangeName(type)}
        param={'firstName'}
        isModified={detailsUser.isModifiedFirstName}
        placeholder={'First name'}
      />

      <InputChanges
        title={'Second name'}
        onChange={(text)=>detailsUserDispatch({ type: 'setSecondName', payload: text })}
        value={detailsUser.secondName}
        pressOnSave={(type)=>saveChangeName(type)}
        pressOnCancel={(type)=>cancelChangeName(type)}
        param={'secondName'}
        isModified={detailsUser.isModifiedSecondName}
        placeholder={'Second name'}
      />

    </View>
  );
};

export default DetailsUserView;

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
});
