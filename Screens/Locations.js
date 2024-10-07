import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native'; 
import {address_function_api} from '../diverse';
import axios from 'axios';

const Locations = (props) => {

    const isFocused = useIsFocused();
    const [locations, setLocations] = useState([]);

    useEffect(()=>{

        if(!isFocused)return;

        // if(!props?.route?.params?.type){
        //     getProgramFromAsyncStorage();
        //     return;
        // };
      
        const {from, to, city, country, checkbox, type} = props?.route?.params;
        
    
        if(type === "getAllDataAboutLocations"){
            let newCheckbox = [];
            checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});  
            getLocations('seeAllPlaces', from, to, city, country, newCheckbox)
        }
        
        // if( props?.route?.params?.type === "getProgramAsync"){
        // getProgramFromAsyncStorage();
        // }

    }, [isFocused]);


    async function getLocations( method, from, to, city, country, newCheckbox){
        setLocations([]);
        console.log('parametrii: ', {method, from, to, city, country, newCheckbox})
        axios.post(`${address_function_api}`, 
          {from, to, city, country, newCheckbox, method}
        ).then((data)=>{
    
          if(data.data.type){
            console.log(data.data)
          }else{
            console.log("eroare la functia getLocations ", data);
          }       
        }).catch((err)=>{
          console.log('eroare de la getLocations', err, ' <<== eroare');
        })
    }


  return (
    <View>
      <Text>Locations</Text>
    </View>
  )
}

export default Locations

const styles = StyleSheet.create({})