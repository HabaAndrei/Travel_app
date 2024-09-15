import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import Calendar from '../Components/Calendar.js';
import { Slider,Center,  VStack, Heading, SliderTrack, SliderFilledTrack, SliderThumb, Button, ButtonText
 } from '@gluestack-ui/themed';
 import {formatDateFromMilliseconds} from '../diverse.js';


const Schedule = (props) => {

    const [period, setPeriod] = useState({from:new Date().getTime(), to:""});
    const [sliderValue, setSliderValue] = React.useState(5)

    useEffect(()=>{
        setPeriod((prev)=>{return {...prev, to: sliderValue}})
    }, [sliderValue]);

    

    


    const handleChange = (value) => {
      setSliderValue(value)
    }





    function goToProgramPage(){
        const {city, country, checkbox} = props.route.params;
        props.navigation.navigate('Program', {from: period.from, to: period.to, city, country, checkbox})
    }
    



    return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>

        <Calendar  period={period} setPeriod={setPeriod} 
            style={{marginTop: 10}}
        />

      

        <VStack  style={{marginTop: 40}}>
            <Center>
                <Heading>Choose duration</Heading>
            </Center>
            <Slider
                
                value={sliderValue}
                w={320}
                defaultValue={5}
                minValue={1}
                maxValue={100}
                step={1}
                onChange={(value) => {
                    handleChange(value)
                }}
            >
                <SliderTrack> 
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </VStack>


        {period.from && period.to ? 
            <View  style={{marginTop: 40}} >
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


        <Button

            style={{marginTop: 200}}
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            onPress={goToProgramPage}
        >
            <ButtonText>Create the program</ButtonText>
        </Button>

    

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


