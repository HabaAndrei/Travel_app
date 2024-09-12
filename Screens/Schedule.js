import { StyleSheet, Text,ScrollView, View, FlatList, Pressablem, Button } from 'react-native'
import React, {useEffect, useState} from 'react'
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Schedule = (props) => {

    // props.route.params.city
    // props.route.params.country
    // props.route.params.checkbox
    const city = 'Kraków';
    const country = 'Poland';
    const checkbox = [
        {selected: true, category: 'Visit historical sites'},
        {selected: false, category: 'Explore cultural attractions'},
        {selected: true, category: 'Try local cuisine'},
        {selected: false, category: 'Attend music festivals or concerts'},     
        {selected: false, category: 'Join guided tours'},
        {selected: true, category: 'Experience traditional folk activities'},
        {selected: true, category: 'Engage in outdoor recreational activities'}
    ]

    /////////////////////////////////////////////
    /////////////////////////////////////////////
    /////////////////////////////////////////////

    const [chosenCalendar, setChosenCalendar] = useState({year: new Date().getFullYear(),  month: new Date().getMonth() + 1, day:  new Date().getDate()});
    

    const presentDay = new Date().getDate();
    const presentMonth = new Date().getMonth() + 1;
    const presentYear = new Date().getFullYear();

    useEffect(()=>{
        // console.log(chosenCalendar);
        generateArrayOfDays(chosenCalendar.month, chosenCalendar.year);
        if(chosenCalendar.day > maxDaysOfMonth[chosenCalendar.month]){
            setChosenCalendar((items) => ({ ...items, day: '' }))
        }
        if(chosenCalendar.month == presentMonth && presentYear == chosenCalendar.year && presentDay > chosenCalendar.day){
            setChosenCalendar((items) => ({ ...items, day: presentDay }))
        }

        if(chosenCalendar.year == presentYear && chosenCalendar.month < presentMonth ){
            setChosenCalendar((items) => ({ ...items, month: presentMonth }))
        }
        
    }, [chosenCalendar]);

    function generateArrayOfYears(year, number){
        let arFinal = [];
        for(let i = 0 ; i<number; i++){
            arFinal.push(year + i);
        }
        return arFinal;
    }
    function generateArrayOfDays(month, year){
        let arrayFinal = [];
        if(year == presentYear && month == new Date().getMonth() + 1){
            for(let i = 0 ; i<=maxDaysOfMonth[presentMonth] - new Date().getDate() ; i++){
                arrayFinal.push(presentDay + i)
            }
        }else{
            for(let i = 0 ; i<maxDaysOfMonth[chosenCalendar.month]; i++){
                arrayFinal.push(i + 1)
            }
        }
        return arrayFinal;
    }

    function keyWhereNameOfTheMonth(month){
        let rez = (Object.keys(months)).find((number)=>months[number] == month);
        return Number(rez);
    }

    const maxDaysOfMonth ={
        1: 31,
        2: 28,
        3: 31,
        4: 30, 
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31 
    };

    let months = {
        1: 'january',
        2: 'february',
        3: 'march',
        4: 'april',
        5: 'may',
        6: 'june',
        7: 'july',
        8: 'august',
        9: 'september',
        10: 'october',
        11: 'november',
        12:'december'
    };



   


    //////////////////////////////////////////
    //////////////////////////////////////////

  
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      console.warn("A date has been picked: ", date);
      hideDatePicker();
    };
   

    return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>


    {/* <Calendar
    onDayPress={day => {
        console.log('selected day', day);
    }}
    /> */}

<Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />



    {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Schedule</Text>
    
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView 
            style={{ maxHeight: 50, marginHorizontal: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 5, backgroundColor: '#f9f9f9' }}
            contentContainerStyle={{ alignItems: 'center' }}
        >
            <FlatList
                data={generateArrayOfYears(presentYear, 3)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                <Pressable onPress={() => setChosenCalendar((items) => ({ ...items, year: item }))}
                    style={chosenCalendar.year === item ? styles.selectedDay : ''}

                >
                    <Text style={{ padding: 10, textAlign: 'center', color: '#333', fontSize: 16 }}>
                        {item}
                    </Text>            
                </Pressable>
                )}
            />
        </ScrollView>
  
        <ScrollView 
            style={{ maxHeight: 50, marginHorizontal: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 5, backgroundColor: '#f9f9f9' }}
            contentContainerStyle={{ alignItems: 'center' }}
        >
            <FlatList
                data={chosenCalendar?.year === presentYear 
                        ? Object.values(months).slice(presentMonth - 1, months.length) 
                        : Object.values(months)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                <Pressable 
                    onPress={() => setChosenCalendar((items) => ({ ...items, month: keyWhereNameOfTheMonth(item) }))}
                    style={chosenCalendar.month === keyWhereNameOfTheMonth(item)  ? styles.selectedDay : ''}

                >
                    <Text style={{ padding: 10, textAlign: 'center', color: '#333', fontSize: 16 }}>
                        {item}
                    </Text>            
                </Pressable>
                )}
            />
        </ScrollView>

        <ScrollView 
            style={{ maxHeight: 50, marginHorizontal: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 5, backgroundColor: '#f9f9f9' }}
            contentContainerStyle={{ alignItems: 'center' }}
        >
            <FlatList
                data={generateArrayOfDays(chosenCalendar.month, chosenCalendar.year)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                <Pressable onPress={() =>   setChosenCalendar((items) => ({ ...items, day: item }))}
                    style={chosenCalendar.day === item ? styles.selectedDay : ''}
                >
                    <Text style={{ padding: 10, textAlign: 'center', color: '#333', fontSize: 16 }}>
                        {item}
                    </Text>            
                </Pressable>
                )}
            />
        </ScrollView>
    </View> */}
</View>

  )
}

export default Schedule

const styles = StyleSheet.create({
    text: {
        padding: 10,
        textAlign: 'center',
        color: '#333',
        fontSize: 16,
    },
    selectedText: {
        color: 'white',
    },
    selectedDay: {
        backgroundColor: '#007BFF',  
        borderRadius: 8,
    },
})


