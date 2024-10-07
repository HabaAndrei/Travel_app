import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native'; 
import {address_function_api, getDataFromAsyncStorage, addDataToAsyncStorage, multiSetFromAsyncStorage} from '../diverse';
import axios from 'axios';
import { Card, HStack, Heading, Image, Link, Divider, LinkText, Box, VStack } from '@gluestack-ui/themed';


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
            
            <Heading size="md" fontFamily="$heading" mb="$4">
              {location.name}
            </Heading>
            
 
            <VStack  space="md"  justifyContent='center'  alignItems='center' >
              <HStack  h='$10'  justifyContent='center'  alignItems='center' >
                <Link href={location.website} isExternal>
                  <HStack alignItems="center">
                    <LinkText  size="sm"  fontFamily="$heading"  fontWeight="$semibold"  color="$primary600"  $dark-color="$primary300"  textDecorationLine="none" >
                      Visit their website
                    </LinkText>
                  </HStack>
                </Link>
               
                <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} $dark-bg="$emerald400"/>
               
                <Link href={location.urlLocation} isExternal>
                  <HStack alignItems="center">
                    <LinkText  size="sm"  fontFamily="$heading"  fontWeight="$semibold"  color="$primary600"  $dark-color="$primary300"  textDecorationLine="none" >
                      Google location
                    </LinkText>
                  </HStack>
                </Link>
                
              </HStack>
            </VStack>
     
          </Card>  
        })}
      </ScrollView>
    </View>
  )
}

export default Locations

const styles = StyleSheet.create({})