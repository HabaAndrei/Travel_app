import { View } from 'react-native'
import { HStack, Text, Divider, ArrowLeftIcon, CheckIcon, Icon } from '@gluestack-ui/themed';

const NavigationDivider = (props) => {
  return (
    <View>
      <HStack h="$10" justifyContent="center" alignItems="center">
        <HStack alignItems="center"  >
          <Icon as={ArrowLeftIcon} m="$2" w="$6" h="$6" />
          <Text bold={true} onPress={()=>props.firstFunction()} >{props.firstFunctionName}</Text>
        </HStack>

        <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

        <HStack alignItems="center">
          <Text bold={true} onPress={()=>props.secondFunction()} >{props.secondFunctionName}</Text>
          <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
        </HStack>
      </HStack>
    </View>
  )
}

export default NavigationDivider;