import { View } from 'react-native';
import { HStack, Text, Divider, ArrowLeftIcon, CheckIcon, Icon } from '@gluestack-ui/themed';

const NavigationDivider = (props) => {
  return (
    <View>
      <HStack h="$10" alignItems="center">
        <HStack alignItems="center" flex={1} justifyContent="flex-end">
          <Icon as={ArrowLeftIcon} m="$2" w="$6" h="$6" />
          <Text bold onPress={() => props.firstFunction()}>
            {props.firstFunctionName}
          </Text>
        </HStack>

        <Divider
          orientation="vertical"
          bg="$indigo500"
          h={25}
          mx="$3"
          alignSelf="center"
        />

        <HStack alignItems="center" flex={1} justifyContent="flex-start">
          <Text bold onPress={() => props.secondFunction()}>
            {props.secondFunctionName}
          </Text>
          <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
        </HStack>
      </HStack>
    </View>
  );
};

export default NavigationDivider;