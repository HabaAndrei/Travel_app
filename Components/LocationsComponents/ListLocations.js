import { View, ScrollView, Dimensions, StyleSheet, TextInput } from 'react-native'
import { Heading, Center, Text, Spinner } from '@gluestack-ui/themed';
import { getDataFromAsyncStorage, addDataToAsyncStorage, formatDateFromMilliseconds} from '../../diverse';
import { useState } from 'react';
import CardDatePicker from './CardDatePicker.js';
import LocationCard from './LocationCard.js';
import NavigationDivider from '../NavigationDivider.js';

/** Component that represents a list of locations that can be picked to visit */
const ListLocations = (props) => {

  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [hotelAddress, setHotelAddress] = useState('');

  const screenHeight = Dimensions.get('window').height;

  // When you press on a location, you can select or deselect it
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

  // This function verifies the existence of all parameters needed to create the program
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

  // Store data in async storage and redirect to the program screen
  async function goToCreateProgram(){
    // Uncomment this in production ==>>>
    // if(!verifyDestinationRequest())return;

    // Uncomment this in production <<<<=======
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    addDataToAsyncStorage('arrayLocationsToTravel', props.locations)
    const newLocationReference = JSON.parse(JSON.stringify(props.locations));
    // get only the selected location
    const selectedLocations = [...newLocationReference].filter((place)=>place.selected);
    if(!selectedLocations.length){
      props.addNotification('warning', 'You do not have any location selected to make the trip');
      return;
    }
    // for each selected location create time to stay to visit that location
    const data = [...selectedLocations].map((ob)=>{
      // if the packages doesn t exist send return the ob as it is
      const {dataTimeLocation} = ob;
      if(!dataTimeLocation)return ob;
      const {packages} = dataTimeLocation;
      if(!packages || !packages.length)return ob;
      let hours = 0;
      // sum the time for every slected packages
      const selectedPackeges = packages.filter((ob)=>{
        if (!ob.selected) return false;
        hours += ob?.average_visiting_hours || 0;
        return true;
      })
      // if the sum (hours) is biger than 0 put the time in object
      if (hours > 0) ob.dataTimeLocation.average_hours_visiting_full_location = hours;
      // edit the object only with selected packages
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
    // Make the change here in production =>>>>>>>>>>

    // locationParam.startDate = formatDateFromMilliseconds(dateFrom);
    // locationParam.endDate = formatDateFromMilliseconds(dateTo)
    locationParam.startDate = formatDateFromMilliseconds(1707602400000);
    locationParam.endDate = formatDateFromMilliseconds(1718053200000)
    props.navigation.navigate('Program', {type: 'createProgram', locations: data, locationParam, hotelAddress});

    // Make the change here in production <<<<<<<<<<===========
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

  }

  // Select or deselect the packages
  function selectPackage(indexLocation, indexPackage){
    try{
      props.setLocations((prev)=>{
        const selected = prev[indexLocation].dataTimeLocation.packages[indexPackage].selected
        prev[indexLocation].dataTimeLocation.packages[indexPackage].selected = !selected;
        return [...prev];
      })
    }catch{
      props.addNotification('error', 'There was a problem selecting the package');
    }
  }

  return (
  <ScrollView>

    {!props.locations?.length ? (
      <View style={{ marginTop: screenHeight / 3, }}>
        <Center  >
          <Spinner size="large" color="blue" bg="rgba(0, 0, 0, 0.43)" />
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

        <NavigationDivider
         firstFunction={pressOnCancel}
         firstFunctionName={'Go back'}
         secondFunction={goToCreateProgram}
         secondFunctionName={'Create program'}
        />

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