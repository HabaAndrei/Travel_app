import { StyleSheet, Text, View, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HStack, LinkText, Link } from '@gluestack-ui/themed';
import {useState} from 'react';

/** Native date picker for each device */
const DatePicker = (props) => {

  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (props?.extraFunction) props?.extraFunction();
    props.getDate(new Date(date).getTime());
    hideDatePicker();
  };

  return (
    <View>
      <Link onPress={()=>setDatePickerVisibility(true)} >
        <HStack alignItems="center">
          <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
            {
              props?.name ? props?.name  : 'Change the date'
            }
          </LinkText>
        </HStack>
      </Link>

      <DateTimePickerModal
        isVisible={datePickerVisibility}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  )
}

export default DatePicker

const styles = StyleSheet.create({})