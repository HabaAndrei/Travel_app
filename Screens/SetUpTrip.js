import {useState} from 'react';
import { StyleSheet, SafeAreaView, } from 'react-native';
import { Card, CheckIcon, ArrowRightIcon, Heading, ScrollView, Center} from '@gluestack-ui/themed';
import SearchDestination from '../Components/SetupTripsComponents/SearchDestination.js';
import CheckboxActivities from '../Components/SetupTripsComponents/CheckboxActivities.js';
import NavbarProgram from '../Components/NavbarProgram.js';
import CustomButton from '../CustomElements/CustomButton.js';

const SetupTrip = (props) => {

  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});
  const [checkbox, setCheckbox] = useState([]);
  const [inputActivity, setInputActivity] = useState('');
  const [isLocalPlaces, setLocalPlaces] = useState('false');
  const [scaleVisit, setScaleVisit] = useState('');

  function verifyDestinationRequest(){
    if(!dataDestination.city || !dataDestination.country){
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
      return false;
    }
    const isSelect = checkbox?.find((ob)=>ob.selected === true);
    const wordWithoutSpace = inputActivity?.replaceAll(' ', '');
    if(!isSelect && !wordWithoutSpace.length){
      props.addNotification("warning", "To go further, you must choose at least one activity, write what you want to visit in the input");
      return false;
    }
    return true;
  }


  function goToProgramPage(){

    ///////////////////////////////////////////////////
    // decomentez si sterg in prod =>>>>>>>>

    if(!verifyDestinationRequest())return;
    let newCheckbox = [];
    checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});

    props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' ,
      country: dataDestination.country, city: dataDestination.city, checkbox: newCheckbox, input: inputActivity, isLocalPlaces, scaleVisit})

    ///////////////////////////////////////////////////////////
    // const city = 'Paris';
    // const country = 'France';
    // const checkbox = ["History and heritage", "Museums and exhibitions"];
    // // const checkbox = [];
    // props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations', country, city, checkbox, input: inputActivity, isLocalPlaces})

    // decomentez si sterg in prod <<<<<<===========
    /////////////////////////////////////////////////////////////////////
  }

  function closeCheckbox(){
    setCheckBoxActivities((prev)=>{return {isOpen:false}})
  }


  function openModalActivities(){
    if(dataDestination.city && dataDestination.country){
      setCheckBoxActivities((prev)=>{return{isOpen:true}})
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
            setCheckBoxActivities={setCheckBoxActivities}  setCheckbox={setCheckbox}
            addNotification={props.addNotification}
            dataDestination={dataDestination} setDataDestination={setDataDestination}
          />
        </Card>

        <CheckboxActivities
          inputActivity={inputActivity} setInputActivity={setInputActivity}
          dataDestination={dataDestination} setScaleVisit={setScaleVisit}
          checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
          checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
          isLocalPlaces={isLocalPlaces} setLocalPlaces={setLocalPlaces}
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
