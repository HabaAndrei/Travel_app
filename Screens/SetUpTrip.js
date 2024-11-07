import React, {useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, } from 'react-native';
import { Card, Icon, CheckIcon, ArrowRightIcon, Heading, ScrollView, Button} from '@gluestack-ui/themed';
import SearchDestination from '../Components/SearchDestination';
import CheckboxActivities from '../Components/CheckboxActivities';
import NavbarProgram from '../Components/NavbarProgram';

const SetUpTrip = (props) => {

  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  const [dataDestination, setDataDestination] = useState({country: 'France', city: 'Paris'});
  const [checkbox, setCheckbox] = useState([]);
  const [inputActivity, setInputActivity] = useState('');


  function verifyDestinationRequest(){
    if(!dataDestination.city || !dataDestination.country){
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
      return false;
    }
    console.log('sa adaug ce am zis eu');
    // aici sa adaug sa fie ceva in input sa niste elemenet selectate din checkbox
    return true;
  }

  
  function goToProgramPage(){
    if(!verifyDestinationRequest())return;
    props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' , 
      country: dataDestination.country, city: dataDestination.city, checkbox})

    ///////////////////////////////////////////////////////////
    // const city = 'Paris';
    // const country = 'France';
    // const activities = [
    //   { category: "Cultural exploration", selected: true },
    //   { category: "Historical tours", selected: true },
    //   { category: "Outdoor activities", selected: true },
    // ]

    // props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' ,country, city, checkbox: activities})

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

        <Card p="$5" borderRadius="$lg"  m="$3" maxWidth={400} style={styles.shadow}>
          <Heading size="md" fontFamily="$heading" mb="$4">
            Where?
          </Heading>
          <SearchDestination
            setCheckBoxActivities={setCheckBoxActivities}  addNotification={props.addNotification}
            dataDestination={dataDestination} setDataDestination={setDataDestination}
          />
        </Card>
        
        <CheckboxActivities 
          inputActivity={inputActivity} setInputActivity={setInputActivity}
          dataDestination={dataDestination} 
          checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
          checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
        /> 

        <View style={styles.buttonContainer}>
          <Button style={[styles.button, styles.shadow]}
            onPress={openModalActivities}>
            <Text style={styles.buttonText}>Choose Activities</Text>
            <Icon as={CheckIcon} style={styles.icon} />
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          <Button style={[styles.button, styles.shadow]}
            onPress={goToProgramPage}>
            <Text style={styles.buttonText}>Continue to see locations</Text>
            <Icon as={ArrowRightIcon} style={styles.icon} />
          </Button>
        </View>


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
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 180,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    color: 'white',
    marginRight: 8,
    marginLeft: 3
  },
});


export default SetUpTrip;
