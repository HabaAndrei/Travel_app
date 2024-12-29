import { StyleSheet, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HStack, LinkText, Link } from '@gluestack-ui/themed';
import { useState } from 'react';

const TimePicker = (props) => {

  const [timePickerVisibility, setTimePickerVisibility] = useState(false);
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    if (props?.extraFunction) props?.extraFunction();
    props.getTime(time)
    hideTimePicker();
  };

  return (
    <View>
      <Link onPress={()=>setTimePickerVisibility(true)} >
        <HStack alignItems="center">
          <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
            {props?.name ? props?.name : 'Change time'}
          </LinkText>
        </HStack>
      </Link>

      <DateTimePickerModal
        isVisible={timePickerVisibility}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );

}

export default TimePicker

const styles = StyleSheet.create({})