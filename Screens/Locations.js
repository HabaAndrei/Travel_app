import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native'; 
import {address_function_api, getDataFromAsyncStorage, addDataToAsyncStorage, multiSetFromAsyncStorage} from '../diverse';
import axios from 'axios';


const Locations = (props) => {

  const isFocused = useIsFocused();
  const [locations, setLocations] = useState([]);

    useEffect(()=>{

      if(!isFocused)return;

      if(!props?.route?.params?.type && locations.length)return;

      if(!props?.route?.params?.type){
        getLocationsFromAsyncStorage();
        return;
      };
    
      const {from, to, city, country, checkbox, type} = props?.route?.params;
      
  
      if(type === "getAllDataAboutLocations"){
        let newCheckbox = [];
        checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});  
        getLocations('seeAllPlaces', from, to, city, country, newCheckbox)
        return;
      }
      

    }, [isFocused]);


    async function getLocations( method, from, to, city, country, newCheckbox){
      setLocations([]);
      console.log('parametrii: ', {method, from, to, city, country, newCheckbox})
      axios.post(`${address_function_api}`, 
        {from, to, city, country, newCheckbox, method}
      ).then((data)=>{
  
        if(data.data.type){
          const arrayWithLocations = data.data.data;
          const arraySelected = arrayWithLocations.map((ob)=>{return {...ob, selected: false}});
          console.log(arraySelected);
          multiSetFromAsyncStorage([['arrayLocationsToTravel', [...arraySelected]], 
            ["locationsParameter", {from, to, city, country, newCheckbox}]]);
        }else{
          console.log("eroare la functia getLocations ", data);
        }       
      }).catch((err)=>{
        console.log('eroare de la getLocations', err, ' <<== eroare');
      })
    }


    async function getLocationsFromAsyncStorage(){

      
      const locations = await getDataFromAsyncStorage("arrayLocationsToTravel");
      if(!locations.type){console.log('aici trebuie sa bag un mesaj de eroare')}
      if(locations?.data?.length){
        console.log(locations.data)
        setLocations([...locations.data])
      }
    }


  return (
    <View>
      <ScrollView>
        {locations.map((location, index)=>{
          return <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={360} m="$3">
            <HStack justifyContent="space-between" alignItems="center">
        
              <Pressable onPress={()=>{console.log('Am selectat indexul', index)}} >
                Aici o sa am o iconita in care accepta sau nu excursia 
              </Pressable>
            </HStack>
            
            <Heading size="md" fontFamily="$heading" mb="$4">
              {location.name}
            </Heading>
            
            AICI SA LINK-URILE LOR DAR SI POZELE 

            {/* DUPA ASTA FAC CUMVA SA LE ADAUG IN BAZA DE DATE =>> LOCATIILE  */}

          </Card>  
        })}
      </ScrollView>
    </View>
  )
}

export default Locations

const styles = StyleSheet.create({})