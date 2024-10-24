import {ADDRESS_FUNCTION_API, ADDRESS_FUNCTION_FUZZY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';




const address_function_api = ADDRESS_FUNCTION_API
const address_function_fuzzy = ADDRESS_FUNCTION_FUZZY;




function formatDateFromMilliseconds(milliseconds) {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${year}-${month}-${day}`;
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    if (password.length < 7) {
      return false;
    }
  
    // Folosim o expresie regulată pentru a găsi toate cifrele din parolă
    const digitCount = (password.match(/\d/g) || []).length;
    return digitCount >= 2;
  }

////////////////////////////
async function getDataFromAsyncStorage(key){
    let rezFinal = {type: false, err:''};
    try {
        const storedTasks = await AsyncStorage.getItem(key);
        const dataParse = JSON.parse(storedTasks);
        rezFinal = {type: true, data: dataParse}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
};

async function addDataToAsyncStorage(key, data){
    let rezFinal = {type: false, err:''};
    let keyString ;
    let dataString ;
    if(typeof(key) != "string"){ keyString = JSON.stringify(key)}else{ keyString = key}
    if(typeof(data) != "string"){dataString = JSON.stringify(data)}else{dataString = data}
    try {
      await AsyncStorage.setItem(keyString, dataString);
      rezFinal = {type: true};
    } catch (error) {
        rezFinal = {type: false, err: error};
    }

    return rezFinal;
}

async function removeItemFromAsyncStorage(key){
    let rezFinal = {type: false, err:''};
    try {
        const removeData = await AsyncStorage.removeItem(key);
        rezFinal = {type: true}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}

async function getAllKeysFromAsyncStorage(){
    let rezFinal = {type: false, err:''};
    try {
        const keys = await AsyncStorage.getAllKeys();
        rezFinal = {type: true, data: keys}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}



async function deleteAllFromAsyncStorage(){
    let rezFinal = {type: false, err:''};
    try {
        await AsyncStorage.clear();
        rezFinal = {type: true}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}


async function multiGetFromAsyncStorage(arrayOfKeys){
    let rezFinal = {type: false, err:''};
    try {
        const data = await AsyncStorage.multiGet(arrayOfKeys);
        rezFinal = {type: true, data: data}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}


async function multiSetFromAsyncStorage(arrayOfArrays){
    // [['k1', 'val1'], ['k2', 'val2']]

    const serializedArray = arrayOfArrays.map(([key, value]) => [key, JSON.stringify(value)]);

    let rezFinal = {type: false, err:''};
    try {
        const data = await AsyncStorage.multiSet(serializedArray);
        rezFinal = {type: true, data: data}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}



async function multiRemoveFromAsyncStorage(arrayOfKeys){
    let rezFinal = {type: false, err:''};
    try {
        const data = await AsyncStorage.multiRemove(arrayOfKeys);
        rezFinal = {type: true}
    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}

export {isValidPassword, isValidEmail, removeItemFromAsyncStorage, getDataFromAsyncStorage, addDataToAsyncStorage,    multiRemoveFromAsyncStorage, multiSetFromAsyncStorage, 
    getAllKeysFromAsyncStorage, multiGetFromAsyncStorage,  formatDateFromMilliseconds,  deleteAllFromAsyncStorage, address_function_api, address_function_fuzzy }




// import {KeyboardAvoidingView, Platform, TextInput  } from 'react-native';
// <KeyboardAvoidingView style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 50 : 0}} behavior="position">
// <TextInput
//     style={{borderWidth: 1,  borderColor: 'gray',  padding: 12,  borderRadius: 8,  fontSize: 16,  color: 'black',  backgroundColor: 'white'}}
//     placeholder={'hahhaha'}
//     value={inputCity}
//     onChangeText={(text) => { setInputCity(text)}}
//     placeholderTextColor="gray"
// />
// </KeyboardAvoidingView>