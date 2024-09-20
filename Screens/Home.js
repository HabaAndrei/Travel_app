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


  function verifyDestinationRequest(){
    if(!dateFrom || !dateTo){props.addNotification("warning", "Please choose the start and end date of the trip."); return false}
    if((new Date(dateTo)).getTime() < (new Date(dateFrom)).getTime()){props.addNotification("warning", "Please choose the start date to be smaller than the end date."); return false}
    if(!checkBoxActivities.city || !checkBoxActivities.country){props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");return false;}
    return true;
  }

  function goToProgramPage(){
    if(!verifyDestinationRequest())return;
    props.navigation.navigate('Program', {from: formatDateFromMilliseconds(dateFrom), to: formatDateFromMilliseconds(dateTo), 
      city: checkBoxActivities.city, country: checkBoxActivities.country, checkbox})
  }

  function closeCheckbox(){
    setCheckBoxActivities((prev)=>{return {...prev, isOpen:false}})
  }
  

  
  return (
    <ScrollView  >

      <Card p="$5" borderRadius="$lg"  m="$3" style={styles.shadow}>
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
          onPress={()=>{setCheckBoxActivities((prev)=>{return{...prev, isOpen:true}})}} > 
          <Text style={styles.text} >Choose activities</Text>
        </Pressable>
      </View>
      

      <CheckboxActivities
        checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
        checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
      /> 


      <View style={{alignItems: 'center'}}>
        <Card  style={styles.shadow} size="md" variant="elevated" m="$3"  >
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
