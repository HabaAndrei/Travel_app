import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card } from '@gluestack-ui/themed';
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
    <View >
        <Card style={styles.container}
        size="md" variant="elevated" m="$3">
            <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Buton 1</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Buton 2</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Buton 2</Text>
            </Pressable>
        </Card>


        <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3">
            <SearchDestination
              setCheckBoxActivities={setCheckBoxActivities}
              dataDestination={dataDestination} setDataDestination={setDataDestination}
            />
        </Card>



        {dataDestination.city && dataDestination.country ? 
          <Pressable onPress={()=>{setCheckBoxActivities((prev)=>{return{...prev, isOpen:true}})}} >
            <Text>Buton alege activitati</Text>
          </Pressable> : <Text></Text>
        }

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
            showDatePicker={()=>setDatePickerVisibility({type: true, data: 'from', func: setDateFrom})}
            datePickerVisibility={datePickerVisibility} setDatePickerVisibility={setDatePickerVisibility} />
        </Card>

        <Card size="md" variant="elevated" m="$3">
            {dateTo ? 
              <Text style={styles.centeredBoldText}>To  {formatDateFromMilliseconds(dateTo)}</Text> :
              <Text></Text>
            }
            <Calendar  
            showDatePicker={()=>setDatePickerVisibility({type: true, data: 'to', func: setDateTo})}
            datePickerVisibility={datePickerVisibility} setDatePickerVisibility={setDatePickerVisibility}/>
        </Card>


        <Pressable  onPress={goToProgramPage} >
          <Text>Go!!!</Text>
        </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  centeredBoldText: {
    textAlign: 'center',   
    fontWeight: '600',    
    fontSize: 16,         
  }
});

export default Home;
