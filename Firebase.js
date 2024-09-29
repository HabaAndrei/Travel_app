import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc,  getDoc, query, where, getDocs } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
import { getAuth, deleteUser, initializeAuth, createUserWithEmailAndPassword, onAuthStateChanged,
   sendEmailVerification  } from "firebase/auth";
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




function createUserEmailPassword(email, password){

  let rezFin = {};
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    rezFin = {type: true, data: userCredential};
  })
  .catch((error) => {
    rezFin = {type: false, err: error};
  });
  return rezFin;

}


function deleteUser(){
  const user = auth.currentUser;

  deleteUser(user).then(() => {
    // User deleted.
  }).catch((error) => {
    // An error ocurred
    // ...
  });

}


function verifyEmail(){
  sendEmailVerification(auth.currentUser)
  .then(() => {
    console.log('email-ul a fost trimis');
  });
}






///////////////////////////////////////////////////////////////////////////////

export {db, auth, createUserEmailPassword, verifyEmail};


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
