import { StyleSheet, View, ScrollView, TextInput, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import {address_function_api, formatDateFromMilliseconds, removeItemFromAsyncStorage, addDataToAsyncStorage,
  multiSetFromAsyncStorage, getDataFromAsyncStorage, multiGetFromAsyncStorage, multiRemoveFromAsyncStorage} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, Text, VStack, Divider, HStack, TrashIcon,RepeatIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import { useIsFocused } from '@react-navigation/native'; 
import {addProgramIntoDb} from '../firebase.js';
import axios from 'axios';


const Program = (props) => {

  // createProgram => creez date din azure
  // getProgramAsync => iau date din async storage 
  // keepProgram => pastram programul din useState



  const isFocused = useIsFocused();
  const [program, setProgram] = useState([]);
  const [buttonHomePage, setButtonHomePage] = useState(false);


  useEffect(()=>{

    if(!isFocused)return 
   
    if(!props?.route?.params?.type || props?.route?.params?.type === "getProgramAsync"){
      getProgramFromAsyncStorage();
      return;
    };

    if(props?.route?.params?.type === "keepProgram")return;

    

    const {from, to, city, country} = props?.route?.params?.locationParam;
    const {locations, type} = props?.route?.params;

    if(type === "createProgram"){
      getProgram('createProgram', from, to, city, country, locations);
    }
    

  }, [isFocused]);



  async function getProgramFromAsyncStorage(){
    const program = await getDataFromAsyncStorage("travelProgram");
    if(!program.type){console.log('aici trebuie sa bag un mesaj de eroare')}
    if(program?.data?.length){
      setProgram([...program.data])
    }else{
      setButtonHomePage(true);
    }
  }

  

  

  async function regenerateProgram(){
    
    const rez = await getDataFromAsyncStorage("travelParameter");
    if(!rez.type)return
    let {method, from, to, city, country, locations} = rez.data;
    setProgram([]);
    getProgram( method, from, to, city, country, locations)

  }



  async function getProgram(method, from, to, city, country, locations){
    setButtonHomePage(false);
    setProgram([]);
    axios.post(`${address_function_api}`, 
      {method, from, to, city, country, locations}
    ).then((data)=>{

      if(data.data.type){
        const values = Object.values(data.data.data);
        setProgram([...values]);
        multiSetFromAsyncStorage([['travelProgram', [...values]], 
          ["travelParameter", {method, from, to, city, country, locations}]]);
        
      }else{
        console.log("eroare la functia getProgram ", data.data);
        props.addNotification("warning", "Unfortunately, we could not generate your program.")
      }       
    }).catch((err)=>{
      props.addNotification("error", "Unfortunately, we could not generate program")
      console.log('eroare de la getProgram',err);
    })
  }





  async function deleteDayFromProgram(index) {
    const response = await props.areYouSureDeleting();
    if (response) {
      setProgram((prev)=>{
        const firstPart = prev.slice(0, index);
        const secondPart = prev.slice(index + 1, prev.length);
        let newProgram = firstPart.concat(secondPart);
        let day = 0;
        const updateDayProgram = newProgram.map((ob, index)=>{
          ob.day = index + 1;
          if(index === 0 ){
            day = new Date(ob.date).getTime();
          }else{
            day+=86400000;
            ob.date = formatDateFromMilliseconds(day);
          }
          return {...ob}
        })

        addDataToAsyncStorage('travelProgram', updateDayProgram);
      
        return [...updateDayProgram];
      })
    }
  }

  
  async function deleteAllProgram(){

    const response = await props.areYouSureDeleting();
    if (response) {
      const rez = await removeItemFromAsyncStorage('travelProgram');
      if(!rez.type)return;
      props.navigation.navigate('Home')
      setProgram([]);

    }
  }


  function goToDailyProgram(obiect){
    props.navigation.navigate('DailyProgram', {data: obiect.data, index: obiect.index})
  }



  async function saveProgramInDb(){
    if(!props.user){
      props.addNotification("error", "You must be logged in as a user to be able to save.");
      return;
    }
    const rez = await multiGetFromAsyncStorage(["travelProgram", "travelParameter"]);
    if(!rez.type){
      props.addNotification("error", "Unfortunately we could not save the program for you")
      console.log(rez.err);
      return;
    }

    const travelProgram =   JSON.parse(rez.data[0][1]);
    const travelParameter = JSON.parse(rez.data[1][1]);
    const {city, country } = travelParameter;
    const from = travelProgram[0].date;
    const to = travelProgram[travelProgram.length - 1].date;
    const programDaysString = JSON.stringify(travelProgram);
    const uid = props.user.uid;
    const rezAddInDb = await addProgramIntoDb(city, country, from , to, programDaysString, uid)
    if(!rezAddInDb.type){
      props.addNotification("error", "Unfortunately we could not save the program for you")
      console.log(rezAddInDb.err);
      return;
    }

    const rezDeleteAsyncStorage = await multiRemoveFromAsyncStorage(["travelProgram", "travelParameter"])
    if(!rezDeleteAsyncStorage.type)return;
    setProgram([]);
    setButtonHomePage(true);
    props.navigation.navigate('Plans');
  }




  return (
    <ScrollView>
      {buttonHomePage ?
      

      <View>
        
        <View style={styles.buttonView} >
          <Pressable  style={styles.buttonPress}  > 
            <Text style={styles.text} onPress={()=>{props.navigation.navigate('Home'); setButtonHomePage(false)}}>
              Create program</Text>
          </Pressable>
        </View>
      </View> 
      :
      <View>


        {!program?.length ? 
        <View style={styles.container} >
          <Center  >
            <Spinner color="$indigo600" />
          </Center>
        </View> :

        <View> 
          
          <HStack h="$10" justifyContent="center" alignItems="center">
            <HStack alignItems="center"  >
              <Text  onPress={()=>{deleteAllProgram()}} >Delete</Text>
              <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
            </HStack>

            <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$emerald500"  h={25}  $dark-bg="$emerald400" />

            <HStack alignItems="center">
              <Text onPress={()=>regenerateProgram()} >Regenerate</Text>
              <Icon as={RepeatIcon} m="$2" w="$6" h="$6" />
            </HStack>

            <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

            <HStack alignItems="center">
              <Text onPress={()=>saveProgramInDb()} >Save</Text>
              <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
            </HStack>
          </HStack>

        {program?.map((ob, index)=>{
          return  <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={400} m="$3">
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$sm"  fontStyle="normal"  fontFamily="$heading"  fontWeight="$normal"  lineHeight="$sm"  mb="$2"  sx={{  color: "$textLight700" }} >
                {'Day' + ob.day + " | " } {ob.date}  
              </Text>
              <Pressable onPress={()=>{deleteDayFromProgram(index)}} >
                <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
              </Pressable>
            </HStack>
            
            <Heading size="md" fontFamily="$heading" mb="$4">
              {ob.title}
            </Heading>
            <Link onPress={()=>{goToDailyProgram({data: ob, index})}}>
              <HStack alignItems="center">
                <LinkText    size="sm"  fontFamily="$heading"  fontWeight="$semibold"  color="$primary600"  $dark-color="$primary300"  textDecorationLine="none" >
                    See full day
                </LinkText>
                <Icon as={ArrowRightIcon}  size="sm"  color="$primary600"  mt="$0.5"  ml="$0.5"  $dark-color="$primary300"/>
              </HStack>
            </Link>
          </Card>   
        })}
        </View>}

      </View>
      }
    </ScrollView>
  )
}


export default Program

const styles = StyleSheet.create({
  container: {
    marginTop: 300
  }, 
  buttonPress:{
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 160,
    marginBottom: 30
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  buttonView: {
    marginTop: 200,
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    
  }, 
})







