import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const TimePicker = (props) => {

  return (
    <View>
      <Button title="Change time" onPress={props.showDatePicker} />
      <DateTimePickerModal
        isVisible={props.isTimePickerVisible.type}
        mode="time"
        onConfirm={props.handleConfirm}
        onCancel={props.hideDatePicker}
      />
    </View>
  );

}

export default TimePicker

const styles = StyleSheet.create({})