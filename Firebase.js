import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc ,updateDoc, query, where, deleteDoc, getDocs, getDoc, orderBy } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
import {signOut,  deleteUser, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider  } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import {address_function_api} from './diverse.js';
import axios from 'axios';
import * as Device from 'expo-device';


const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


async function _createUserWithEmailAndPassword(email, password, firstName, secondName){

  let rezFin = {};
  try{
    const rez = await createUserWithEmailAndPassword(auth, email, password);

    const {uid} = rez.user;
    const {createdAt} = rez.user.metadata;

    await addUserIntoDb(uid, createdAt, email, password, firstName, secondName);

    rezFin = {isResolve: true, data: rez};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function _signInWithEmailAndPassword(email, password){
  let rezFin = {};
  try{
    const rez = await signInWithEmailAndPassword(auth, email, password)
    rezFin = {isResolve: true, data: rez};
  }catch(err){
  storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function reAuth(password){
  let rezFin = {isResolve: true};
  try{
    const user = auth.currentUser;
    const {email} = user;
    const credential = EmailAuthProvider.credential(email, password)
    await reauthenticateWithCredential(user, credential);
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function _deleteUser(){
  let rezFin = {};
  try{
    const user = auth.currentUser;
    const rez = await deleteUser(user);
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function _signOut(){
  let rezFin = {};
  try{
    const rez = await signOut(auth);
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}


async function _sendPasswordResetEmail(email){
  let rezFin = {};
  try{
    const rez = await sendPasswordResetEmail(auth, email)
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

///////////////////////////////////////////////////////////////////////////////

async function addUserIntoDb(uid, createdAt, email, password, firstName, secondName){

  try{
    await setDoc(doc(db, "users", uid), {
      uid, email, firstName, secondName, createdAt, email_verified: false
    });
  }catch(err){
    storeErr(err.message)
    console.log(err, 'nu s a introdus nimic in baza de date')
  }
}


async function addProgramIntoDb(city, country, from , to, programDaysString, uid){

  let rezFin = {isResolve: true};
  try{
    await addDoc(collection(db, "programs"), {city, country, from , to, programDaysString, uid});
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err}
  }
  return rezFin;
}

async function getPlansFromDbWithUid(uid){
  let rezFin = {isResolve: true};
  try{
    const q = query(collection(db, "programs"), where("uid", "==", uid), orderBy("from"));
    const querySnapshot = await getDocs(q);
    let programs = [];
    querySnapshot.forEach((doc) => {
      const {id} = doc;
      let data = doc.data();
      data.id = id;
      programs.push(data);
    });
    rezFin = {isResolve:true, data: programs};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err}
  }
  return rezFin;
}

async function updateProgram(id, from, to, program){
  let rezFin = {isResolve: true};

  try{
    if(typeof(program) != 'string')program = JSON.stringify(program);
    const ref = doc(db, 'programs', id);
    const rez = await updateDoc(ref, {
      from: from,
      to: to,
      programDaysString: program
    });
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function storeCodeAndEmail(code, email){
  let rezFin = {isResolve: true};
  try{
    await setDoc(doc(db, "code_verification", email), {code});
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function verifyCodeDB(codeInput, email){
  let rezFin = {isResolve: true};
  try{
    const docRef = doc(db, "code_verification", email);
    const dataFromDB = await getDoc(docRef);
    const {code} = dataFromDB.data();
    if(code != codeInput){
      rezFin = {isResolve: true, mes: 'The code does not correspond to the code sent by e-mail last time'}
    }
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;

}

async function updateEmailVerificationDB(uid){
  let rezFin = {isResolve: true};
  try{
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      email_verified: true
    });
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function verifyEmailVerifiedDB(uid){
  let rezFin = {isResolve: true};
  try{
    const docRef = doc(db, "users", uid);
    const dataFromDB = await getDoc(docRef);
    const data = dataFromDB.data();
    if(data.email_verified != true){
      rezFin = {isResolve: false};
    }
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function store_feedback(feedback, feedbackCategory){
  let rezFin = {};
  try{
    const {uid} = auth.currentUser;
    await addDoc(collection(db, "feedback"), {uid, feedback, feedbackCategory});
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function askQuestion(histoyConv){
  let rezFin = {};
  try{
    const {uid} = auth.currentUser;
    const data = await getPlansFromDbWithUid(uid);
    if(!data.isResolve){
      return {isResolve: false, err: data.err};
    }
    let information = '';
    if(data.data.length){
      const rez = data.data.map((trip)=>{
        let {city, country, from, to, programDaysString} = trip;
        programDaysString = JSON.parse(programDaysString);
        const daysWithInfo = programDaysString.map((full_day)=>{
          let {day, date, activities} = full_day;
          const info_activities = activities.map((activity)=>{
            const {time, info, urlLocation, website, place, description, address} = activity;
            return {time, info,
              urlLocation: urlLocation ? urlLocation : '',
              website: website ? website : '',
              place, description, address
            };
          })
          return {day, date, info_activities};
        })
        return {city, country, from, to, daysWithInfo};
      })
      information = JSON.stringify(rez);
    }

    const rezQuery =  await axios.post(`${address_function_api}`, {method: 'chat', histoyConv, information});
    if(rezQuery?.data?.type){
      rezFin = {isResolve: true, data: rezQuery?.data?.data};
    }else{
      rezFin = {isResolve: false, err: rezQuery?.data?.err};
    }
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin
};

async function storeConv(id, name){
  let rezFin = {};
  try{
    const {uid} = auth.currentUser;
    await addDoc(collection(db, "conversations"), {uid, id, name});
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin
}

async function storeMes(idConv, type, mes, time){
  let rezFin = {};
  try{
    const {uid} = auth.currentUser;
    await addDoc(collection(db, "messages"), {uid, idConv, type, mes, time});
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin
}

async function getConversations(){
  let rezFin = {};
  try{
    const {uid} = auth.currentUser;
    const q = query(collection(db, "conversations"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let rez = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      rez.push(data);
    });
    rezFin = {isResolve:true, data: rez};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function getMessages(idConv){
  let rezFin = {};
  try{
    const q = query(collection(db, "messages"), where("idConv", "==", idConv), orderBy("time"));
    const querySnapshot = await getDocs(q);
    let rez = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      rez.push(data);
    });
    rezFin = {isResolve:true, data: rez};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin;
}

async function deleteChat(idConv){
  const q = query(collection(db, "messages"), where("idConv", "==", idConv));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    const docRef = doc(db, 'messages', document.id);
    deleteDoc(docRef)
  });

  const q2 = query(collection(db, "conversations"), where("id", "==", idConv));
  const querySnapshot2 = await getDocs(q2);
  querySnapshot2.forEach((document) => {
    const docRef = doc(db, 'conversations', document.id);
    deleteDoc(docRef)
  });
}

async function storeErr(mesErr){
  const {modelName, modelId, brand} = Device;
  let rezFin = {};
  try{
    const {uid} = auth.currentUser;
    await addDoc(collection(db, "errors"), {uid, modelName, modelId, brand, mesErr});
    rezFin = {isResolve: true};
  }catch(err){
    storeErr(err.message)
    rezFin = {isResolve: false, err};
  }
  return rezFin
}


export {db, auth, _signOut, _deleteUser, addProgramIntoDb, _createUserWithEmailAndPassword, _signInWithEmailAndPassword,
  getPlansFromDbWithUid, _sendPasswordResetEmail, updateProgram, storeCodeAndEmail, verifyCodeDB, updateEmailVerificationDB,
  verifyEmailVerifiedDB, reAuth, store_feedback, askQuestion, storeConv, storeMes, getConversations, getMessages,
  deleteChat, storeErr
};



