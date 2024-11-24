import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HStack, LinkText, Link } from '@gluestack-ui/themed';


const DatePicker = (props) => {
  
    const hideDatePicker = () => {
      props.setDatePickerVisibility({type: false});
    };
    
    const handleConfirm = (date) => {
      if(props.datePickerVisibility.data === "from"){
        props.datePickerVisibility.func(new Date(date).getTime());
      }else if(props.datePickerVisibility.data === "to"){
        props.datePickerVisibility.func(new Date(date).getTime());
      }else{
        props.confimNewDate(new Date(date).getTime());
      }
      hideDatePicker();
    };

  return (
    <View>      
      <Link onPress={props.showDatePicker} >
        <HStack alignItems="center">
          <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
            {
              props.how? (props.how == "from" ? "Select start date" : 
              "Select end date" ) : "Change the date"
            }
          </LinkText>
        </HStack>
      </Link>
        
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