import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc ,updateDoc, query, where, getDocs } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
import { getAuth, signOut,  deleteUser, initializeAuth, createUserWithEmailAndPassword, onAuthStateChanged,
   sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail  } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';



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


async function createUserEmailPassword(email, password, firstName, secondName){

  let rezFin = {};
  try{
    const rez = await createUserWithEmailAndPassword(auth, email, password);
    
    const {uid} = rez.user;
    const {createdAt} = rez.user.metadata;

    await addUserIntoDb(uid, createdAt, email, password, firstName, secondName);

    rezFin = {type: true, data: rez};
  }catch(err){
    rezFin = {type: false, err};
  }
  return rezFin;
}

async function signInUserEmailPassword(email, password){
  let rezFin = {};
  try{
    const rez = await signInWithEmailAndPassword(auth, email, password)
    rezFin = {type: true, data: rez};
  }catch(err){
    rezFin = {type: false, err};
  }
  return rezFin; 
}


async function deleteTheUser(){
  const user = auth.currentUser;
  let rezFin = {};
  try{
    const rez = await deleteUser(user);
    rezFin = {type: true};
  }catch(err){
    rezFin = {type: false, err};
  }
  return rezFin;
}

async function signOutUser(){
  let rezFin = {};
  
  try{
    const rez = await signOut(auth);
    rezFin = {type: true};
  }catch(err){
    rezFin = {type: false, err};
  }
  return rezFin;
}


async function forgotPassword(email){
  let rezFin = {};
  try{
    const rez = await sendPasswordResetEmail(auth, email)
    rezFin = {type:true};
  }catch(err){
    rezFin = {type: false, err};
  }
  return rezFin; 
}


async function verifyEmail(){
  let rezFin = {};
  try{
    await sendEmailVerification(auth.currentUser);
    rezFin = {type:true};
  }catch(err){
    rezFin = {type:false, err}
  }
  return rezFin;
}

///////////////////////////////////////////////////////////////////////////////

async function addUserIntoDb(uid, createdAt, email, password, firstName, secondName){
  
  console.log({uid, createdAt, email, password, firstName, secondName});
  try{
    await setDoc(doc(db, "users", uid), {
      uid, email, firstName, secondName, password, createdAt, plan: "standard"
    });
  }catch(err){
    console.log(err, 'nu s a introdus nimic in baza de date')
  }
}


async function addProgramIntoDb(city, country, from , to, programDaysString, uid){

  let rezFin = {type: true};
  try{
    await addDoc(collection(db, "programs"), {city, country, from , to, programDaysString, uid});
  }catch(err){
    rezFin = {type: false, err}
  }
  return rezFin;
}

async function getPlansFromDbWithUid(uid){
  let rezFin = {type: true};
  try{
    const q = query(collection(db, "programs"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let programs = [];
    querySnapshot.forEach((doc) => {
      const {id} = doc;
      let data = doc.data();
      data.id = id;
      programs.push(data);
    });
    rezFin = {type:true, data: programs};
  }catch(err){
    rezFin = {type: false, err}
  }
  return rezFin;
}

async function updateProgramActivities(id, program, methodDate = '', date){
  let rezFin = {type: true};
  try{
    if(typeof(program) != 'string') program = JSON.stringify(program);
    
    const ref = doc(db, 'programs', id);
    if(methodDate === 'from'){
      const rez = await updateDoc(ref, {
        from: date,
        programDaysString: program
      });
    }else if(methodDate === 'to'){
      const rez = await updateDoc(ref, {
        to: date,
        programDaysString: program
      });
    }
  }catch(err){
    rezFin = {type: false, err};
  }
  return rezFin;
}



export {db, auth, signOutUser, deleteTheUser, addProgramIntoDb, createUserEmailPassword, verifyEmail, signInUserEmailPassword, 
  getPlansFromDbWithUid, forgotPassword, updateProgramActivities
};





async function getData(){
  // const docRef = doc(db, "travel_destinations", '1GTlNqmma2kgfSuaN3B1');
  // const docSnap = await getDoc(docRef);
  
  
  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   console.log("No such document!");
  // }

  try{
    console.log('se executa!!!')
    const q = query(collection(db, "travel_destinations"), where("capital", ">=", 'Buc'), where("capital", "<=", 'Buc'));
    console.log(q);
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.data());
    });
  }catch(err){
    console.log('err=>', err);
  }

}
