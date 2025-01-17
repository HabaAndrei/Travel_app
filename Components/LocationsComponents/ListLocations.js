import { View, ScrollView, Dimensions, StyleSheet, TextInput } from 'react-native'
import { HStack, Heading, Center, Text, Divider, Spinner, ArrowLeftIcon, CheckIcon, Icon } from '@gluestack-ui/themed';
import { getDataFromAsyncStorage, addDataToAsyncStorage, formatDateFromMilliseconds} from '../../diverse';
import { useState } from 'react';
import CardDatePicker from './CardDatePicker.js';
import LocationCard from './LocationCard.js';


const ListLocations = (props) => {

  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [hotelAddress, setHotelAddress] = useState('');

  const screenHeight = Dimensions.get('window').height;

  function pressOnLocations(index_){
    props.setLocations((prev)=>{
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
    props.navigation.navigate('SetupTrip');
  }

  function verifyDestinationRequest(){
    if(!dateFrom || !dateTo){
      props.addNotification("warning", "Please choose the start and end date of the trip.");
      return false
    }
    if((new Date(dateTo)).getTime() < (new Date(dateFrom)).getTime()){
      props.addNotification("warning", "Please choose the start date to be smaller than the end date.");
      return false
    }
    return true;
  }


  async function goToCreateProgram(){
    ////////////////////////////////////////////////////////////////
    // decomentez aceasta in prod ==>>>

    // if(!verifyDestinationRequest())return;

    // decomentez aceasta in prod  <<<<=======
    ////////////////////////////////////////////////////////////////
    addDataToAsyncStorage('arrayLocationsToTravel', props.locations)
    const newLocationReference = JSON.parse(JSON.stringify(props.locations));
    const selectedLocations = [...newLocationReference].filter((place)=>place.selected);
    if(!selectedLocations.length){
      props.addNotification('warning', 'You do not have any location selected to make the trip');
      return;
    }
    const data = [...selectedLocations].map((ob)=>{
      const {dataTimeLocation} = ob;
      if(!dataTimeLocation)return ob;
      const {packages} = dataTimeLocation;
      if(!packages || !packages.length)return ob;
      let hours = 0;
      const selectedPackeges = packages.filter((ob)=>{
        if (!ob.selected) return false;
        hours += ob?.average_visiting_hours || 0;
        return true;
      })

      if (hours > 0) ob.dataTimeLocation.average_hours_visiting_full_location = hours;

      ob.dataTimeLocation.packages = selectedPackeges;
      return ob;
    })

    const dataParam = await getDataFromAsyncStorage('locationsParameter');
    if(!dataParam.isResolved){
      props.addNotification('error', 'Error submitting for program search');
      return;
    }
    const locationParam = dataParam.data;
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // fac si aici schimbarea in pod =>>>>>>>>>>

    // locationParam.from = formatDateFromMilliseconds(dateFrom);
    // locationParam.to = formatDateFromMilliseconds(dateTo)
    locationParam.from = formatDateFromMilliseconds(1707602400000);
    locationParam.to = formatDateFromMilliseconds(1718053200000)
    props.navigation.navigate('Program', {type: 'createProgram', locations: data, locationParam, hotelAddress});

    // fac si aici schimbarea in pod <<<<<<<<<<===========
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

  }

  function selectPackage(indexLocation, indexPackage){
    try{
      props.setLocations((prev)=>{
        const selected = prev[indexLocation].dataTimeLocation.packages[indexPackage].selected
        prev[indexLocation].dataTimeLocation.packages[indexPackage].selected = !selected;
        return [...prev];
      })
    }catch(err){
      props.addNotification('error', 'There was a problem selecting the package');
    }
  }

  return (
  <ScrollView>

    {!props.locations?.length ? (
      <View style={{ marginTop: screenHeight / 3, }}>
        <Center  >
          <Spinner size="large" color="$indigo600" />
        </Center>
      </View>
    ) : (
      <View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hotel Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder='Write here your hotel address'
                value={hotelAddress}
                onChangeText={(text) => setHotelAddress(text)}
                style={styles.textInput}
                placeholderTextColor="gray"
              />
          </View>
        </View>

        <Center>
          <Heading size="md" fontFamily="$heading" mb="$4">
            Select the locations you would like to visit
          </Heading>
        </Center>

        {props.locations.map((location, index) =>(
          <LocationCard
            key={index}
            location={location}
            index={index}
            pressOnLocations={pressOnLocations}
            selectPackage={selectPackage}
          />)
        )}

        <CardDatePicker
          setDateTo={setDateTo} dateTo={dateTo}
          setDateFrom={setDateFrom} dateFrom={dateFrom}
        />

        <View>
          <HStack h="$10" justifyContent="center" alignItems="center">
            <HStack alignItems="center"  >
              <Icon as={ArrowLeftIcon} m="$2" w="$6" h="$6" />
              <Text bold={true} onPress={()=>pressOnCancel()} >Go back</Text>
            </HStack>

            <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

            <HStack alignItems="center">
              <Text bold={true} onPress={()=>goToCreateProgram()} >Create program</Text>
              <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
            </HStack>
          </HStack>
        </View>

      </View>
    )}

  </ScrollView>
  )
}

export default ListLocations;


const styles = StyleSheet.create({
  inputContainer: {
    margin: 15
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
});