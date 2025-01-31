import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc ,updateDoc, query, where, deleteDoc,
  getDocs, getDoc, orderBy } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
import {signOut,  deleteUser, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider  } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import {address_function_chat} from './diverse.js';
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

/////////////////////////////////

class FirebaseFirestore{

  async getPlansFromDbWithUid(uid){
    return this._storeErr(async ()=>{
      const q = query(collection(db, "programs"), where("uid", "==", uid), orderBy("startDate"));
      const querySnapshot = await getDocs(q);
      let programs = [];
      querySnapshot.forEach((doc) => {
        const {id} = doc;
        let data = doc.data();
        data.id = id;
        programs.push(data);
      });
      return {isResolved:true, data: programs};
    })
  }

  async verifyCodeDB(codeInput, email){
    return this._storeErr(async ()=>{
      const docRef = doc(db, "code_verification", email);
      const dataFromDB = await getDoc(docRef);
      const {codes} = dataFromDB.data();
      if(!codes.includes(codeInput)){
        return {isResolved: false, mes: 'The code does not correspond to the code sent by e-mail'}
      }
      return {isResolved: true};
    })
  }

  async getDetailsUser(uid){
    return this._storeErr(async ()=>{
      const docRef = doc(db, "users", uid);
      const dataFromDB = await getDoc(docRef);
      const data = dataFromDB.data();
      return {data};
    })
  }

  async askQuestion(historyConv){
    return this._storeErr(async ()=>{
      const {uid} = auth.currentUser;
      const data = await this.getPlansFromDbWithUid(uid);
      if(!data.isResolved){
        return {isResolved: false, err: data.err};
      }
      let information = '';
      if(data.data.length){
        const rez = data.data.map((trip)=>{
          let {city, country, startDate, endDate, programDaysString} = trip;
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
          return {city, country, startDate, endDate, daysWithInfo};
        })
        information = JSON.stringify(rez);
      }
      const rezQuery =  await axios.post(`${address_function_chat}`, { historyConv, information});
      if(rezQuery?.data?.isResolved){
        return {isResolved: true, data: rezQuery?.data?.data};
      }else{
        return {isResolved: false, err: rezQuery?.data?.err};
      }
    })
  };

  async getConversations(){
    return this._storeErr(async ()=>{
      const {uid} = auth.currentUser;
      const q = query(collection(db, "conversations"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      let rez = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        rez.push(data);
      });
      return {isResolved:true, data: rez};
    })
  }

  async getMessages(idConv){
    return this._storeErr(async ()=>{
      const q = query(collection(db, "messages"), where("idConv", "==", idConv), orderBy("time"));
      const querySnapshot = await getDocs(q);
      let rez = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        rez.push(data);
      });
      return {isResolved:true, data: rez};
    })
  }

  async deleteChat(idConv){
    return this._storeErr(async ()=>{
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
      return {isResolved:true};
    })
  }

  async _storeErr(cb){
    try{
      const data = await cb();
      return data;
    }catch(err){
      const uid = auth?.currentUser?.uid;
      const {modelName, modelId, brand} = Device;
      console.log('we catch an error', {err});
      addDoc(collection(db, "errors"), {uid: uid || 'user not connected', modelName, modelId, brand, mesErr: err.message});
      return {isResolved: false, err: err.message}
    }
  }

  async storeErr(mesErr){
    const {modelName, modelId, brand} = Device;
    let rezFin = {};
    try{
      const {uid} = auth.currentUser;
      await addDoc(collection(db, "errors"), {uid, modelName, modelId, brand, mesErr});
      rezFin = {isResolved: true};
    }catch(err){
      this.storeErr(err.message)
      rezFin = {isResolved: false, err};
    }
    return rezFin
  }

  async deleteTrip(idTrip){
    return this._storeErr(async ()=>{
      await deleteDoc(doc(db, "programs", idTrip));
      return {isResolved:true};
    })
  }

  async updateColumnsDatabase({database, id, columnsWithValues}){
    return this._storeErr(async ()=>{
      const ref = doc(db, database, id);
      const rez = await updateDoc(ref, columnsWithValues);
      return {isResolved: true};
    })
  }

  async addIntoDatabase({database, id, columnsWithValues}){
    return this._storeErr(async ()=>{
      if (id) {
        await setDoc(doc(db, database, id), columnsWithValues);
      }else{
        await addDoc(collection(db, database), columnsWithValues);
      }
      return {isResolved: true};
    })
  }


}

/////////////////////////////////////

class FirebaseAuth extends FirebaseFirestore {

  async _createUserWithEmailAndPassword(email, password, firstName, secondName){
    return this._storeErr(async ()=>{
      const rez = await createUserWithEmailAndPassword(auth, email, password);
      const {uid} = rez.user;
      const {createdAt} = rez.user.metadata;
      await this.addIntoDatabase({
        database: 'users',
        id: uid,
        columnsWithValues: {
          uid, createdAt, email, password, firstName, secondName, email_verified: false
        }
      });
      this.addIntoDatabase({
        database: 'code_verification',
        id: email,
        columnsWithValues: {'codes': []}
      });
      return {isResolved: true, data: rez};
    })
  }

  async _signInWithEmailAndPassword(email, password){
    return this._storeErr(async ()=>{
      const rez = await signInWithEmailAndPassword(auth, email, password)
      return {isResolved: true, data: rez};
    })
  }

  async reAuth(password){
    return this._storeErr(async ()=>{
      const user = auth.currentUser;
      const {email} = user;
      const credential = EmailAuthProvider.credential(email, password)
      await reauthenticateWithCredential(user, credential);
      return {isResolved: true};
    })
  }

  async _deleteUser(){
    return this._storeErr(async ()=>{
      const user = auth.currentUser;
      const rez = await deleteUser(user);
      return {isResolved: true};
    })
  }

  async _signOut(){
    return this._storeErr(async ()=>{
      const rez = await signOut(auth);
      return {isResolved: true};
    })
  }

  async _sendPasswordResetEmail(email){
    return this._storeErr(async ()=>{
      const rez = await sendPasswordResetEmail(auth, email)
      return {isResolved: true};
    })
  }
};


///////////////////////////////////////////////////////////////////////////////


export {db, auth, FirebaseAuth, FirebaseFirestore};



