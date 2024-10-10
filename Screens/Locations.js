import { StyleSheet,SafeAreaView, Text, View, ScrollView, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native'; 
import {address_function_api, getDataFromAsyncStorage, addDataToAsyncStorage, multiSetFromAsyncStorage} from '../diverse';
import axios from 'axios';
import { Card, HStack, Heading,Center, Image, Link, Divider, LinkText, Spinner, VStack, CloseIcon, CheckIcon, Icon } from '@gluestack-ui/themed';


const Locations = (props) => {

  const isFocused = useIsFocused();
  const [locations, setLocations] = useState([]);
  const [buttonHomePage, setButtonHomePage] = useState(false);



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
    setButtonHomePage(false)
    console.log('parametrii: ', {method, from, to, city, country, newCheckbox})
    axios.post(`${address_function_api}`, 
      {from, to, city, country, newCheckbox, method}
    ).then((data)=>{

      if(data.data.type){
        const arrayWithLocations = data.data.data;
        const arraySelected = arrayWithLocations.map((ob)=>{return {...ob, selected: false}});
        console.log(arraySelected);
        setLocations(arraySelected)
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

    if(locations.length)return;
    const places = await getDataFromAsyncStorage("arrayLocationsToTravel");
    if(places?.data?.length ){
      setLocations([...places.data])
    }else{
      setButtonHomePage(true);
    }
  }



  function pressOnLocations(index_){
    setLocations((prev)=>{
      const newAr = prev.map((ob, index)=>{
        if(index === index_){
          return {...ob, selected : !ob.selected}
        }else{
          return ob;
        }
      })
      return newAr;
    })
  }


  function pressOnCancel(){
    props.navigation.navigate('Home');
  }


  async function pressOnSave(){    
    const selectedLocations = locations.filter((place)=>place.selected)
    if(!selectedLocations.length){
      props.addNotification('warning', 'You do not have any location selected to make the trip');
      return;
    }
    const dataParam = await getDataFromAsyncStorage('locationsParameter');
    if(!dataParam.type){
      props.addNotification('error', 'Error submitting for program search');
      return;
    }
    const locationParam = dataParam.data;
    props.navigation.navigate('Program', {type: 'createProgram', locations: selectedLocations, locationParam});

  }



  return (
  <SafeAreaView style={styles.container}>
    {buttonHomePage ? (
      <View style={styles.buttonView}>
        <Pressable style={styles.buttonPress}>
          <Text style={styles.text} onPress={() => {
            props.navigation.navigate('Home');
            setButtonHomePage(false);
          }}>
            Create program
          </Text>
        </Pressable>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!locations?.length ? (
          <View style={{ marginTop: 300 }}>
            <Center  >
              <Spinner color="$indigo600" />
            </Center>
          </View>
        ) : (

          <View>

            <Center>
              <Heading size="md" fontFamily="$heading" mb="$4">
                Select the locations you would like to visit
              </Heading>
            </Center>
          
          {locations.map((location, index) => (
            <Pressable 
              key={index} 
              onPress={() => pressOnLocations(index)} 
              style={[
                styles.cardPressable,
                location.selected && styles.selectedCard
              ]}
            >
              <Card p="$5" borderRadius="$lg" maxWidth={400} m="$3">
                <Heading size="md" fontFamily="$heading" mb="$4">
                  {location.name}
                </Heading>
                <View style={{ flex: 1 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {location.arrayWithLinkImages.map((image, idx) => (
                      <Image alt={idx} key={idx} source={{ uri: image }} style={styles.image} />
                    ))}
                  </ScrollView>
                </View>
                <VStack space="md" justifyContent='center' alignItems='center'>
                  <HStack h='$10' justifyContent='center' alignItems='center'>
                    <Link href={location.website} isExternal>
                      <HStack alignItems="center">
                        <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                          Visit their website
                        </LinkText>
                      </HStack>
                    </Link>
                    <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} />
                    <Link href={location.urlLocation} isExternal>
                      <HStack alignItems="center">
                        <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                          Google location
                        </LinkText>
                      </HStack>
                    </Link>
                  </HStack>
                </VStack>
              </Card>
            </Pressable>
          ))
          }
          

            <View> 
          
              <HStack h="$10" justifyContent="center" alignItems="center">
                <HStack alignItems="center"  >
                  <Text  onPress={()=>pressOnCancel()} >Cancel</Text>
                  <Icon as={CloseIcon} m="$2" w="$6" h="$6" />
                </HStack>
                
                <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

                <HStack alignItems="center">
                  <Text onPress={()=>pressOnSave()} >Save</Text>
                  <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
                </HStack>
              </HStack>
            </View>
          
          
          </View>
        )}
      </ScrollView>
    )}
  </SafeAreaView>

  )
}

export default Locations

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  buttonPress: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 160,
    marginBottom: 30,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
  },
  cardPressable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: '#ADD8E6', 
  },
});




// adaug datele acestea in baza de date nu in async storage
// fac ca clientul sa le selecteze
// pun sa se faca speener pe ecran cand nu vin sau cand nu sunt date