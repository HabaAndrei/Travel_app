import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const TimePicker = (props) => {

    const [timePickerVisibility, setTimePickerVisibility] = useState(false);
  
    const hideTimePicker = () => {setTimePickerVisibility(false)};
    
    const handleConfirm = (time) => {
      console.log(time)
    };

  return (
    <View>
      <Button 
      title={ 'Pick the time'}
      onPress={()=>setTimePickerVisibility(true)} />
        <DateTimePickerModal
            isVisible={timePickerVisibility}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideTimePicker}
        />
    </View>
  )
}

export default TimePicker

const styles = StyleSheet.create({})