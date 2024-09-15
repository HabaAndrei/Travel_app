import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card } from '@gluestack-ui/themed';
import SearchDestination from '../Components/SearchDestination';
import Calendar from '../Components/Calendar';
import {formatDateFromMilliseconds} from '../diverse';
import CheckboxActivities from '../Components/CheckboxActivities';


const MyComponent = () => {

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePickerVisibility, setDatePickerVisibility] = useState({type: false, date:''});
  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});


  // function goToProgramPage(){
  //   const {city, country, checkbox} = props.route.params;
  //   props.navigation.navigate('Program', {from: period.from, to: period.to, city, country, checkbox})
  // }
  
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
          checkBoxActivities={checkBoxActivities} setCheckBoxActivities={setCheckBoxActivities}
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

export default MyComponent;
