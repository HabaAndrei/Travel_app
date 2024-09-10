import { StyleSheet, Text,ScrollView, View, FlatList, Pressable } from 'react-native'
import React, {useEffect, useState} from 'react'



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

    const [calendar, setCalendar] = useState({todayCalendar:{}});
    const [chosenCalendar, setChosenCalendar] = useState({year: new Date().getFullYear(),  month: new Date().getMonth() + 1, day:  new Date().getDate()});
    useEffect(()=>{
        setCalendar({...calendar, todayCalendar:{year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:  new Date().getDate()}})
    }, []);

    useEffect(()=>{
        console.log(chosenCalendar);
        generateArrayOfDays(chosenCalendar.month, chosenCalendar.year)
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
        if(year == calendar.todayCalendar.year && month == new Date().getMonth() + 1){
            for(let i = 0 ; i<=maxDaysOfMonth[calendar.todayCalendar.month] - new Date().getDate() ; i++){
                arrayFinal.push(calendar.todayCalendar.day + i)
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

  

   

    return (
    <View>
        <Text>Schedule</Text>
        
        {calendar.todayCalendar.year ? 
        <ScrollView 
        style={{maxHeight: '50px', marginTop: '100px'}}
        >
            <FlatList
                data={generateArrayOfYears(calendar.todayCalendar?.year, 3)}
                keyExtractor={(item, index) => {
                    return index;
                }}
                renderItem={({ item }) => (
                <Pressable onPress={()=>setChosenCalendar((items)=>{
                    return {...items, year: item};
                })} >
                    <Text >
                        {item}
                    </Text>            
                </Pressable>
                )}
            />
        </ScrollView>
        :<View></View>
        }


        {calendar.todayCalendar.month ? 
        <ScrollView 
        style={{maxHeight: '50px', marginTop: '100px'}}
        >
            <FlatList
                data={
                    chosenCalendar?.year === calendar?.todayCalendar?.year ? 
                    (Object.values( months)).slice(calendar?.todayCalendar?.month - 1, months.length) 
                    : Object.values(months)
                    
                }
                keyExtractor={(item, index) => {
                    return index;
                }}
                renderItem={({ item }) => (
                <Pressable 
                    onPress={()=>setChosenCalendar((items)=>{
                        return {...items, month: keyWhereNameOfTheMonth(item)};
                    })} 
                >
                    <Text >
                        {item}
                    </Text>            
                </Pressable>
                )}
            />
        </ScrollView>
        :<View></View>
        }

        {calendar.todayCalendar.day ? 
        <ScrollView 
        style={{maxHeight: '50px', marginTop: '100px'}}
        >
            <FlatList
                data={
                    generateArrayOfDays(chosenCalendar.month, chosenCalendar.year)
                    
                }
                keyExtractor={(item, index) => {
                    return index;
                }}
                renderItem={({ item }) => (
                <Pressable onPress={()=>setChosenCalendar(item)} >
                    <Text >
                        {item}
                    </Text>            
                </Pressable>
                )}
            />
        </ScrollView>
        :<View></View>

    
        }
       
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({})


// rezolv partea cu     const [calendar, setCalendar] = useState({todayCalendar:{}});
// adica sa o scot
// sa nu se vea click pe nimic daca ceva din inaintea lui nu a fost setat 
// daca sa sechimba ceav mai mare sa se dea reset