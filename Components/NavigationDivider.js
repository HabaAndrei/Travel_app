import { View, Pressable } from 'react-native';
import { HStack, Text, Divider, ArrowLeftIcon, CheckIcon, Icon } from '@gluestack-ui/themed';

const NavigationDivider = (props) => {
  return (
    <View>
      <HStack h="$10" alignItems="center">
        <Pressable onPress={() => props.firstFunction()} style={{ flex: 1 }}>
          <HStack alignItems="center" justifyContent="flex-end">
            <Icon as={ArrowLeftIcon} m="$2" w="$6" h="$6" />
            <Text bold>
              {props.firstFunctionName}
            </Text>
          </HStack>
        </Pressable>

        <Divider
          orientation="vertical"
          bg="$indigo500"
          h={25}
          mx="$3"
          alignSelf="center"
        />

        <Pressable onPress={() => props.secondFunction()} style={{ flex: 1 }}>
          <HStack alignItems="center" justifyContent="flex-start">
            <Text bold>
              {props.secondFunctionName}
            </Text>
            <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
          </HStack>
        </Pressable>
      </HStack>
    </View>
  );
};

export default NavigationDivider;