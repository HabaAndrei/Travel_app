import { useState, useReducer } from 'react';
import { StyleSheet, SafeAreaView, } from 'react-native';
import { Card, CheckIcon, ArrowRightIcon, Heading, ScrollView, Center} from '@gluestack-ui/themed';
import SearchDestination from '../Components/SetupTripsComponents/SearchDestination.js';
import CheckboxActivities from '../Components/SetupTripsComponents/CheckboxActivities.js';
import NavbarProgram from '../Components/NavbarProgram.js';
import CustomButton from '../CustomElements/CustomButton.js';
import { verifyFreeTier } from '../diverse.js';

/** SetupTrip screen => where client inputs the initial elements to create locations */
const SetupTrip = (props) => {

  const [isLocalPlaces, setLocalPlaces] = useState('false');
  const [destinationActivities, destinationActivitiesDispatch] = useReducer(destinationActivitiesReducer, {
    city: '',
    country: '',
    isOpenModalActivities: false,
    checkbox: [],
    customActivity: '',
    scaleVisit: ''
  })
  function destinationActivitiesReducer(state, action){
    const { type, payload } = action;
    switch (type) {
      case 'openModalActivities': {
        return {...state, isOpenModalActivities: true }
      }
      case 'closeModalActivities': {
        return {...state, isOpenModalActivities: false }
      }
      case 'setCountry': {
        return {...state, country: payload, city: ''}
      }
      case 'setCity': {
        return {...state, city: payload}
      }
      case 'setCheckbox': {
        return {...state, checkbox: payload}
      }
      case 'setCustomActivity': {
        return {...state, customActivity: payload}
      }
      case 'setScaleVisit': {
        return {...state, scaleVisit: payload}
      }
      default:
        return state;
    }
  }


  function verifyDestinationRequest(){
    if(!destinationActivities.city || !destinationActivities.country){
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
      return false;
    }
    const isSelect = destinationActivities.checkbox?.find((ob)=>ob.selected === true);
    const wordWithoutSpace = destinationActivities.customActivity?.replaceAll(' ', '');
    if(!isSelect && !wordWithoutSpace.length){
      props.addNotification("warning", "To go further, you must choose at least one activity, write what you want to visit in the input");
      return false;
    }
    return true;
  }

  async function goToProgramPage(){
    if(!verifyDestinationRequest())return;

    // Verify if a user who is not logged in still has access to the free tier
    if (!props.user?.userDetails?.email_verified) {
      const verificationFreeTier = await verifyFreeTier();
      // If the user no longer has access to the free tier, redirect them to log in
      if (!verificationFreeTier.continue) {
        props.navigation.navigate('LogIn');
        return;
      }
    }
    const selectedActivities = destinationActivities.checkbox
      .filter(ob => ob.selected)
      .map(ob => ob.category);

    const {country, city, scaleVisit, customActivity } = destinationActivities;
    props.navigation.navigate('Locations', {
      country, city, isLocalPlaces, scaleVisit, selectedActivities, customActivity,
      type: 'getAllDataAboutLocations',
    })
  }

  function closeCheckbox(){
    destinationActivitiesDispatch({type: 'closeModalActivities'});
  }

  function openModalActivities(){
    if(destinationActivities.city && destinationActivities.country){
      destinationActivitiesDispatch({type: 'openModalActivities'});
    }else{
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
    }
  }

  return (
    <SafeAreaView style={{flex: 1}} >

      <ScrollView  >

        <NavbarProgram name={props.route.name} navigation={props.navigation} />

        <Center>
          <Heading>Plan your next trip</Heading>
        </Center>

        <Card p="$5" borderRadius="$lg"  m="$3" maxWidth={400} style={styles.shadow}>
          <Heading size="md" fontFamily="$heading" mb="$4">
            Search your destination
          </Heading>
          <SearchDestination
            destinationActivitiesDispatch={destinationActivitiesDispatch}
            destinationActivities={destinationActivities}
            addNotification={props.addNotification}
          />
        </Card>

        <CheckboxActivities
          destinationActivitiesDispatch={destinationActivitiesDispatch}
          destinationActivities={destinationActivities}
          closeCheckbox={closeCheckbox}
          addNotification={props.addNotification}
          isLocalPlaces={isLocalPlaces}
          setLocalPlaces={setLocalPlaces}
        />

        <CustomButton name={'Choose Activities'} icon={CheckIcon} func={openModalActivities} />

        <CustomButton name={'Continue to see locations'} icon={ArrowRightIcon} func={goToProgramPage} />

      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});


export default SetupTrip;
