import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Center } from 'react-native';
import { Card, Pressable, Heading, ScrollView } from '@gluestack-ui/themed';
import SearchDestination from '../Components/SearchDestination';
import Calendar from '../Components/Calendar';
import {formatDateFromMilliseconds} from '../diverse';
import CheckboxActivities from '../Components/CheckboxActivities';

const Home = (props) => {


  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePickerVisibility, setDatePickerVisibility] = useState({type: false, date:''});
  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});
  const [checkbox, setCheckbox] = useState([]);


  useEffect(()=>{
    if(!dataDestination.country)return;
    if(checkbox.length)setCheckbox([]);
  }, [dataDestination]);




  function verifyDestinationRequest(){
    if(!dateFrom || !dateTo){
      props.addNotification("warning", "Please choose the start and end date of the trip."); 
      return false
    }
    if((new Date(dateTo)).getTime() < (new Date(dateFrom)).getTime()){
      props.addNotification("warning", "Please choose the start date to be smaller than the end date."); 
      return false
    }
    if(!dataDestination.city || !dataDestination.country){
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
      return false;
    }
    return true;
  }

  
  function goToProgramPage(){
    // if(!verifyDestinationRequest())return;
    // props.navigation.navigate('Program', {type: 'createProgram' ,from: formatDateFromMilliseconds(dateFrom), to: formatDateFromMilliseconds(dateTo), 
    //   city: dataDestination.city, country: dataDestination.country, checkbox})

    ///////////////////////////////////////////////////////////
    const from = '25-09-2024';
    const to = '26-09-2024';
    const city = 'Paris';
    const country = 'France';
    const activities =  [
      { category: "Cultural exploration", selected: true },
      { category: "Historical tours", selected: true },
      { category: "Outdoor activities", selected: true },
    ]

    props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' ,from, to,  country, city, checkbox: activities})

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
    <ScrollView  >

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
      

      <CheckboxActivities dataDestination={dataDestination} 
        checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
        checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
      /> 


      <View style={{alignItems: 'center'}}>
        <Card  style={styles.shadow} size="md" variant="elevated" m="$3" maxWidth={400} >
          <View style={styles.row}>
            <View style={styles.buttonContainer}>
              {dateFrom ? (
                <Text style={styles.centeredBoldText}>
                  From {formatDateFromMilliseconds(dateFrom)}
                </Text>
              ) : (
                <Text></Text>
              )}
              <Calendar
                how={"from"}
                showDatePicker={() =>
                  setDatePickerVisibility({ type: true, data: "from", func: setDateFrom })
                }
                datePickerVisibility={datePickerVisibility}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            </View>

            <View style={styles.buttonContainer}>
              {dateTo ? (
                <Text style={styles.centeredBoldText}>
                  To {formatDateFromMilliseconds(dateTo)}
                </Text>
              ) : (
                <Text></Text>
              )}
              <Calendar
                how={"to"}
                showDatePicker={() =>
                  setDatePickerVisibility({ type: true, data: "to", func: setDateTo })
                }
                datePickerVisibility={datePickerVisibility}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            </View>
          </View>
        </Card>
      </View>



      <View style={styles.buttonGo} >
        <Pressable  style={styles.buttonGoPressAc}
          onPress={goToProgramPage}> 
          <Text style={styles.text}>Create program</Text>
        </Pressable>
      </View>

    </ScrollView>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  centeredBoldText: {
    fontWeight: 'bold',
    marginBottom: 8, 
  },

});

export default Home;
