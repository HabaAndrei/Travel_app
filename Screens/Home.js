import {useState, useEffect} from 'react'
import { View, TextInput,Pressable ,TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import {countries} from '../country_capital';
import Fuse from "fuse.js";
import SearchDestination from '../Components/SearchDestination';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import {MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';

const Home =  ({navigation}) => {

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
      const q = query(collection(db, "travel_destinations"), where("capital", "==", 'Madrid'));
      console.log(q);
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    }catch(err){
      console.log('err=>', err);
    }

  }

  return (
    <View style={styles.wrapper}>
      {/* <SearchDestination/> */}



      <Text onPress={()=>getData()} >Press</Text>
      
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // justifyContent: 'center',
    marginTop: 150,
    paddingHorizontal: 20,
  },
});

