import { StyleSheet, View, ScrollView, TextInput, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import {address_function_api, formatDateFromMilliseconds, removeItemFromAsyncStorage, addDataToAsyncStorage,
  multiSetFromAsyncStorage, getDataFromAsyncStorage} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, Text, VStack, Divider, HStack, TrashIcon,RepeatIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import { useIsFocused } from '@react-navigation/native';
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
   
    // const from = '20-09-2024';
    // const to = '21-09-2024';
    // const city = 'London';
    // const country = 'England';
    // const newCheckbox = ['Explore skyscrapers and modern architecture', 'Enjoy desert safari and camel riding', 'Visit cultural heritage sites and museums', "Nature and outdoors", 'Try water sports and activities', "sightseeing"];
    
    // if(!props?.route?.params)return;



    if(!props?.route?.params?.type){
      getProgramFromAsyncStorage();
      return;
    };

    const {from, to, city, country, checkbox, type} = props?.route?.params;


    
    if(props?.route?.params?.type === "keepProgram")return;


    if(type === "createProgram"){
      console.log('A intrat sa se creeze program')
      let newCheckbox =[];
      checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});  
      getProgram('createProgram', from, to, city, country, newCheckbox)
    }
    
    if( props?.route?.params?.type === "getProgramAsync"){
      getProgramFromAsyncStorage();
    }

    // setProgram([...Object.values(prog.program)]);

  }, [isFocused]);


  // async function addProgramToAsyncStorage(){
  //   const data = await addDataToAsyncStorage('travelProgram', [...Object.values(prog.program)]);
  //   console.log(data);
  // }

  async function getProgramFromAsyncStorage(){
    const program = await getDataFromAsyncStorage("travelProgram");
    if(!program.type){console.log('aici trebuie sa bag un mesaj de eroare')}
    if(program?.data?.length){
      setProgram([...program.data])
    }else{
      console.log('trebuie sa adaug eu butonul');
      setButtonHomePage(true);
    }
    
  }



  const prog = {
    program: {
    1: {
      day: 1,
      date: "2024-09-20",
      title: "Modern Architecture & Skyscrapers",
      activities: [
        {
          place: "The Shard",
          address: "32 London Bridge St, London SE1 9SG, United Kingdom",
          description: "A 95-storey skyscraper with a viewing gallery offering panoramic views of London.",
          info: "Tickets can be purchased online or at the venue.",
          link: "https://www.theviewfromtheshard.com/",
          time: "10:00"
        },
        {
          place: "Sky Garden",
          address: "1 Sky Garden Walk, London EC3M 8AF, United Kingdom",
          description: "A public space located at the top of the 'Walkie Talkie' building, offering 360-degree views of London.",
          info: "Free entry but requires booking in advance.",
          link: "https://skygarden.london/",
          time: "13:00"
        },
      ]
    },
    2: {
      day: 2,
      date: "2024-09-21",
      title: "Cultural Heritage Sites and Museums",
      activities: [
        {
          place: "British Museum",
          address: "Great Russell St, London WC1B 3DG, United Kingdom",
          description: "A public institution dedicated to human history, art, and culture.",
          info: "Free entry with optional donation.",
          link: "https://www.britishmuseum.org/",
          time: "10:00"
        },
        {
          place: "Tower of London",
          address: "St Katharine's & Wapping, London EC3N 4AB, United Kingdom",
          description: "A historic castle located on the north bank of the River Thames in central London.",
          info: "Tickets can be purchased online or at the venue.",
          link: "https://www.hrp.org.uk/tower-of-london/",
          time: "13:00"
        }
      ]
    },
    3:{
      day: 3,
      date: "2024-09-22",
      title: "Nature and Outdoors",
      activities: [
        {
          place: "Hyde Park",
          address: "Hyde Park, London, United Kingdom",
          description: "One of London's largest and most famous parks.",
          info: "Free entry.",
          link: "https://www.royalparks.org.uk/parks/hyde-park",
          time: "10:00"
        },
        {
          place: "Kew Gardens",
          address: "Royal Botanic Gardens, Kew, Richmond, Surrey, TW9 3AE, United Kingdom",
          description: "A botanical garden with the largest and most diverse botanical collections in the world.",
          info: "Tickets can be purchased online or at the venue.",
          link: "https://www.kew.org/",
          time: "13:00"
        }
      ]
    },
    4:{
      day: 4,
      date: "2024-09-23",
      title: "Water Sports and Activities",
      activities: [
        {
          place: "WakeUp Docklands",
          address: "Royal Victoria Beach, Western Gateway, Royal Docks, London E16 1FA, United Kingdom",
          description: "A water sports center offering activities like wakeboarding and paddleboarding.",
          info: "Tickets can be purchased online or at the venue.",
          link: "https://wakeupdocklands.com/",
          time: "10:00"
        },
        {
          place: "Lee Valley White Water Centre",
          address: "Station Road, Waltham Cross, Hertfordshire, EN9 1AB, United Kingdom",
          description: "An outdoor center offering white water rafting and kayaking.",
          info: "Tickets can be purchased online or at the venue.",
          link: "https://www.visitleevalley.org.uk/en/content/cms/outdoors/white-water-centre/",
          time: "13:00"
        }
      ]
    },
    5:{
      day: 5,
      date: "2024-09-24",
      title: "Sightseeing",
      activities: [
        {
          place: "Buckingham Palace",
          address: "Westminster, London SW1A 1AA, United Kingdom",
          description: "The London residence and administrative headquarters of the monarch of the United Kingdom.",
          info: "Tickets can be purchased online or at the venue. Note that it is open to the public only during certain times of the year.",
          link: "https://www.rct.uk/visit/the-state-rooms-buckingham-palace",
          time: "10:00"
        },
        {
          place: "London Eye",
          address: "Riverside Building, County Hall, London SE1 7PB, United Kingdom",
          description: "A large observation wheel on the South Bank of the River Thames in London.",
          info: "Tickets can be purchased online or at the venue.",
          link: "https://www.londoneye.com/",
          time: "13:00"
        }
      ]
    },
  }};
  

  async function regenerateProgram(){
    
    const rez = await getDataFromAsyncStorage("travelParameter");
    if(!rez.type)return
    let {method, from, to, city, country, newCheckbox} = rez.data;
    setProgram([]);
    getProgram( method, from, to, city, country, newCheckbox)

  }



  async function getProgram( method, from, to, city, country, newCheckbox){
    setButtonHomePage(false);
    axios.post(`${address_function_api}`, 
      {from, to, city, country, newCheckbox, method}
    ).then((data)=>{

      if(data.data.type){
        const values = Object.values(data.data.data);
        setProgram([...values]);
        multiSetFromAsyncStorage([['travelProgram', [...values]], 
          ["travelParameter", {method, from, to, city, country, newCheckbox}]]);
        
      }else{
        console.log(data.data);
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
      </View> :
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
              <Text  onPress={()=>deleteAllProgram()} >Delete</Text>
              <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
            </HStack>

            <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$emerald500"  h={25}  $dark-bg="$emerald400" />

            <HStack alignItems="center">
              <Text onPress={()=>regenerateProgram()} >Regenerate</Text>
              <Icon as={RepeatIcon} m="$2" w="$6" h="$6" />
            </HStack>

            <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

            <HStack alignItems="center">
              <Text onPress={()=>console.log('Am apasat pe save')} >Save</Text>
              <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
            </HStack>
          </HStack>

        {program?.map((ob, index)=>{
          return  <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={360} m="$3">
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$sm"  fontStyle="normal"  fontFamily="$heading"  fontWeight="$normal"  lineHeight="$sm"  mb="$2"  sx={{  color: "$textLight700" }} >
                {'Day' + ob.day + " | " } {ob.date}  
              </Text>
              <Pressable onPress={()=>deleteDayFromProgram(index)} >
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



// Salvez excursia in baza de date !!!





