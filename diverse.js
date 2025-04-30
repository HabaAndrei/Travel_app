import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseFirestore } from './Firebase';
import { EnvConfig } from './providers/EnvConfig';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

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

function getHours(startTime, endTime, sameDay = false) {

  // Find the index of the colon that separates hours and minutes
  const colonIndexStart = startTime.indexOf(':');
  const colonIndexEnd = endTime.indexOf(':');

  // Extract the hours
  const startHour = startTime.slice(0, colonIndexStart);
  const endHour = endTime.slice(0, colonIndexEnd);

  // Extract the minutes
  const startMinutes = startTime.slice(colonIndexStart + 1, startTime.length);
  const endMinutes = endTime.slice(colonIndexEnd + 1, endTime.length);

  // Calculate the difference in hours and minutes
  let hours = endHour - startHour;
  let minutes = endMinutes - startMinutes;

  // Adjust for negative values (crossing midnight)
  if (Number(hours) < 0) {
    hours = (24 - Number(startHour)) + Number(endHour);
  } else if (Number(hours) == 0 && !sameDay) {
    hours = 24
  }
  if (Number(minutes) < 0) {
    minutes = (60 - Number(startMinutes)) + Number(endMinutes);
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

function getUrlImage(name){
  const server_address_images = EnvConfig.getInstance().get('server_address_images')
  return `${server_address_images}${name}.jpg`;
}

function isBase64(str) {
  if (typeof str !== "string") {
    return false;
  }
  str = str.replace('data:image/jpeg;base64,', '')
  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
}

async function existsUpdates(){
  const os = Platform.OS;
  const app_version = Application.nativeBuildVersion;
  if ( !os || os === 'web' || !app_version ) return false;

  const result_version = await firebaseFirestore.appVersions();
  if ( !result_version['isResolved'] ) return false;
  const ios_version = result_version['data']['IOS']['version'];
  const android_version = result_version['data']['ANDROID']['version'];

  const getNumber = (num) => Number(num.replaceAll('.', ''));

  if (os === 'ios' && (getNumber(ios_version) > getNumber(app_version))) return {url: result_version['data']['IOS']['url']};
  if (os === 'android' && (getNumber(android_version) > getNumber(app_version))) return {url: result_version['data']['ANDROID']['url']};
  return false;
}


export {
  isValidPassword, isValidEmail, removeItemFromAsyncStorage, getDataFromAsyncStorage, addDataToAsyncStorage,
  multiRemoveFromAsyncStorage, multiSetFromAsyncStorage, getAllKeysFromAsyncStorage, multiGetFromAsyncStorage,
  formatDateFromMilliseconds, deleteAllFromAsyncStorage, getDays, getHours, toMinutes, imagePath,
  getUrlImage, isBase64, existsUpdates
};
