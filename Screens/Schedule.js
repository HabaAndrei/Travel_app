import { StyleSheet, Text, View } from 'react-native'
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

    useEffect(()=>{
        
        // console.log(props.route.params.city);
    }, []);

    //////////////////////////////////////////
    //////////////////////////////////////////



   

    return (
    <View>
        <Text>Schedule</Text>
        
       
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({})