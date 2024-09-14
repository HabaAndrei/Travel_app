import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import Calendar from '../Components/Calendar.js';
import { Select, SelectTrigger, SelectInput, SelectIcon, ChevronDownIcon, Icon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@gluestack-ui/themed';


const Schedule = (props) => {

    const [period, setPeriod] = useState({from:1726157653435, to:""});

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

 


    function formatDateFromMilliseconds(milliseconds) {
        const date = new Date(milliseconds);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear(); 
        return `${day}-${month}-${year}`;
    }

    function generateNumber(){
        let arFin = [];
        for(let i = 1 ; i < 1000; i++){
            arFin.push(i);
        }
        return arFin;
    }

    useEffect(()=>{
        console.log(period);
    }, [period]);
    
   
    
    return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>

        <Calendar  period={period} setPeriod={setPeriod} />

                        
            <Select>
                <SelectInput placeholder="Choose duration in days" />
                <SelectIcon mr="$3">
                    <Icon as={ChevronDownIcon} />
                </SelectIcon>
                <SelectPortal>
                
    
                {generateNumber().map((item) => {
                    console.log(item);
    return <SelectItem onPress={()=>console.log('ok')}
        key={item}
        
        disabled={period.to == item}
    >{item}
        {/* <TouchableOpacity
        onPress={() => {
            console.log('am dat click');
            setPeriod((prev) => ({ ...prev, to: item }));
        }}
            label={item > 1 ? `${item} days` : `${item} day`}
            value={item}
        >
            {item}
        </TouchableOpacity> */}
    </SelectItem>
})}

    
    
    
                </SelectPortal>
            </Select>

        {period.from && period.to ? 
            <View>
                <Text
                    style={{ 
                    fontSize: 16, 
                    color: 'black', 
                    fontWeight: 'bold', 
                    padding: 10, 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: 5, 
                    textAlign: 'center'}}
                >From {formatDateFromMilliseconds(period.from)} to {formatDateFromMilliseconds(period.from + (period.to * 86_400_000))}
                </Text>
            </View>:
            <View/>
        }


      

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


