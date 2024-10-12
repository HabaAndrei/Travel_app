import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const DatePicker = (props) => {
  
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
      title={
        props.how == "from" ? "Select start date" : 
        "Select end date"
      }
      onPress={props.showDatePicker} />
        <DateTimePickerModal
            isVisible={props.datePickerVisibility.type}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    </View>
  )
}

export default DatePicker

const styles = StyleSheet.create({})