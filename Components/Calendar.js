import { StyleSheet, Text, View, Button } from 'react-native';
import React, {useEffect, useState} from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const Calendar = (props) => {

   

    const showDatePicker = () => {
        props.setDatePickerVisibility({type: true});
    };
    
    const hideDatePicker = () => {
        props.setDatePickerVisibility({type: false});
    };
    
    const handleConfirm = (date) => {
        props.setPeriod((prev)=>{return {...prev, from: date.getTime()}})
        hideDatePicker();
    };


  return (
    <View>
      <Button 
      
      title="Choose Start Time" onPress={showDatePicker} />
        <DateTimePickerModal
            isVisible={props.datePickerVisible.type}
            mode="date"
            minimumDate={new Date()}
            maximumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    </View>
  )
}

export default Calendar

const styles = StyleSheet.create({})