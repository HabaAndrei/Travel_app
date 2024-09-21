import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native'
import React, {useState, useEffect} from 'react'
import {address_function_program} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, HStack, Image, Icon } from "@gluestack-ui/themed";
import axios from 'axios';
import ModalDayProgram from '../Components/ModalDayProgram.js';

const Program = (props) => {

  // observation | create 

  const [modalVisible, setModalVisible] = useState({isOpen:false, data:{}});
  const [observation, setObservation] = useState('');
  const [program, setProgram] = useState([]);

  const prog = {
    program: {
    1: {
      day: 1,
      date: "20-09-2024",
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
        }
      ]
    },
    2: {
      day: 2,
      date: "21-09-2024",
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
    // 3:{
    //   day: 3,
    //   date: "22-09-2024",
    //   title: "Nature and Outdoors",
    //   activities: [
    //     {
    //       place: "Hyde Park",
    //       address: "Hyde Park, London, United Kingdom",
    //       description: "One of London's largest and most famous parks.",
    //       info: "Free entry.",
    //       link: "https://www.royalparks.org.uk/parks/hyde-park",
    //       time: "10:00"
    //     },
    //     {
    //       place: "Kew Gardens",
    //       address: "Royal Botanic Gardens, Kew, Richmond, Surrey, TW9 3AE, United Kingdom",
    //       description: "A botanical garden with the largest and most diverse botanical collections in the world.",
    //       info: "Tickets can be purchased online or at the venue.",
    //       link: "https://www.kew.org/",
    //       time: "13:00"
    //     }
    //   ]
    // },
    // 4:{
    //   day: 4,
    //   date: "23-09-2024",
    //   title: "Water Sports and Activities",
    //   activities: [
    //     {
    //       place: "WakeUp Docklands",
    //       address: "Royal Victoria Beach, Western Gateway, Royal Docks, London E16 1FA, United Kingdom",
    //       description: "A water sports center offering activities like wakeboarding and paddleboarding.",
    //       info: "Tickets can be purchased online or at the venue.",
    //       link: "https://wakeupdocklands.com/",
    //       time: "10:00"
    //     },
    //     {
    //       place: "Lee Valley White Water Centre",
    //       address: "Station Road, Waltham Cross, Hertfordshire, EN9 1AB, United Kingdom",
    //       description: "An outdoor center offering white water rafting and kayaking.",
    //       info: "Tickets can be purchased online or at the venue.",
    //       link: "https://www.visitleevalley.org.uk/en/content/cms/outdoors/white-water-centre/",
    //       time: "13:00"
    //     }
    //   ]
    // },
    // 5:{
    //   day: 5,
    //   date: "24-09-2024",
    //   title: "Sightseeing",
    //   activities: [
    //     {
    //       place: "Buckingham Palace",
    //       address: "Westminster, London SW1A 1AA, United Kingdom",
    //       description: "The London residence and administrative headquarters of the monarch of the United Kingdom.",
    //       info: "Tickets can be purchased online or at the venue. Note that it is open to the public only during certain times of the year.",
    //       link: "https://www.rct.uk/visit/the-state-rooms-buckingham-palace",
    //       time: "10:00"
    //     },
    //     {
    //       place: "London Eye",
    //       address: "Riverside Building, County Hall, London SE1 7PB, United Kingdom",
    //       description: "A large observation wheel on the South Bank of the River Thames in London.",
    //       info: "Tickets can be purchased online or at the venue.",
    //       link: "https://www.londoneye.com/",
    //       time: "13:00"
    //     }
    //   ]
    // }
  }};
  
  async function getProgramWithObservation(method, actualProgram, observation){
    let obNou = {};
    actualProgram.forEach((ob, index)=>{
      obNou[index + 1] = ob;
    });
    const objectProgram = {"program" : obNou};
    axios.post(`${address_function_program}`, {method, program: objectProgram, observation}).then((data)=>{
      console.log(data.data)
    }).catch((err)=>{
      console.log(err);
    })

  }


  async function getProgram( method, from, to, city, country, newCheckbox){
    axios.post(`${address_function_program}`, 
      {from, to, city, country, newCheckbox, method}
    ).then((data)=>{
      if(data.data.type){
        const values = Object.values(data.data.data);
        setProgram([...values]);
      }else{
        props.addNotification("warning", "Unfortunately, we could not generate your program.")
      }       
    }).catch((err)=>{
      console.log(err);
    })
  }
  

  setTimeout(() => {
    getProgramWithObservation("observation", program, "I want you to chenge the start day trip to 31-12-2023")

  }, 4000);

    
  useEffect(()=>{
    const from = '20-09-2024';
    const to = '21-09-2024';
    const city = 'London';
    const country = 'England';
    const newCheckbox = ['Explore skyscrapers and modern architecture', 'Enjoy desert safari and camel riding', 'Visit cultural heritage sites and museums', "Nature and outdoors", 'Try water sports and activities', "sightseeing"];

    // const {from, to, city, country, checkbox} = props.route.params;
    // console.log({from, to, city, country, checkbox});

    // let newCheckbox =[];
    // checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});

    setProgram([...Object.values(prog.program)]);


    // getProgram('create', from, to, city, country, newCheckbox)

  
  }, []);



  return (
    <ScrollView  >


      <ModalDayProgram  modalVisible={modalVisible} setModalVisible={setModalVisible} />

      {!program.length ? 
      <View style={styles.container} >
        <Center  >
          <Spinner color="$indigo600" />
        </Center>
      </View> :

      <View> 
      {program.map((ob, index)=>{

        return  <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={360} m="$3">

          <Text fontSize="$sm"  fontStyle="normal"  fontFamily="$heading"  fontWeight="$normal"  lineHeight="$sm"  mb="$2"
            sx={{
                color: "$textLight700",
                _dark: {
                color: "$textDark200",
                },
            }}
          >
            {'Day' + ob.day + " | " } {ob.date}  
          </Text>
          <Heading size="md" fontFamily="$heading" mb="$4">
            {ob.title}
          </Heading>
          <Link onPress={()=>{setModalVisible({isOpen:true, data: ob})}}>
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



      <View style={styles.viewInputObservation} >
        <TextInput  style={styles.inputObseravation}
          multiline
          onChangeText={(text) => setObservation(text)}
          value={observation}
        />
      </View>
    </ScrollView>
  )
}

export default Program

const styles = StyleSheet.create({
 
  viewInputObservation: {
    margin:20
  },
  inputObseravation: {
    height: 100, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 10, 
    textAlignVertical: 'top', 
    backgroundColor: '#f9f9f9'
  },
  container: {
    marginTop: 300
  }
})




// adaug buton de salvare sau respingere a excursiere
// adaug buton de comentariu si sa incerce utilizatorul sa isi modifice excursia





// Despre program: 

// De bine:
// imi da bine structurate pentru zona si timp 
// mi le imparte bine pe zile



// De rau:
// daca are o locatie mica nu poate sa imi dea activitati pentru toata perioada
// Mi-a dat activitati bune insa mi-a combinat cu orasul pe care l-am dat ca si exemplu in prompt
// imi da link care nu merg 


// Intrebari: 
// Unde as putea sa adaug butonul acceptare sau refuzare a calatoriei 
// Text input car eridica si tastarura dar si inputul 
