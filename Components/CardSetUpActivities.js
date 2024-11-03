import { StyleSheet, View, Pressable } from 'react-native'
import React, {useState} from 'react'
import { Card, Text, Heading, ScrollView, Button,
  FormControl, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Textarea, TextareaInput, 
  RadioGroup, HStack, Radio, RadioIndicator, RadioIcon, RadioLabel, CircleIcon
} from '@gluestack-ui/themed';

const CardSetUpActivities = (props) => {

  const [values, setValues] = useState("Cash On Delivery")

  return (
    <View>

      <Card p="$5" borderRadius="$lg"  m="$3" maxWidth={400} style={styles.shadow}>
     
      <RadioGroup value={values} onChange={setValues}>
        <HStack space="2xl">
          <Radio value="Credit Card">
            <RadioIndicator mr="$2">
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Credit Card</RadioLabel>
          </Radio>
          <Radio value="Cash On Delivery">
            <RadioIndicator mr="$2">
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Cash On Delivery</RadioLabel>
          </Radio>
        </HStack>
      </RadioGroup>


        {/*  */}
        
        <Button isDisabled={true} onPress={()=>props.openModalActivities()} >
          <Text>
            Choose activities
          </Text>
        </Button>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Comment</FormControlLabelText>
          </FormControlLabel>
          <Textarea                 
          // isDisabled={true}
          >
            <TextareaInput 
              value={props.inputSearch}
              onChangeText={(text) => props.setInputSearch(text)}
            />
          </Textarea>
          <FormControlHelper>
            <FormControlHelperText>Type your comment above</FormControlHelperText>
          </FormControlHelper>
        </FormControl>

      </Card>
    </View>
  )
}

export default CardSetUpActivities

const styles = StyleSheet.create({})