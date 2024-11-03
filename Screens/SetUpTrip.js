import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { Card, Pressable, Heading, ScrollView} from '@gluestack-ui/themed';
import SearchDestination from '../Components/SearchDestination';
import CheckboxActivities from '../Components/CheckboxActivities';
import NavbarProgram from '../Components/NavbarProgram';
import CardSetUpActivities from '../Components/CardSetUpActivities.js';

const SetUpTrip = (props) => {

  
  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});
  const [checkbox, setCheckbox] = useState([]);

  useEffect(()=>{
    if(!dataDestination.country)return;
    if(checkbox.length)setCheckbox([]);
  }, [dataDestination]);


  function verifyDestinationRequest(){
    if(!dataDestination.city || !dataDestination.country){
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
      return false;
    }
    return true;
  }

  
  function goToProgramPage(){
    // if(!verifyDestinationRequest())return;
    // props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' , 
    //   country: dataDestination.country, city: dataDestination.city, checkbox})

    ///////////////////////////////////////////////////////////
    const city = 'Paris';
    const country = 'France';
    const activities = [
      { category: "Cultural exploration", selected: true },
      { category: "Historical tours", selected: true },
      { category: "Outdoor activities", selected: true },
    ]

    props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' ,country, city, checkbox: activities})

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

        <View style={styles.buttonGo} >
          <Pressable  style={styles.buttonGoPressAc}
            onPress={()=>openModalActivities()} > 
            <Text style={styles.text} >Choose activities</Text>
          </Pressable>
        </View>
        
        <CheckboxActivities 
          dataDestination={dataDestination} 
          checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
          checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
        /> 

        <CardSetUpActivities
         dataDestination={dataDestination} 
         checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
         checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
        />

        <View style={styles.buttonGo} >
          <Pressable  style={styles.buttonGoPressAc}
            onPress={goToProgramPage}> 
            <Text style={styles.text}>Create program</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  shadow:{
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonGoPressAc:{
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
  buttonGo: {
    marginTop: 30,
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },  
});

export default SetUpTrip;
