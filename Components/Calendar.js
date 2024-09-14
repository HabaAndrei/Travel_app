import { StyleSheet, Text, View, Button } from 'react-native';
import React, {useState} from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const Calendar = (props) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    
    const handleConfirm = (date) => {
        props.setPeriod((prev)=>{return {...prev, from: date.getTime()}})
        hideDatePicker();
    };


  return (
    <View>
      <Button title="Choose Start Time" onPress={showDatePicker} />
        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    </View>
  )
}

export default Calendar

const styles = StyleSheet.create({})