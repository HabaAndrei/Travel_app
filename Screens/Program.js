import { StyleSheet, View, ScrollView, Dimensions, SafeAreaView } from 'react-native'
import {useState, useEffect, useRef} from 'react'
import { formatDateFromMilliseconds, removeItemFromAsyncStorage,
  addDataToAsyncStorage, multiSetFromAsyncStorage, getDataFromAsyncStorage,
  multiGetFromAsyncStorage, multiRemoveFromAsyncStorage} from '../diverse.js';
import { Spinner, Center, Heading, Text, Divider, HStack, TrashIcon,RepeatIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import { useIsFocused } from '@react-navigation/native';
import {FirebaseFirestore} from '../Firebase.js';
import axios from 'axios';
import NavbarProgram from '../Components/NavbarProgram.js';
import CardPresentationTrip from '../Components/CardPresentationTrip.js';
import InputHotelAddress from '../Components/ProgramComponents/InputHotelAddress.js';
import { EnvConfig } from '../providers/EnvConfig.js';

/** Program screen => where the client can see the generated program */
const Program = (props) => {

  // createProgram => create a program
  // getProgramAsync => get data from async storage
  // keepProgram => retain the program from useState

  const isFocused = useIsFocused();
  const [program, setProgram] = useState([]);
  const [isRecomandation, setRecomandation] = useState(false);
  const [hotelAddress, setHotelAddress] = useState('');
  const isSavingProgram = useRef(false);

  const firebaseFirestore = new FirebaseFirestore();
  const screenHeight = Dimensions.get('window').height;

  useEffect(()=>{
    if (!isFocused) return

    if(!props?.route?.params?.type || props?.route?.params?.type === "getProgramAsync"){
      getProgramFromAsyncStorage();
      return;
    };

    if (props?.route?.params?.type === "keepProgram") return;

    const {startDate, endDate, city, country, urlImageCity} = props?.route?.params?.locationParam || {};
    const {locations, type, hotelAddress} = props?.route?.params || {};

    if(type === "createProgram"){
      createProgramAi({startDate, endDate, city, country, locations, urlImageCity, hotelAddress});
      setHotelAddress(hotelAddress)
    }
  }, [isFocused]);

  async function getProgramFromAsyncStorage(){
    const rez = await multiGetFromAsyncStorage(["travelProgram", "travelParameter"]);
    if(!rez.isResolved){
      props.addNotification("error", "Unfortunately, we encountered a system error")
      return;
    }

    const travelProgram =   JSON.parse(rez.data[0][1]);
    const travelParameter = JSON.parse(rez.data[1][1]);
    const address = travelParameter?.hotelAddress;

    if(travelProgram?.length){
      setProgram([...travelProgram]);
      setHotelAddress(address);
    }else{
      setRecomandation(true);
    }
  }

  async function regenerateProgram(){
    const rez = await getDataFromAsyncStorage("travelParameter");
    if(!rez.isResolved)return
    let {startDate, endDate, city, country, locations, urlImageCity, hotelAddress} = rez.data;
    setProgram([]);
    createProgramAi({startDate, endDate, city, country, locations, urlImageCity, hotelAddress})
  }

  async function createProgramAi({startDate, endDate, city, country, locations, urlImageCity, hotelAddress}){
    setRecomandation(false);
    setProgram([]);
    axios.post(EnvConfig.getInstance().get('address_function_ai_generation'),
      {generationType: 'generateProgram', startDate, endDate, city, country, locations, hotelAddress}
    ).then((data)=>{
      if(data.data.isResolved){
        const days = data.data.data;
        setProgram([...days]);
        multiSetFromAsyncStorage([['travelProgram', [...days]],
          ["travelParameter", {startDate, endDate, city, country, locations, urlImageCity, hotelAddress}]]);
      }else{
        console.log("Error in getProgram function ", data.data);
        props.addNotification("warning", "Unfortunately, we could not generate your program.")
      }
    }).catch((err)=>{
      firebaseFirestore.storeErr(err.message)
      props.addNotification("error", "Unfortunately, we could not generate the program")
      console.log('Error from getProgram',err);
    })
  }

  async function deleteDayFromProgram(index) {
    const response = await props.areYouSure();
    if (!response) return;
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

  async function deleteAllProgram(){
    const response = await props.areYouSure();
    if (response) {
      const rez = await removeItemFromAsyncStorage('travelProgram');
      if(!rez.isResolved)return;
      setProgram([]);
      setRecomandation(true)
    }
  }

  function goToDailyProgram(obiect){
    props.navigation.navigate('DailyProgram', {data: obiect.data, index: obiect.index})
  }

  async function saveProgramInDb(){
    if ( isSavingProgram.current ) return;
    isSavingProgram.current = true;
    const rez = await multiGetFromAsyncStorage(["travelProgram", "travelParameter"]);
    if(!rez.isResolved){
      props.addNotification("error", "Unfortunately, we could not save the program for you")
      console.log(rez.err);
      isSavingProgram.current = false;
      return;
    }

    const travelProgram =   JSON.parse(rez.data[0][1]);
    const travelParameter = JSON.parse(rez.data[1][1]);
    const {city, country, urlImageCity, hotelAddress } = travelParameter;
    const startDate = travelProgram[0].date;
    const endDate = travelProgram[travelProgram.length - 1].date;
    const programDaysString = JSON.stringify(travelProgram);
    const uid = props.user.uid;
    const rezAddInDb = await firebaseFirestore.addIntoDatabase({
      database: 'programs',
      id: false,
      columnsWithValues: {
        city, country, startDate, endDate, programDaysString, uid, urlImageCity, hotelAddress
      }
    })
    if(!rezAddInDb.isResolved){
      props.addNotification("error", "Unfortunately, we could not save the program for you")
      console.log(rezAddInDb.err);
      isSavingProgram.current = false;
      return;
    }

    const rezDeleteAsyncStorage = await multiRemoveFromAsyncStorage(["travelProgram", "travelParameter"])
    if (!rezDeleteAsyncStorage.isResolved) {
      isSavingProgram.current = false;
      return;
    }
    setProgram([]);
    setRecomandation(true);
    isSavingProgram.current = false;
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
                  <Spinner size="large" color="blue" />
                </Center>
              </View> :

              <View>

                <InputHotelAddress
                  hotelAddress={hotelAddress}
                  setHotelAddress={setHotelAddress}
                />

                <Center>
                  <Heading>
                    The generated program
                  </Heading>
                </Center>

                {program.map((day, index)=>(
                  <CardPresentationTrip
                    key={index}
                    index={index}
                    textDate={`Day ${day.day}  |  ${new Date(day.date).toString().slice(0, 15)}`}
                    deleteFunction={deleteDayFromProgram}
                    deleteFunctionParameters={[index]}
                    title={day.title}
                    functionRedirect={goToDailyProgram}
                    functionRedirectParameters={[{data: day, index}]}
                    nameRedirect={'See full day'}
                  />
                ))}

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







