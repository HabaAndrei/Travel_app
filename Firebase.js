import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc,  getDoc, query, where, getDocs } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, getAuth, 
  signInWithPopup, initializeAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification  } from "firebase/auth";
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
const provider = new GoogleAuthProvider();


const auth = getAuth(app);

auth.setPersistence(getReactNativePersistence(AsyncStorage));




function connectWithGoogle(){


  signInWithRedirect(auth, provider)
  .then((result) => {
    console.log(result, " raspuns de succes!!!");
  }).catch((error) => {
    console.log("eroare de la google ", error, {auth, provider});
  });


  console.log('Am ajuns la final de functie ')


  // createUserWithEmailAndPassword(auth, "okoo@ok.com", "password82347")
  // .then((userCredential) => {
  //   // Signed up 
  //   const user = userCredential.user;
  //   console.log(user, "acesta este userul");
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   console.log(error);
  // });


}


// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });


// function connectWithGoogle(){
//   signInWithPopup(auth, provider)
//   .then((result) => {
//     console.log(result);
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     const user = result.user;
    
//   }).catch((error) => {
//     console.log("eroare de la google ", error, {auth, provider});
//   });
// }

///////////////////////////////////////////////////////////////////////////////


function createUserEmailPassword(){

  createUserWithEmailAndPassword(auth, "habaconstantin45@gmail.com", "password82347")
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user, "acesta este userul");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);
  });

}


function verifyEmail(){
  sendEmailVerification(auth.currentUser)
  .then(() => {
    console.log('email-ul a fost trimis');
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    
    const uid = user.uid;
    console.log('Avem user conectat cu uid: ' , uid);
  } else {
    console.log('nu avem user conectat')
  }
});




///////////////////////////////////////////////////////////////////////////////

export {db, auth,  connectWithGoogle, createUserEmailPassword, verifyEmail};


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
