import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc ,getDoc, query, where, getDocs } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
import { getAuth, signOut,  deleteUser, initializeAuth, createUserWithEmailAndPassword, onAuthStateChanged,
   sendEmailVerification, signInWithEmailAndPassword  } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { create } from "twrnc";



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
    
    const {uid, emailVerified} = rez.user;
    const {createdAt} = rez.user.metadata;

    // await addUserIntoDb(uid, emailVerified, createdAt, email, password, firstName, secondName);
    
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


async function verifyEmail(){
  sendEmailVerification(auth.currentUser)
  .then(() => {
    console.log('email-ul a fost trimis');
  });
}
///////////////////////////////////////////////////////////////////////////////

async function addUserIntoDb(uid, emailVerified, createdAt, email, password, firstName, secondName){

  console.log({uid, emailVerified, createdAt, email, password, firstName, secondName});
  try{
    await setDoc(doc(db, "users", uid), {
      uid, email, firstName, secondName, password, emailVerified, createdAt
    });
  }catch(err){
    console.log(err, 'nu s a introdus nimic in baza de date')
  }

}






export {db, auth, signOutUser, deleteTheUser, createUserEmailPassword, verifyEmail, signInUserEmailPassword};


/////////////////////////////////////////////////

  
  // async function makeAction(){
  //   console.log('se executa!!!!!!!')

  //   for(let i = 0 ; i <countries.length; i++){
  //     let ob = countries[i];
  //     let name = ob['name'];
  //     let capital = ob['capital'];
  //     try{
  //         const docRef = await addDoc(collection(db, "travel_destinations"), {
  //           country: name , capital
  //         });
  //         console.log(ob.id);
  //       }catch(err){
  //         console.log(err);
  //       }

  //   }
    // try{
    //   const docRef = await addDoc(collection(db, "test"), {
    //     first: "Ada",
    //   });
    //   console.log(docRef);
    // }catch(err){
    //   console.log(err);
    // }
    
  // }


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
