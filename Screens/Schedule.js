import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect} from 'react'

const Schedule = (props) => {

    useEffect(()=>{
        console.log(props);
    }, []);

    return (
    <View>
        <Text>Schedule</Text>
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({})