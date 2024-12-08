import { StyleSheet, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HStack, LinkText, Link } from '@gluestack-ui/themed';

const TimePicker = (props) => {




  return (
    <View>
      <Link onPress={props.showDatePicker} >
        <HStack alignItems="center">
          <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
            {props?.title ? props?.title : 'Change time'}
          </LinkText>
        </HStack>
      </Link>

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