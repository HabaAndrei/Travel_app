import { StyleSheet, View, ScrollView, Dimensions, Pressable, SafeAreaView } from 'react-native'
import {useState, useEffect} from 'react'
import {address_function_api, formatDateFromMilliseconds, removeItemFromAsyncStorage,
  addDataToAsyncStorage, multiSetFromAsyncStorage, getDataFromAsyncStorage,
  multiGetFromAsyncStorage, multiRemoveFromAsyncStorage} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, Text,
  Divider, HStack, TrashIcon,RepeatIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import { useIsFocused } from '@react-navigation/native';
import {FirebaseFirestore} from '../firebase.js';
import axios from 'axios';
import NavbarProgram from '../Components/NavbarProgram.js';

const Program = (props) => {

  // createProgram => creez date din azure
  // getProgramAsync => iau date din async storage
  // keepProgram => pastram programul din useState

  const isFocused = useIsFocused();
  const [program, setProgram] = useState([]);
  const [isRecomandation, setRecomandation] = useState(false);

  const firebaseFirestore = new FirebaseFirestore();
  const screenHeight = Dimensions.get('window').height;


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
      createProgramAi('createProgram', from, to, city, country, locations);
    }


  }, [isFocused]);



  async function getProgramFromAsyncStorage(){
    const program = await getDataFromAsyncStorage("travelProgram");
    if(!program.isResolve){
      props.addNotification("error", "Unfortunately, we got an system error")
    }
    if(program?.data?.length){
      setProgram([...program.data])
    }else{
      setRecomandation(true);
    }
  }



  async function regenerateProgram(){

    const rez = await getDataFromAsyncStorage("travelParameter");
    if(!rez.isResolve)return
    let {method, from, to, city, country, locations} = rez.data;
    setProgram([]);
    createProgramAi( method, from, to, city, country, locations)
  }



  async function createProgramAi(method, from, to, city, country, locations){
    setRecomandation(false);
    setProgram([]);
    axios.post(`${address_function_api}`,
      {method, from, to, city, country, locations}
    ).then((data)=>{

      if(data.data.isResolve){
        const values = Object.values(data.data.data);
        setProgram([...values]);
        multiSetFromAsyncStorage([['travelProgram', [...values]],
          ["travelParameter", {method, from, to, city, country, locations}]]);
      }else{
        console.log("eroare la functia getProgram ", data.data);
        props.addNotification("warning", "Unfortunately, we could not generate your program.")
      }
    }).catch((err)=>{
      firebaseFirestore.storeErr(err.message)
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
      if(!rez.isResolve)return;
      setProgram([]);
      setRecomandation(true)
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
    if(!rez.isResolve){
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
    const rezAddInDb = await firebaseFirestore.addProgramIntoDb(city, country, from , to, programDaysString, uid)
    if(!rezAddInDb.isResolve){
      props.addNotification("error", "Unfortunately we could not save the program for you")
      console.log(rezAddInDb.err);
      return;
    }

    const rezDeleteAsyncStorage = await multiRemoveFromAsyncStorage(["travelProgram", "travelParameter"])
    if(!rezDeleteAsyncStorage.isResolve)return;
    setProgram([]);
    setRecomandation(true);
    props.navigation.navigate('MyTrips');
  }


  return (
    <SafeAreaView style={{flex: 1}}>

      <ScrollView style={{flex:1}}>

        <NavbarProgram name={props.route.name} navigation={props.navigation} />

        {isRecomandation ?
          <View style={styles.indicationView}>
            <Text style={styles.indicationText}>
              The program is generated after you select the desired locations (from step 2) and want it to create the schedule for you.
            </Text>
          </View>
          :
          <ScrollView>
            {!program?.length ?
              <View  style={{ marginTop: screenHeight / 3 }} >
                <Center  >
                  <Spinner color="$indigo600" />
                </Center>
              </View> :

              <View>

                <Center>
                  <Heading>
                    The generated program
                  </Heading>
                </Center>

                {program?.map((ob, index)=>{
                  return  <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={400} m="$3">
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="$sm"  fontStyle="normal"  fontFamily="$heading"  fontWeight="$normal"  lineHeight="$sm"  mb="$2"  sx={{  color: "$textLight700" }} >
                        {'Day' + ob.day + " | " } {new Date(ob.date).toString().slice(0, 15)}
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

                <HStack h="$10" justifyContent="center" alignItems="center">
                  <HStack alignItems="center"  >
                    <Text bold={true} onPress={()=>{deleteAllProgram()}} >Delete</Text>
                    <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
                  </HStack>

                  <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$emerald500"  h={25}  $dark-bg="$emerald400" />

                  <HStack alignItems="center">
                    <Text bold={true} onPress={()=>regenerateProgram()} >Regenerate</Text>
                    <Icon as={RepeatIcon} m="$2" w="$6" h="$6" />
                  </HStack>

                  <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

                  <HStack alignItems="center">
                    <Text bold={true} onPress={()=>saveProgramInDb()} >Save</Text>
                    <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
                  </HStack>
                </HStack>

              </View>
            }
          </ScrollView>
        }

      </ScrollView>

    </SafeAreaView>
  )
}


export default Program

const styles = StyleSheet.create({
  indicationView: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  indicationText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
})







