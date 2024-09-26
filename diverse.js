import {ADDRESS_FUNCTION_API, ADDRESS_FUNCTION_FUZZY, ADDRESS_FUNCTION_CHECKBOX} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';




const address_function_api = ADDRESS_FUNCTION_API
const address_function_fuzzy = ADDRESS_FUNCTION_FUZZY;
const address_function_checkbox = ADDRESS_FUNCTION_CHECKBOX;



function formatDateFromMilliseconds(milliseconds) {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${year}-${month}-${day}`;
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


async function multiGetFromAsyncStorage(arrayOfKeys){
    let rezFinal = {type: false, err:''};
    try {
        const data = await AsyncStorage.multiGet(arrayOfKeys);
        rezFinal = {type: true, data: data}
        console.log(rezFinal)

    } catch (error) {
        rezFinal = {type: false, err: error};
    }
    return rezFinal;
}


async function multiSetFromAsyncStorage(arrayOfArrays){
    // [['k1', 'val1'], ['k2', 'val2']]
    let rezFinal = {type: false, err:''};
    try {
        const data = await AsyncStorage.multiSet(arrayOfArrays);
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

export {removeItemFromAsyncStorage, getDataFromAsyncStorage, addDataToAsyncStorage,    multiRemoveFromAsyncStorage, multiSetFromAsyncStorage, 
    getAllKeysFromAsyncStorage, multiGetFromAsyncStorage,  formatDateFromMilliseconds,  address_function_api, address_function_fuzzy, 
    address_function_checkbox }
