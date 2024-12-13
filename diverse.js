import {ADDRESS_FUNCTION_API, ADDRESS_FUNCTION_FUZZY,
  ADDRESS_FUNCTION_SEND_CODE_VERIFICATION} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseFirestore } from './firebase';

const address_function_api = ADDRESS_FUNCTION_API;
const address_function_fuzzy = ADDRESS_FUNCTION_FUZZY;
const address_function_send_code_verification = ADDRESS_FUNCTION_SEND_CODE_VERIFICATION;
const firebaseFirestore = new FirebaseFirestore();

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
  const digitCount = (password.match(/\d/g) || []).length;
  return digitCount >= 2;
}

function getDays(from, to) {
  const days = to - from;
  return days / 86400000;
}

function getHours(from, to) {
  const getHoursFrom = from.slice(0, 2);
  const getHoursTo = to.slice(0, 2);
  const getMinutesFrom = from.slice(3, 5);
  const getMinutesTo = to.slice(3, 5);
  let hours = getHoursTo - getHoursFrom;
  let minutes = getMinutesTo - getMinutesFrom;

  if (Number(hours) < 0) {
    hours = (24 - Number(getHoursFrom)) + Number(getHoursTo);
  }
  if (Number(minutes) < 0) {
    minutes = (60 - Number(getMinutesFrom)) + Number(getMinutesTo);
    hours -= 1;
  }
  return { minutes, hours };
}

async function getDataFromAsyncStorage(key) {
  let rezFinal = { isResolve: false, err: '' };
  try {
    const storedTasks = await AsyncStorage.getItem(key);
    const dataParse = JSON.parse(storedTasks);
    rezFinal = { isResolve: true, data: dataParse };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function addDataToAsyncStorage(key, data) {
  let rezFinal = { isResolve: false, err: '' };
  let keyString;
  let dataString;
  if (typeof(key) !== "string") {
    keyString = JSON.stringify(key);
  } else {
    keyString = key;
  }
  if (typeof(data) !== "string") {
    dataString = JSON.stringify(data);
  } else {
    dataString = data;
  }
  try {
    await AsyncStorage.setItem(keyString, dataString);
    rezFinal = { isResolve: true };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function removeItemFromAsyncStorage(key) {
  let rezFinal = { isResolve: false, err: '' };
  try {
    await AsyncStorage.removeItem(key);
    rezFinal = { isResolve: true };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function getAllKeysFromAsyncStorage() {
  let rezFinal = { isResolve: false, err: '' };
  try {
    const keys = await AsyncStorage.getAllKeys();
    rezFinal = { isResolve: true, data: keys };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function deleteAllFromAsyncStorage() {
  let rezFinal = { isResolve: false, err: '' };
  try {
    await AsyncStorage.clear();
    rezFinal = { isResolve: true };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function multiGetFromAsyncStorage(arrayOfKeys) {
  let rezFinal = { isResolve: false, err: '' };
  try {
    const data = await AsyncStorage.multiGet(arrayOfKeys);
    rezFinal = { isResolve: true, data: data };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function multiSetFromAsyncStorage(arrayOfArrays) {
  const serializedArray = arrayOfArrays.map(([key, value]) => [key, JSON.stringify(value)]);
  let rezFinal = { isResolve: false, err: '' };
  try {
    await AsyncStorage.multiSet(serializedArray);
    rezFinal = { isResolve: true };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

async function multiRemoveFromAsyncStorage(arrayOfKeys) {
  let rezFinal = { isResolve: false, err: '' };
  try {
    await AsyncStorage.multiRemove(arrayOfKeys);
    rezFinal = { isResolve: true };
  } catch (err) {
    firebaseFirestore.storeErr(err.message);
    rezFinal = { isResolve: false, err: err };
  }
  return rezFinal;
}

function randomNumber() {
  return Math.floor(Math.random() * 10);
}

const random = randomNumber();
let imagePath = '';
switch(random){
  case 0:
    imagePath = require('./img/0.jpg');
    break;
  case 1:
    imagePath = require('./img/1.jpg');
    break;
  case 2:
    imagePath = require('./img/2.jpg');
    break;
  case 3:
    imagePath = require('./img/3.jpg');
    break;
  case 4:
    imagePath = require('./img/4.jpg');
    break;
  case 5:
    imagePath = require('./img/5.jpg');
    break;
  case 6:
    imagePath = require('./img/6.jpg');
    break;
  case 7:
    imagePath = require('./img/7.jpg');
    break;
  case 8:
    imagePath = require('./img/8.jpg');
    break;
  case 9:
    imagePath = require('./img/9.jpg');
    break;
  case 10: imagePath = require('./img/10.jpg');
}

export {
  isValidPassword, isValidEmail, removeItemFromAsyncStorage, getDataFromAsyncStorage, addDataToAsyncStorage,
  multiRemoveFromAsyncStorage, multiSetFromAsyncStorage, getAllKeysFromAsyncStorage, multiGetFromAsyncStorage,
  formatDateFromMilliseconds, deleteAllFromAsyncStorage, getDays, getHours, address_function_api,
  address_function_fuzzy, address_function_send_code_verification, imagePath
};
