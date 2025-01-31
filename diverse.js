import {ADDRESS_FUNCTION_CHAT, ADDRESS_FUNCTION_FUZZY, ADDRESS_FUNCTION_ACTIVITIES, ADDRESS_FUNCTION_LOCATIONS,
  ADDRESS_FUNCTION_PROGRAM, ADDRESS_FUNCTION_SEND_CODE_VERIFICATION} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseFirestore } from './Firebase';

const address_function_chat = ADDRESS_FUNCTION_CHAT;
const address_function_activities = ADDRESS_FUNCTION_ACTIVITIES;
const address_function_locations = ADDRESS_FUNCTION_LOCATIONS;
const address_function_program = ADDRESS_FUNCTION_PROGRAM;

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

function getDays({startDate, endDate}) {
  const days = endDate - startDate;
  return days / 86400000;
}

function toMinutes(time) {
  let [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getHours(startDate, endDate) {
  const getHoursFrom = startDate.slice(0, 2);
  const getHoursTo = endDate.slice(0, 2);
  const getMinutesFrom = startDate.slice(3, 5);
  const getMinutesTo = endDate.slice(3, 5);
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
  return firebaseFirestore._storeErr(async ()=>{
    const storedTasks = await AsyncStorage.getItem(key);
    const dataParse = JSON.parse(storedTasks);
    return { isResolved: true, data: dataParse };
  })
}

async function addDataToAsyncStorage(key, data) {
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
  return firebaseFirestore._storeErr(async ()=>{
    await AsyncStorage.setItem(keyString, dataString);
    return { isResolved: true };
  })
}

async function removeItemFromAsyncStorage(key) {
  return firebaseFirestore._storeErr(async ()=>{
    await AsyncStorage.removeItem(key);
    return { isResolved: true };
  })
}

async function getAllKeysFromAsyncStorage() {
  return firebaseFirestore._storeErr(async ()=>{
    const keys = await AsyncStorage.getAllKeys();
    return { isResolved: true, data: keys };
  })
}

async function deleteAllFromAsyncStorage() {
  return firebaseFirestore._storeErr(async ()=>{
    await AsyncStorage.clear();
    return { isResolved: true };
  });
}

async function multiGetFromAsyncStorage(arrayOfKeys) {
  return firebaseFirestore._storeErr(async ()=>{
    const data = await AsyncStorage.multiGet(arrayOfKeys);
    return { isResolved: true, data: data };
  });
}

async function multiSetFromAsyncStorage(arrayOfArrays) {
  const serializedArray = arrayOfArrays.map(([key, value]) => [key, JSON.stringify(value)]);
  return firebaseFirestore._storeErr(async ()=>{
    await AsyncStorage.multiSet(serializedArray);
    return { isResolved: true };
  });
}

async function multiRemoveFromAsyncStorage(arrayOfKeys) {
  return firebaseFirestore._storeErr(async ()=>{
    await AsyncStorage.multiRemove(arrayOfKeys);
    return { isResolved: true };
  });
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
  formatDateFromMilliseconds, deleteAllFromAsyncStorage, getDays, getHours, toMinutes, address_function_chat,
  address_function_activities, address_function_locations, address_function_program,
  address_function_fuzzy, address_function_send_code_verification, imagePath
};
