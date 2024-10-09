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


  const locationsUp = [
    {
      name: "The Louvre Museum",
      address: "75001 Paris, Franța",
      place_id: "ChIJD3uTd9hx5kcR1IQvGfr8dbk",
      selected: true,
      urlLocation: "https://maps.google.com/?cid=13363865620386383060",
      website: "https://www.louvre.fr/",
      arrayProgramPlace: [
        "Monday: 9:00 AM – 6:00 PM",
        "Tuesday: Closed",
        "Wednesday: 9:00 AM – 9:00 PM",
        "Thursday: 9:00 AM – 6:00 PM",
        "Friday: 9:00 AM – 9:00 PM",
        "Saturday: 9:00 AM – 6:00 PM",
        "Sunday: 9:00 AM – 6:00 PM"
      ],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqEZBQsOWSQbmwD0hTnLgabUhTqLByZW33HYcyVJHMikqeNZPtbllfR1767KwRxdwYzPBb0g9pN-pUvETxvBtWMJWyW2vGUQyxk=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqHrGBb9mLUp7NNw2p4536bCpYV3PRvC52KxMytmiwhcgts4fmNLnzDpalRxZsWgwhL-aADT-fK45g8WmYDPSnFaQp7khGLVHuY=s1600-w1970",
      ]
    },
    {
      name: "Eiffel Tower",
      address: "Av. Gustave Eiffel, 75007 Paris, Franța",
      place_id: "ChIJLU7jZClu5kcR4PcOOO6p3I0",
      selected: true,
      urlLocation: "https://maps.google.com/?cid=10222232094831998944",
      website: "https://www.toureiffel.paris/fr",
      arrayProgramPlace: [
        "Monday: 9:00 AM – 12:00 AM",
        "Tuesday: 9:00 AM – 12:00 AM",
        "Wednesday: 9:00 AM – 12:00 AM",
        "Thursday: 9:00 AM – 12:00 AM",
        "Friday: 9:00 AM – 12:00 AM",
        "Saturday: 9:00 AM – 12:00 AM",
        "Sunday: 9:00 AM – 12:00 AM"
      ],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqH7VLb8DF2L93W-Df2qJWzPN1a2wC4zm698fmCI8fXibr6CE84bgtqwUbqB-2UbqVDhXayV7797Au-T9M7Jd3-Hx3nm7h8SwXQ=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqHkAzWYXf87zHMciS06s_2Y5a6rd49RGhI_7LtUkzEnJEC70mTqH6cei0SQCAU4ItumP8uGuAMiiZ-CKwfsigoFbhgw1Z4MIoo=s1600-w1200",
      ]
    },
    {
      name: "Notre-Dame Cathedral",
      address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, Franța",
      place_id: "ChIJATr1n-Fx5kcRjQb6q6cdQDY",
      selected: true,
      urlLocation: "https://maps.google.com/?cid=3909157082539624077",
      website: "https://www.notredamedeparis.fr/",
      arrayProgramPlace: [],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqEPWX4Nv7mO93Q3MnaDjCmjFF-gtWGBRws4rYuM18m_tmA9oD7mqF44nsG_AMJzL6rSaecKQDvycwbPOXOvvqFz5HaYZ5V-XA4=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqE0qec1mq4OlJXtHnCFCML6dt2tQG4PTfsENZ7hsxa-AMphIMlIh8iNiBts7CG2p6BaVe8opmf3RsywhyQUUzVji09G-GE88Dw=s1600-w998",
      ]
    },
    {
      address: "Montmartre, 75018 Paris, Franţa",
      arrayProgramPlace: [],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqHLC2-x8aKexAqP-bUI8rQUjFAO3xYAxlJxQ6xLpnNpwGF3ncreL9I3_0XFfp2GOsfZzK09gh__bN25VGaoO2F4bBGD6Euv1ag=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqFgn4rFmlAPYP5TVzonhkim0mTZTo44APZrQxdzBZX50kS5C-8vloMyGlYjm_upHKIF2KJYCjf3yydbK666hDNeQ3UOfF36Ryo=s1600-w3000"
      ],
      name: "Montmartre",
      place_id: "ChIJ1fXA1ERu5kcRcIbgA4VK1H0",
      selected: true,
      urlLocation: "https://maps.google.com/?q=Montmartre,+75018+Paris,+France&ftid=0x47e66e44d4c0f5d5:0x7dd44a8503e08670",
      website: ""
    },
    {
      address: "Place d'Armes, 78000 Versailles, Franța",
      arrayProgramPlace: [
        "Monday: Closed",
        "Tuesday: 9:00 AM – 6:30 PM",
        "Wednesday: 9:00 AM – 6:30 PM",
        "Thursday: 9:00 AM – 6:30 PM",
        "Friday: 9:00 AM – 6:30 PM",
        "Saturday: 9:00 AM – 6:30 PM",
        "Sunday: 9:00 AM – 6:30 PM"
      ],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqFg45byLl6k1OVu1_jTQnDZraX-ZhEcxSMXAXlb-Fi7AcexbIJrq3Vj2epO86Tg60h6J7onZDVo3AyWjSir8Qy3UuJEA49BtKo=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqHr3IOViA1c1SbAZh6LndAhMJpiJCzxiOr_ssd5FVt4c18UwRqffWRWuKjtPIqwt7YccQegQUzgPqVhXhQDnoZViaPxUzc2W0Y=s1600-w3000"
      ],
      name: "Palatul Versailles",
      place_id: "ChIJxRRWgBVu5kcR-JNrrCk0a6s",
      selected: false,
      urlLocation: "https://maps.google.com/?q=Place+d%27Armes,+78000+Versailles,+France&ftid=0x47e67b6be97ac27b:0x99bb5cb41ae1044c",
      website: "http://www.chateauversailles.fr/"
    },
    {
      address: "Rue de Rivoli, 75001 Paris, Franţa",
      arrayProgramPlace: [
        "Monday: 9:00 AM – 6:00 PM",
        "Tuesday: 9:00 AM – 6:00 PM",
        "Wednesday: Closed",
        "Thursday: 9:00 AM – 6:00 PM",
        "Friday: 9:00 AM – 6:00 PM",
        "Saturday: 9:00 AM – 6:00 PM",
        "Sunday: 9:00 AM – 6:00 PM"
      ],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqGo7FJccnpfKl_0CDrztuXY3FD4BAnPckNzOhB9xXY_KgVGcKe8u7ltgD4gYcWZFYg9whRLtPjWQGeWjVHJKaLbN2i_dOzvjXg=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqFcXJY0B12_tjCmlo8b8q9OBnF4zrMkRFw5ATYb9O8LO13MGcFwx9lZhP_bsmwWE9MAoOfm2eI5Vh0tBdDrTniNEytD7TUkEUk=s1600-w3000"
      ],
      name: "Luvru",
      place_id: "ChIJ2eUgeAKdwokRM8S6dBMsKCs",
      selected: false,
      urlLocation: "https://maps.google.com/?q=Rue+de+Rivoli,+75001+Paris,+France&ftid=0x47e671d877d3d2f1:0x214c0fcb9871d6b8",
      website: "https://www.louvre.fr/en"
    },
    {
      address: "5 Avenue Anatole, 75007 Paris, Franţa",
      arrayProgramPlace: [
        "Monday: 9:30 AM – 11:45 PM",
        "Tuesday: 9:30 AM – 11:45 PM",
        "Wednesday: 9:30 AM – 11:45 PM",
        "Thursday: 9:30 AM – 11:45 PM",
        "Friday: 9:30 AM – 11:45 PM",
        "Saturday: 9:30 AM – 11:45 PM",
        "Sunday: 9:30 AM – 11:45 PM"
      ],
      arrayWithLinkImages: [
        "https://lh3.googleusercontent.com/places/ANXAkqHRGIGukzmJ0n4SwXehyy7-f_JE7u1cO4CEVf5fOgV5bCUthdC0RmOIrWlyWxUeb8Lg8fT9A8j0ycj_VsFdqRmIkhEBHljw=s1600-w3000",
        "https://lh3.googleusercontent.com/places/ANXAkqFPxb8Z4ITSD4Ch4m8Zh4o9eTxklzkIeyyQFPY3dsj9nVoHgYeLntL1_SkRZFA7U2rUyqGmRyNMLMIyArfYkx8yOeNcCOdLBz8=s1600-w3000"
      ],
      name: "Turnul Eiffel",
      place_id: "ChIJLU7jZClu5kcR4PcOOO6p3I0",
      selected: true,
      urlLocation: "https://maps.google.com/?q=5+Avenue+Anatole,+75007+Paris,+France&ftid=0x47e66f9b15ecf1a3:0xc22ecfdc2e3f1f3",
      website: "https://www.toureiffel.paris/en"
    }
  ]


  const isFocused = useIsFocused();
  const [program, setProgram] = useState([]);
  const [buttonHomePage, setButtonHomePage] = useState(false);


  useEffect(()=>{


    if(!isFocused)return 
   

    if(!props?.route?.params?.type){
      getProgramFromAsyncStorage();
      return;
    };


    const {from, to, city, country, newCheckbox} = props?.route?.params?.locationParam;
    const {locations, type} = props?.route?.params;
    console.log(locations);
    if(props?.route?.params?.type === "keepProgram")return;

    if(type === "createProgram"){
      getProgram('createProgram', from, to, city, country, locations);
    }
    
    if( props?.route?.params?.type === "getProgramAsync"){
      getProgramFromAsyncStorage();
    }

  }, [isFocused]);



  async function getProgramFromAsyncStorage(){
    console.log('A intrat sa ia programul din async storage')
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
    let {method, from, to, city, country, newCheckbox} = rez.data;
    setProgram([]);
    getProgram( method, from, to, city, country, newCheckbox)

  }



  async function getProgram(method, from, to, city, country, locations){
    setButtonHomePage(false);
    setProgram([]);
    axios.post(`${address_function_api}`, 
      {method, from, to, city, country, locations}
    ).then((data)=>{

      console.log(data.data);
      // if(data.data.type){
      //   const values = Object.values(data.data.data);
      //   setProgram([...values]);
      //   multiSetFromAsyncStorage([['travelProgram', [...values]], 
      //     ["travelParameter", {method, from, to, city, country, newCheckbox}]]);
        
      // }else{
      //   console.log("eroare la functia getProgram ", data.data);
      //   props.addNotification("warning", "Unfortunately, we could not generate your program.")
      // }       
    }).catch((err)=>{
      props.addNotification("error", "Unfortunately, we could not generate program")
      console.log('eroare de la getProgram',err);
    })
  }

  
  // setTimeout(()=>{
  //   getProgram('createProgram', '25-10-2024', '28-10-2024', 'Paris', 'France', locationsUp )
  //   console.log('se executa!!')
  // }, 10000);  



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







