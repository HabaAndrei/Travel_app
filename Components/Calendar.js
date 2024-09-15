import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const Calendar = (props) => {

    const hideDatePicker = () => {
      props.setDatePickerVisibility({type: false});
    };
    
    const handleConfirm = (date) => {
      if(props.datePickerVisibility.data === "from"){
        props.datePickerVisibility.func(new Date(date).getTime());
      }else if(props.datePickerVisibility.data === "to"){
        props.datePickerVisibility.func(new Date(date).getTime());
      }
      hideDatePicker();
    };

  return (
    <View>
      <Button 
      
      title="Choose Start Time" onPress={props.showDatePicker} />
        <DateTimePickerModal
            isVisible={props.datePickerVisibility.type}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    </View>
  )
}

export default Calendar

const styles = StyleSheet.create({})