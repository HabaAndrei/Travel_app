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


  function goToProgramPage(){
    props.navigation.navigate('Program', {from: formatDateFromMilliseconds(dateFrom), to: formatDateFromMilliseconds(dateTo), 
      city: checkBoxActivities.city, country: checkBoxActivities.country, checkbox})
  }

  function closeCheckbox(){
    setCheckBoxActivities((prev)=>{return {...prev, isOpen:false}})
  }
  
  return (
    <ScrollView  >

      <Card p="$5" borderRadius="$lg"  m="$3">
        <Heading size="md" fontFamily="$heading" mb="$4">
          Where?
        </Heading>
        <SearchDestination
          setCheckBoxActivities={setCheckBoxActivities}
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
        checkbox={checkbox} setCheckbox={setCheckbox}
      /> 


      <Card size="md" variant="elevated" m="$3">
          {dateFrom ? 
            <Text style={styles.centeredBoldText}>From  {formatDateFromMilliseconds(dateFrom)}</Text> :
            <Text></Text>
          }
          <Calendar  
          how={"from"}
          showDatePicker={()=>setDatePickerVisibility({type: true, data: 'from', func: setDateFrom})}
          datePickerVisibility={datePickerVisibility} setDatePickerVisibility={setDatePickerVisibility} />
      </Card>

      <Card size="md" variant="elevated" m="$3">
        {dateTo ? 
          <Text style={styles.centeredBoldText}>To  {formatDateFromMilliseconds(dateTo)}</Text> :
          <Text></Text>
        }
        <Calendar  
        how={"to"}
        showDatePicker={()=>setDatePickerVisibility({type: true, data: 'to', func: setDateTo})}
        datePickerVisibility={datePickerVisibility} setDatePickerVisibility={setDatePickerVisibility}/>
      </Card>



      <View style={styles.buttonGo} >
        <Pressable  style={styles.buttonGoPress}
          onPress={goToProgramPage} > 
          <Text style={styles.text} >okook</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonGoPress:{
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 60,
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
  centeredBoldText: {
    textAlign: 'center',   
    fontWeight: '600',    
    fontSize: 16,         
  },
  buttonGo: {
    marginTop: 30,
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    
  }
  
});

export default Home;
