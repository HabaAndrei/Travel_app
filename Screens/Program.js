import { StyleSheet, View, ScrollView, TextInput, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import {address_function_api, formatDateFromMilliseconds} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, Text, VStack, Divider, HStack, TrashIcon,RepeatIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import axios from 'axios';
import ModalDayProgram from '../Components/ModalDayProgram.js';


const Program = (props) => {

  
  const [modalVisible, setModalVisible] = useState({isOpen:false, data:{}, index: ''});


  useEffect(()=>{
    // const from = '20-09-2024';
    // const to = '21-09-2024';
    // const city = 'London';
    // const country = 'England';
    // const newCheckbox = ['Explore skyscrapers and modern architecture', 'Enjoy desert safari and camel riding', 'Visit cultural heritage sites and museums', "Nature and outdoors", 'Try water sports and activities', "sightseeing"];
    
    // const {from, to, city, country, checkbox} = props?.route?.params;
    // console.log({from, to, city, country, checkbox});

    // let newCheckbox =[];
    // checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});
    // getProgram('createProgram', from, to, city, country, newCheckbox)


    props.setProgram([...Object.values(prog.program)]);



  }, []);

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
  



  async function getProgram( method, from, to, city, country, newCheckbox){
    axios.post(`${address_function_api}`, 
      {from, to, city, country, newCheckbox, method}
    ).then((data)=>{
      if(data.data.type){
        const values = Object.values(data.data.data);
        props.setProgram([...values]);
      }else{
        props.addNotification("warning", "Unfortunately, we could not generate your program.")
      }       
    }).catch((err)=>{
      console.log(err);
    })
  }
  



  async function deleteDayFromProgram(index) {
    const response = await props.areYouSureDeleting();
    if (response) {
      props.setProgram((prev)=>{
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
        return [...updateDayProgram];
      })
    }
  }

  
  async function deleteAllProgram(){

    console.log('am apasat pe stergem tot programul');
    const response = await props.areYouSureDeleting();
    if (response) {
      props.navigation.navigate('Home')
      props.setProgram([]);

    }
  }


  function goToDailyProgram(obiect){
    // setModalVisible(obiect);
    props.navigation.navigate('DailyProgram', {data: obiect.data, index: obiect.index})
  
  }



  return (
    <ScrollView>

    
      <ModalDayProgram  modalVisible={modalVisible} setModalVisible={setModalVisible} areYouSureDeleting={props.areYouSureDeleting}
        addNotification={props.addNotification}  program={props.program} setProgram={props.setProgram}
      />

      {!props?.program.length ? 
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
            <Text onPress={()=>console.log('press on regenerate')} >Regenerate</Text>
            <Icon as={RepeatIcon} m="$2" w="$6" h="$6" />
          </HStack>

          <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

          <HStack alignItems="center">
            <Text onPress={()=>console.log('press on save')} >Save</Text>
            <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
          </HStack>
      </HStack>

      {props?.program?.map((ob, index)=>{
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
          <Link onPress={()=>{goToDailyProgram({isOpen:true, data: ob, index})}}>
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





    </ScrollView>
  )
}


export default Program

const styles = StyleSheet.create({
  container: {
    marginTop: 300
  }
})




// adaug buton de salvare sau respingere a excursiere






